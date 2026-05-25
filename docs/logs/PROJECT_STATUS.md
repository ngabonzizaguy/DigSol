# DigSol — Project Status (source of truth)

> **Read this file first in every agent session.**

**Last updated:** 2026-05-25  
**Active branch:** `feature/cms-marketing-wiring`  
**Supabase:** `DigSol` (`qfohxusczbvyoiqsxatl`) — live, `.env.local` configured (gitignored).

---

## Done

| Area | Status |
|------|--------|
| Admin CMS (entities, leads, media, users, settings) | Live on Supabase |
| Admin **Page sections** | Visibility + content CRUD → `site_settings.integrations.page_sections` |
| Admin **Settings** | Brand, contact, social, pricing tiers → `site_settings` |
| Marketing **all routes** | `PageSection` gates; no empty layout shells when hidden |
| Marketing **entity content** | `lib/content/fetchers.ts` on all listing/detail pages |
| Marketing **section copy** | Heroes, headings, CTAs, cards, FAQ, partners, events, legal, etc. |
| **Global header** | CMS: brand, nav items, mega menus (services/industries from DB, company links editable) |
| **Global footer** | CMS: column links; Solutions column falls back to live services |
| **Home features / process** | CMS icon cards + numbered steps (`CmsHomeFeaturesGrid`, `CmsProcessStepper`) |
| **Page hero CTAs** | All `page_hero` fields in admin (SMB, Enterprise, How we work, etc.) |
| **Root metadata** | `generateMetadata()` from `site_settings` brand |
| **Home pricing** | `getPricingTiersForMarketing()` merge chain |
| **Footer newsletter** | CMS + visibility toggle |
| **Forms + pageviews** | Supabase |
| **Admin ← public merge** | Settings + Page sections pre-fill from live defaults (same as marketing site) |
| `npx tsc --noEmit` | Passes |

---

## Remaining static (minimal)

| Item | Notes |
|------|--------|
| `sitemap.ts` / `robots.ts` | Build-time; uses fetchers + `lib/site` URL |
| `LogoMarquee` | Decorative; no CMS body |
| Section “View all” buttons on Home | Short hardcoded labels on services/work rows |

---

## Admin: where to edit

| Content | Location |
|---------|----------|
| **Live baseline** | Admin forms show merged public-site copy before you save (see blue info banners) |
| Header nav, logo, CTAs | **Page sections → Global chrome → Site header** |
| Footer columns | **Page sections → Global chrome → Site footer** |
| Home differentiators / process | **Page sections → Homepage → Differentiators / Process** |
| Hero buttons on audience pages | **Page sections → [page] → Page hero** |
| Brand / SEO defaults | **Settings** |

---

## Frontend ↔ backend connection (estimate)

| Layer | % |
|-------|---|
| **Backend (Supabase + admin)** | **~98%** |
| **Marketing ↔ CMS entities** | **~100%** |
| **Marketing ↔ page sections** | **~99%** |
| **Marketing ↔ site_settings** | **~98%** |
| **Lead capture + analytics** | **~100%** |
| **Overall public site ↔ backend** | **~98–99%** |

---

## Do not trust without checking

| Source | Issue |
|--------|--------|
| Old `blockers.md` (May 22) | Supabase blocker resolved |
| Glob for `.env.local` | Gitignored |
