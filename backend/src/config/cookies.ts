import type { CookieOptions } from "express";

export const SESSION_COOKIE_NAME = "curuza_session";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Render sets RENDER=true on every service, so we can treat that as
 * production even if NODE_ENV was not configured in the dashboard.
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.RENDER === "true";
}

function resolveSameSite(): "lax" | "none" | "strict" {
  const configured = process.env.COOKIE_SAME_SITE?.toLowerCase();
  if (configured === "lax" || configured === "none" || configured === "strict") {
    return configured;
  }

  // Vercel -> Render is a cross-site request, so the session cookie must use
  // SameSite=None. Local development uses plain HTTP, where SameSite=None
  // cookies are rejected unless Secure is set, so keep Lax there.
  return isProduction() ? "none" : "lax";
}

function resolveSecure(sameSite: "lax" | "none" | "strict"): boolean {
  if (process.env.COOKIE_SECURE !== undefined) {
    return process.env.COOKIE_SECURE === "true";
  }
  return isProduction() || sameSite === "none";
}

function baseOptions() {
  const sameSite = resolveSameSite();
  return {
    httpOnly: true,
    sameSite,
    secure: resolveSecure(sameSite),
    path: "/",
  } satisfies CookieOptions;
}

/** Options used when express-session writes the cookie. */
export function getSessionCookieOptions(): CookieOptions {
  return { ...baseOptions(), maxAge: SESSION_MAX_AGE_MS };
}

/**
 * Options used with res.clearCookie(). Browsers only clear a cookie when the
 * name, path, SameSite and Secure attributes match the original cookie.
 */
export function getClearSessionCookieOptions(): CookieOptions {
  return baseOptions();
}
