# DigSol — Project Status (source of truth)

> **Read this file first in every agent session.**

**Last updated:** 2026-05-27  
**Active branch:** `feature/phase-2-admin` (Phase 2 + ABCD polish + Phase 3 wave + Quick Start; `main` at `c047c9a`)  
**Supabase:** `DigSol` (`qfohxusczbvyoiqsxatl`) — live, `.env.local` configured (gitignored).  
**Phase 2 detail:** [PHASE_2_PROGRESS.md](./PHASE_2_PROGRESS.md) · [2026-05-26-phase-2.md](./2026-05-26-phase-2.md)  
**Phase 3 plan:** [admin_phase_3_wave](../../.cursor/plans/admin_phase_3_wave_803c4ff5.plan.md) (local)

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
| **Phase 3 — Analytics window + reset** | `resolveAnalyticsWindow`, custom `?from`/`?to` picker, admin-only "RESET" danger zone, RPC accepts `until_ts` |
| **Phase 3 — Activity wiring** | Broadened RLS to `authenticated`, full entity filter set, date filter, action label map, deep links to detail pages |
| **Phase 3 — AI admin hub** | `/admin/ai`, `site_settings.integrations.ai`, toggles for lead/contact/analytics + default reply tone; `lib/ai/actions` gated by flags |
| **AI connection (admin)** | Provider presets + custom name, model, API key, optional `api_base_url`; env `AI_*` overrides DB; OpenAI-compatible chat endpoint |
| **Editor headers** | Work/services/simple editors truncate long titles; mobile stacks back/actions above title + status (no overlap) |
| **Admin Content list UI (2026-05-27)** | Shared `ContentList` with filters, sort, list/grid toggle, pagination, responsive cards; applied to all Content nav pages |
| **Phase 3 — Work (portfolio)** | Migration adds `project_url` + toggle, customer quote/name/role, `media_gallery` jsonb; editor gets gallery picker, project link card, customer comment; marketing renders cover, gallery, quote, public URL; home honors `featured` |
| **Phase 3 — Public sync fix** | `normalizeCaseStudy` now maps `service_slugs`→`services`, surfaces `cover_url` on cards/detail; `sitemap` switched to dynamic fetchers |
| **Phase 3 — Media image editor** | Canvas-based crop + 90° rotate dialog; uploads new file via storage, replaces row with `replaceMediaFile`; no native deps |
| **Phase 3 — Admin profile** | `/admin/account`, `updateOwnProfile`, topbar avatar/name + link to account; `account` + `ai` resources in permissions matrix |
| **Quick Start — Phase A (flow)** | `/start` route + first-visit modal + persistent pill; 8-step flow with GSAP + Framer; new `lead_kind = 'quick_start'` + structured columns on `leads`; provider persists draft to `sessionStorage` |
| **Quick Start — Phase B (attachments)** | `lead_attachments` table + private `quick-start-uploads` storage bucket; `FileDropzone` + GSAP `VoiceRecorder`; FormData server action uploads via `getServiceSupabase()` (not SSR cookie client) |
| **Quick Start — attachment upload fix (2026-05-27)** | Signed Supabase upload URLs from browser (`createQuickStartLead` → `prepareQuickStartAttachmentUpload` → PUT → `finalizeQuickStartAttachment`); Server Action FormData binaries were never persisted |
| **Quick Start — Phase C (admin)** | `/admin/quick-start` editor (toggle, copy, services, budget, channels); attachments panel on lead detail with signed URLs; leads filter includes Quick Start; nav entry under Operations |
| **Quick Start — Phase D (contact upgrades)** | `PhoneInput` + `CountrySelect` rolled into contact + consultation forms; "Send via WhatsApp" CTA gated on `site_settings.integrations.quick_start.whatsapp.number_e164`; phone now stored in top-level `leads.phone` column |
| `npx tsc --noEmit` + `npm run build` | Passes (2026-05-27, Quick Start) |

---

## Phase 2 — Not done / follow-up

| Item | Notes |
|------|--------|
| Dashboard analytics mini-card | Analytics page only |
| Real Resend / OpenAI keys | Mock by default; set env per [2026-05-26-phase-2.md](./2026-05-26-phase-2.md) |
| Demo seed for sparse pageviews | Optional |

## Phase 3 — Not done / follow-up

| Item | Notes |
|------|--------|
| ~~Apply Phase 3 migrations to remote DB~~ | **Done (2026-05-27)** — `case_study_portfolio` applied via MCP; saves `customer_name`, gallery, etc. |
| ~~LogoMarquee hardcoded~~ | **Done (2026-05-27)** — partner names editable in Admin → Page sections → Home → Trust bar |
| Short-video trim in Media editor | Image-only in Phase 3A; ffmpeg.wasm / server ffmpeg planned for follow-up |
| Backfill `width`/`height` on `media` rows | Only set on newly-edited assets right now |

## Quick Start — Not done / follow-up

| Item | Notes |
|------|--------|
| ~~Apply Quick Start migrations~~ | **Done (2026-05-27)** — applied to live project via Supabase MCP: `quick_start_leads`, `lead_attachments` |
| ~~Set WhatsApp number~~ | **Done (2026-05-27)** — `site_settings.integrations.quick_start.whatsapp.number_e164` = `+250784928786` |
| Resend notifications | Quick Start leads currently use the same notification path as other leads (mock unless `RESEND_API_KEY` is set) |
| Manual smoke | Re-test Quick Start with doc + voice upload; confirm admin Attachments panel shows files and Download works; prior test lead files are not recoverable (only links backfilled from payload) |
| **Public form RLS fix (2026-05-27)** | Quick Start / contact / consultation / newsletter inserts use server `getServiceSupabase()` — anon `.insert().select()` failed for guests (no SELECT policy on `leads`) |
| **Mobile form layout (2026-05-27)** | `/start`, `/book-consultation`, contact forms: `min-w-0`, stacked buttons, header spacing under fixed nav |
| **Activity log fix (2026-05-27)** | `logActivity` + `createServiceClient` use `getServiceSupabase()` (cookie SSR was blocking inserts); `activity_read_authenticated` applied on live DB |
| **Pricing settings → public (2026-05-27)** | `getPricingTiersForMarketing` applies `site_settings.pricing_tiers` over page-section tier copy; settings save revalidates home + engagement models |

---

## Remaining static (minimal)

| Item | Notes |
|------|--------|
| `sitemap.ts` / `robots.ts` | Build-time |
| `LogoMarquee` | ~~Decorative~~ — names from CMS (`home` → `trust` → Partner / client names) |
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

1. Apply Phase 3 migrations (`20260527000001`–`20260527000003`) to the live Supabase project.
2. Manual smoke on `feature/phase-2-admin`:
   - `/admin/analytics` — custom date range, reset (admin only).
   - `/admin/activity` — date filters, deep links, entity pills.
   - `/admin/ai` — toggles persist into `site_settings.integrations.ai`; lead assist hides when off.
   - `/admin/work/[slug]` — gallery picker, customer quote, project URL toggle → public `/work/[slug]` reflects on next request.
   - `/admin/media` — pencil icon opens crop dialog; saved file replaces original.
   - `/admin/account` — name + avatar persist; topbar reflects avatar.
3. Merge `feature/phase-2-admin` → `main` when ready.
4. Optional: dashboard analytics mini-card, demo pageview seed, real `RESEND_API_KEY` / `AI_API_KEY`, video trim follow-up.
