# Deploying Curuza

Production layout:

| Part     | Platform | URL                                  |
| -------- | -------- | ------------------------------------ |
| Frontend | Vercel   | `https://<project>.vercel.app`       |
| Backend  | Render   | `https://curuza-nub1.onrender.com`   |
| Database | MongoDB Atlas | cluster connection string       |

The frontend and backend are on different domains, so the browser treats the
session request as **cross-site**. The backend is configured for that
(`SameSite=None; Secure` cookie + CORS allow-list), but the steps below must be
followed exactly.

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
NEXT_PUBLIC_API_URL=https://curuza-nub1.onrender.com
```

`NEXT_PUBLIC_*` values are baked in at build time, so **redeploy after changing
it**.

### First-deploy order

1. Deploy the frontend once to get its Vercel domain.
2. Put that domain in Render's `FRONTEND_URL`.
3. Redeploy/restart the Render backend.
4. Log in from the Vercel URL.

Local development keeps using `frontend/.env.local` with
`NEXT_PUBLIC_API_URL=http://localhost:4000`; that file is ignored by Git.

---

## 3. Why the cookie settings matter

- Local dev: `http://localhost:3000` → `http://localhost:4000` is not
  cross-site, so `SameSite=Lax` + non-secure cookies are used.
- Production: `https://*.vercel.app` → `https://*.onrender.com` **is**
  cross-site. Browsers only store that cookie when it is
  `SameSite=None; Secure`.
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
2. Open DevTools → Application → Cookies → backend domain.
3. Confirm `curuza_session` exists with `HttpOnly`, `Secure`, `SameSite=None`.
4. Refresh `/home`; you should stay signed in.

---

## 5. Production checklist

- [ ] `SESSION_SECRET` is long, random and only stored in Render.
- [ ] `MONGO_URI` includes the intended database name.
- [ ] Atlas network access allows Render.
- [ ] Render `FRONTEND_URL` exactly matches the Vercel origin (no trailing slash).
- [ ] Vercel `NEXT_PUBLIC_API_URL` is the Render HTTPS URL.
- [ ] Backend `/api/health` returns `200`.
- [ ] Login survives a page refresh on the Vercel domain.
- [ ] SMTP is configured if password-reset emails must reach users.
- [ ] `SMS_DRY_MODE=false` only when SMS credentials are set.
- [ ] Custom domain configured if Safari/iOS login is required.
