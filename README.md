# ALLC — Asian Lifestyle Longevity Clinic

Full-stack web application for ALLC — a lifestyle medicine clinic focused on chronic condition reversal and metabolic optimization.

---

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v6, Framer Motion, Tailwind CSS |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (access token 15m) + httpOnly refresh cookie (7d) |
| Email | Resend API |
| Tests | Jest (ESM) — 33 tests, 4 suites |

---

## Project Structure

```
ALLC/
├── src/                  # Frontend (Vite + React)
│   ├── components/       # Reusable UI components (Navbar, Footer, etc.)
│   ├── pages/            # Route-level pages
│   ├── lib/api.js        # Centralized API client (auth headers, token management)
│   ├── utils/blogStorage.js  # Blog API client (CRUD via REST)
│   └── context/AuthContext.jsx  # Global JWT auth state
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # auth.js, admin.js, waitlist.js, blog.js
│   │   ├── middleware/   # auth.js (JWT guards), rateLimiter.js
│   │   └── utils/        # jwt.js, email.js, audit.js, logger.js
│   ├── prisma/
│   │   ├── schema.prisma # DB models
│   │   └── migrations/   # SQL migration history
│   └── __tests__/        # Jest test suites
│
└── .github/workflows/    # CI (lint → test on push to main)
```

---

## Quick Start

### Frontend
```bash
npm install
npm run dev          # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Fill in your values
npx prisma generate
npm run dev          # http://localhost:4000
```

### Seed default admin
```bash
cd backend
npx prisma db seed
# Creates: admin@allc.local / Admin@1234  ← CHANGE AFTER FIRST LOGIN
```

---

## API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/login` | — | Login, returns JWT + sets cookie |
| POST | `/api/v1/auth/refresh` | cookie | Get new access token |
| POST | `/api/v1/auth/logout` | — | Revoke session |
| GET | `/api/v1/auth/me` | bearer | Current user info |
| PATCH | `/api/v1/auth/password` | bearer | Self-service password change |
| POST | `/api/v1/auth/forgot-password` | — | Trigger password reset email |
| POST | `/api/v1/auth/reset-password` | — | Apply token + new password |
| POST | `/api/v1/waitlist` | — | Submit waitlist application |
| GET | `/api/v1/admin/waitlist` | REVIEWER+ | List applications |
| PATCH | `/api/v1/admin/waitlist/:id` | ADMIN+ | Update status / notes |
| DELETE | `/api/v1/admin/waitlist/:id` | ADMIN+ | Delete application |
| GET | `/api/v1/admin/users` | SUPERADMIN | List admin users |
| POST | `/api/v1/admin/users` | SUPERADMIN | Create admin user |
| PATCH | `/api/v1/admin/users/:id` | SUPERADMIN | Update role / deactivate |
| GET | `/api/v1/admin/audit-events` | ADMIN+ | View audit log |
| GET | `/api/v1/blog` | — | List published posts |
| GET | `/api/v1/blog/:id` | — | Single published post |
| GET | `/api/v1/blog/admin/all` | REVIEWER+ | All posts (incl. drafts) |
| POST | `/api/v1/blog` | ADMIN+ | Create post |
| PATCH | `/api/v1/blog/:id` | ADMIN+ | Update post |
| DELETE | `/api/v1/blog/:id` | SUPERADMIN | Delete post |

---

## Roles

| Role | Permissions |
|------|-------------|
| `REVIEWER` | Read-only: view waitlist, blog drafts, audit log |
| `ADMIN` | REVIEWER + update waitlist status, create/edit blog posts |
| `SUPERADMIN` | ADMIN + user management, delete posts/applications |

---

## Environment Variables

See `backend/.env.example` for all required variables.

---

## Tests

```bash
cd backend
npm test
# Expected: 33/33 passing across 4 suites
```

---

## Deployment

1. Deploy backend → Render or Railway
2. Set all env vars from `.env.example` in the hosting dashboard
3. Add release command: `npx prisma migrate deploy`
4. Deploy frontend → Vercel or Netlify
5. Set `VITE_API_BASE_URL` to your backend URL
6. Configure `CORS_ORIGIN` on backend to match your frontend domain

---

## For the Next Developer

- **Payment gateway**: Add routes in `backend/src/routes/` following the same pattern (Zod validation → Prisma → audit log). Mount in `server.js`.
- **Email domain**: Verify `asianllc.com` at resend.com before emails will work in production.
- **Blog images**: Currently URL-only. Upload support would need Supabase Storage or Cloudinary.
