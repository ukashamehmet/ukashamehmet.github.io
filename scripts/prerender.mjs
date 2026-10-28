// Renders every route to static HTML so GitHub Pages serves real content
// (fast first paint, crawlable) and React hydrates on top.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const client = join(root, 'dist/client');
const out = join(root, 'dist/site');
const SITE = 'https://ukashamehmet.github.io';

const { render, ROUTES, NOT_FOUND, PAGE_FILES, POSTS } = await import(pathToFileURL(join(root, 'dist/server/entry-server.js')).href);
const manifest = JSON.parse(readFileSync(join(client, '.vite/manifest.json'), 'utf8'));
const template = readFileSync(join(client, 'index.html'), 'utf8');

rmSync(out, { recursive: true, force: true });
cpSync(client, out, { recursive: true, filter: (src) => !src.includes('.vite') });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const PERSON = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Okasha Mehmood', url: `${SITE}/`,
  jobTitle: 'Penetration Tester & Reverse Engineer', email: 'mailto:ukashamehmet@gmail.com', telephone: '+92-321-9116318',
  address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  sameAs: ['https://www.linkedin.com/in/okasha-mehmood-0394261a2/'],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Science & Technology' },
  knowsAbout: ['Penetration testing', 'Application security', 'API security', 'Android reverse engineering', 'Network security', 'Red teaming'],
};

function head(r) {
  const post = r.slug && POSTS.find((p) => p.slug === r.slug);
  const title = post?.metaTitle || r.title;
  const description = post?.metaDescription || r.description;
  const url = `${SITE}${r.path}`;
  const chunk = manifest[`src/pages/${PAGE_FILES[r.page]}.jsx`];
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<meta name="robots" content="${r.robots || 'index, follow'}">`,
    r.page !== 'notfound' && `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    chunk && `<link rel="modulepreload" href="/${chunk.file}">`,
    r.page === 'home' && `<script type="application/ld+json">${JSON.stringify(PERSON)}</script>`,
    post && `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description,
      author: { '@type': 'Person', name: 'Okasha Mehmood', url: `${SITE}/` }, url,
    })}</script>`,
  ];
  return tags.filter(Boolean).join('\n');
}

function fileFor(path) {
  if (path.endsWith('/')) return join(out, path, 'index.html');
  return join(out, path);
}

for (const r of [...ROUTES, NOT_FOUND]) {
  const html = template.replace('<!--app-head-->', head(r)).replace('<!--app-html-->', render(r.path));
  const file = fileFor(r.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('prerendered', r.path);
}
writeFileSync(join(out, '.nojekyll'), '');
