import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import PasswordResetToken from "../models/password-reset-token.model.js";
import {
  SESSION_COOKIE_NAME,
  getClearSessionCookieOptions,
} from "../config/cookies.js";
import mongoose from "mongoose";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;
const RESET_TOKEN_EXPIRES_HOURS = 1;
const INVITE_TOKEN_EXPIRES_DAYS = 7;

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** The public frontend URL used in password-reset links. */
function frontendBaseUrl(): string {
  const first = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")[0]
    ?.trim();
  return (first || "http://localhost:3000").replace(/\/$/, "");
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

function isValidationError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError"
  );
}

async function beginSession(req: Request, userId: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
  req.session.userId = userId;
  await new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function verifyPassword(
  candidate: string,
  storedHash: string
): Promise<boolean> {
  return bcrypt.compare(candidate, storedHash);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

function hashToken(token: string): string {
  return require("crypto").createHash("sha256").update(token).digest("hex");
}

async function createToken(userId: mongoose.Types.ObjectId, purpose: "reset" | "invite") {
  const token = require("crypto").randomBytes(48).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt =
    purpose === "reset"
      ? new Date(Date.now() + RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000)
      : new Date(Date.now() + INVITE_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  const tokenDoc = await PasswordResetToken.create({
    user: userId,
    tokenHash,
    purpose,
    expiresAt,
  });

  return { token, tokenHash: tokenDoc.tokenHash };
}

/* -------------------------------------------------------------
   Auth responses (shared across all handlers)
   ------------------------------------------------------------- */

type AuthResponse<T> = {
  ok: true;
  user: T;
};

type AuthErrorResponse = {
  ok: false;
  message: string;
};

function sendAuthError(res: Response, message: string, status = 400): Response {
  return res.status(status).json({ ok: false, message });
}

/* -------------------------------------------------------------
   Handler: register
   Creates a Shop + owner User, hashes password, sets session.
   ------------------------------------------------------------- */
export async function register(req: Request, res: Response): Promise<void> {
  const username = stringField(req.body?.username);
  const businessName = stringField(req.body?.businessName) || username;
  const email = stringField(req.body?.email).toLowerCase();
  const phone = stringField(req.body?.phone).replace(/[\s()-]/g, "");
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  // Validate required fields
  if (!username || !phone || !password) {
    res
      .status(400)
      .json({ ok: false, message: "Please complete all required fields." });
    return;
  }
  if (username.length > 120 || businessName.length > 120 || phone.length > 30) {
    res
      .status(400)
      .json({ ok: false, message: "One or more fields are too long." });
    return;
  }
  if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) {
    res
      .status(400)
      .json({ ok: false, message: "Please enter a valid email address." });
    return;
  }
  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
  ) {
    res.status(400).json({
      ok: false,
      message:
        "Password must be at least 8 characters and no more than 72 bytes.",
    });
    return;
  }

  // Check if user already exists (by username or phone or email)
  const existingUser = await User.findOne({
    $or: [{ username }, { phone }],
  }).lean();
  if (existingUser) {
    res
      .status(409)
      .json({ ok: false, message: "An account with that name or phone already exists." });
    return;
  }

  // Validate email uniqueness if provided
  if (email) {
    const existingByEmail = await User.findOne({ email }).lean();
    if (existingByEmail) {
      res
        .status(409)
        .json({ ok: false, message: "An account with that email already exists." });
      return;
    }
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  const shopId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  // Preallocate both IDs so each required reference is present at creation.
  const shop = await Shop.create({
    _id: shopId,
    owner: userId,
    name: businessName,
    currency: "RWF",
    smsReminders: false,
    cloudBackup: true,
  });

  const user = await User.create({
    _id: userId,
    shop: shopId,
    username,
    email: email || undefined,
    password: passwordHash,
    phone,
    role: "owner",
    locale: "rw",
    status: "active",
    authVersion: 0,
  });

  // Start session - pass string version of user id
  await beginSession(req, user._id.toString());

  res.status(201).json({
    ok: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: shop.name,
      role: user.role,
      locale: user.locale,
      status: user.status,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      currency: shop.currency,
      smsReminders: shop.smsReminders,
      cloudBackup: shop.cloudBackup,
      lastBackupAt: shop.lastBackupAt,
    },
  });
}

/* -------------------------------------------------------------
   Handler: login
   Generic error; reject non-active users; generic error.
   ------------------------------------------------------------- */
export async function login(req: Request, res: Response): Promise<void> {
  const identifier = stringField(req.body?.identifier);
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (
    !identifier ||
    !password ||
    Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
  ) {
    res
      .status(400)
      .json({ ok: false, message: "Enter your phone or email and password." });
    return;
  }

  // Find user by phone or email
  const user = await User.findOne({
    $or: [
      { phone: identifier.replace(/[\s()-]/g, "") },
      { email: identifier.toLowerCase() },
    ],
  })
    .select("+password +shop +role +status +authVersion")
    .lean();

  if (!user) {
    res.status(401).json({ ok: false, message: "Phone/email or password is incorrect." });
    return;
  }

  // Check status
  if (user.status !== "active") {
    res.status(401).json({
      ok: false,
      message:
        "Your account has been disabled. Please contact support.",
    });
    return;
  }

  // Verify password
  const passwordValid = await verifyPassword(password, user.password);
  if (!passwordValid) {
    res.status(401).json({
      ok: false,
      message: "Phone/email or password is incorrect.",
    });
    return;
  }

  // Check authVersion — if changed (e.g., password reset), invalidate session
  const sessionAuthVersion = (req.session as any)?.authVersion;
  if (sessionAuthVersion !== undefined && sessionAuthVersion !== user.authVersion) {
    req.session.destroy(() => {});
  }

  // Store authVersion in session for future invalidation
  await beginSession(req, user._id.toString());
  ;(req.session as any).authVersion = user.authVersion;

  const shop = await Shop.findById(user.shop);
  if (!shop) {
    res.status(404).json({ ok: false, message: "Shop not found." });
    return;
  }

  res.json({
    ok: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: shop.name,
      role: user.role,
      locale: user.locale,
      status: user.status,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      currency: shop.currency,
      smsReminders: shop.smsReminders,
      cloudBackup: shop.cloudBackup,
      lastBackupAt: shop.lastBackupAt,
    },
  });
}

