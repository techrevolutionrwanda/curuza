import { rateLimit } from "express-rate-limit";

/**
 * Protects the credential endpoints against brute-force attempts.
 * Render forwards the real client IP via X-Forwarded-For, and `trust proxy`
 * is enabled in server.ts so each client gets its own bucket.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many attempts. Please wait a few minutes and try again.",
  },
});

/** Password-reset requests are more sensitive, so allow fewer per window. */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Too many password reset requests. Please try again later.",
  },
});
