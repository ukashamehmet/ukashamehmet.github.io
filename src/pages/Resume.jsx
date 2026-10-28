import { Link } from 'react-router-dom';
import { SITE, EXPERIENCE } from '../data/site.js';
import { Icon } from '../lib/ui.jsx';

const IMPACT = [['50+', 'Confidential security engagements'], ['7', 'Sectors tested'], ['3+', 'Years in offensive security'], ['0', 'Client records retained']];

const ENGAGEMENTS = [
  ['Multi-tenant SaaS · cross-tenant BOLA', 'Proved cross-organization read/write access; enforced tenant scope at the query layer and retested 40+ object routes before a SOC 2 audit.'],
  ['National telecom · LFI + SQL injection', 'Confirmed path traversal and injection in public portals with minimal evidence; drove canonicalisation, parameterised queries, privilege reduction, and segmentation.'],
  ['External perimeter · WAF bypass', 'Exposed direct-to-origin access and public management planes; reduced observable attack surface by 78% with origin locking, ZTNA, and asset ownership.'],
  ['Android malware · rogue VPN', 'Reversed a dropper abusing VpnService, reconstructed the second-stage loader, and delivered YARA, Sigma, and MDM controls for the fleet.'],
];

const SKILLS = [
  ['App & API', 'BOLA/BFLA, auth/session, SSRF, file upload, deserialization, business logic, GraphQL, OWASP WSTG/API Top 10'],
  ['Mobile & RE', 'Android, Jadx, Apktool, Frida, SSL pinning, root detection, crypto protocols, native analysis, MASTG/MASVS'],
  ['Network & ASM', 'External footprint, origin exposure, WAF bypass, exposed management planes, segmentation, TLS, ZTNA, OSINT'],
  ['Tooling & delivery', 'Burp Suite Pro, Nmap, Masscan, Amass, ffuf, SQLmap, Wireshark, Python, Bash, PowerShell, CVSS, MITRE ATT&CK'],
];

const EDUCATION = [
  ['BSc Computer Science', 'University of Science & Technology · 2023 · GPA 3.3/4.0'],
  ['Certified Red Team Analyst (CRTA)', 'CyberWarFare Labs'],
  ['Cybersecurity Specialist', 'NAVTTC'],
  ['Python for Cybersecurity', 'Cybrary'],
];

const H2 = ({ children }) => <h2 className="font-mono text-xs uppercase tracking-widest text-neon print:text-slate-900 border-b border-line print:border-slate-300 pb-2">{children}</h2>;

export default function Resume() {
  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 print:p-0 print:text-slate-900">
      <div className="no-print mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-neon"><Icon.back size={16} /> Back to portfolio</Link>
        <div className="flex gap-2">
          <a href={SITE.cv} download className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-line text-sm font-semibold hover:border-neon/40"><Icon.download size={16} /> PDF</a>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-neon text-ink text-sm font-semibold hover:bg-neon/90"><Icon.print size={16} /> Print / Save as PDF</button>
        </div>
      </div>

      <main className="cv-sheet mx-auto max-w-4xl rounded-xl border border-line bg-panel print:bg-white shadow-2xl shadow-black/40 p-6 sm:p-10 grid gap-8">
        <header className="flex flex-wrap justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-dim print:text-slate-500">Curriculum vitae / 2026</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Okasha Mehmood</h1>
            <p className="mt-2 text-muted print:text-slate-700">Penetration Tester · API Security · Mobile Reverse Engineering</p>
          </div>
          <address className="not-italic text-sm grid gap-1 text-muted print:text-slate-700 sm:text-right">
            <span><strong className="text-fg print:text-slate-900">Islamabad, Pakistan</strong> · remote worldwide</span>
            <a className="hover:text-neon" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a className="hover:text-neon" href={`tel:${SITE.tel}`}>{SITE.phone}</a>
            <a className="hover:text-neon" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/okasha-mehmood</a>
          </address>
        </header>

        <section className="grid sm:grid-cols-3 gap-5">
          <p className="sm:col-span-2 text-sm leading-relaxed text-muted print:text-slate-700">
            <strong className="text-fg print:text-slate-900">Offensive security engineer with 3+ years of specialised experience and 50+ confidential engagements</strong> across government-adjacent, telecom, fintech, SaaS, legal, logistics, and identity environments. I test web, API, mobile, and network systems, then work with engineering teams through remediation and retest. Known for clear reporting, careful evidence handling, and findings that become shipped fixes.
          </p>
          <div className="rounded-lg border border-neon/30 bg-neon/5 print:bg-white p-4 text-sm">
            <p className="font-mono text-[11px] uppercase text-dim">Availability</p>
            <p className="mt-1 font-semibold">Senior roles &amp; select contracts</p>
            <p className="mt-1 text-xs text-muted print:text-slate-600">Remote worldwide. References and redacted reports available under NDA.</p>
          </div>
        </section>

        <section>
          <H2>Selected impact</H2>
          <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {IMPACT.map(([v, l]) => (
              <div key={l} className="flex flex-col-reverse rounded-lg border border-line print:border-slate-300 bg-obsidian print:bg-white p-3">
                <dt className="text-xs text-muted print:text-slate-600">{l}</dt><dd className="font-mono text-2xl font-bold text-neon print:text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <H2>Experience</H2>
          <div className="mt-4 grid gap-5">
            {EXPERIENCE.map((x) => (
              <article key={x.date + x.role} className="grid sm:grid-cols-4 gap-2">
                <div className="font-mono text-xs">
                  <p className={x.current ? 'text-neon print:text-slate-900' : 'text-dim'}>{x.date}</p>
                  <p className="text-dim mt-0.5">{x.place}</p>
                  {x.current && <p className="mt-1 inline-block px-1.5 rounded border border-neon/30 text-neon text-[10px]">Current</p>}
                </div>
                <div className="sm:col-span-3">
                  <h3 className="font-semibold">{x.role} <span className="text-muted print:text-slate-600 font-normal">· {x.org}</span></h3>
                  <ul className="mt-1 grid gap-1 text-sm text-muted print:text-slate-700">
                    {x.cv.map((b) => <li key={b} className="flex gap-2"><span className="text-neon font-mono" aria-hidden="true">▸</span>{b}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <H2>Selected engagements</H2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {ENGAGEMENTS.map(([t, d]) => (
              <div key={t} className="rounded-lg border border-line print:border-slate-300 p-4 text-sm">
                <p className="font-semibold">{t}</p><p className="mt-1 text-muted print:text-slate-700">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <H2>Technical capabilities</H2>
          <dl className="mt-4 grid gap-2 text-sm">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="grid sm:grid-cols-4 gap-1"><dt className="font-semibold">{k}</dt><dd className="sm:col-span-3 text-muted print:text-slate-700">{v}</dd></div>
            ))}
          </dl>
        </section>

        <section>
          <H2>Education &amp; certifications</H2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            {EDUCATION.map(([t, d]) => <li key={t}><strong className="block">{t}</strong><span className="text-muted print:text-slate-700">{d}</span></li>)}
          </ul>
        </section>

        <footer className="pt-5 border-t border-line print:border-slate-300 grid sm:grid-cols-2 gap-3 text-xs text-muted print:text-slate-600">
          <p><strong className="text-fg print:text-slate-900">Confidentiality:</strong> client names, domains, IPs, and data are withheld from this CV and the portfolio.</p>
          <p><strong className="text-fg print:text-slate-900">Portfolio &amp; references:</strong> available on request · full case studies online.</p>
        </footer>
      </main>
    </div>
  );
}
