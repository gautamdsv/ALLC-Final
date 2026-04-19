# ALLC — Asian Lifestyle Longevity Clinic

Full-stack web application for a lifestyle medicine clinic focused on chronic condition reversal and metabolic optimization.

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v6, Framer Motion, Tailwind CSS + DaisyUI |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL (Supabase) |
| Auth | JWT access tokens (15 min) + httpOnly refresh cookies (7 days) |
| Email | Resend API |
| Tests | Jest (ESM) — 33 tests across 4 suites |

## Project Structure

```
ALLC/
├── src/                          # Frontend (Vite + React)
│   ├── components/
│   │   ├── NavbarVariant2.jsx    # Main navigation with mobile hamburger menu
│   │   ├── FooterVariant2.jsx    # Footer with social links and newsletter CTA
│   │   ├── TimelineFeatures.jsx  # Scroll-driven timeline (desktop + mobile variants)
│   │   ├── AppleCardsCarousel.jsx # Draggable card carousel for programs section
│   │   ├── ChromaGrid.jsx        # Team member grid with hover effects
│   │   ├── WaitlistMeter.jsx     # Animated waitlist counter with pulse effect
│   │   ├── ProtectedRoute.jsx    # Auth guard for admin pages
│   │   └── ScrollToTop.jsx       # Scroll-to-top on route change
│   │
│   ├── pages/
│   │   ├── HomePaletteTeal.jsx   # Landing page (hero, timeline, programs, team, CTA)
│   │   ├── About.jsx             # Clinic philosophy, pillars, team bios
│   │   ├── Services.jsx          # Clinical programs with expandable detail modals
│   │   ├── Research.jsx          # Peer-reviewed research references
│   │   ├── Contact.jsx           # Contact form (submits to backend waitlist)
│   │   ├── Blogs.jsx             # Blog listing with category filter
│   │   ├── BlogPost.jsx          # Individual blog post view
│   │   ├── BlogEditor.jsx        # Admin blog CRUD (create/edit/publish)
│   │   ├── AdminDashboard.jsx    # Waitlist management, user admin, audit log
│   │   ├── AdminLogin.jsx        # Admin authentication page
│   │   ├── ForgotPassword.jsx    # Password reset request
│   │   └── ResetPassword.jsx     # Token-based password reset
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # JWT state provider (login, logout, refresh)
│   │   ├── useAuth.js            # Hook shortcut for auth context
│   │   └── auth-context.js       # Re-export for backwards compat
│   │
│   ├── lib/api.js                # Fetch wrapper with auto auth headers
│   ├── utils/blogStorage.js      # Blog API client (CRUD over REST)
│   ├── data/teamMembers.js       # Static team data
│   ├── index.css                 # Global styles, font imports, Tailwind layers
│   └── main.jsx                  # App entry point
│
├── backend/
│   ├── src/
│   │   ├── server.js             # Express app — mounts all routes and middleware
│   │   ├── db.js                 # Prisma client singleton
│   │   ├── routes/
│   │   │   ├── auth.js           # Login, logout, refresh, password reset
│   │   │   ├── admin.js          # Waitlist CRUD, user management, audit log
│   │   │   ├── waitlist.js       # Public waitlist submission
│   │   │   └── blog.js           # Blog CRUD with publish/draft workflow
│   │   ├── middleware/
│   │   │   ├── auth.js           # authGuard (JWT verify) + roleGuard (RBAC)
│   │   │   └── rateLimiter.js    # Rate limiters (API, auth, waitlist)
│   │   └── utils/
│   │       ├── jwt.js            # Token generation and verification
│   │       ├── email.js          # Resend email sending
│   │       ├── audit.js          # Audit event logger
│   │       └── logger.js         # Console logger with timestamps
│   │
│   ├── prisma/
│   │   ├── schema.prisma         # Database models (see "Database" section below)
│   │   ├── seed.js               # Creates default admin user
│   │   └── migrations/           # SQL migration history
│   │
│   ├── __tests__/                # Jest test suites (auth, health, RBAC, waitlist)
│   └── .env.example              # All required environment variables with comments
│
├── public/                       # Static assets (favicon, images)
├── tailwind.config.js            # Custom color palette, fonts, breakpoints
├── vite.config.js                # Dev server proxy and build config
└── eslint.config.js              # React + hooks linting
```

## Quick Start

### Frontend
```bash
npm install
npm run dev              # starts at http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env     # fill in your Supabase/Resend credentials
npx prisma generate      # generate the Prisma client
npx prisma migrate deploy # apply migrations to your database
npm run dev              # starts at http://localhost:4000
```

### Seed the default admin
```bash
cd backend
npx prisma db seed
# Creates: admin@allc.local / Admin@1234
# CHANGE THIS PASSWORD IMMEDIATELY after first login
```

## Database Schema

All models are defined in `backend/prisma/schema.prisma`:

