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
async function hasValidSession(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) return false;

  try {
    const response = await fetch(`${apiBaseUrl()}/api/auth/me`, {
      headers: { Cookie: `${SESSION_COOKIE}=${session}` },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    return response.status !== 401;
  } catch {
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
