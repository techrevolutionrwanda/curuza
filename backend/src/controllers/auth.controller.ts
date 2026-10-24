import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import User from "../models/user.model.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;

function stringField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
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

export async function register(req: Request, res: Response) {
  const username = stringField(req.body?.username);
  const businessName = stringField(req.body?.businessName);
  const phone = stringField(req.body?.phone).replace(/[\s()-]/g, "");
  const email = stringField(req.body?.email).toLowerCase();
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (!username || !businessName || !phone || !password) {
    res.status(400).json({ message: "Please complete all required fields." });
    return;
  }
  if (username.length > 120 || businessName.length > 120 || phone.length > 30) {
    res.status(400).json({ message: "One or more fields are too long." });
    return;
  }
  if (email && (email.length > 254 || !EMAIL_PATTERN.test(email))) {
    res.status(400).json({ message: "Please enter a valid email address." });
    return;
  }
  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
  ) {
    res.status(400).json({
      message: "Password must be at least 8 characters and no more than 72 bytes.",
    });
    return;
  }

  try {
    const user = await User.create({
      username,
      businessName,
      phone,
      ...(email ? { email } : {}),
      password: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });

    await beginSession(req, user.id);
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
      },
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({
        message: "An account with that name, email, or phone already exists.",
      });
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const identifier = stringField(req.body?.identifier);
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";

  if (
    !identifier ||
    !password ||
    Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES
  ) {
    res.status(400).json({ message: "Enter your phone or email and password." });
    return;
  }

  const user = await User.findOne({
    $or: [
      { phone: identifier.replace(/[\s()-]/g, "") },
      { email: identifier.toLowerCase() },
    ],
  }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: "Phone/email or password is incorrect." });
    return;
  }

  await beginSession(req, user.id);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: user.businessName,
    },
  });
}

export async function currentUser(req: Request, res: Response) {
  if (!req.session.userId) {
    res.status(401).json({ message: "You are not logged in." });
    return;
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    res.clearCookie("curuza_session", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(401).json({ message: "Your account session has expired." });
    return;
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      businessName: user.businessName,
    },
  });
}

export async function logout(req: Request, res: Response) {
  if (req.session) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  res.clearCookie("curuza_session", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.sendStatus(204);
}