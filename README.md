# 🧠 SensAI Pro — Full-Stack AI Career SaaS

Production-ready AI SaaS with JWT authentication, PostgreSQL (Neon), Prisma ORM, admin panel, and GPT-4o powered career tools.

---

## 🛠 Tech Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Framework    | Next.js 14 (App Router)        |
| Language     | JavaScript only                |
| Styling      | Tailwind CSS + shadcn/ui       |
| Auth         | Custom JWT (bcrypt + jsonwebtoken) |
| Database     | PostgreSQL via Neon DB         |
| ORM          | Prisma                         |
| AI           | OpenAI GPT-4o                  |

---

## 📁 Project Structure

```
sensai-pro/
├── app/
│   ├── layout.js
│   ├── page.js                      # Redirects to /login or /dashboard
│   ├── globals.css
│   ├── login/page.js
│   ├── signup/page.js
│   ├── dashboard/layout.js + page.js
│   ├── resume/layout.js + page.js
│   ├── cover-letter/layout.js + page.js
│   ├── interview/layout.js + page.js
│   ├── career/layout.js + page.js
│   ├── admin/layout.js + page.js
│   └── api/
│       ├── auth/login/route.js
│       ├── auth/signup/route.js
│       ├── auth/logout/route.js
│       ├── auth/me/route.js
│       ├── admin/route.js           # GET all users, DELETE user
│       └── ai/route.js              # All AI features
├── components/
│   ├── Sidebar.js
│   ├── PageHeader.js
│   ├── LoadingSkeleton.js
│   └── ui/  (button, input, textarea, label, card, badge, progress, accordion, toast, toaster, separator)
├── hooks/
│   ├── useAuth.js
│   ├── useAI.js
│   └── use-toast.js
├── lib/
│   ├── prisma.js
│   ├── auth.js
│   └── utils.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── middleware.js
├── .env.local
└── package.json
```

---

## ⚡ Quick Start

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Set up Neon DB

1. Go to [neon.tech](https://neon.tech) → Sign up free
2. Create a new project (name it `sensai-db`)
3. From the dashboard, copy your **Connection String**:
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3 — Generate JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output — this is your `JWT_SECRET`.

### Step 4 — Get OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Copy it (you only see it once)

### Step 5 — Fill in `.env.local`

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-64-char-random-string-here"
OPENAI_API_KEY="sk-proj-your-openai-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 6 — Initialize the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Neon
npm run db:push

# Create default admin user (admin@sensai.dev / admin123)
npm run db:seed
```

### Step 7 — Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Default Admin Credentials

After running `npm run db:seed`:

| Field    | Value               |
|----------|---------------------|
| Email    | admin@sensai.dev    |
| Password | admin123            |
| Role     | ADMIN               |

> ⚠️ **Change this password immediately** after first login in production!

---

## 🔑 Authentication Flow

```
Signup → hash password (bcrypt, 12 rounds)
       → create user in DB
       → sign JWT (7-day expiry)
       → set HTTP-only cookie

Login  → verify password
       → sign JWT
       → set HTTP-only cookie

Middleware → reads cookie on every request
           → verifies JWT with jose
           → injects user headers
           → redirects if unauthenticated
           → blocks non-admins from /admin
```

---

## 🧑‍💼 Admin Panel (`/admin`)

- Accessible only to users with `role: ADMIN`
- Shows all registered users in a searchable table
- Stats: total users, regular users, admins, today's signups
- Delete users (with confirmation)
- Middleware blocks non-admin access and redirects to dashboard

---

## 🚀 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in **Vercel Dashboard → Project Settings → Environment Variables**:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
- `NODE_ENV=production`

In Neon DB, whitelist Vercel's IPs or set connection pooling for serverless.

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `PrismaClientInitializationError` | Check `DATABASE_URL` in `.env.local` |
| `JWT_SECRET is not set` | Add JWT_SECRET to `.env.local` |
| Redirect loop on login | Clear browser cookies and retry |
| `401 from /api/ai` | Make sure you're logged in; check cookie |
| OpenAI `401` error | Check `OPENAI_API_KEY` value |
| OpenAI `429` error | Rate limit hit — wait 60s and retry |
| `P1001: Can't reach database` | Check Neon DB is active and URL is correct |
| Admin page shows 403 | Your user role is not ADMIN — run seed or update DB |

---

## 📝 License

MIT — Free to use, modify, and deploy.
