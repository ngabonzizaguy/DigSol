# Architecture & Design Decisions

Lightweight ADRs. Each decision: context → choice → rationale → consequences.

---

## D-001: Use Tailwind v3 (not v4)

**Context:** Tailwind v4 is the latest but shadcn ecosystem and many community plugins still target v3.
**Decision:** Tailwind v3.4 stable.
**Rationale:** Faster scaffold, fewer surprises, full shadcn compatibility.
**Consequences:** Migrate to v4 later as a Phase 2 task.

---

## D-002: Hand-rolled shadcn primitives instead of `shadcn init`

**Context:** `shadcn init` is interactive and modifies many files; we want full control over token mapping to ElevenLabs preset.
**Decision:** Write small Radix-based components directly under `components/ui/` with our token classes.
**Rationale:** DESIGN.md uses pill buttons, custom radii, hairline borders — easier to author than override shadcn defaults.
**Consequences:** Fewer files, but we own all primitives.

---

## D-003: EB Garamond as Waldenburg substitute

**Context:** Waldenburg is licensed and not available on Google Fonts. DESIGN.md explicitly lists EB Garamond as the documented substitute.
**Decision:** Load EB Garamond 300 via `next/font/google` as `--font-display`.
**Rationale:** Preserves editorial weight-300 serif voice.
**Consequences:** Visual fidelity is "close enough" — swap to licensed Waldenburg if/when purchased.

---

## D-004: Multi-library animation stack

**Context:** User explicitly asked for GSAP + Framer + parallax + anime.js + smooth scroll.
**Decision:** Use all four with clear lanes (see IMPLEMENTATION_LOG entry).
**Rationale:** Each library wins at different jobs; combined cost is small (~80KB gzipped) and worth premium feel for an agency site.
**Consequences:** Discipline required — document which lib owns each effect to avoid duplication.

---

## D-005: Static-only frontend; forms link to `/thank-you`

**Context:** Plan scope is frontend-only; no backend in MVP.
**Decision:** Forms POST nowhere — `<form action="/thank-you">` redirect or client-side router push.
**Rationale:** Keeps MVP shippable without server work; wire to Resend/Formspree in Phase 2.
**Consequences:** No lead capture today — explicit known gap.

---

## D-006: Content as TS data, not MDX in MVP

**Context:** MDX adds tooling weight and ~5 pages of blog don't justify it yet.
**Decision:** Store case studies, blog posts, services as typed TS arrays in `content/*.ts`.
**Rationale:** Simpler, type-safe, easy to migrate to CMS later.
**Consequences:** Authors edit TS files until CMS Phase 2.

---

<!-- Append new decisions below -->
