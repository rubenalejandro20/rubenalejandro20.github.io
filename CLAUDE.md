# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Matchday Live's marketing site (matchdayliveofficial.com) — an Astro + TypeScript + Tailwind CSS v4
site with React islands for the interactive pieces (mobile nav, the contact form, the lite-YouTube
video facade, the highlights filter). Static output, deployed to GitHub Pages via `public/CNAME`.

This replaced a 2-page static HTML/CSS/JS site in a from-scratch rebuild (see git history: `main`
holds the legacy site as a baseline commit; `redesign/v2` has the full rewrite). There is no remote
configured yet — `git init` happened locally as part of that rebuild.

## Commands

```bash
npm run dev            # dev server, http://localhost:4321
npm run build           # production build to dist/
npm run preview         # serve the production build
npm run check            # astro check (TS/Astro diagnostics) — run before considering work done
npm run lint             # eslint .
npm run format           # prettier --write . (sorts Tailwind classes too)
npm run format:check     # prettier --check . (CI-safe)
npm run clean-logos      # re-runs scripts/clean-logos.mjs (see Brand assets below)
```

No test suite exists. `npm run check` + `npm run lint` + `npm run build` are the correctness gates.

## Architecture

**Content lives in `src/content/*.ts`, not in components.** Each file exports a plain object/array
validated with Zod via `.parse()` at module load — a bad edit fails the build immediately instead of
shipping broken data. Pages and section components import from here rather than hardcoding copy, so
`site.ts`, `services.ts`, `analytics-program.ts`, `team.ts`, `partners.ts`, `videos.ts`,
`locations.ts`, and `faqs.ts` are the first place to look for "where does this text/data come from."
Components that render a content array (`TeamGrid`, `PartnerWall`, etc.) null-guard on `.length === 0`
and render nothing — there are no fabricated placeholder entries anywhere in the content.

**Two brand identities share one codebase.** Matchday Live (green, `--color-brand`) is the default;
Matchday Analytics (lime, `--color-lime`) is a sub-brand used only on `/analytics`-related surfaces —
`<Header variant="analytics">` swaps the logo/link, and section components take a `tone="lime"` prop
where they need the accent. Don't let lime bleed into non-Analytics pages or vice versa.

**Design tokens are Tailwind v4 `@theme` vars in `src/styles/global.css`**, not a `tailwind.config.*`
file (v4 is CSS-first — there is no Tailwind config file in this repo, and that's correct, not an
oversight). Colors (`--color-brand`, `--color-lime`, `--color-live`, `--color-night`, etc.) and fonts
(`--font-display` = Barlow Condensed, `--font-body` = Inter) are declared there and become Tailwind
utilities automatically (`bg-brand`, `font-display`, …). The broadcast-red `--color-live` is reserved
for the LIVE badge/indicator only — never for general-purpose content.

**Fonts and brand logos are self-hosted**, not loaded from Google Fonts/CDN at runtime — woff2 files
in `public/fonts/`, logo/favicon/OG-image PNGs in `public/brand/`. `scripts/clean-logos.mjs` is the
(re-runnable) pipeline that turned the raw opaque logo drops into those transparent, cropped assets;
re-run it with `npm run clean-logos` if a raw source file in `public/brand-source/` is replaced.

**Legacy URL compatibility**: `/matchday-analytics.html` redirects to `/analytics` via the
`redirects` key in `astro.config.mjs`. Do **not** add a `/index.html` redirect entry there — the
homepage's own build output already is `dist/index.html`, and Astro's redirect-page generator
collides with that exact path (`EISDIR` at build time) if you try.

**Islands are deliberately minimal**: `MobileNav.tsx` (in the global `Header`, so it ships on every
page), `InquiryForm.tsx` (Contact page), `LiteYouTube.tsx` (click-to-load YouTube facade, used on
Home/Highlights), and the Highlights category filter (plain vanilla JS, not a React island — see
`HighlightsGrid.astro`). Everything else is server-rendered Astro with zero client JS. Keep new
interactive pieces this scoped rather than reaching for React by default.

**No pricing appears anywhere on the site** — every commercial CTA routes to `/contact` (optionally
with `?type=livestream|analytics|partnership|other` to pre-select the inquiry type, read client-side
from `window.location.search` inside `InquiryForm.tsx` since this is a fully static build with no
per-request server to parse query params at render time).

**One `<h1>` per page**: `SectionHeading.astro` defaults to rendering an `<h2>` and takes a
`level="h1"` prop for the single page heading — when adding a new page, make sure exactly one heading
on it passes `level="h1"` (or is a raw `<h1>`, as `HeroHome.astro`/`AnalyticsHero.astro`/`404.astro`
do).
