import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Terminal from '../components/Terminal.jsx';
import {
  SITE, MAILTO_ENGAGEMENT, MAILTO_REPORT, METRICS, SECTORS, HOME_CASES, APPROACH, ARTIFACTS,
  CAPABILITIES, LEDGER, TOOLBELT, EXPERIENCE, CREDENTIALS, PRINCIPLES, NOTES, postPath,
} from '../data/site.js';
import { Icon, Check, SevTag, Chip, Tag, Kicker, btn, useReveal } from '../lib/ui.jsx';

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 lg:pt-20 grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 min-w-0">
          <p className="inline-flex items-center gap-2 font-mono text-xs text-neon border border-neon/30 bg-neon/5 rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-neon" aria-hidden="true" /> Open to senior security roles &amp; selected contracts
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] tracking-tight">
            I find the failure <span className="text-neon">before</span> it becomes an incident.
          </h1>
          <p className="mt-5 text-lg text-muted max-w-xl leading-relaxed">
            I&rsquo;m <strong className="text-fg font-semibold">Okasha Mehmood</strong> — a penetration tester and reverse engineer working across <strong className="text-fg font-semibold">web, API, mobile, and network systems</strong>. For the last three years I&rsquo;ve helped government, telecom, fintech, and SaaS teams prove what is exploitable, fix it properly, and verify the fix.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projects/" className={btn.primary}>Read the case studies <Icon.arrow /></Link>
            <a href="#contact" className={btn.ghost}>Start a conversation</a>
            <a href={SITE.cv} download className="inline-flex items-center gap-2 h-12 px-3 text-muted hover:text-fg underline underline-offset-4 decoration-line">
              <Icon.download size={16} />Download CV
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Quick facts">
            <li className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-line bg-panel text-sm">
              <Icon.shield size={16} className="text-neon" /><span className="font-mono font-bold">CRTA</span><span className="text-dim text-xs">CyberWarFare Labs</span>
            </li>
            <li className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-line bg-panel text-sm"><Icon.pin size={16} className="text-cyan" />Islamabad, PK · Remote worldwide</li>
            <li className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-line bg-panel text-sm"><Icon.doc size={16} className="text-amber" />NDA-safe write-ups</li>
            <li className="inline-flex items-center gap-2 h-10 px-3 rounded-md border border-line bg-panel text-sm"><span className="font-mono font-bold text-neon">50+</span>confidential engagements</li>
          </ul>
          <p className="mt-6 flex gap-3 text-sm text-muted max-w-xl">
            <Icon.lock size={18} className="shrink-0 text-amber mt-0.5" />
            <span><strong className="text-fg">Confidentiality is part of the craft.</strong> Names, domains, IPs, and data never leave the report.</span>
          </p>
        </div>
        <Terminal />
      </div>

      <div className="relative border-y border-line bg-obsidian/70">
        <dl className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 md:divide-x divide-line" aria-label="Practice at a glance">
          {METRICS.map((m, i) => (
            <div key={m.label} className={`flex flex-col-reverse py-6 px-4 sm:px-6 border-line ${i % 2 ? 'border-l md:border-l-0' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''}`}>
              <dt className="text-xs sm:text-sm text-muted">{m.label}</dt>
              <dd className={`font-mono text-2xl sm:text-3xl font-bold ${m.neon ? 'text-neon' : ''}`}>{m.value}{m.accent && <span className="text-neon">{m.accent}</span>}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Sectors worked in">
        <span className="font-mono text-xs uppercase tracking-widest text-dim">Experience across</span>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">{SECTORS.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
    </section>
  );
}

const CATS = ['All', ...HOME_CASES.map((c) => c.cat)];

function Work() {
  const [cat, setCat] = useState('All');
  const shown = HOME_CASES.filter((c) => cat === 'All' || c.cat === cat);
  useReveal(cat);
  return (
    <section id="work" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>01 / selected_work</Kicker>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">The work is the argument.</h2>
            <p className="mt-3 text-muted max-w-2xl">Four sanitized case studies from confidential engagements. Each one shows the signal, the proof, and the fix — without naming the client.</p>
          </div>
          <div role="group" aria-label="Filter case studies" className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}
                className={`h-10 px-4 rounded-full border text-sm font-mono ${c === cat ? 'bg-neon text-ink border-neon' : 'border-line text-muted hover:text-fg'}`}>{c}</button>
            ))}
          </div>
        </div>
        <ul className="mt-10 grid md:grid-cols-2 gap-5">
          {shown.map((c) => (
            <li key={c.id}>
              <article className="group h-full flex flex-col rounded-xl border border-line bg-panel hover:border-neon/40 transition overflow-hidden">
                <Link to={`/projects/#${c.id}`} className="relative block aspect-[16/7] overflow-hidden border-b border-line bg-obsidian" tabIndex={-1} aria-hidden="true">
                  <picture>
                    <source srcSet={`/assets/${c.img}.webp`} type="image/webp" />
                    <img src={`/assets/${c.img}.jpg`} alt={c.alt} width="960" height="720" loading="lazy" decoding="async"
                      className="h-full w-full object-cover opacity-60 grayscale-[35%] group-hover:opacity-80 group-hover:scale-[1.02] transition duration-500" />
                  </picture>
                  <span className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
                </Link>
                <div className="flex items-center justify-between gap-2 px-5 h-11 border-b border-line bg-obsidian">
                  <span className="font-mono text-xs text-dim">{c.no} / {c.cat.toUpperCase()}</span>
                  <span className="flex gap-2"><SevTag sev={c.sev} /><Chip>{c.sector}</Chip></span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{c.body}</p>
                  <ul className="mt-5 grid gap-1.5 text-sm">{c.outcomes.map((o) => <li key={o} className="flex items-center gap-2"><Check />{o}</li>)}</ul>
                  <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
                    <ul className="flex flex-wrap gap-1.5">{c.tags.map((t) => <Tag key={t}>{t}</Tag>)}</ul>
                    <Link to={`/projects/#${c.id}`} className="inline-flex items-center gap-1 h-10 text-sm font-semibold text-neon hover:underline">
                      View case <span aria-hidden="true">→</span><span className="sr-only">: {c.title}</span>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Link to="/projects/" className={btn.small}>All nine case studies →</Link>
        </div>
      </div>
    </section>
  );
}

const TABS = [['exec', 'Executive summary'], ['find', 'Technical finding'], ['fix', 'Remediation & retest']];

function Report() {
  const [tab, setTab] = useState('exec');
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const next = TABS[(i + d + TABS.length) % TABS.length][0];
    setTab(next);
    document.getElementById(`rt-${next}`)?.focus();
  };
  return (
    <section id="report" className="border-y border-line bg-obsidian/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 reveal">
          <Kicker>02 / deliverable</Kicker>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Written for two audiences at once.</h2>
          <p className="mt-3 text-muted">The executive who needs the risk, and the developer who needs the exact change. This is the shape of every finding — an illustrative, sanitized excerpt based on case 01.</p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {['Business impact & overall risk', 'CVSS, affected component, owner', 'Reproducible request evidence', 'Exact remediation & retest memo'].map((x) => (
              <li key={x} className="flex gap-2"><span className="text-neon font-mono" aria-hidden="true">✓</span> {x}</li>
            ))}
          </ul>
          <a href={MAILTO_REPORT} className={`mt-8 ${btn.primary}`}>Request a redacted report</a>
          <p className="mt-3 text-xs text-dim">Full redacted reports and references available under NDA.</p>
        </div>

        <div className="lg:col-span-8 min-w-0 reveal">
          <div className="rounded-xl border border-line bg-fg text-ink overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-8 py-4 bg-obsidian text-fg">
              <span className="font-mono text-xs">FINDING DOSSIER — CASE FILE / 047 · <span className="redact text-fg/80">LEGALTECH CO</span></span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-crit/20 text-[#FF8FA3]">SANITIZED</span>
            </div>
            <div role="tablist" aria-label="Report sections" className="flex border-b border-slate-300 bg-slate-100 overflow-x-auto">
              {TABS.map(([k, label], i) => (
                <button key={k} type="button" role="tab" id={`rt-${k}`} aria-selected={tab === k} aria-controls={`rp-${k}`} tabIndex={tab === k ? 0 : -1}
                  onClick={() => setTab(k)} onKeyDown={(e) => onKey(e, i)}
                  className={`px-5 h-12 text-sm font-semibold whitespace-nowrap border-b-2 ${tab === k ? 'border-ink' : 'border-transparent text-slate-600'}`}>{label}</button>
              ))}
            </div>

            <div id="rp-exec" role="tabpanel" aria-labelledby="rt-exec" hidden={tab !== 'exec'} className="p-5 sm:p-8">
              <p className="font-mono text-[11px] uppercase text-slate-500">Engagement profile</p>
              <p className="mt-1 text-lg font-bold">Multi-tenant SaaS <span className="text-sm font-normal text-slate-600">· Web application + REST API</span></p>
              <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {[['Surface', 'Authenticated web + API'], ['Window', '10 days'], ['Framework', 'OWASP WSTG / API Top 10'], ['Sector', 'Legal technology']].map(([k, v]) => (
                  <div key={k}><dt className="font-mono text-[11px] uppercase text-slate-500">{k}</dt><dd className="font-semibold mt-1">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-slate-700">The multi-tenant platform verified that a user was logged in, but not which organization a record belonged to. An authenticated user of one tenant could read another tenant&apos;s records. The issue was proven with minimal access — no bulk data collection — and overall risk is rated <strong className="text-[#B4123A]">CRITICAL</strong>.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="font-mono text-xs px-2 py-1 rounded bg-[#B4123A] text-white">Critical · cross-tenant object access</span>
                <span className="font-mono text-xs px-2 py-1 rounded bg-slate-800 text-white">Signal · proven, not theoretical</span>
                <span className="font-mono text-xs px-2 py-1 rounded bg-[#15803D] text-white">Fix validated · retest clean</span>
                <span className="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700">Evidence retained: 0 records</span>
              </div>
            </div>

            <div id="rp-find" role="tabpanel" aria-labelledby="rt-find" hidden={tab !== 'find'} className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs px-2 py-1 rounded bg-[#B4123A] text-white">CRITICAL</span>
                {['BOLA / IDOR', 'OWASP API1:2023', 'Django REST'].map((t) => <span key={t} className="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700">{t}</span>)}
              </div>
              <h3 className="mt-3 text-lg font-bold">Cross-tenant object access on record endpoints</h3>
              <p className="mt-2 text-sm text-slate-700">Object lookups were scoped to the authenticated user&apos;s session but not to their organization, so a valid ID from another tenant was returned in full.</p>
              <pre className="mt-4 font-mono text-[12px] leading-relaxed bg-obsidian text-fg rounded-md p-4 overflow-x-auto"><span className="text-dim"># illustrative · identifiers redacted · tenant A session, tenant B object</span>{'\n'}
<span className="text-cyan">GET</span> /api/<span className="redact text-fg/70">matters</span>/<span className="text-amber">{'{id}'}</span>/ HTTP/1.1{'\n'}
Host: <span className="redact text-fg/70">app.redacted.tld</span>{'\n'}
Authorization: Bearer <span className="text-dim">[tenant_A_user]</span>{'\n\n'}
<span className="text-neon">HTTP/1.1 200 OK</span>{'\n'}
{'{"id": …, "organization": "'}<span className="redact text-fg/70">tenant_B</span>{'", …}'}</pre>
            </div>

            <div id="rp-fix" role="tabpanel" aria-labelledby="rt-fix" hidden={tab !== 'fix'} className="p-5 sm:p-8">
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
                <li>Move tenant enforcement into the data layer — every queryset scoped to the caller&apos;s organization, not a controller guard.</li>
                <li>Add authorization regression tests per object route so the boundary can&apos;t silently regress.</li>
                <li>Replay the original path and test adjacent routes after the fix.</li>
              </ol>
              <div className="mt-6 rounded-md border border-slate-300 bg-white p-4 text-sm">
                <p className="font-mono text-[11px] uppercase text-slate-500">Retest memo</p>
                <p className="mt-1"><strong>Tenant isolation restored.</strong> Retested across 40+ object routes — original path and adjacent routes closed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 reveal">
          <Kicker>03 / how_i_work</Kicker>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">A test should survive contact with engineering.</h2>
          <p className="mt-3 text-muted">Findings are not the deliverable. A change that holds is. My process is built to make the risky path obvious, the evidence reproducible, and the fix testable by the people who own the system.</p>
          <blockquote className="mt-8 rounded-xl border border-line bg-panel p-5">
            <p className="text-lg font-semibold leading-snug">&ldquo;A finding isn&rsquo;t closed when the report is sent. It&rsquo;s closed when the fix survives a retest.&rdquo;</p>
            <footer className="mt-3 font-mono text-xs text-dim">— working principle</footer>
          </blockquote>
          <div className="mt-6 grid grid-cols-2 gap-3" aria-label="Engagement artifacts">
            {ARTIFACTS.map(([t, s]) => (
              <div key={t} className="rounded-lg border border-line bg-obsidian p-3"><p className="font-semibold text-sm">{t}</p><p className="font-mono text-[11px] text-dim mt-1">{s}</p></div>
            ))}
          </div>
        </div>
        <ol className="lg:col-span-7 reveal grid gap-3">
          {APPROACH.map((s, i) => {
            const last = i === APPROACH.length - 1;
            return (
              <li key={s.title} className={`flex gap-4 rounded-xl border p-5 ${last ? 'border-neon/30 bg-neon/5' : 'border-line bg-panel'}`}>
                <span className={`font-mono text-sm pt-0.5 ${last ? 'text-neon' : 'text-cyan'}`}>0{i + 1}</span>
                <div><h3 className="font-semibold">{s.title}</h3><p className="mt-1 text-sm text-muted">{s.body}</p></div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="border-y border-line bg-obsidian/60 cv-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="reveal">
          <Kicker>04 / capabilities</Kicker>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Depth where it matters. Context where it counts.</h2>
          <p className="mt-3 text-muted max-w-2xl">The work spans the application, the API behind it, the device in front of it, and the perimeter around it. The common thread is understanding how the pieces trust each other.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {CAPABILITIES.map((c) => (
            <article key={c.title} className="reveal rounded-xl border border-line bg-panel p-5 sm:p-6">
              <h3 className="font-semibold text-lg"><span className={`font-mono ${c.color}`} aria-hidden="true">▸</span> {c.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{c.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">{c.items.map((i) => <li key={i} className="font-mono text-[11px] px-2 py-1 rounded bg-obsidian border border-line text-fg/90">{i}</li>)}</ul>
            </article>
          ))}
        </div>

        <div id="practice" className="mt-10 reveal rounded-xl border border-line bg-panel overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Fifty-plus engagements. One standard.</h3>
              <span className="font-mono text-xs text-dim">practice ledger</span>
            </div>
            <p className="mt-2 text-sm text-muted max-w-3xl">A representative slice of the work. The scope changes; the discipline does not: understand the system, prove the path, document the repair, verify the result.</p>
          </div>
          <div className="overflow-x-auto thin-scroll">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="text-left text-dim font-mono text-xs uppercase"><tr><th scope="col" className="px-5 py-3 font-medium">Domain</th><th scope="col" className="px-5 py-3 font-medium">What I test</th><th scope="col" className="px-5 py-3 font-medium">Outcome pattern</th></tr></thead>
              <tbody className="divide-y divide-line">
                {LEDGER.map((r) => (
                  <tr key={r[0]} className="hover:bg-obsidian/60">
                    <th scope="row" className="px-5 py-4 text-left font-semibold whitespace-nowrap align-top">{r[0]}</th>
                    <td className="px-5 py-4 text-muted align-top">{r[1]}</td>
                    <td className="px-5 py-4 align-top"><span className="inline-flex items-center gap-2 whitespace-nowrap"><Check />{r[2]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-5 py-4 border-t border-line text-sm text-muted flex gap-3">
            <Icon.lock size={18} className="shrink-0 text-amber mt-0.5" />
            <span><strong className="text-fg">Why the details are withheld.</strong> Most engagements are under NDA, and several involve state-level infrastructure. Public case studies are sanitized; redacted reports and references are available under NDA.</span>
          </p>
        </div>

        <div className="mt-6 reveal">
          <p className="font-mono text-xs uppercase tracking-widest text-dim">Daily toolbelt</p>
          <ul className="mt-3 flex flex-wrap gap-2">{TOOLBELT.map((t) => <li key={t} className="font-mono text-xs px-3 h-9 inline-flex items-center rounded-md border border-line bg-panel text-muted">{t}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 cv-auto">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 reveal">
          <Kicker>05 / about</Kicker>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Offensive by trade. Useful by design.</h2>
          <p className="mt-3 text-muted">I started in web application testing and followed the interesting problems into APIs, Android internals, external attack surfaces, and vulnerability research. The thread through all of it is the same: understand why the system trusts something it shouldn&rsquo;t.</p>
          <dl className="mt-8 rounded-xl border border-line bg-panel divide-y divide-line text-sm">
            {[['Based in', 'Islamabad, Pakistan'], ['Working', 'Remote worldwide'], ['Certification', 'CRTA — CyberWarFare Labs'], ['References', 'Available under NDA']].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3"><dt className="text-muted">{k}</dt><dd className="font-semibold text-right">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {PRINCIPLES.map(([t, d]) => (
              <div key={t} className="rounded-lg border border-line bg-obsidian p-4"><p className="font-semibold text-sm">{t}</p><p className="text-xs text-muted mt-1">{d}</p></div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 reveal">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>I&rsquo;m <strong className="text-fg">Okasha Mehmood</strong>, a penetration tester and reverse engineer with <strong className="text-fg">three-plus years</strong> of specialised offensive security experience and <strong className="text-fg">50+ completed engagements</strong>. I&rsquo;ve worked with national telecom and regulatory environments, multi-tenant legal SaaS, financial services, logistics, identity platforms, and enterprise member portals.</p>
            <p>My favourite part of the job is the handoff. Finding the bug is necessary; explaining it clearly enough that a busy engineering team can fix it correctly is what makes the work matter. I write for two audiences at once — the executive who needs the risk, and the developer who needs the exact change.</p>
          </div>

          <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-dim">Experience</h3>
          <ol className="mt-4 relative border-l border-line ml-1.5 space-y-6">
            {EXPERIENCE.map((x) => (
              <li key={x.date + x.role} className="pl-6 relative">
                <span className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 ${x.current ? 'border-neon bg-neon/30' : 'border-line bg-ink'}`} aria-hidden="true" />
                <p className={`font-mono text-xs ${x.current ? 'text-neon' : 'text-dim'}`}>{x.date}</p>
                <h4 className="mt-1 font-semibold">{x.role} <span className="text-muted font-normal">· {x.org}</span></h4>
                <p className="mt-1 text-sm text-muted">{x.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 font-mono text-xs uppercase tracking-widest text-dim">Credentials &amp; education</h3>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3">
            {CREDENTIALS.map((c) => (
              <li key={c.name} className={`flex items-start gap-3 rounded-lg border p-4 ${c.primary ? 'border-neon/40 bg-neon/5' : 'border-line bg-panel'}`}>
                <Icon.cap className={`${c.primary ? 'text-neon' : 'text-dim'} mt-0.5 shrink-0`} />
                <span><span className="block font-semibold text-sm">{c.name}</span><span className="block text-xs text-muted mt-0.5">{c.issuer}</span></span>
              </li>
            ))}
          </ul>
          <Link to="/resume.html" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neon hover:underline">View the one-page CV <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}

function Writing() {
  return (
    <section id="writing" className="border-y border-line bg-obsidian/60 cv-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <Kicker>06 / field_notes</Kicker>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Notes from the work.</h2>
            <p className="mt-3 text-muted max-w-xl">Short, practical write-ups on the patterns behind the findings — written for the people who have to defend, build, or review the same systems.</p>
          </div>
          <Link to="/blog/" className={btn.small}>All notes →</Link>
        </div>
        <ul className="mt-10 grid md:grid-cols-3 gap-5">
          {NOTES.slice(0, 3).map((n) => (
            <li key={n.slug} className="reveal">
              <Link to={postPath(n.slug)} className="group h-full flex flex-col rounded-xl border border-line bg-panel p-5 hover:border-neon/40 hover:-translate-y-0.5 transition">
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-dim"><span>{n.cat}</span><span>{n.mins} min read</span></div>
                <h3 className="mt-4 font-semibold text-lg leading-snug group-hover:text-neon">{n.title}</h3>
                <p className="mt-2 text-sm text-muted flex-1">{n.home}</p>
                <p className="mt-5 font-mono text-xs text-neon">Read the note →</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  const [pkt, setPkt] = useState('PKT');
  useEffect(() => {
    const fmt = () => {
      try { setPkt(`${new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' }).format(new Date())} PKT`); } catch { /* keep label */ }
    };
    fmt();
    const t = setInterval(fmt, 30000);
    return () => clearInterval(t);
  }, []);
  const rows = [
    ['Email', SITE.email, `mailto:${SITE.email}`],
    ['LinkedIn', 'okasha-mehmood', SITE.linkedin],
    ['Phone', SITE.phone, `tel:${SITE.tel}`],
    ['WhatsApp', SITE.phone, SITE.whatsapp],
  ];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6 reveal">
          <Kicker>07 / contact</Kicker>
          <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">Have a system that needs a <span className="text-neon">serious</span> look?</h2>
          <p className="mt-4 text-muted">I&rsquo;m open to senior penetration testing, application security, and security engineering roles — plus a small number of remote consulting engagements. If you need someone who can test deeply, write clearly, and stay through the fix, let&rsquo;s talk.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={MAILTO_ENGAGEMENT} className={btn.primary}>Email me</a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className={btn.ghost}>LinkedIn ↗</a>
            <a href={SITE.cv} download className={btn.ghost}>Download CV</a>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 rounded-full bg-neon" aria-hidden="true" /> Available for select work · replies within one business day</p>
        </div>

        <aside className="lg:col-span-6 reveal rounded-xl border border-line bg-panel overflow-hidden" aria-label="Contact details">
          <div className="flex items-center justify-between px-5 h-12 border-b border-line">
            <span className="font-mono text-xs text-dim">direct_line</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-neon/30 text-neon">OPEN</span>
          </div>
          <ul className="divide-y divide-line">
            {rows.map(([k, v, href]) => (
              <li key={k}>
                <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-obsidian/60">
                  <span><span className="block font-mono text-[11px] uppercase text-dim">{k}</span><span className="block font-semibold break-all">{v}</span></span>
                  <span className="text-dim" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 px-5 py-4">
              <span><span className="block font-mono text-[11px] uppercase text-dim">Location</span><span className="block font-semibold">Islamabad, PK · remote worldwide</span></span>
              <span className="font-mono text-xs text-muted whitespace-nowrap">{pkt}</span>
            </li>
          </ul>
          <p className="px-5 py-4 border-t border-line text-xs text-muted">Prefer email for first contact. Redacted reports and professional references are available under NDA.</p>
        </aside>
      </div>
    </section>
  );
}

export default function Home() {
  useReveal('home');
  return (
    <Layout section="home">
      <Hero />
      <Work />
      <Report />
      <Approach />
      <Capabilities />
      <About />
      <Writing />
      <Contact />
    </Layout>
  );
}