/* -------------------------------------------------------------
   Handler: logout
   ------------------------------------------------------------- */
export async function logout(req: Request, res: Response): Promise<void> {
  if (req.session) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  // Clear the session cookie with the same attributes used to set it.
  res.clearCookie(SESSION_COOKIE_NAME, getClearSessionCookieOptions());

  res.sendStatus(204);
}

/* -------------------------------------------------------------
   Handler: currentUser
   ------------------------------------------------------------- */
export async function currentUser(req: Request, res: Response): Promise<void> {
  const userId = req.session?.userId;

  if (!userId) {
    res.status(401).json({ ok: false, message: "You are not logged in." });
    return;
  }

  const user = await User.findById(userId)
    .select("+password +shop +role +status +locale +authVersion")
    .lean();

  if (!user) {
    // Session is stale; destroy and clear cookie
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    res.clearCookie(SESSION_COOKIE_NAME, getClearSessionCookieOptions());
    res.status(401).json({ ok: false, message: "Your account session has expired." });
    return;
  }

  const shop = await Shop.findById(user.shop);
  if (!shop) {
    res.status(404).json({ ok: false, message: "Shop not found." });
    return;
  }

  res.json({
    ok: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: shop.name,
      role: user.role,
      locale: user.locale,
      status: user.status,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      currency: shop.currency,
      smsReminders: shop.smsReminders,
      cloudBackup: shop.cloudBackup,
      lastBackupAt: shop.lastBackupAt,
    },
  });
}

/* -------------------------------------------------------------
   Handler: updateCurrentUser
   Update username, email, phone
   ------------------------------------------------------------- */
