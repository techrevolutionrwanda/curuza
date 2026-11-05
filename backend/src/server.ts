import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
  isProduction,
} from "./config/cookies.js";
import authRoutes from "./routes/auth.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import smsRoutes from "./routes/sms.routes.js";
import { startSmsWorker } from "./workers/sms.worker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const sessionSecret = process.env.SESSION_SECRET;
const mongoUri = process.env.MONGO_URI;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is missing from the backend environment");
}
if (!mongoUri) {
  throw new Error("MONGO_URI is missing from the backend environment");
}

/**
 * Comma-separated list of allowed frontend origins. In production this is the
 * Vercel domain, e.g. "https://curuza.vercel.app".
 */
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

/** Optional regex for Vercel preview deployments, e.g. "^https://curuza-.*\\.vercel\\.app$". */
let previewOriginPattern: RegExp | null = null;
if (process.env.VERCEL_PREVIEW_ORIGIN_PATTERN) {
  try {
    previewOriginPattern = new RegExp(process.env.VERCEL_PREVIEW_ORIGIN_PATTERN);
  } catch (error) {
    console.error("Invalid VERCEL_PREVIEW_ORIGIN_PATTERN:", error);
  }
}

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  if (previewOriginPattern?.test(origin)) return true;
  if (
    !isProduction() &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  ) {
    return true;
  }
  return false;
}

if (isProduction() && !process.env.FRONTEND_URL) {
  console.warn(
    "FRONTEND_URL is not set. Only http://localhost:3000 will be allowed by CORS.",
  );
}

// Render terminates TLS at its proxy. Trust the first proxy hop so secure
// cookies and rate limiting see the real client protocol/IP.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: server-to-server calls, curl, health checks.
      if (!origin) return callback(null, true);
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
  }),
);

// Render health check target (configure this path in the Render dashboard).
app.get("/api/health", (_req, res) => {
  const databaseUp = mongoose.connection.readyState === 1;
  res.status(databaseUp ? 200 : 503).json({
    ok: databaseUp,
    status: databaseUp ? "up" : "starting",
    database: databaseUp ? "up" : "down",
  });
});

// Session store backed by MongoDB (TTL index expires sessions automatically).
app.use(
  session({
    name: SESSION_COOKIE_NAME,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: getSessionCookieOptions(),
    store: new MongoStore({
      mongoUrl: mongoUri,
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/sms", smsRoutes);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Small deployments run the reminder loop in-process. Set
  // SMS_WORKER_INLINE=false when a dedicated worker process is used instead.
  if (process.env.SMS_WORKER_INLINE !== "false" && process.env.NODE_ENV !== "test") {
    startSmsWorker();
  }
}

void startServer();
