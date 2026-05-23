# Architectural Decisions

## ADR-001: Tailwind v3 over v4
**Date:** 2026-05-22
**Decision:** Use Tailwind 3.4 instead of v4.
**Reason:** v4 changes PostCSS pipeline and config format; v3 is the stable target for Next 15 + Radix + shadcn primitives.

## ADR-002: Hand-authored UI primitives (no shadcn CLI)
**Date:** 2026-05-22
**Decision:** Skip `npx shadcn init` and hand-author `Button`, `Card`, `Badge`, etc.
**Reason:** Faster scaffold, full control over ElevenLabs token mapping.

## ADR-003: Animation stack — GSAP + Framer Motion + anime.js + Lenis
**Date:** 2026-05-22
**Decision:** Use all four together with clear lanes (GSAP scroll/timelines, Framer Motion components, anime.js micro-interactions, Lenis global smooth scroll).

## ADR-004: ElevenLabs design tokens via DESIGN.md → Tailwind config
**Date:** 2026-05-22
**Decision:** Map tokens to Tailwind theme rather than CSS variables (except fonts).

## ADR-005: Content as TS modules (not MDX) in MVP
**Date:** 2026-05-22
**Decision:** Case studies, blog posts, services data live in `lib/content/*.ts`.

## ADR-006: Supabase as CMS backend
**Date:** 2026-05-22
**Decision:** Use Supabase Postgres + Auth + Storage for the CMS.
**Reason:**
- Production-grade out of the box.
- SSR-ready via `@supabase/ssr`.
- RLS gives us per-role authorisation declaratively.
- Storage covers media library without a separate vendor.
- Free tier covers MVP; clear upgrade path.

**Project:** `DigSolutions` (new project, eu-north-1) under org `N.Guy org`. Created after pausing `kcart_final` to free a free-tier slot.

## ADR-007: Marketing site reads Supabase server-side; revalidate on mutation
**Date:** 2026-05-22
**Decision:** Replace static `lib/content/*.ts` exports with async `getX()` functions that read from Supabase server-side. Admin server actions call `revalidatePath()` for affected routes.
**Reason:**
- Keeps marketing pages SSG-fast.
- Edits go live within seconds.
- No CDN cache management overhead.

## ADR-008: Admin route group `(admin)` isolated from `(marketing)`
**Date:** 2026-05-22
**Decision:** Move existing pages into `app/(marketing)/` and put CMS under `app/(admin)/admin/`.
**Reason:** Different layout (sidebar vs header), different design density, different auth gate.

## ADR-009: Density-first admin tokens + optional dark mode
**Date:** 2026-05-22
**Decision:** Admin uses 14px base font, 12px row padding, hairline-dense tables. Dark mode toggle via `class="dark"` on `<html>` for the admin route group only.
**Reason:** Engineers and operators work in dashboards all day. Density + dark mode are not preference — they're requirement.

## ADR-010: Schema migrations as SQL files in `supabase/migrations/`
**Date:** 2026-05-22
**Decision:** Author all schema changes as numbered SQL files. Apply via Supabase MCP `apply_migration`.
**Reason:** Reviewable in git, replayable, standard Supabase convention.
