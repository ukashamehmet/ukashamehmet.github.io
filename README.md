# Okasha Mehmood — Cyber Portfolio (CSUME-inspired)

A one-page cyber security portfolio inspired by the CSUME template: dark navy surfaces, purple accents, an arched portrait hero, services, selected work, and a direct contact form. The detailed case-study and blog pages are included behind the one-page home.

**Target URL:** https://ukashamehmet.github.io/

**Live sections**

- `/` — one-page hero, about, services, selected work, confidentiality, contact
- `/projects/` — nine detailed, sanitized case studies
- `/blog/` — four field notes plus full article pages
- `/resume.html` — print-ready CV (PDF in `assets/Okasha-Mehmood-CV.pdf`)
- `/admin/` — local authoring console (not linked publicly, `noindex`)

The header also includes an optional **Aa** larger-text reading mode, stored in the visitor's browser.

---

## Preview locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. No build step, no npm install, no server-side runtime.

---

## Publish with GitHub Pages

This site is the root GitHub Pages site for `ukashamehmet/ukashamehmet.github.io`.

1. Go to **Settings → Pages → Build and deployment**.
2. Choose **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
3. GitHub Pages serves it at `https://ukashamehmet.github.io/`.

The canonical URLs, social image URLs, and `sitemap.xml` are set for the site root. If you choose a custom domain, update those absolute URLs before publishing.

All internal links are relative. `.nojekyll` is included so GitHub Pages serves the files without Jekyll processing.

---

## File map

```text
.
├── index.html
├── resume.html
├── assets/
│   ├── style.css
│   ├── editorial.css
│   ├── theme.css
│   ├── csume.css
│   ├── inner.css
│   ├── script.js
│   ├── portrait-original.jpg
│   ├── portrait-cyber.jpg
│   ├── work-saas.jpg
│   ├── work-network.jpg
│   ├── work-mobile.jpg
│   ├── work-research.jpg
│   ├── blog-arch.jpg
│   ├── favicon.svg
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── og-card.png
│   ├── site.webmanifest
│   └── Okasha-Mehmood-CV.pdf
├── projects/
│   └── index.html
├── blog/
│   ├── index.html
│   └── posts/
│       ├── tenant-boundaries.html
│       ├── waf-origin.html
│       ├── android-vpn.html
│       └── findings-engineers-fix.html
├── admin/
│   └── index.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── .gitignore
└── README.md
```

---

## Customize

### Identity and contact

Search for these values and replace them consistently:

- `Okasha Mehmood`
- `ukashamehmet@gmail.com`
- `+92 321 911 6318`
- `https://www.linkedin.com/in/okasha-mehmood-0394261a2/`
- `Islamabad, Pakistan`

Files: `index.html`, `projects/index.html`, `blog/index.html`, the article pages, `resume.html`, and the JSON-LD block in `index.html`.

### Case studies

All nine write-ups live in `projects/index.html`, inside `<details class="case">` blocks. Each case has:

- a summary card with category, severity, and tags;
- `data-cases` values used by the filter bar (`web api network mobile research`);
- context, discovery, evidence, remediation, verification, and outcome sections.

When adding a case, keep the same structure and update the filter count if the number changes.

### Field notes

The blog index links to four article pages in `blog/posts/`. Each article uses the shared `article-shell` layout and `prose` styles. Add a new `.html` file, then add a card to `blog/index.html`.

### CV

Edit `resume.html`, then print to PDF:

1. Open `resume.html` in Chrome or Edge.
2. Print → **Save as PDF**.
3. Use A4, margins **None**, background graphics **on**.
4. Replace `assets/Okasha-Mehmood-CV.pdf`.

The current PDF is a one-page A4 CV.

### Social preview and metadata

`assets/og-card.png` is a 1200×630 social preview. Replace it with your own image if you change the hero. Canonical URLs, `og:url`, `og:image`, and `twitter:image` are set to `https://ukashamehmet.github.io/`, and `sitemap.xml` lists the public pages.

If you move to a custom domain, update these absolute URLs in every page head, update `sitemap.xml` and `robots.txt`, and replace the `og:image` path.

### Admin / content studio

`admin/index.html` is a local-only authoring companion. It stores draft metadata in `localStorage` and exports JSON. It is **not** a CMS and has **no authentication**. It is marked `noindex, nofollow` and excluded from `robots.txt`, but it is still a public file if deployed. Never enter client data, credentials, tokens, or secrets there.

The seed data lives in `assets/script.js` under `initStudio()`.

---

## Privacy and confidentiality

This portfolio was built around a simple rule: **the technical lesson can be public; the target cannot.**

- No client names, product names, domains, IPs, CIDRs, ASNs, exact dates, credentials, session values, malware infrastructure, or client records appear in the public pages.
- Evidence examples use placeholders and sanitized request shapes.
- The CV and case studies avoid identifying details.
- No analytics, tracking pixels, cookies, or third-party scripts are used. Google Fonts is the only external asset request; remove it if you want a fully self-contained build.
- `admin/` is a local convenience page, not a security boundary.

The legacy audit material (old docs, built site, and the previous React experiment) was moved outside this publish folder into a separate private archive on this machine. It is not part of the site and should not be copied back into the repository. If you use the GitHub web uploader, select only the files in the file map above.

---

## Quality checks

Before publishing:

- [ ] Open every page and verify navigation and footer links.
- [ ] Test the mobile menu and all filter buttons.
- [ ] Open each case study; check that copy-link and Expand all work.
- [ ] Download the CV and open the PDF.
- [ ] Search the public files for old client names, domains, IPs, tokens, and CVE identifiers.
- [ ] Confirm the admin page is not linked from the public navigation.
- [ ] Run Lighthouse or PageSpeed Insights after deployment.
- [ ] Test with JavaScript disabled: core content and links should still work.
- [ ] Verify `og-card.png` and page titles in a social preview debugger.

---

## Notes

- The site is intentionally static and framework-free. It loads quickly, has no build pipeline, and is easy to audit.
- Animations respect `prefers-reduced-motion`.
- `resume.html` and the PDF are print-optimized; the PDF is a snapshot and must be regenerated after CV edits.
- The public writing is educational and sanitized. It does not include working exploit code.

## Photography

Editorial photography is sourced from Unsplash under the Unsplash License and used as illustrative imagery only. The images do not depict clients, engagements, or confidential environments.

## License

Personal portfolio content and case studies © Okasha Mehmood. All rights reserved. The code may be used as a reference, but the written case studies, CV, and personal branding may not be republished as someone else's work.
