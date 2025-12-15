<!-- Quick, actionable guidance for AI coding agents working on QuickCart -->
# QuickCart — Copilot Instructions

This file captures the essential, discoverable knowledge an AI coding agent needs to be productive in this repository.

1) Big picture
- This is a Next.js (app router) frontend using React + Tailwind (`app/`, `components/`).
- Server endpoints live under the App Router API: `app/api/*/route.js` (e.g. [app/api/product/list/route.js](app/api/product/list/route.js#L1)).
- Auth is provided by Clerk (`@clerk/nextjs`) and wrapped in `app/layout.js` via `ClerkProvider`.
- Persistent data uses MongoDB via Mongoose. Connection helper: [config/db.js](config/db.js#L1-L40).
- Background/event logic uses Inngest: [config/inngest.js](config/inngest.js#L1-L20) (creates functions such as `createUserOrder`).

2) Developer workflows / commands
- Install: `npm install` (see [package.json](package.json#L1-L40)).
- Dev: `npm run dev` (uses `next dev --turbopack`). Ensure environment vars are set before running.
- Build: `npm run build`, Start: `npm run start`.
- Lint: `npm run lint`.

3) Important environment variables (must be present locally)
- `MONGODB_URI` — MongoDB connection string used by [config/db.js](config/db.js#L1-L40).
- `NEXT_PUBLIC_CURRENCY` — displayed currency used in `context/AppContext.jsx`.
- Clerk-related env vars — required for `ClerkProvider` in [app/layout.js](app/layout.js#L1-L20).
- Cloudinary / other third-party keys may be referenced by API handlers (search `cloudinary` usage).

4) Project-specific patterns & conventions
- App router conventions: pages use `page.jsx`, API handlers use `route.js` under `app/api`.
- Client components must include `"use client"` (see [context/AppContext.jsx](context/AppContext.jsx#L1-L4)).
- Server-side helpers (DB, Inngest) are imported from `config/` and `lib/` and may perform dynamic `import()` of models.
- DB connection caching: [config/db.js](config/db.js#L1-L40) caches `global.mongoose` to avoid reconnect storms — reuse this helper for any DB access.
- Auth token usage: `getToken()` from `useAuth()` is used in the client to call authenticated API routes (see `fetchUserData` in [context/AppContext.jsx](context/AppContext.jsx#L1-L120)).

5) Integration points to watch when changing code
- API routes called by UI: e.g. `/api/product/list`, `/api/cart/update`. Update both handler and UI callers together.
- Inngest functions in [config/inngest.js](config/inngest.js#L1-L200) expect models to be available; ensure `connectDB()` is called before model usage.
- Models live in `models/` — e.g. [models/User.js](models/User.js) and [models/Order.js](models/Order.js). Keep schema changes compatible with existing handlers.

6) Quick examples (how to add a new API route)
- Add `app/api/foo/route.js` exporting `GET`/`POST` handlers. Use `await connectDB()` before touching Mongoose models.
- From client, call `axios.get('/api/foo')` or `axios.post('/api/foo', body, { headers: { Authorization: `Bearer ${token}` }})` when auth is required.

7) Safety nets & troubleshooting
- Common dev startup problems: missing `MONGODB_URI` or Clerk env vars — check console for connection/auth errors.
- DB timeouts are configured in [config/db.js](config/db.js#L10-L30) — adjust `serverSelectionTimeoutMS` only if you understand implications.

8) Where to look for more context
- App shell and providers: [app/layout.js](app/layout.js#L1-L40).
- Global client state and API usage: [context/AppContext.jsx](context/AppContext.jsx#L1-L160).
- Background/event flows: [config/inngest.js](config/inngest.js#L1-L200).
- DB connection and models: [config/db.js](config/db.js#L1-L40) and `models/` directory.

If anything in these notes is unclear or you'd like more examples (PRs, tests, or editing conventions), tell me which area to expand.  
-- QuickCart maintainers
