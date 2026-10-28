import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ---------- Icons ---------- */
const svg = (d, props) => (
  <svg width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={props.sw || 2} className={props.className} aria-hidden="true">{d}</svg>
);
export const Icon = {
  arrow: (p = {}) => svg(<path d="M5 12h14m-6-6 6 6-6 6" />, p),
  back: (p = {}) => svg(<path d="M19 12H5m6 6-6-6 6-6" />, p),
  download: (p = {}) => svg(<path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />, p),
  menu: (p = {}) => svg(<path d="M4 7h16M4 12h16M4 17h16" />, p),
  close: (p = {}) => svg(<path d="M6 6l12 12M18 6 6 18" />, p),
  shield: (p = {}) => svg(<><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>, p),
  pin: (p = {}) => svg(<><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></>, p),
  doc: (p = {}) => svg(<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h4M10 13h5M10 17h5" /></>, p),
  lock: (p = {}) => svg(<><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>, p),
  cap: (p = {}) => svg(<><path d="m12 3 8 4-8 4-8-4Z" /><path d="M6 9v6c0 2 2.7 4 6 4s6-2 6-4V9" /></>, p),
  check: (p = {}) => svg(<path d="m5 12 4 4L19 6" />, { sw: 2.4, size: 14, ...p }),
  link: (p = {}) => svg(<><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></>, p),
  plus: (p = {}) => svg(<path d="M12 5v14M5 12h14" />, p),
  user: (p = {}) => svg(<><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>, p),
  clock: (p = {}) => svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, p),
  edit: (p = {}) => svg(<><path d="m4 16-.8 4.8L8 20l10.7-10.7a2.1 2.1 0 0 0-3-3Z" /><path d="m13.5 7.5 3 3" /></>, p),
  trash: (p = {}) => svg(<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5" />, p),
  print: (p = {}) => svg(<><path d="M6 9V3h12v6" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v7H7z" /></>, p),
  alert: (p = {}) => svg(<><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>, p),
};

export const Check = () => <Icon.check className="text-neon shrink-0" />;

const SEV = {
  Critical: 'text-[#FF8FA3] bg-crit/15 border-crit/40',
  High: 'text-amber bg-amber/10 border-amber/40',
  Medium: 'text-cyan bg-cyan/10 border-cyan/40',
};
export const SevTag = ({ sev }) => (
  <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${SEV[sev] || 'text-muted border-line'}`}>{sev}</span>
);
export const Chip = ({ children, className = '' }) => (
  <span className={`font-mono text-[11px] px-2 py-0.5 rounded border border-line text-muted ${className}`}>{children}</span>
);
export const Tag = ({ children }) => (
  <li className="font-mono text-[11px] px-2 py-1 rounded bg-obsidian border border-line text-muted">{children}</li>
);

export const Kicker = ({ children }) => <p className="font-mono text-sm text-neon">{children}</p>;

export const btn = {
  primary: 'inline-flex items-center gap-2 h-12 px-5 rounded-md bg-neon text-ink font-semibold hover:bg-neon/90',
  ghost: 'inline-flex items-center gap-2 h-12 px-5 rounded-md border border-line bg-panel hover:border-cyan/60 font-semibold',
  small: 'inline-flex items-center gap-2 h-11 px-4 rounded-md border border-line hover:border-neon/40 text-sm font-semibold',
};

/* ---------- Smart link: router for internal pages, native for files/anchors/external ---------- */
export function A({ href, children, ...rest }) {
  const internal = href.startsWith('/') && !/\.(pdf|png|jpg|webp|svg|json)$/i.test(href);
  if (internal) return <Link to={href} {...rest}>{children}</Link>;
  const ext = /^https?:/.test(href);
  return <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>;
}

/* Route clicks on internal links inside server-provided HTML through the router. */
export function useInternalLinks() {
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onClick = (e) => {
      const a = e.target.closest('a[href^="/"]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    };
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  }, [navigate]);
  return ref;
}

/* ---------- Reveal on scroll (one shared observer) ---------- */
let observer;
function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); observer.unobserve(en.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  return observer;
}
export function useReveal(dep) {
  useEffect(() => {
    const io = getObserver();
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!io) { els.forEach((el) => el.classList.add('in')); return undefined; }
    els.forEach((el) => io.observe(el));
    return () => els.forEach((el) => io.unobserve(el));
  }, [dep]);
}

/* ---------- Toasts ---------- */
const listeners = new Set();
export function toast(message, type = 'success') { listeners.forEach((fn) => fn({ message, type, id: Math.random() })); }
export function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fn = (t) => {
      setItems((xs) => [...xs, t]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== t.id)), 3400);
    };
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 grid gap-2">
      {items.map((t) => (
        <div key={t.id} className={`flex items-center gap-2 rounded-md border px-4 py-3 text-sm shadow-2xl shadow-black/40 bg-panel ${t.type === 'error' ? 'border-crit/50 text-[#FF8FA3]' : 'border-neon/40 text-fg'}`}>
          {t.type === 'error' ? <Icon.alert size={16} /> : <Icon.check className="text-neon" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export async function copyText(value, msg = 'Copied to clipboard.') {
  try {
    await navigator.clipboard.writeText(value);
    toast(msg);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = value; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove();
    toast(ok ? msg : 'Copy failed — please copy the address manually.', ok ? 'success' : 'error');
  }
}

/* ---------- Page header block shared by sub-pages ---------- */
export function PageHero({ crumb, title, lead, meta }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-14 lg:pt-16">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-dim flex items-center gap-2">
          <Link to="/" className="hover:text-fg">Home</Link><span aria-hidden="true">/</span><span className="text-muted">{crumb}</span>
        </nav>
        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] tracking-tight max-w-3xl">{title}</h1>
        <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">{lead}</p>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Collection details">
          {meta.map((m, i) => (
            <li key={m} className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-line bg-panel text-sm">
              <span className={`h-2 w-2 rounded-full ${['bg-neon', 'bg-cyan', 'bg-amber'][i % 3]}`} aria-hidden="true" />{m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
