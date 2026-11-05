# Deploying Curuza

Production layout:

| Part     | Platform | URL                                  |
| -------- | -------- | ------------------------------------ |
| Frontend | Vercel   | `https://<project>.vercel.app`       |
| Backend  | Render   | `https://curuza-nub1.onrender.com`   |
| Database | MongoDB Atlas | cluster connection string       |

Browser API requests go to the frontend origin and are proxied to the backend by
the `/api/:path*` rewrite in `frontend/next.config.ts`. That keeps the
`curuza_session` cookie first-party on the frontend domain, which the Next.js
route gate and server components need. The direct frontend → Render hop is still
cross-site, so the backend keeps its `SameSite=None; Secure` cookie + CORS
allow-list settings. Follow the steps below exactly.

---

## 1. Backend on Render

### Service settings

| Setting          | Value                          |
| ---------------- | ------------------------------ |
| Root Directory   | `backend`                      |
| Build Command    | `npm ci && npm run build`      |
| Start Command    | `npm start`                    |
| Health Check Path| `/api/health`                  |
| Node version     | 20.9+ (22 recommended)         |

Do **not** set `PORT`; Render injects it.

### Environment variables

| Key                          | Value / notes |
| ---------------------------- | ------------- |
| `NODE_ENV`                   | `production` |
| `MONGO_URI`                  | MongoDB Atlas URI, including the database name |
| `SESSION_SECRET`             | Long random string (Render can generate it) |
| `FRONTEND_URL`               | Vercel production URL, e.g. `https://curuza.vercel.app` |
| `COOKIE_SAME_SITE`           | `none` |
| `COOKIE_SECURE`              | `true` |
| `VERCEL_PREVIEW_ORIGIN_PATTERN` | Optional regex for preview deploys, e.g. `^https://curuza-[a-z0-9-]+\.vercel\.app$` |
| `SMS_*`                      | See `backend/.env.example` |
| `SMTP_*`                     | Optional; without it reset links are only logged |

After changing `FRONTEND_URL`, redeploy/restart the Render service.

### MongoDB Atlas

1. Create a database user for the app.
2. Add a Network Access rule for Render. The simplest option is
   `0.0.0.0/0`; a static Render egress IP is safer if your plan provides one.
3. Use the database name in `MONGO_URI`, e.g.
   `mongodb+srv://user:pass@cluster.mongodb.net/curuza`.

> **Existing data note:** the current Atlas users live in the `test` database
> because the old connection string had no database name. If you switch to a
> named database such as `curuza`, copy the collections first or the existing
> accounts will not appear.

---

## 2. Frontend on Vercel

### Project settings

| Setting            | Value       |
| ------------------ | ----------- |
| Root Directory     | `frontend`  |
| Framework Preset   | Next.js     |
| Build Command      | `npm run build` (default) |
| Node version       | 20.9+       |

### Environment variable

Set this in **Vercel → Project → Settings → Environment Variables** for
Production (and Preview if you use previews):

```env
API_URL=https://curuza-nub1.onrender.com
```

`API_URL` is used by the `/api/:path*` rewrite in `frontend/next.config.ts` and
by server components. `NEXT_PUBLIC_API_URL` is still accepted as a fallback, but
`API_URL` is preferred because the browser never needs the backend URL.

Rewrites are compiled at build time, so **redeploy after changing this value**.

### First-deploy order

1. Deploy the frontend once to get its Vercel domain.
2. Put that domain in Render's `FRONTEND_URL`.
3. Redeploy/restart the Render backend.
4. Log in from the Vercel URL.

Local development keeps using `frontend/.env.local` with
`API_URL=https://curuza-nub1.onrender.com` (or `http://localhost:4000` when
running the backend locally); that file is ignored by Git.

---

## 3. Why the `/api` proxy and cookie settings matter

All browser requests go to relative `/api/...` URLs and are proxied by Next.js
to the backend. This is essential:

- Without the proxy, the backend sets `curuza_session` for `*.onrender.com`.
  The Next.js route gate (`frontend/src/proxy.ts`) and server components run on
  the frontend origin (`localhost` or Vercel) and read cookies for **that**
  origin, so they never see the session and bounce you back to the login page.
- With the proxy, the browser stores `curuza_session` for the frontend origin,
  so the route gate and server components can read it. Server-to-server calls
  use the absolute `API_URL` and forward the cookie explicitly.

Backend cookie behaviour:

- Local backend: `SameSite=Lax` + non-secure cookies are used.
- Production backend: requests from the Next.js server are still cross-site at
  the HTTP level, so `SameSite=None; Secure` is used.
- `app.set("trust proxy", 1)` is required because Render terminates TLS at its
  proxy. Without it, express-session may refuse to set secure cookies.

### Recommended: custom domains

Third-party cookies (including `SameSite=None`) can be blocked by privacy
settings, especially Safari/iOS. If possible, point both services at subdomains
of the same parent domain:

```text
https://app.example.com   → Vercel
https://api.example.com   → Render
```

That makes the session cookie first-party. You can then set
`COOKIE_SAME_SITE=lax` and `COOKIE_SECURE=true` on Render.

---

## 4. Verify the deployment

```bash
# Backend is up and connected to MongoDB
curl https://curuza-nub1.onrender.com/api/health
# => {"ok":true,"status":"up","database":"up"}

# CORS allows the Vercel origin
curl -i -X OPTIONS https://curuza-nub1.onrender.com/api/auth/login \
  -H "Origin: https://curuza.vercel.app" \
  -H "Access-Control-Request-Method: POST"
# => access-control-allow-origin: https://curuza.vercel.app
# => access-control-allow-credentials: true
```

Then, in the browser on the Vercel URL:

1. Register or log in.
2. Open DevTools → Application → Cookies → **frontend origin**.
3. Confirm `curuza_session` exists for the frontend domain (the backend cookie
   is an implementation detail and is not used by the browser).
4. Refresh `/home`; you should stay signed in.

---

## 5. Production checklist

- [ ] `SESSION_SECRET` is long, random and only stored in Render.
- [ ] `MONGO_URI` includes the intended database name.
- [ ] Atlas network access allows Render.
- [ ] Render `FRONTEND_URL` exactly matches the Vercel origin (no trailing slash).
- [ ] Vercel `API_URL` is the Render HTTPS URL.
- [ ] `/api/health` through the frontend proxy returns `200`
      (`https://<vercel-domain>/api/health`).
- [ ] Backend `/api/health` returns `200`.
- [ ] Login survives a page refresh on the Vercel domain.
- [ ] SMTP is configured if password-reset emails must reach users.
- [ ] `SMS_DRY_MODE=false` only when SMS credentials are set.
- [ ] Custom domain configured if Safari/iOS login is required.
