const DEFAULT_BACKEND_URL = "http://localhost:4000";

function backendBaseUrl(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/$/, "");
}

/**
 * API origin to use for a request.
 *
 * - Browser: an empty string, so requests go to the same origin and are
 *   proxied through the Next.js `/api` rewrite. This keeps the session cookie
 *   on the frontend domain (localhost or Vercel) instead of the Render domain,
 *   which is what the route gate and server components read.
 * - Server: the absolute backend URL, because server-side fetch() cannot use a
 *   relative path.
 */
export function apiBaseUrl(): string {
  return typeof window === "undefined" ? backendBaseUrl() : "";
}
