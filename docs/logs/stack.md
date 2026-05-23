# Current Stack

## Framework
- **Next.js** 15.x (App Router, SSG-first)
- **React** 19
- **TypeScript** 5.7

## Styling
- **Tailwind CSS** 3.4 (v3 chosen over v4 for ecosystem stability with shadcn pieces)
- **PostCSS** + Autoprefixer
- Design tokens mapped manually from `DESIGN.md` (ElevenLabs preset)

## UI primitives
- Radix UI (dialog, dropdown-menu, navigation-menu, slot, tabs)
- `class-variance-authority` + `tailwind-merge` + `clsx`
- `lucide-react` for icons

## Animation
- **GSAP** 3.13 + `@gsap/react` (scroll-linked, complex timelines)
- **Framer Motion** 11.18 (component entrances, gestures) — pinned to v11 because v12 has an unresolved `motion-dom` peer dep issue
- **anime.js** 3.2 (micro-interactions, SVG morph, count-up)
- **Lenis** 1.1 (smooth scroll, global)
- CSS keyframes (orb drift, marquee, shimmer)

## Fonts
- Inter (UI/body) via `next/font/google`
- EB Garamond 300 (display — Waldenburg substitute) via `next/font/google`

## Hosting target
- Vercel (preview + production)

## Not yet installed / deferred
- shadcn CLI components (we hand-author primitives to stay light)
- MDX (case studies/blog content authored as TS/TSX placeholders in MVP)
- CMS, auth, database, payments
