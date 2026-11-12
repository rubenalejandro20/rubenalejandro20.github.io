# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Matchday Live's marketing website (matchdayliveofficial.com, per `CNAME`) — a plain static site with no build step, no package manager, and no test suite. There is currently no `.git` directory in this working copy even though the repo name implies GitHub Pages hosting; it is deployed by pushing these files as-is (likely to a `rubenalejandro20.github.io` repo, served via the custom domain in `CNAME`).

## Running it locally

There is no dev server or build command. Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Structure

- `index.html` — home page (hero, about/services, video embeds, contact section).
- `matchday-analytics.html` — separate landing page for the "Matchday Analytics" coaching/analytics offering, including a coach profile section.
- `styles.css` — single stylesheet shared by both pages.
- `script.js` — single script shared by both pages.
- `assets/` — logos and images referenced by both pages.
- `favicon.ico`, `CNAME` — site-level config for GitHub Pages + custom domain.

Both HTML files are independent, self-contained pages (not generated from a template/framework) that both load `styles.css` and `script.js`. When changing shared visual or behavioral elements (header/nav, buttons, footer), **edit both HTML files** to keep them in sync — there is no shared partial/include mechanism.

## `styles.css` notes

This file has grown by appending override blocks (several sections are literally labeled `/* FINAL */` or similar) rather than editing earlier rules in place, so the same selector (e.g. `.btn`, `.profile-block`, `.mobile-menu`, `.nav-toggle`) is often redefined multiple times later in the file with `!important`. When changing styling for an existing component, search for **all** occurrences of its selector/class in the file and check which block actually wins (later rules / `!important` win) rather than editing only the first occurrence.

## `script.js` behavior

Three independent, self-invoking behaviors, all relying on plain DOM APIs (no framework, no modules/bundler):

1. Sets the footer `#year` text to the current year.
2. Intercepts same-page `#anchor` link clicks to add a fade-out/scroll/fade-in effect.
3. Intercepts clicks on internal links (not `#...`, not `target`-having, not `http...`) to fade the page out before navigating, and toggles `.page-loaded` on `<body>` for the page's own fade-in on load.
4. Wires up `.nav-toggle` to open/close the `#mobile-menu` drawer by toggling `body.menu-open`.

Note: `index.html`'s header markup does not currently include a `.nav-toggle` button or `#mobile-menu` element (unlike `matchday-analytics.html`, which has both) — the mobile-menu JS silently no-ops there since it guards on the elements existing.
