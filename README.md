# 🍼 LittleBundle Diaper Store

A modern e-commerce storefront for baby diapers built with **Next.js 14**, **Prisma**, **Tailwind CSS**, and **shadcn/ui**.

---

## ✨ Features

- **Product Catalog** — Browse diapers by size and pack type with filtering
- **Product Detail Pages** — Rich descriptions, feature lists, and customer reviews
- **Shopping Cart** — Client-side cart with Zustand state management
- **Checkout Flow** — Full order placement with form validation
- **Size Guide** — Interactive guide to help parents pick the right size
- **Responsive Design** — Mobile-first UI with dark mode support
- **SEO Ready** — Dynamic sitemap, robots.txt, and Open Graph metadata

---

## 🛠 Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 14 (App Router)             |
| Language     | TypeScript                          |
| Database     | PostgreSQL + Prisma ORM             |
| Styling      | Tailwind CSS + shadcn/ui + Radix UI |
| State        | Zustand, Jotai, React Query         |
| Validation   | Zod, Yup, React Hook Form           |
| Deployment   | Vercel (recommended)                |

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **PostgreSQL** database (local or hosted)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/diaper-store.git
cd diaper-store
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set at minimum:

| Variable        | Description                                     | Required |
| --------------- | ----------------------------------------------- | -------- |
| `DATABASE_URL`  | PostgreSQL connection string for Prisma          | ✅ Yes   |
| `NEXTAUTH_URL`  | Canonical site URL (metadata, sitemap, robots)   | Recommended |

### 4. Set up the database

```bash
# Push the Prisma schema to your database
npx prisma db push

# Seed the database with sample products
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

---

## 🏗 Production Build

```bash
npm run build   # Generates Prisma client + builds Next.js
npm run start   # Starts the production server
```

---

## ☁️ Deploy to Vercel

### One-Click Deploy

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Configure the environment variables (see below)
4. Click **Deploy**

### Environment Variables in Vercel

In your Vercel project dashboard → **Settings** → **Environment Variables**, add:

| Variable        | Value                                                        | Notes                                      |
| --------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `DATABASE_URL`  | `postgresql://user:pass@host:5432/db?connect_timeout=15`     | **Required.** Use Neon, Supabase, or Vercel Postgres |
| `NEXTAUTH_URL`  | `https://your-store.vercel.app`                              | Set to your production domain               |

#### Recommended PostgreSQL Providers for Vercel

- **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)** — Native integration, auto-configured
- **[Neon](https://neon.tech)** — Serverless Postgres with generous free tier
- **[Supabase](https://supabase.com)** — Full Postgres with REST API
- **[Railway](https://railway.app)** — Simple managed Postgres

### Post-Deploy: Database Setup

After the first deployment, run migrations and seed the database:

```bash
# Using Vercel CLI
vercel env pull .env.local          # Pull prod env vars locally
npx prisma db push                  # Push schema to production DB
npx prisma db seed                  # Seed with sample products
```

Or use the Vercel Postgres dashboard to run the seed directly.

### Build Configuration

Vercel auto-detects Next.js. No special configuration needed:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (runs `prisma generate && next build`)
- **Install Command:** `npm install --legacy-peer-deps`
- **Output Directory:** `.next` (default)

> ⚠️ **Important:** Set the Install Command to `npm install --legacy-peer-deps` in Vercel's project settings to avoid peer dependency conflicts.

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # REST API endpoints (products, orders, featured)
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product listing & detail pages
│   ├── size-guide/         # Diaper size guide
│   ├── layout.tsx          # Root layout (theme, cart provider)
│   └── page.tsx            # Home page
├── components/             # Reusable React components
│   ├── ui/                 # shadcn/ui primitives
│   └── layouts/            # Layout wrappers
├── lib/                    # Utilities (db client, types, cart store)
├── prisma/                 # Prisma schema & migrations
├── scripts/                # Database seed scripts
├── public/                 # Static assets
└── hooks/                  # Custom React hooks
```

---

## 📄 License

Private project — all rights reserved.
