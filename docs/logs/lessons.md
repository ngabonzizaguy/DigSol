# Lessons Learned

## L-001: PowerShell command portability
`tail`, `head`, `grep`, `cat` are not available in stock Windows PowerShell. Use `Select-Object -Last N`, `Select-Object -First N`, `Select-String`, `Get-Content`. Prefer running commands without pipes when possible to avoid friction.

## L-002: PowerShell ExecutionPolicy
If npm/npx scripts get blocked, run with:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```
Or set per session: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

## L-003: getdesign CLI behavior
`npx getdesign@latest add elevenlabs` only writes a single `DESIGN.md`. It does NOT install packages, configure Tailwind, or scaffold components. Treat `DESIGN.md` as agent-readable token reference and map manually.

## L-004: ElevenLabs preset reality
The catalog tagline says "dark cinematic" but the actual template is **light editorial** — off-white canvas (`#f5f5f5`), warm ink (`#0c0a09`), pastel gradient orbs as the only color voltage. Build light-first.

## L-005: Waldenburg is licensed
Not available on Google Fonts. Use **EB Garamond** (weights 400/500/600 — 300 not available either) as the documented substitute via `next/font/google`.

## L-006: framer-motion v12 needs `motion-dom` peer
v12 split `motion-dom` into a separate package. npm's resolver doesn't always pull it. Pin to `framer-motion@11.18.2` until v12 stabilises or install `motion-dom` explicitly.

## L-007: Next.js 15 — params are Promises
All dynamic routes (`[slug]`, `[doc]`, etc.) must type `params` as `Promise<{...}>` and `await` it inside the component and inside `generateMetadata`. Otherwise TypeScript build will fail with `Diff<PageProps, ...>` errors.

## L-008: Windows SWC native binary warning is cosmetic
The `next-swc.win32-x64-msvc.node is not a valid Win32 application` warning on Windows builds is non-fatal — Next falls back to the WASM SWC build automatically. Build still completes and pages prerender correctly.
