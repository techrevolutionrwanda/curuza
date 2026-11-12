import type { NextConfig } from "next";

/**
 * Absolute URL of the Express backend. Server-side fetches and the `/api`
 * rewrite use it. `NEXT_PUBLIC_API_URL` is kept as a fallback so existing
 * deployments keep working.
 */
const backendUrl = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* config options here */
  async rewrites() {
    // Proxy API traffic through the frontend origin so the session cookie is
    // first-party (localhost in dev, the Vercel domain in production). Without
    // this the cookie is stored for *.onrender.com and the Next.js route gate
    // on the frontend origin can never read it.
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  redirects: async () => [
    // The login page now lives at the root URL.
    { source: "/login", destination: "/", permanent: false },
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
