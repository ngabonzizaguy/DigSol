# DigSol — Project Status (source of truth)

> **Read this file first in every agent session.**

**Last updated:** 2026-05-26  
**Active branch:** `main`  
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
| `npx tsc --noEmit` + `npm run build` | Passes (2026-05-26) |

---

## Phase 2 — Not done / follow-up

| Item | Notes |
|------|--------|
| Users permission matrix UI | Presets enforced; no checkbox editor on `/admin/users` yet |
| Media picker in entity editors | `MediaPickerDialog` exists; not wired to insight/case study forms |
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

1. Wire `MediaPickerDialog` into insight/case study admin editors.
2. Super-admin permission matrix on `/admin/users`.
3. Smoke-test leads reply + activity log on production Supabase after migrations (applied 2026-05-26 via MCP).
