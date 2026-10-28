import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../data/site.js';
import { Icon, Toaster } from '../lib/ui.jsx';

/* Footer copy changes per section, exactly as on the original site. */
const FOOTERS = {
  home: { blurb: 'Penetration testing, API security, mobile reversing, and external attack surface work. Built to be read by both the people who approve the risk and the people who fix it.', note: 'Designed for GitHub Pages · Last updated October 2026' },
  projects: { blurb: 'Sanitized case studies from confidential security engagements. Full reports and references are available under NDA.', note: 'Client identifiers intentionally withheld.' },
  blog: { blurb: 'Field notes on application security, network exposure, mobile reversing, and the craft of remediation.', note: 'Written from practice, not from a content calendar.' },
  post: { blurb: 'Field notes on application security, network exposure, mobile reversing, and the craft of remediation.', note: 'Sanitized for public reading.' },
};

function useNav(isHome) {
  // On the home page sections are in-page anchors; elsewhere they route home.
  const h = (id) => (isHome ? `#${id}` : `/#${id}`);
  return [
    { label: 'Work', href: isHome ? '#work' : '/projects/', key: 'projects' },
    { label: 'Approach', href: h('approach') },
    { label: 'Capabilities', href: h('capabilities') },
    { label: 'About', href: h('about') },
    { label: 'Writing', href: isHome ? '#writing' : '/blog/', key: 'blog' },
  ];
}

const NavLink = ({ href, children, ...rest }) =>
  href.startsWith('#') ? <a href={href} {...rest}>{children}</a> : <Link to={href} {...rest}>{children}</Link>;

function TextSizeToggle() {
  const [large, setLarge] = useState(false);
  useEffect(() => setLarge(document.documentElement.classList.contains('large-text')), []);
  const toggle = () => {
    const next = !large;
    document.documentElement.classList.toggle('large-text', next);
    setLarge(next);
    try { localStorage.setItem('om-large-text', next ? '1' : '0'); } catch { /* reading mode still works for this view */ }
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={large} title={large ? 'Standard text' : 'Larger text'}
      aria-label={large ? 'Use standard text size' : 'Use larger text'}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-md border font-mono text-sm ${large ? 'border-neon/50 text-neon' : 'border-line text-muted hover:text-fg'}`}>
      Aa
    </button>
  );
}

export function Header({ section }) {
  const isHome = section === 'home';
  const nav = useNav(isHome);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const current = section === 'post' ? 'blog' : section;
  const contact = isHome ? '#contact' : '/#contact';

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between" aria-label="Primary">
        <NavLink href={isHome ? '#top' : '/'} className="flex items-center gap-3" aria-label="Okasha Mehmood — home">
          <span className="h-9 w-9 rounded-md border border-neon/40 bg-neon/10 text-neon font-mono text-sm font-bold inline-flex items-center justify-center" aria-hidden="true">OM</span>
          <span className="leading-tight"><span className="block text-sm font-semibold">Okasha Mehmood</span><span className="block font-mono text-[11px] text-dim">security engineering</span></span>
        </NavLink>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted">
          {nav.map((n) => (
            <li key={n.label}>
              <NavLink href={n.href} aria-current={n.key === current ? 'page' : undefined}
                className={n.key === current ? 'text-neon' : 'hover:text-fg'}>{n.label}</NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <TextSizeToggle />
          <NavLink href={contact} className="hidden sm:inline-flex items-center h-10 px-4 rounded-md bg-neon text-ink text-sm font-semibold hover:bg-neon/90">Let&rsquo;s talk</NavLink>
          <button type="button" onClick={() => setOpen((o) => !o)} className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-md border border-line"
            aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            {open ? <Icon.close size={20} /> : <Icon.menu size={20} />}
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={`md:hidden border-t border-line bg-ink ${open ? '' : 'hidden'}`}>
        <ul className="px-4 py-3 grid gap-1 text-muted" onClick={(e) => e.target.closest('a') && setOpen(false)}>
          {nav.map((n) => <li key={n.label}><NavLink className="block py-3" href={n.href}>{n.label}</NavLink></li>)}
          <li><NavLink className="block py-3 text-neon" href={contact}>Let&rsquo;s talk</NavLink></li>
        </ul>
      </div>
    </header>
  );
}

export function Footer({ section }) {
  const f = FOOTERS[section] || FOOTERS.home;
  const isHome = section === 'home';
  const h = (id) => (isHome ? `#${id}` : `/#${id}`);
  const links = [
    ...(isHome ? [] : [['Home', '/']]),
    ['Case studies', '/projects/'], ['Approach', h('approach')], ['About', h('about')],
    ['Writing', '/blog/'], ['Contact', h('contact')],
  ];
  return (
    <footer className="no-print border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Okasha Mehmood — home">
              <span className="h-8 w-8 rounded-md border border-neon/40 bg-neon/10 text-neon font-mono text-xs font-bold inline-flex items-center justify-center" aria-hidden="true">OM</span>
              <span className="font-semibold">Okasha Mehmood</span>
            </Link>
            <p className="mt-3 text-sm text-muted">{f.blurb}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-muted">
            {links.map(([l, href]) => <NavLink key={l} className="hover:text-fg" href={href}>{l}</NavLink>)}
            <a className="hover:text-fg" href={SITE.cv} download>CV</a>
            <a className="hover:text-fg" href={`mailto:${SITE.email}`}>Email</a>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-wrap justify-between gap-3 font-mono text-xs text-dim">
          <span>© {new Date().getFullYear()} Okasha Mehmood. All rights reserved.</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon" aria-hidden="true" /> No trackers. No cookies. No client data.</span>
          <span>{f.note}</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ section, children }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-neon focus:text-ink focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
      <Header section={section} />
      <main id="main">{children}</main>
      <Footer section={section} />
      <Toaster />
    </>
  );
}
