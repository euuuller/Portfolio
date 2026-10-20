# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static personal portfolio (pt-BR) built with Astro 7 (SSG) + Tailwind CSS v4, deployed to GitHub Pages as a project site (`https://euuuller.github.io/Portfolio/`). Hard constraints from the spec: **0 KB of client-side JavaScript** by default (any `client:*`, `<script>` or client library needs written justification and fits a 5 KB gzip budget), Lighthouse mobile ≥ 95 in all categories, WCAG 2.2 AA, CLS ≤ 0.1. The base folder structure (`.github/workflows`, `public/{images,docs}`, `src/{components,layouts,styles,pages}`, `astro.config.mjs`, `tailwind.config.mjs`) is fixed: don't rename or move those items.

## Commands

Node ≥ 22.22 (`.nvmrc` = 24). There is no test runner; quality is enforced by gates run against `dist/`:

```sh
npm ci                          # install from lockfile
npm run dev                     # http://localhost:4321/Portfolio/
npm run check                   # astro check (type-check .astro/.ts)
npm run build                   # -> dist/
node scripts/check-budget.mjs   # JS<=5KB, CSS<=20KB gzip, home<=500KB, dist<=1GB
node scripts/check-links.mjs    # internal links/assets exist, use the base, #anchors resolve
```

Lighthouse CI runs in CI only (needs Chrome). It serves a copy of `dist/` at `.lhci-site/<base>/` because the LHCI static server serves from root. See the "Lighthouse CI" step in `.github/workflows/deploy.yml`.

## Architecture

- **Base path is everywhere.** `astro.config.mjs` sets `base: '/Portfolio'` and `trailingSlash: 'always'`. Every internal URL (pages, anchors, `public/` assets) must go through `url()` from `src/data/site.ts`, never a hard-coded `/...`. `check-links.mjs` fails the build on links that skip the base. Switching to a custom domain means changing `site` and removing `base`; nothing else needs to change.
- **Content lives in `src/data/`**: `site.ts` (name, job title, social links, optional `resumePath`, OG image) and `projects.ts` (typed `Project[]`). Pages and components read from there. Don't hard-code personal data in components.
- **`BaseLayout.astro` is the only importer of `src/styles/global.css`** and owns the whole `<head>` (canonical, OG/Twitter, JSON-LD `Person`, font preload) plus the skip link and the header/main/footer landmarks. Pages pass `title`, optional `description`/`ogImage`, and `noindex` (404 sets it, which also drops canonical and `og:url`).
- **Styling is Tailwind v4 CSS-first.** Design tokens (`--color-canvas|surface|fg|muted|accent|accent-fg|border`, `--font-sans`) are defined in `@theme` in `global.css`, and dark mode overrides the same variables under `@media (prefers-color-scheme: dark)`. There is no JS theme toggle. `tailwind.config.mjs` exists only to satisfy the fixed structure and is **not loaded**. Don't put tokens there. CSS is inlined into every page (`build.inlineStylesheets: 'always'`).
- **Images are served from `public/images/` without processing or hashing** (not `astro:assets`). Every `<img>` declares `width`/`height`. `ProjectCard` expects `<image>-640.webp` and `<image>-1280.webp` (16:10) and builds `srcset`/`sizes` itself. Only the above-the-fold LCP candidate (`priority` prop on the first card) gets `loading="eager"` + `fetchpriority="high"`; everything else stays lazy.
- **The font** is Inter Variable from `@fontsource-variable/inter`, but only the latin `woff2` is referenced, via a hand-written `@font-face` in `global.css` plus a `?url` import in `BaseLayout` for the preload. Both resolve to the same hashed file.
- **`src/pages/robots.txt.ts`** is a static endpoint that derives the sitemap URL from `site` + `base`. `@astrojs/sitemap` generates `sitemap-index.xml`.

## CI/CD

`.github/workflows/deploy.yml`: on PRs to `main` it runs the gates only; on push to `main` or `workflow_dispatch` from `main` it also uploads the Pages artifact and deploys (environment `github-pages`, then a post-deploy `curl` check). Blocking gates: check, build, budget, links, Lighthouse Accessibility/Best Practices/SEO ≥ 0.95 and CLS. Lighthouse Performance/LCP/TBT are warnings only. The pipeline uses `npm ci` + `actions/upload-pages-artifact` instead of `withastro/action` on purpose, because the latter runs `npm install` and uploads before any gate.

Commit messages follow Conventional Commits with descriptions in Portuguese (e.g. `feat(pages): ...`).
