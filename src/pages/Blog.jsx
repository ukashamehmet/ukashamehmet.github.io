import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { NOTES, postPath } from '../data/site.js';
import { Icon, Kicker, PageHero, btn, useReveal } from '../lib/ui.jsx';

export default function Blog() {
  useReveal('blog');
  const [featured, ...rest] = NOTES;
  return (
    <Layout section="blog">
      <PageHero crumb="Field notes"
        title={<>Notes from <span className="text-neon">the work.</span></>}
        lead="Practical write-ups on the patterns behind security findings: authorization boundaries, origin exposure, Android internals, and the craft of making a fix actually happen. No client names. No copy-paste exploits."
        meta={['4 field notes', 'Written from practice', 'Sanitized']} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <Kicker>Latest / 01</Kicker>
          <p className="text-muted max-w-2xl">The best security writing tells you what to look for and why it matters — without turning into a weapon. These notes are written for defenders, developers, and testers who want the reasoning, not just the payload.</p>
        </div>

        <Link to={postPath(featured.slug)} className="reveal group mt-8 block rounded-xl border border-line bg-panel overflow-hidden hover:border-neon/40 transition">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-8 p-6 sm:p-8">
              <p className="font-mono text-xs text-neon">Featured · {featured.cat}</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-neon transition-colors">{featured.title}</h2>
              <p className="mt-3 text-muted max-w-2xl">{featured.index}</p>
              <p className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-neon">Read the note <Icon.arrow size={14} /></p>
            </div>
            <dl className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-line bg-obsidian p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-1 gap-4 content-center font-mono text-xs">
              <div><dt className="text-dim uppercase">Reading time</dt><dd className="mt-1 text-fg text-sm">{featured.mins} min read</dd></div>
              <div><dt className="text-dim uppercase">Published</dt><dd className="mt-1 text-fg text-sm">{featured.date}</dd></div>
            </dl>
          </div>
        </Link>

        <ul className="mt-5 grid md:grid-cols-3 gap-5">
          {rest.map((n) => (
            <li key={n.slug} className="reveal">
              <Link to={postPath(n.slug)} className="group h-full flex flex-col rounded-xl border border-line bg-panel p-5 hover:border-neon/40 hover:-translate-y-0.5 transition">
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-dim"><span>{n.cat}</span><span>{n.mins} min read</span></div>
                <h3 className="mt-4 font-semibold text-lg leading-snug group-hover:text-neon">{n.title}</h3>
                <p className="mt-2 text-sm text-muted flex-1">{n.index}</p>
                <p className="mt-5 font-mono text-xs text-neon">Read the note →</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="reveal mt-10 flex gap-3 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
          <Icon.lock size={18} className="shrink-0 text-amber mt-0.5" />
          <span><strong className="text-fg">Editorial note.</strong> Articles are generalized from engagement experience and public research. They do not contain client identifiers, live infrastructure, captured data, or working exploit code. Where a technique could be misused, the explanation stays at the level needed to design a defense.</span>
        </p>

        <div className="mt-12 reveal rounded-xl border border-neon/30 bg-neon/5 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Prefer the full case studies?</h2>
            <p className="mt-2 text-muted">The work section goes deeper into nine engagements, including discovery, repair, and verification.</p>
          </div>
          <Link to="/projects/" className={btn.primary}>Browse the case studies <Icon.arrow /></Link>
        </div>
      </section>
    </Layout>
  );
}
