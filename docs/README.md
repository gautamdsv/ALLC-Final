# Developer Onboarding

Quick reference for getting up to speed on the ALLC codebase.

## How the frontend works

The app is a standard Vite + React SPA. All routing is in `src/App.jsx`.

**Public pages**: HomePaletteTeal, About, Services, Research, Contact, Blogs, BlogPost

**Admin pages** (behind `ProtectedRoute`): AdminLogin, AdminDashboard, BlogEditor, ForgotPassword, ResetPassword

**Auth flow**: `AuthContext.jsx` stores the JWT access token in memory (never localStorage). On page load, it calls `/api/v1/auth/refresh` to get a new access token from the httpOnly refresh cookie. If that fails, the user is logged out.

**API calls**: All API requests go through `src/lib/api.js`, which auto-attaches the `Authorization: Bearer` header. Blog-specific calls use `src/utils/blogStorage.js` which wraps the blog endpoints.

## How the backend works

Express 5 app in `backend/src/server.js`. Routes are mounted under `/api/v1/`.

**Request lifecycle**:
1. Rate limiter checks the request
2. CORS validates the origin
3. Route handler runs
4. If protected: `authGuard` verifies the JWT, `roleGuard` checks the user's role
5. `zod` validates the request body
6. `sanitize-html` strips any HTML from user input
7. Prisma executes the database query
8. `audit()` logs the action (for admin routes)

**Password reset flow**: User submits email → backend generates a random token → hashes it with SHA-256 → stores the hash in `PasswordResetToken` table → sends the raw token in a link via Resend → user clicks link → frontend sends token + new password to `/reset-password` → backend hashes the incoming token, finds the match, verifies expiry, updates the password.

## Database

PostgreSQL hosted on Supabase. Schema is at `backend/prisma/schema.prisma`.

Two connection strings are needed:
- `DATABASE_URL` — goes through PgBouncer (port 6543). Used at runtime.
- `DIRECT_URL` — bypasses PgBouncer (port 5432). Used by `prisma migrate` and `prisma studio`.

## Key design decisions

- **No localStorage for auth tokens** — access token lives in a JS variable, refresh token is httpOnly cookie. This prevents XSS from stealing credentials.
- **Audit everything** — every admin action (status change, user creation, deletion) is logged to the `AuditEvent` table with the actor's user ID.
- **Rate limiting** — three tiers: general API (100/15min), auth (10/15min), waitlist (5/hour).
- **Blog is server-rendered from the DB** — the `blogStorage.js` file talks directly to the REST API, not localStorage. The name is a holdover from an earlier iteration.

## Adding a payment gateway

This is the next feature to build. Suggested approach:

1. Pick a provider (Razorpay or Stripe)
2. Create `backend/src/routes/payments.js`
3. Add endpoints for: create order, verify payment, webhook handler
4. Add a `Payment` model to `schema.prisma` and run `npx prisma migrate dev`
5. Mount the router in `server.js`
6. Build a frontend checkout page
7. Use the `audit()` utility to log payment events

Follow the patterns in `waitlist.js` (simplest route) and `admin.js` (RBAC + audit) for reference.
