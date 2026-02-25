# dearbb 💖

Adorable interactive LDR microsite built with Next.js App Router + TypeScript + Tailwind.

## Local run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Vercel deploy

1. Push this repo to GitHub.
2. Import in Vercel.
3. Framework preset: **Next.js**.
4. Deploy (no env vars required).

## Controls

- **Desktop**: Arrow keys / WASD move, Space/Up/W jump.
- **Mobile**: on-screen left / right / jump buttons.
- Goal: collect 5 memory tokens across 3 zones, then reach mailbox portal.

## Customizing copy

- Landing letter text: `app/page.tsx`
- Token memory notes: `lib/game/levels.ts`
- Reveal invitation copy: `app/reveal/page.tsx`

## Features

- localStorage persistence (progress/timeline/settings/reveal choices)
- Web Audio API synth SFX + ambient pad
- SVG-only game assets generated in code
- Memory timeline modal
- Easter egg moon-click “Bedtime Story Booth” with SVG export
- Share section with clipboard + downloadable SVG date card


## Production hardening

- `canvas-confetti` now loads on demand to reduce initial JavaScript during first paint.
- Game loop localStorage reads were reduced to in-memory refs to keep frame updates smoother.
- `next.config.mjs` enables compression and removes the `x-powered-by` header.
- `vercel.json` adds a small baseline of security headers for all routes.
- `package.json` now includes a Node.js engine requirement for consistent Vercel builds.