export async function updateCurrentUser(req: Request, res: Response): Promise<void> {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ ok: false, message: "You are not logged in." });
    return;
  }

  const username = stringField(req.body?.username);
  const businessName = stringField(req.body?.businessName);
  const email = stringField(req.body?.email).toLowerCase();
  const phone = stringField(req.body?.phone).replace(/[\s()-]/g, "");

  if (!username || !phone) {
    res
      .status(400)
      .json({ ok: false, message: "Complete the required profile fields." });
    return;
  }
  if (username.length > 120 || businessName.length > 120 || phone.length > 30) {
    res
      .status(400)
      .json({ ok: false, message: "One or more fields are too long." });
    return;
  }
  if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) {
    res
      .status(400)
      .json({ ok: false, message: "Please enter a valid email address." });
    return;
  }

  // Validate no duplicate username/phone/email (skip current user's own ids)
  const duplicate = await User.findOne({
    $or: [
      { username },
      { phone: phone || "" },
      { email: email || "" },
    ],
    _id: { $ne: userId },
  }).lean();

  if (duplicate) {
    res.status(409).json({
      ok: false,
      message:
        "That name, email, or phone is already used by another account.",
    });
    return;
  }

  const update: any = {
    username,
    email: email || undefined,
    phone,
  };

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  }).select("+password +shop +role +status +locale +authVersion");

  if (!user) {
    res.status(404).json({ ok: false, message: "Account not found." });
    return;
  }

  const shop = businessName
    ? await Shop.findByIdAndUpdate(user.shop, { name: businessName }, { new: true, runValidators: true })
    : await Shop.findById(user.shop);
  if (!shop) {
    res.status(404).json({ ok: false, message: "Shop not found." });
    return;
  }

  res.json({
    ok: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: shop.name,
      role: user.role,
      locale: user.locale,
      status: user.status,
    },
    shop: {
      id: shop._id,
      name: shop.name,
      currency: shop.currency,
      smsReminders: shop.smsReminders,
      cloudBackup: shop.cloudBackup,
      lastBackupAt: shop.lastBackupAt,
    },
  });
}

/* -------------------------------------------------------------
   Handler: updatePassword
   Verify current password, validate new one, re-hash, increment authVersion
   ------------------------------------------------------------- */
export async function updatePassword(req: Request, res: Response): Promise<void> {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ ok: false, message: "You are not logged in." });
    return;
  }

  const { currentPassword, newPassword, confirmPassword } =
    req.body as {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({
      ok: false,
      message: "Enter current and new password.",
    });
    return;
  }

  if (newPassword.length < 8 || Buffer.byteLength(newPassword, "utf8") > MAX_PASSWORD_BYTES) {
    res.status(400).json({
      ok: false,
      message:
        "New password must be at least 8 characters and no more than 72 bytes.",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({
      ok: false,
      message: "New passwords do not match.",
    });
    return;
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    res.status(404).json({ ok: false, message: "Account not found." });
    return;
  }

  // Verify current password
  const currentValid = await verifyPassword(currentPassword, user.password);
  if (!currentValid) {
    res.status(400).json({
      ok: false,
      message: "Current password is incorrect.",
    });
    return;
  }

  // Hash new password
  const newHash = await hashPassword(newPassword);

  // Re-hash and increment authVersion
  await User.findByIdAndUpdate(userId, {
    password: newHash,
    authVersion: user.authVersion + 1,
  });

  res.json({
    ok: true,
    message: "Password updated successfully.",
  });
}

/* -------------------------------------------------------------
   Handler: updatePreferences
   Update locale
   ------------------------------------------------------------- */
export async function updatePreferences(req: Request, res: Response): Promise<void> {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ ok: false, message: "You are not logged in." });
    return;
  }

  const locale = stringField(req.body?.locale);
  if (locale !== "rw" && locale !== "en") {
    res.status(400).json({ ok: false, message: "Invalid locale." });
    return;
  }

  const user = await User.findByIdAndUpdate(userId, { locale }, { new: true })
    .select("+password +shop +role +status +locale +authVersion");

  if (!user) {
    res.status(404).json({ ok: false, message: "Account not found." });
    return;
  }

  res.json({
    ok: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      locale: user.locale,
      status: user.status,
    },
    shop: {
      id: user.shop!,
      name: (await Shop.findById(user.shop!))!.name,
      currency: (await Shop.findById(user.shop!))!.currency,
      smsReminders: (await Shop.findById(user.shop!))!.smsReminders,
      cloudBackup: (await Shop.findById(user.shop!))!.cloudBackup,
      lastBackupAt: (await Shop.findById(user.shop!))!.lastBackupAt,
    },
  });
}

/* -------------------------------------------------------------
   Handler: forgotPassword
   Public endpoint: always return 204; create token + email if account exists.
   ------------------------------------------------------------- */
