import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/** Dashboard routes that require a session. */
const PROTECTED = ["/home", "/stock", "/debtors", "/reports", "/settings"];

/**
 * Optimistic auth gate (Next.js Proxy, formerly middleware).
 *
 * Until the backend issues real sessions:
 * - the dashboard routes bounce back to the login page at / when the
 *   placeholder cookie is missing
 * - when the cookie is present, / skips the login and goes to /home
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected && !loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname === "/" && loggedIn) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/stock/:path*",
    "/debtors/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
