# Session: Build Verification — 2026-05-22

## Goal
Compile the full Next.js project, fix any blockers, and confirm all ~40 routes prerender.

## Build result
**SUCCESS** — `npm run build` produces 58 prerendered static routes:

| Route group | Count |
|-------------|-------|
| Home | 1 |
| Solutions (hub + 8 pillars) | 9 |
| Audience landings (smb + enterprise) | 2 |
| Industries (hub + 6) | 7 |
| Work (hub + 5 case studies) | 6 |
| Insights (hub + blog + guides + events + 5 posts) | 9 |
| About (about, leadership, careers + 4 roles, partners) | 7 |
| How we work (hub + 3 sub-pages) | 4 |
| Contact / Book / FAQ / Thank-you / 404 | 5 |
| Legal (privacy, terms, cookies) | 3 |
| sitemap.xml, robots.txt | 2 |
| **Total** | **58** |

First Load JS ≈ 102 kB shared, with most pages adding only ~1.2 kB. Homepage = 163 kB (animation-heavy, expected).

## Fixes applied during build

### F-1: EB Garamond weight 300 unavailable
**Symptom:** `next/font` error: Unknown weight 300 for font EB Garamond.
**Fix:** Switched to weights 400 / 500 / 600 in `app/layout.tsx`. Visual weight loss vs. Waldenburg 300 is acceptable for MVP.

### F-2: framer-motion 12 missing peer
**Symptom:** `Can't resolve 'motion-dom'` across multiple components.
**Fix:** Pinned framer-motion to `11.18.2`. v12 split `motion-dom` out and the npm registry installed without it. v11 bundles internally.

### F-3: Next.js 15 async params
**Symptom:** Type error — `params: { slug: string }` does not satisfy PageProps; expected Promise.
**Fix:** Updated all 6 dynamic route pages (`solutions/[slug]`, `industries/[slug]`, `work/[slug]`, `insights/[slug]`, `about/careers/[slug]`, `legal/[doc]`) to:
```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```
This is a Next.js 15 breaking change — `params` and `searchParams` are now Promises.

### F-4: SWC native binary warnings (Windows)
**Symptom:** `next-swc.win32-x64-msvc.node is not a valid Win32 application`.
**Status:** Cosmetic. Next.js falls back to the WASM build automatically. Build still completes successfully and pages prerender.
**Possible cleanup later:** `npm rebuild` or reinstall on a machine with matching glibc/MSVC. Not blocking.

## Verified
- All 58 routes generate without error.
- TypeScript strict mode passes.
- ESLint passes.
- Static export for SEO (sitemap.xml + robots.txt) emitted.

## Next steps
- Mark `qa-deploy` todo done after a final review.
- Optional: run `npm run dev` to visually verify in browser before commit.
