/**
 * Placeholder session for the auth pages.
 *
 * The backend has no auth API yet, so "logging in" simply writes a
 * session cookie (cleared when the browser closes) which the proxy in
 * src/proxy.ts uses to gate the dashboard routes. When real auth
 * arrives, only who issues the cookie has to change.
 */
export const SESSION_COOKIE = "curuza_session";

/** Mark the visitor as logged in. Client-side only. */
export function startSession(): void {
  document.cookie = `${SESSION_COOKIE}=1; path=/; samesite=lax`;
}
