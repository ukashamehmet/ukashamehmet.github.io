import { NOTES, postPath } from './data/site.js';

/* Every URL of the original site is kept, so existing links and search results keep working.
   Descriptions here are used by the prerenderer; post descriptions come from posts.json. */
export const ROUTES = [
  { path: '/', page: 'home', title: 'Okasha Mehmood — Penetration Tester & Security Engineer',
    description: 'Penetration testing, API security, mobile reverse engineering, and external attack surface work. 50+ confidential engagements across government, telecom, fintech, and SaaS.' },
  { path: '/projects/', page: 'projects', title: 'Security Case Studies — Okasha Mehmood',
    description: 'Nine sanitized penetration testing, API, mobile reversing, and vulnerability research case studies. See how each issue was found, fixed, and verified.' },
  { path: '/blog/', page: 'blog', title: 'Field Notes — Okasha Mehmood',
    description: 'Practical notes on application security, network exposure, mobile reversing, and writing findings engineers can act on.' },
  ...NOTES.map((n) => ({ path: postPath(n.slug), page: 'post', slug: n.slug, title: `${n.title} — Okasha Mehmood`, description: n.home, article: true })),
  { path: '/resume.html', page: 'resume', title: 'Okasha Mehmood — Curriculum Vitae', robots: 'noindex, nofollow',
    description: 'One-page CV for Okasha Mehmood: penetration tester, API security, mobile reverse engineering, and 50+ confidential engagements.' },
  { path: '/admin/', page: 'studio', title: 'Content Studio — Okasha Mehmood', robots: 'noindex, nofollow, noarchive',
    description: 'Local-only portfolio authoring console.' },
];

export const NOT_FOUND = { path: '/404.html', page: 'notfound', title: 'Page not found — Okasha Mehmood', robots: 'noindex',
  description: 'This page does not exist.' };

export const PAGE_FILES = {
  home: 'Home', projects: 'Projects', blog: 'Blog', post: 'Post', resume: 'Resume', studio: 'Studio', notfound: 'NotFound',
};
