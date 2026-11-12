# Matchday Live — Official Website

Marketing site for Matchday Live (sports livestream production) and its Matchday Analytics
sub-brand, serving the Dallas–Fort Worth area. Built with [Astro](https://astro.build),
TypeScript, Tailwind CSS v4, and React islands for the interactive bits.

## Setup

```bash
npm install
npm run dev       # http://localhost:4321
```

## Scripts

| Script                 | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Local dev server with hot reload                          |
| `npm run build`        | Production build to `dist/`                               |
| `npm run preview`      | Serve the production build locally                        |
| `npm run check`        | Astro/TypeScript diagnostics (`astro check`)              |
| `npm run lint`         | ESLint over the whole project                             |
| `npm run format`       | Prettier, writes changes (Astro + Tailwind class sorting) |
| `npm run format:check` | Prettier in check-only mode (CI-safe)                     |
| `npm run clean-logos`  | Re-runs the brand asset cleanup (see below)               |

## Editing content

Nearly everything a non-developer would want to change lives in `src/content/*.ts` as
plain, typed objects validated with [Zod](https://zod.dev) at build time (a typo or missing
field fails the build immediately rather than shipping broken data):

- `site.ts` — name, tagline, contact email/phones, social links, announcement banner, Web3Forms fallback key
- `services.ts` — the six livestream production services
- `analytics-program.ts` — the four Matchday Analytics components, monthly deliverables, 3-step process
- `team.ts` — team bios (currently just Ruben Zurda — the team grid/profile sections hide automatically if this is ever empty)
- `partners.ts` — partner logos (shown, never linked)
- `videos.ts` — real YouTube video IDs shown on Home/Highlights
- `locations.ts` — DFW and Houston location pages; Houston flips from `status: "coming-soon"` to `"active"` here once it's live
- `faqs.ts` — Livestreaming and Analytics FAQ copy

Anything left to fill in later is marked `// TODO(content):` in these files — search for that
string to find every open item. **No pricing appears anywhere on the site**; every commercial
CTA routes to `/contact`.

## Environment variables

| Variable               | Purpose                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_WEB3FORMS_KEY` | [Web3Forms](https://web3forms.com) access key used by the Contact form. It's a public, client-safe key by design. Falls back to the value baked into `site.ts` if unset. |

Copy `.env.example` to `.env` to override it locally; set it as a build-time environment
variable in whatever CI/deploy pipeline builds the site.

## Brand assets

`scripts/clean-logos.mjs` is a re-runnable Node script (uses `sharp`) that takes the raw logo
drops in `public/` (backed up to `public/brand-source/`), makes their backgrounds transparent
and crops them tightly, and writes the results to `public/brand/` — including the generated
favicon set and the default Open Graph image. Re-run it with `npm run clean-logos` if a raw
asset is replaced.

Fonts (Barlow Condensed, Inter) are self-hosted as woff2 files in `public/fonts/`, declared in
`src/styles/global.css`.

## Legacy URLs

`/matchday-analytics.html` redirects to `/analytics` (configured in `astro.config.mjs`).
`/index.html` needs no redirect — the homepage already builds to exactly that file.

## Deployment

This repo is set up for GitHub Pages with a custom domain (`public/CNAME` →
`matchdayliveofficial.com`, carried into every build). Static output goes to `dist/`.

There is currently no CI/CD workflow or GitHub remote configured in this repository (it was a
plain, unversioned folder before this rebuild) — build with `npm run build` and deploy the
`dist/` folder's contents to whichever host serves the domain, or add a GitHub Actions
workflow once a remote is connected.
