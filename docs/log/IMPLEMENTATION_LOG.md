# Implementation Log

Chronological. Newest entries at the bottom.

---

## 2026-05-22 — Phase 0: Design System Install

**Action:** Ran `npx getdesign@latest add elevenlabs` in repo root.

**Outcome:** `DESIGN.md` created (~20KB). Contains YAML frontmatter with full token set (colors, typography, rounded, spacing, components) plus prose guidance.

**Key tokens captured:**
- Canvas `#f5f5f5`, ink `#0c0a09`, body `#4e4e4e`, primary `#292524`
- Pastel orbs: mint/peach/lavender/sky/rose (decoration only)
- Display: Waldenburg 300 → substituted with EB Garamond 300 (Google Fonts)
- UI: Inter 400/500

**Files created:**
- [`DESIGN.md`](../../DESIGN.md)
- [`.cursor/rules/design-system.mdc`](../../.cursor/rules/design-system.mdc) — alwaysApply rule pointing agent at DESIGN.md

---

## 2026-05-22 — Phase 1: Project Scaffold

**Action:** Manual scaffold (skipped `create-next-app` to avoid interactive prompts on Windows PowerShell).

**Stack chosen:**
- Next.js 15 + React 19 (App Router)
- TypeScript strict
- Tailwind CSS v3.4 (stable; defer v4 until ecosystem mature)
- shadcn primitives (Radix under the hood, hand-rolled to match DESIGN.md)
- **Animation:** GSAP 3.13 + `@gsap/react`, Framer Motion 12, anime.js 3.2, Lenis 1.1 (smooth scroll)
- Lucide React for icons

**Files created:**
- [`package.json`](../../package.json)
- [`tsconfig.json`](../../tsconfig.json)
- [`next.config.mjs`](../../next.config.mjs)
- [`postcss.config.mjs`](../../postcss.config.mjs)
- [`tailwind.config.ts`](../../tailwind.config.ts) — full ElevenLabs token mapping

**Why these animation libs together:**
- **GSAP** = scroll-linked, complex pin/scrub timelines, SVG.
- **Framer Motion** = React component entrances, layout shared transitions, gestures.
- **anime.js** = micro-interactions (number count-up, text shimmer).
- **Lenis** = global silky smooth scroll feel.
- **CSS** = orb drift (keyframes), marquee, glass blur.

---

<!-- Append new sections below -->