export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const identifier = stringField(req.body?.identifier);

  if (!identifier) {
    res.status(400).json({ ok: false, message: "Enter your phone or email." });
    return;
  }

  // Find user by phone or email (case-insensitive)
  const identifierNorm = identifier.replace(/[\s()-]/g, "");
  const emailNorm = stringField(req.body?.email)?.toLowerCase();

  const user = await User.findOne({
    $or: [
      { phone: identifierNorm },
      { email: emailNorm },
    ],
  }).lean();

  if (!user) {
    // Always return 204 to avoid leaking whether an account exists
    res.status(204).end();
    return;
  }

  // If SMTP is configured, send the reset link
  // (The actual sending happens in a service; here we just create the token.)
  try {
    const { token } = await createToken(user._id, "reset");

    // Attempt to send email
    await sendResetEmail(user.email || user.phone, token, "reset");
    // If SMTP not configured, the service will log the link in dev mode.

    res.status(204).end();
  } catch (err) {
    // Log error but still return 204 to avoid leaking info
    console.error("Forgot password email failed:", err);
    res.status(204).end();
  }
}

/* -------------------------------------------------------------
   Handler: resetPassword
   Public endpoint: validate token hash + expiry, set new password, mark used.
   ------------------------------------------------------------- */
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, newPassword, confirmPassword } =
    req.body as {
      token: string;
      newPassword: string;
      confirmPassword: string;
    };

  if (!token || !newPassword || !confirmPassword) {
    res.status(400).json({ ok: false, message: "Missing required fields." });
    return;
  }

  if (newPassword.length < 8 || Buffer.byteLength(newPassword, "utf8") > MAX_PASSWORD_BYTES) {
    res.status(400).json({
      ok: false,
      message:
        "New password must be at least 8 characters and no more than 72 bytes.",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ ok: false, message: "New passwords do not match." });
    return;
  }

  // Find the token
  const tokenHash = require("crypto").createHash("sha256").update(token).digest("hex");
  const tokenDoc = await PasswordResetToken.findOne({ tokenHash })
    .select("+user +purpose +expiresAt +usedAt");

  if (!tokenDoc) {
    res.status(400).json({ ok: false, message: "Invalid or expired token." });
    return;
  }

  // Check expiry
  if (tokenDoc.expiresAt < new Date()) {
    res.status(400).json({ ok: false, message: "Invalid or expired token." });
    return;
  }

  // Check if already used
  if (tokenDoc.usedAt) {
    res.status(400).json({ ok: false, message: "Token already used." });
    return;
  }

  // Find user
  const user = await User.findById(tokenDoc.user).select("+password +authVersion +status");
  if (!user) {
    res.status(400).json({ ok: false, message: "User not found." });
    return;
  }

  // Prevent reset on disabled accounts
  if (user.status !== "active" && user.status !== "invited") {
    res.status(400).json({ ok: false, message: "Account is not active." });
    return;
  }

  // Hash new password and update user
  const newHash = await hashPassword(newPassword);

  await User.findByIdAndUpdate(user._id, {
    password: newHash,
    authVersion: user.authVersion + 1,
    status: "active", // ensure invited users become active
  });

  // Mark token as used
  await PasswordResetToken.findByIdAndUpdate(tokenDoc._id, { usedAt: new Date() });

  res.json({ ok: true, message: "Password reset successfully." });
}

/* -------------------------------------------------------------
   Helper: sendResetEmail
   Sends the password reset or invite link.
   ------------------------------------------------------------- */
async function sendResetEmail(contact: string, token: string, purpose: "reset" | "invite") {
  // If SMTP not configured, print the link in dev mode
  if (
    process.env.NODE_ENV !== "production" &&
    (!process.env.SMTP_HOST || process.env.SMTP_HOST === "smtp.example.com")
  ) {
    const resetUrl = `${frontendBaseUrl()}/reset-password?token=${token}`;
    console.log(`[dev] ${purpose === "reset" ? "Reset" : "Invite"} link for ${contact}: ${resetUrl}`);
    return;
  }

  const nodemailer = require("nodemailer");

  // Configure transporter from env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${frontendBaseUrl()}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || "Curuza <no-reply@curuza.local>",
    to: contact,
    subject: purpose === "reset" ? "Password Reset • Curuza" : "Set Your Password • Curuza",
    text: `You are receiving this email because a password reset or account invitation was requested for your Curuza account.\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`,
    html: `<p>You are receiving this email because a <strong>${purpose === "reset" ? "password reset" : "account invitation"}</strong> was requested for your Curuza account.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export default { register, login, logout, currentUser, updateCurrentUser, updatePassword, updatePreferences, forgotPassword, resetPassword };