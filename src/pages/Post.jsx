import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import POSTS from '../data/posts.json';
import { Icon, A, copyText, useInternalLinks } from '../lib/ui.jsx';

export const findPost = (slug) => POSTS.find((p) => p.slug === slug);

function useReadingProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return bar;
}

export default function Post({ slug }) {
  const p = findPost(slug);
  const bar = useReadingProgress();
  const body = useInternalLinks();
  const end = useInternalLinks();
  const copy = () => copyText(window.location.href.split('#')[0], 'Article link copied.');
  const [topic, sub] = p.eyebrow.split(' / ');

  return (
    <Layout section="post">
      <div className="no-print fixed top-0 inset-x-0 z-50 h-0.5" aria-hidden="true">
        <div ref={bar} className="read-progress h-full bg-neon" />
      </div>

      <div className="relative overflow-hidden border-b border-line">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <header className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-12 lg:pt-16">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-dim flex flex-wrap items-center gap-2">
            <Link to="/" className="hover:text-fg">Home</Link><span aria-hidden="true">/</span>
            <Link to="/blog/" className="hover:text-fg">Field notes</Link><span aria-hidden="true">/</span>
            <span className="text-muted">{topic}</span>
          </nav>
          <p className="mt-6 font-mono text-sm text-neon">{topic}{sub && <span className="text-dim"> / {sub}</span>}</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold leading-[1.08] tracking-tight max-w-4xl">{p.title}</h1>
          <p className="mt-5 text-lg text-muted max-w-3xl leading-relaxed">{p.dek}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-line bg-panel"><Icon.user size={15} className="text-neon" />{p.byline[0]}</span>
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-line bg-panel"><Icon.clock size={15} className="text-cyan" />{p.byline[1]}</span>
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-line bg-panel text-muted"><Icon.lock size={15} className="text-amber" />{p.byline[2]}</span>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 order-last lg:order-first" aria-label="Article details">
          <div className="lg:sticky lg:top-24 grid gap-4">
            <Link to="/blog/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-neon"><Icon.back size={16} /> All field notes</Link>
            <dl className="rounded-xl border border-line bg-panel divide-y divide-line text-sm">
              {p.details.map((d) => (
                <div key={d.label} className="px-4 py-3"><dt className="font-mono text-[11px] uppercase text-dim">{d.label}</dt><dd className="mt-0.5 font-semibold">{d.value}</dd></div>
              ))}
            </dl>
            <button type="button" onClick={copy} className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md border border-line hover:border-neon/40 text-sm font-semibold">
              Copy link <Icon.link size={16} />
            </button>
          </div>
        </aside>

        <article className="lg:col-span-9 min-w-0 max-w-3xl">
          <div ref={body} className="prose-om" dangerouslySetInnerHTML={{ __html: p.html }} />

          <footer ref={end} className="mt-14 rounded-xl border border-line bg-panel p-6">
            <p className="prose-om !text-sm" dangerouslySetInnerHTML={{ __html: p.relatedHtml }} />
            <div className="mt-5 flex flex-wrap gap-3">
              <A href={p.relatedHref} className="inline-flex items-center gap-2 h-11 px-4 rounded-md bg-neon text-ink text-sm font-semibold hover:bg-neon/90">
                {p.relatedHref === '/projects/' ? 'Browse the case studies' : 'Read the case study'} <Icon.arrow size={16} />
              </A>
              <button type="button" onClick={copy} className="inline-flex items-center gap-2 h-11 px-4 rounded-md border border-line hover:border-neon/40 text-sm font-semibold">
                Copy article link <Icon.link size={16} />
              </button>
            </div>
          </footer>

          {p.next && (
            <Link to={p.next.href} className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-obsidian p-6 hover:border-neon/40 transition">
              <span>
                <span className="block font-mono text-xs text-dim uppercase">{p.next.href.endsWith(`${POSTS[0].slug}.html`) ? 'Start again' : 'Next note'}</span>
                <strong className="mt-1 block text-lg group-hover:text-neon">{p.next.title}</strong>
              </span>
              <Icon.arrow className="text-neon shrink-0" />
            </Link>
          )}
        </article>
      </div>
    </Layout>
  );
}
