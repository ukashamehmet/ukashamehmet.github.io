# Okasha Mehmood — portfolio (React)

React 18 + Vite + Tailwind rebuild of https://ukashamehmet.github.io in the dark "terminal" design.
Every page is **prerendered to static HTML** at build time and then hydrated, so the first paint
needs no JavaScript and every page is fully crawlable.

## Pages (all original URLs kept)

| URL | Source |
| --- | --- |
| `/` | `src/pages/Home.jsx` |
| `/projects/` (+ `#saas-bola`, `#member-portal`, … deep links) | `src/pages/Projects.jsx`, `src/data/cases.json` |
| `/blog/` | `src/pages/Blog.jsx` |
| `/blog/posts/{tenant-boundaries,waf-origin,android-vpn,findings-engineers-fix}.html` | `src/pages/Post.jsx`, `src/data/posts.json` |
| `/resume.html` (noindex, printable CV) | `src/pages/Resume.jsx` |
| `/admin/` (noindex, local-only content studio) | `src/pages/Studio.jsx` |
| `/404.html` | `src/pages/NotFound.jsx` |

## Editing content

- Home page copy, experience, credentials, notes list: `src/data/site.js`
- Case studies and articles: `src/data/cases.json`, `src/data/posts.json`
  (generated once from the original site by `scripts/extract.py`; edit the JSON directly now).
- New article: add an entry to `posts.json` **and** `NOTES` in `site.js` — the route is created automatically.

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # outputs the deployable site to dist/site
npm run preview   # serves dist/site on http://localhost:4173
```

## Deploying to GitHub Pages

Push this folder to the `ukashamehmet.github.io` repository's `main` branch and set
**Settings → Pages → Source** to **GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes `dist/site`.

## Performance notes

- Static HTML per route, Tailwind compiled and purged (~6.7 KB gzip CSS), no CDN Tailwind.
- Per-page code splitting; the current page's chunk is `modulepreload`ed, others warm up when idle.
- Case images resized and served as WebP (JPEG fallback), lazy-loaded with fixed dimensions (no layout shift).
- Below-the-fold sections use `content-visibility: auto`. No trackers, no cookies.
