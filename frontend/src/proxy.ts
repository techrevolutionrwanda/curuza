import { NextResponse, type NextRequest } from "next/server";
import { apiBaseUrl } from "@/lib/api-base";
import { SESSION_COOKIE } from "@/lib/session";

/** Dashboard routes that require a session. */
const PROTECTED = [
  "/home",
  "/sales",
  "/stock",
  "/debtors",
  "/reports",
  "/ai",
  "/settings",
];

/**
 * Ask the API whether the cookie still points at a live session.
 *
 * The cookie being present is not enough: it may have expired or been
 * revoked, and the API would then return 401 to every page's data calls.
 * Only a 401 means "log out"; if the API is unreachable we keep the user
 * signed in instead of forcing them out during an outage.
 */
const SESSION_CACHE_MS = 15_000;
const SESSION_CACHE_LIMIT = 250;
const sessionCache = new Map<string, { valid: boolean; expiresAt: number }>();

function readCachedSession(session: string): boolean | null {
  const entry = sessionCache.get(session);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    sessionCache.delete(session);
    return null;
  }
  return entry.valid;
}

function cacheSession(session: string, valid: boolean) {
  const now = Date.now();

  if (sessionCache.size >= SESSION_CACHE_LIMIT) {
    for (const [key, entry] of sessionCache) {
      if (entry.expiresAt <= now) sessionCache.delete(key);
    }
    while (sessionCache.size >= SESSION_CACHE_LIMIT) {
      const oldest = sessionCache.keys().next().value;
      if (!oldest) break;
      sessionCache.delete(oldest);
    }
  }

  sessionCache.set(session, { valid, expiresAt: now + SESSION_CACHE_MS });
}

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) return false;

  // Every navigation and prefetch runs the proxy. Re-asking the API on each
  // one adds a full backend round-trip to every click, so reuse the answer
  // briefly.
  const cached = readCachedSession(session);
  if (cached !== null) return cached;

  try {
    const response = await fetch(`${apiBaseUrl()}/api/auth/me`, {
      headers: { Cookie: `${SESSION_COOKIE}=${session}` },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    const valid = response.status !== 401;
    cacheSession(session, valid);
    return valid;
  } catch {
    // Do not sign the user out during a backend outage, and remember that for
    // a moment so the next clicks do not wait for the timeout again.
    cacheSession(session, true);
    return true;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(SESSION_COOKIE);
  return response;
}

/**
 * Optimistic auth gate (Next.js Proxy, formerly middleware).
 *
 * The backend sets the HTTP-only session cookie after successful
 * registration or login.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!(await hasValidSession(request))) {
      return redirectToLogin(request);
    }
  }

  if (pathname === "/" && loggedIn) {
    if (await hasValidSession(request)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Drop the stale cookie and show the login form instead of bouncing
    // between "/" and "/home".
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/sales/:path*",
    "/stock/:path*",
    "/debtors/:path*",
    "/reports/:path*",
    "/ai/:path*",
    "/settings/:path*",
  ],
};