| Model | Purpose |
|-------|---------|
| `User` | Admin accounts (email, passwordHash, role, isActive) |
| `RefreshToken` | JWT refresh tokens linked to users, with expiry and revocation |
| `PasswordResetToken` | Time-limited tokens for the forgot-password flow |
| `WaitlistApplication` | Public waitlist submissions with status tracking and admin notes |
| `AuditEvent` | Immutable log of all admin actions (who did what, when) |
| `BlogPost` | Blog content with title, category, tags, published/draft state |

### Roles
| Role | Permissions |
|------|-------------|
| `REVIEWER` | Read-only: view waitlist, blog drafts, audit log |
| `ADMIN` | REVIEWER + update waitlist status, create/edit blog posts |
| `SUPERADMIN` | ADMIN + user management, delete posts/applications |

## API Reference

All routes are prefixed with `/api/v1`.

### Auth (`/api/v1/auth`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/login` | — | Returns JWT access token + sets httpOnly refresh cookie |
| POST | `/refresh` | cookie | Exchange refresh cookie for new access token |
| POST | `/logout` | — | Revoke refresh token and clear cookie |
| GET | `/me` | bearer | Get current user info |
| PATCH | `/password` | bearer | Change own password |
| POST | `/forgot-password` | — | Send password reset email |
| POST | `/reset-password` | — | Apply reset token + set new password |

### Waitlist (`/api/v1/waitlist`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/` | — | Submit a waitlist application (rate-limited: 5/hour) |
| GET | `/count` | — | Get total accepted count (for the meter on homepage) |

### Admin (`/api/v1/admin`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/waitlist` | REVIEWER+ | List applications (search, filter, paginate, sort) |
| PATCH | `/waitlist/:id` | ADMIN+ | Update status or admin notes |
| DELETE | `/waitlist/:id` | ADMIN+ | Delete an application |
| GET | `/users` | SUPERADMIN | List all admin users |
| POST | `/users` | SUPERADMIN | Create a new admin user |
| PATCH | `/users/:id` | SUPERADMIN | Update role or deactivate account |
| GET | `/audit-events` | ADMIN+ | View recent audit log (last 100 events) |

### Blog (`/api/v1/blog`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | — | List published posts (optional `?category=` filter) |
| GET | `/:id` | — | Get a single published post |
| GET | `/admin/all` | REVIEWER+ | List all posts including drafts |
| POST | `/` | ADMIN+ | Create a new post |
| PATCH | `/:id` | ADMIN+ | Update a post |
| DELETE | `/:id` | SUPERADMIN | Delete a post |

## Environment Variables

All are documented in `backend/.env.example`. The required ones:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase pooler connection string (port 6543) |
| `DIRECT_URL` | Supabase direct connection (port 5432, for migrations) |
| `ACCESS_TOKEN_SECRET` | Random 64-byte hex string for JWT signing |
| `REFRESH_TOKEN_SECRET` | Different random 64-byte hex for refresh tokens |
| `RESEND_API_KEY` | API key from resend.com |
| `FRONTEND_URL` | Where password reset links point to |
| `CLINIC_NOTIFY_EMAIL` | Gets notified on every new waitlist submission |
| `CORS_ORIGIN` | Allowed frontend origins (comma-separated) |

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Tests

```bash
cd backend
npm test
# 33 tests passing across 4 suites (auth, health, RBAC, waitlist)
```

## Deployment

1. **Backend** → Deploy to Render, Railway, or any Node.js host
   - Set all env vars from `.env.example`
   - Set release command to `npx prisma migrate deploy`
   - Start command: `node src/server.js`

2. **Frontend** → Deploy to Vercel or Netlify
   - Set `VITE_API_BASE_URL` to your backend URL (e.g. `https://api.asianllc.com`)
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Backend CORS** → Set `CORS_ORIGIN` to your frontend domain

4. **Email** → Verify `asianllc.com` domain at resend.com before production emails will deliver

## For the Next Developer

The primary task ahead is **payment gateway integration**. Here's what you need to know:

### Adding new backend features
1. Create a new route file in `backend/src/routes/` (follow the pattern in `waitlist.js` or `blog.js`)
2. Use `zod` for request validation, `sanitize-html` for user input
3. Use `authGuard` + `roleGuard` middleware for protected endpoints
4. Log admin actions with `audit()` from `utils/audit.js`
5. Mount the router in `server.js`

### Known lint warnings (not bugs)
- **TimelineFeatures.jsx**: `useTransform` called inside `.map()` — this is intentional for scroll-driven animation with a fixed-length array. Works correctly at runtime.
- **AppleCardsCarousel.jsx**: `Date.now()` inside drag event handlers flagged as "impure during render" — these are event handlers, not render body. Works correctly.

### Things still needed
- **Payment gateway**: Routes, webhooks, subscription management
- **Blog images**: Currently URL-only. Consider adding Supabase Storage or Cloudinary for uploads
- **Email domain**: Verify `asianllc.com` at resend.com for production delivery
