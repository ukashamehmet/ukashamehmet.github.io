import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import data from '../data/cases.json';
import { Icon, Check, SevTag, Chip, Kicker, PageHero, btn, copyText, useInternalLinks, useReveal } from '../lib/ui.jsx';

const { cases: CASES, archive: ARCHIVE } = data;
const FILTERS = [['all', 'All'], ['web', 'Web'], ['api', 'API'], ['network', 'Network'], ['mobile', 'Mobile'], ['research', 'Research']];

function CaseItem({ c, open, onToggle }) {
  const ref = useInternalLinks();
  return (
    <li id={c.id} className="scroll-mt-40">
      <details open={open} className="group rounded-xl border border-line bg-panel open:border-neon/40 transition overflow-hidden">
        <summary onClick={(e) => { e.preventDefault(); onToggle(c.id); }} className="cursor-pointer select-none">
          <div className="flex items-center justify-between gap-2 px-5 h-11 border-b border-line bg-obsidian">
            <span className="font-mono text-xs text-dim">{c.no} / {c.category.toUpperCase()}</span>
            <span className="flex gap-2"><SevTag sev={c.severity} /><Chip>{c.sector}</Chip></span>
          </div>
          <div className="p-5 sm:p-6 flex gap-5 items-start">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-neon transition-colors">{c.title}</h2>
              <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-3xl">{c.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {c.summaryTags.map((t) => <li key={t} className="font-mono text-[11px] px-2 py-1 rounded bg-obsidian border border-line text-muted">{t}</li>)}
              </ul>
            </div>
            <span className={`shrink-0 h-10 w-10 rounded-md border inline-flex items-center justify-center transition ${open ? 'rotate-45 border-neon/50 text-neon' : 'border-line text-muted'}`} aria-hidden="true">
              <Icon.plus size={18} />
            </span>
          </div>
        </summary>

        {/* Body stays in the DOM (hidden by <details>) so the prerendered page is fully indexable. */}
        <div ref={ref} className="border-t border-line">
            <dl className="grid grid-cols-2 lg:grid-cols-4 border-b border-line bg-obsidian/60">
              {c.meta.map((m, i) => (
                <div key={m.label} className={`px-5 py-4 border-line ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
                  <dt className="font-mono text-[11px] uppercase text-dim">{m.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="p-5 sm:p-8 grid gap-10">
              {c.sections.map((s, i) => (
                <section key={s.title} className="grid lg:grid-cols-12 gap-3 lg:gap-8">
                  <h3 className="lg:col-span-3 font-mono text-xs uppercase tracking-widest text-cyan pt-1">
                    <span className="text-dim">{String(i + 1).padStart(2, '0')} · </span>{s.title}
                  </h3>
                  <div className="lg:col-span-9 min-w-0">
                    <div className="prose-om prose-sm-om" dangerouslySetInnerHTML={{ __html: s.html }} />
                    {i === c.sections.length - 1 && (
                      <>
                        {c.outcomes?.length > 0 && (
                          <div className="mt-6 grid grid-cols-3 gap-3">
                            {c.outcomes.map((o) => (
                              <div key={o.label} className="rounded-lg border border-line bg-obsidian p-4">
                                <p className="font-mono text-xl sm:text-2xl font-bold text-neon">{o.value}</p>
                                <p className="mt-1 text-xs text-muted">{o.label}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-5 flex gap-3 rounded-lg border border-neon/30 bg-neon/5 p-4 text-sm">
                          <Icon.shield size={18} className="shrink-0 text-neon mt-0.5" />
                          <p className="prose-om !text-sm !leading-relaxed text-fg/90" dangerouslySetInnerHTML={{ __html: c.callout }} />
                        </div>
                      </>
                    )}
                  </div>
                </section>
              ))}
              <div className="pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5">{c.tags.map((t) => <li key={t} className="font-mono text-[11px] px-2 py-1 rounded bg-obsidian border border-line text-muted">{t}</li>)}</ul>
                <button type="button" onClick={() => copyText(`${window.location.origin}/projects/#${c.id}`, 'Case-study link copied.')}
                  className="inline-flex items-center gap-2 h-10 text-sm font-semibold text-neon hover:underline">
                  Copy case link <Icon.link size={16} />
                </button>
              </div>
            </div>
        </div>
      </details>
    </li>
  );
}

export default function Projects() {
  const { hash } = useLocation();
  const [filter, setFilter] = useState('all');
  const [openIds, setOpenIds] = useState(() => new Set());
  useReveal('projects');

  const shown = useMemo(() => CASES.filter((c) => filter === 'all' || c.filters.includes(filter)), [filter]);
  const anyClosed = shown.some((c) => !openIds.has(c.id));

  // Deep links (#case-id) open the case and reset a filter that would hide it.
  useEffect(() => {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    const target = CASES.find((c) => c.id === id);
    if (!target) return;
    setFilter((f) => (f === 'all' || target.filters.includes(f) ? f : 'all'));
    setOpenIds((s) => new Set(s).add(id));
  }, [hash]);

  const toggle = useCallback((id) => setOpenIds((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  }), []);

  const expandAll = () => setOpenIds((s) => {
    const n = new Set(s);
    shown.forEach((c) => (anyClosed ? n.add(c.id) : n.delete(c.id)));
    return n;
  });

  return (
    <Layout section="projects">
      <PageHero crumb="Case studies"
        title={<>Security findings, <span className="text-neon">responsibly shared.</span></>}
        lead="Ten case studies: nine anonymized engagement write-ups and one named mobile finding whose public disclosure was authorized. The named report’s duplicate triage and unresolved status are stated as supplied; exploit steps are omitted."
        meta={['10 case studies', '9 anonymized · 1 named', 'Islamabad / remote']} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 gap-4">
          <p className="flex gap-3 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
            <Icon.lock size={18} className="shrink-0 text-amber mt-0.5" />
            <span><strong className="text-fg">Confidentiality note.</strong> Engagement write-ups are generalized for public reading, except for the named finding explicitly authorized for disclosure. Sensitive identifiers, client data, credentials, session values, malware infrastructure, and copy-paste exploit payloads are omitted. Redacted reports and references are available under NDA.</span>
          </p>
          <p className="flex gap-3 rounded-xl border border-line bg-panel p-5 text-sm text-muted">
            <Icon.doc size={18} className="shrink-0 text-cyan mt-0.5" />
            <span><strong className="text-fg">How to read this page.</strong> Each case is folded into a summary. Open one for the available context, impact, and remediation or disclosure status. Details and verification claims are limited to what the engagement records support.</span>
          </p>
        </div>

        <div className="sticky top-16 z-30 -mx-4 sm:mx-0 mt-10 px-4 sm:px-4 py-3 bg-ink/90 backdrop-blur border-y sm:border sm:rounded-xl border-line flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-dim">Filter</span>
          <div role="group" aria-label="Filter case studies by category" className="flex flex-wrap gap-2">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
                className={`h-9 px-4 rounded-full border text-sm font-mono ${filter === k ? 'bg-neon text-ink border-neon' : 'border-line text-muted hover:text-fg'}`}>{label}</button>
            ))}
          </div>
          <span className="ml-auto font-mono text-xs text-muted" aria-live="polite"><strong className="text-fg">{shown.length}</strong> of {CASES.length} shown</span>
          <button type="button" onClick={expandAll} className="h-9 px-3 rounded-md border border-line text-sm text-muted hover:text-fg hover:border-neon/40">
            {anyClosed ? 'Expand all' : 'Collapse all'}
          </button>
        </div>

        <ul className="mt-6 grid gap-4">
          {shown.map((c) => <CaseItem key={c.id} c={c} open={openIds.has(c.id)} onToggle={toggle} />)}
        </ul>

        <section aria-labelledby="archive-title" className="mt-20 reveal">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker>Engagement archive</Kicker>
              <h2 id="archive-title" className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">A wider view of the <span className="text-neon">practice.</span></h2>
            </div>
            <p className="text-muted max-w-md">Not every engagement becomes a full case study. These additional examples show the breadth of the work — still without client names or identifiers.</p>
          </div>
          <div className="mt-8 rounded-xl border border-line bg-panel overflow-x-auto thin-scroll">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-left text-dim font-mono text-xs uppercase"><tr>
                <th scope="col" className="px-5 py-3 font-medium">Sector</th><th scope="col" className="px-5 py-3 font-medium">Representative issue</th><th scope="col" className="px-5 py-3 font-medium">What changed</th>
              </tr></thead>
              <tbody className="divide-y divide-line">
                {ARCHIVE.map(([s, issue, fix]) => (
                  <tr key={s} className="hover:bg-obsidian/60">
                    <th scope="row" className="px-5 py-4 text-left font-semibold whitespace-nowrap align-top">{s}</th>
                    <td className="px-5 py-4 text-muted align-top">{issue}</td>
                    <td className="px-5 py-4 align-top"><span className="inline-flex items-start gap-2"><span className="mt-1"><Check /></span>{fix}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-16 reveal rounded-xl border border-neon/30 bg-neon/5 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Need a similar level of scrutiny?</h2>
            <p className="mt-2 text-muted">I take on a small number of penetration tests, API reviews, mobile reverse-engineering engagements, and retests. If your system carries real risk, start with a short conversation about scope.</p>
          </div>
          <Link to="/#contact" className={btn.primary}>Start a conversation <Icon.arrow /></Link>
        </div>
      </section>
    </Layout>
  );
}
