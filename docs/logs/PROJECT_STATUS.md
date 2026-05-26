# DigSol — Project Status (source of truth)

> **Read this file first in every agent session.**

**Last updated:** 2026-05-26  
**Active branch:** `feature/phase-2-admin` (Phase 2 + ABCD polish; `main` at `c047c9a`)  
**Supabase:** `DigSol` (`qfohxusczbvyoiqsxatl`) — live, `.env.local` configured (gitignored).  
**Phase 2 detail:** [PHASE_2_PROGRESS.md](./PHASE_2_PROGRESS.md) · [2026-05-26-phase-2.md](./2026-05-26-phase-2.md)

---

## Done

| Area | Status |
|------|--------|
| Admin CMS (entities, leads, media, users, settings) | Live on Supabase |
| Admin **Page sections** | Visibility + content CRUD → `site_settings.integrations.page_sections` |
| Admin **Settings** | Brand, contact, social, pricing tiers → `site_settings` |
| Marketing **all routes** | `PageSection` gates; CMS-driven copy |
| Marketing **entity content** | `lib/content/fetchers.ts` on listing/detail pages |
| **Global header / footer** | CMS nav + merge with live services |
| **Forms + pageviews** | Supabase capture |
| **Phase 2 — Activity log** | Service-role inserts; diff + entity filter UI |
| **Phase 2 — Leads pipeline** | `in_progress` / `replied` / `closed`, `lead_messages`, reply composer, mock/live email |
| **Phase 2 — Analytics** | Recharts dashboard, `get_analytics_summary` RPC, UTM/device/geo capture |
| **Phase 2 — AI (mock-first)** | `lib/ai`, lead assist, contact improve (CMS flag), analytics insight blurb |
| **Phase 2 — RBAC (v1)** | Role presets, nav filter, route guard, `profiles.permissions` column |
| **Phase 2 — Media (v1)** | Search, copy URL, `getMediaPublicUrl`, insight `cover_url` on marketing |
| **Phase 2 — ABCD polish** | Leads pipeline bar + inbox copy; analytics empty/layout; `CoverImageField` on insight/case study editors; users permission matrix modal |
| **Analytics chart visual cleanup** | Ranked lists + single/multi-series radar charts; weekly device mix; period-split countries/funnel; fixed RGB token usage in Recharts |
| **Admin nav icon fix** | Server layout passes role/permissions only; `filterNavForProfile` runs client-side (fixes `/admin` 500) |
| `npx tsc --noEmit` + `npm run build` | Passes (2026-05-26, incl. ABCD polish) |

---

## Phase 2 — Not done / follow-up

| Item | Notes |
|------|--------|
| Dashboard analytics mini-card | Analytics page only |
| Real Resend / OpenAI keys | Mock by default; set env per [2026-05-26-phase-2.md](./2026-05-26-phase-2.md) |
| Demo seed for sparse pageviews | Optional |

---

## Remaining static (minimal)

| Item | Notes |
|------|--------|
| `sitemap.ts` / `robots.ts` | Build-time |
| `LogoMarquee` | Decorative |
| Section “View all” labels on Home | Short hardcoded strings |

---

## Do not trust without checking

| Source | Issue |
|--------|--------|
| Old `blockers.md` (May 22) | Supabase blocker resolved |
| This file before 2026-05-26 | Phase 2 not listed |
| [PHASE_2_PROGRESS.md](./PHASE_2_PROGRESS.md) | **Authoritative for Phase 2 wave status** until reconciled here |

---

## Next (suggested)

1. Manual smoke on `feature/phase-2-admin`: `/admin`, leads detail, analytics, media, users matrix.
2. Merge `feature/phase-2-admin` → `main` when ready.
3. Optional: dashboard analytics mini-card, demo pageview seed, real `RESEND_API_KEY` / `AI_API_KEY`.
