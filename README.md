# DigSol

DigSolutions is a digital business transformation platform and marketing site for SMBs, mid-market companies, and enterprises. It combines a premium public website with a Supabase-backed admin CMS for content, leads, users, media, analytics, and site settings.

## Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, editorial design tokens (EB Garamond + Inter)
- **Motion:** GSAP, Framer Motion, Lenis, anime.js
- **Backend:** Supabase (Postgres, Auth, Storage, RLS)
- **Deploy:** Vercel

## Project structure

```
app/
  (marketing)/     Public marketing pages
  (admin)/         Auth-gated CMS dashboard
  api/             API routes (page views, etc.)
components/
  marketing/       Marketing UI and motion
  admin/           CMS shell, editors, tables
  ui/              Shared primitives
lib/
  content/         Content fetchers (Supabase + static fallback)
  supabase/        Client, server, middleware helpers
  admin/           Auth, nav, activity log, CRUD helpers
supabase/
  migrations/      Schema, RLS, seed data, storage policies
```

## Getting started

### Prerequisites

- Node.js 20+
- A Supabase project with migrations applied

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/ngabonzizaguy/DigSol.git
cd DigSol
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable or anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server only) |
| `SUPABASE_BOOTSTRAP_ADMIN_EMAIL` | First admin user email |
| `NEXT_PUBLIC_SITE_URL` | App URL (`http://localhost:3000` locally) |

4. Apply database migrations (Supabase CLI or dashboard SQL):

```bash
# migrations in supabase/migrations/
```

5. Create the first admin in Supabase Auth (Authentication → Users) using the bootstrap email, or sign up after migrations run.

6. Start the dev server:

```bash
npm run dev
```

- Marketing site: [http://localhost:3000](http://localhost:3000)
- Admin CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

## Admin CMS

The admin dashboard supports:

- **Content:** services, industries, case studies, insights, guides, testimonials, team, careers
- **Leads:** contact, consultation, and newsletter submissions
- **Users & roles:** admin, editor, viewer
- **Media library:** Supabase Storage uploads
- **Settings:** brand, contact, social, SEO, pricing tiers
- **Analytics:** page views and lead funnel overview
- **Activity log:** audit trail of admin actions

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clear `.next` build cache |

## Deploying to Vercel

1. Import the GitHub repository in Vercel.
2. Set all environment variables from `.env.example` for Production and Preview.
3. In Supabase → Authentication → URL Configuration, add your Vercel domain to redirect URLs.
4. Deploy from `main`.

## License

See [LICENSE](LICENSE).
