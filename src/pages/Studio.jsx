import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Toaster, toast, copyText } from '../lib/ui.jsx';

/* Local-only authoring companion (ported from the original /admin/ page).
   State lives in this browser's localStorage; nothing is sent anywhere. */

const STORAGE_KEY = 'om-studio-v1';

const P = (id, title, category, severity, summary, tags) => ({ id, title, slug: `projects/#${id}`, category, severity, status: 'Published', summary, tags, confidential: true });
const DEFAULTS = {
  profile: { name: 'Okasha Mehmood', role: 'Penetration Tester & Reverse Engineer', location: 'Islamabad, Pakistan', availability: 'Open to senior roles & remote contracts' },
  projects: [
    P('saas-bola', 'One query, every tenant', 'Web & API', 'Critical', 'Cross-tenant BOLA in a multi-tenant case-management platform.', 'BOLA, multi-tenant, Django REST'),
    P('member-portal', 'The debug folder that opened the front door', 'Web', 'Critical', 'Session hijacking and file-upload RCE in a member portal.', 'session, upload, WAF bypass'),
    P('logistics-perimeter', 'The WAF was never the wall', 'Network', 'High', 'Origin exposure and management-plane sprawl across a hybrid estate.', 'ASM, origin exposure, ZTNA'),
    P('telecom-perimeter', 'When a CMS becomes a doorway', 'Network', 'Critical', 'Path traversal and SQL injection across a national telecom perimeter.', 'LFI, SQLi, telecom'),
    P('mobile-crypto', 'Reading the envelope', 'Mobile & API', 'High', 'Reversing a proprietary mobile API encryption scheme and finding the replay gap.', 'Frida, Android, crypto'),
    P('android-rat', 'The app that became the network', 'Mobile / RE', 'Critical', 'Inside an Android dropper abusing VpnService for on-device interception.', 'Android, malware, VpnService'),
    P('cicd-rce', 'Trust, but deserialize', 'Research', 'Critical', 'An unauthenticated object-injection path in a CI/CD agent control plane.', 'XStream, deserialization, CI/CD'),
    P('cms-upload-rce', "The extension filter that wasn't", 'Research', 'Critical', 'A case-normalization bypass that turned a media upload into remote code execution.', 'upload, RCE, canonicalization'),
    P('mobile-oauth-recovery', 'Obfuscation is not encryption', 'Mobile / RE', 'High', 'Recovering embedded OAuth 1.0a consumer credentials from an Android client through static analysis.', 'apktool / Smali, OAuth 1.0a, HMAC-SHA1, static analysis'),
  ],
  posts: [
    { id: 'tenant-boundaries', title: 'The tenant boundary is a query, not a checkbox', slug: 'blog/posts/tenant-boundaries.html', category: 'Application security', status: 'Published', summary: 'A practical model for testing multi-tenant authorization — and fixing it at the data layer.' },
    { id: 'waf-origin', title: 'Your WAF only protects the hostname', slug: 'blog/posts/waf-origin.html', category: 'Network & cloud', status: 'Published', summary: 'Origin exposure is still one of the most reliable ways around an edge control.' },
    { id: 'android-vpn', title: 'What a rogue VPN service looks like from the inside', slug: 'blog/posts/android-vpn.html', category: 'Mobile reversing', status: 'Published', summary: 'Static and dynamic signals from an Android dropper that turns the device into the network.' },
    { id: 'findings-engineers-fix', title: 'Write findings engineers can actually fix', slug: 'blog/posts/findings-engineers-fix.html', category: 'Security craft', status: 'Published', summary: 'A report is a handoff, not a scoreboard. A lightweight structure for findings that ship.' },
  ],
  checklist: [
    { id: 'names', label: 'Client names removed', note: 'No organization, product, or domain names remain.' },
    { id: 'network', label: 'Network identifiers removed', note: 'No IPs, CIDRs, hostnames, ASNs, or C2 indicators.' },
    { id: 'data', label: 'Client data removed', note: 'No PII, secrets, tokens, screenshots, or raw records.' },
    { id: 'claims', label: 'Claims verified', note: 'Every metric and outcome is supported by engagement records.' },
    { id: 'links', label: 'Links and metadata checked', note: 'Navigation, canonical metadata, and contact links work.' },
  ],
  activity: [
    { text: 'Case study updated: One query, every tenant', time: 'Today' },
    { text: 'Confidentiality checklist reviewed', time: 'Yesterday' },
    { text: 'New draft: Write findings engineers can actually fix', time: '3 days ago' },
  ],
};

const VIEWS = {
  overview: ['Overview', "A local read-out of the portfolio's content and launch checklist."],
  projects: ['Case studies', 'Edit the public project index, status, and disclosure flags.'],
  writing: ['Writing', 'Manage article metadata and publication state.'],
  publish: ['Publish', 'Run the confidentiality and quality checks before exporting.'],
};

const clone = (v) => JSON.parse(JSON.stringify(v));
const merge = (parsed) => ({
  ...clone(DEFAULTS), ...parsed,
  profile: { ...DEFAULTS.profile, ...(parsed.profile || {}) },
  projects: Array.isArray(parsed.projects) ? parsed.projects : clone(DEFAULTS.projects),
  posts: Array.isArray(parsed.posts) ? parsed.posts : clone(DEFAULTS.posts),
  checklist: Array.isArray(parsed.checklist) ? parsed.checklist : clone(DEFAULTS.checklist),
  activity: Array.isArray(parsed.activity) ? parsed.activity : clone(DEFAULTS.activity),
});
function load() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? merge(JSON.parse(s)) : clone(DEFAULTS); } catch { return clone(DEFAULTS); }
}

const PILL = { published: 'text-neon border-neon/40 bg-neon/10', review: 'text-cyan border-cyan/40 bg-cyan/10', draft: 'text-muted border-line', critical: 'text-[#FF8FA3] border-crit/40 bg-crit/15', high: 'text-amber border-amber/40 bg-amber/10', medium: 'text-cyan border-cyan/40 bg-cyan/10' };
const pillClass = (v) => {
  const s = String(v || '').toLowerCase();
  const k = ['publish', 'review', 'draft', 'critical', 'high', 'medium'].find((x) => s.includes(x)) || 'draft';
  return PILL[k === 'publish' ? 'published' : k];
};
const Pill = ({ v }) => <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${pillClass(v)}`}>{v}</span>;

const input = 'w-full h-11 rounded-md border border-line bg-obsidian px-3 text-sm text-fg placeholder:text-dim focus:border-neon/50 outline-none';
const card = 'rounded-xl border border-line bg-panel';
const smallBtn = 'inline-flex items-center gap-2 h-10 px-4 rounded-md border border-line text-sm font-semibold hover:border-neon/40';
const primaryBtn = 'inline-flex items-center gap-2 h-10 px-4 rounded-md bg-neon text-ink text-sm font-semibold hover:bg-neon/90';

function Checklist({ items, onCheck }) {
  return (
    <div className="grid gap-2">
      {items.map((c) => (
        <label key={c.id} className="flex gap-3 items-start rounded-lg border border-line bg-obsidian p-3 cursor-pointer hover:border-neon/30">
          <input type="checkbox" className="mt-1 accent-[#00FF87] h-4 w-4" checked={!!c.checked} onChange={(e) => onCheck(c.id, e.target.checked)} />
          <span><strong className="block text-sm">{c.label}</strong><span className="text-xs text-muted">{c.note}</span></span>
        </label>
      ))}
    </div>
  );
}

function EditDialog({ kind, item, onClose, onSave }) {
  const ref = useRef(null);
  const isProject = kind === 'project';
  const [f, setF] = useState(() => item || (isProject
    ? { title: '', slug: '', category: 'Web & API', severity: 'High', status: 'Draft', summary: '', tags: '', confidential: true }
    : { title: '', slug: '', category: 'Application security', status: 'Draft', summary: '' }));
  useEffect(() => { ref.current?.showModal(); }, []);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.title.trim()) return;
    const id = item?.id || `${kind}-${Date.now()}`;
    onSave({ ...f, id, title: f.title.trim(), summary: f.summary.trim(), slug: f.slug.trim() || (isProject ? `projects/#${item?.id || 'new-case'}` : '') });
  };
  const label = 'block font-mono text-[11px] uppercase text-dim mb-1.5';
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}
      className="backdrop:bg-black/70 bg-panel text-fg border border-line rounded-xl p-0 w-[min(560px,calc(100vw-2rem))]" aria-labelledby="dlg-title">
      <form onSubmit={submit}>
        <div className="flex items-center justify-between px-5 h-14 border-b border-line">
          <h2 id="dlg-title" className="font-semibold">{item ? `Edit ${isProject ? 'case study' : 'article'}` : `New ${isProject ? 'case study' : 'article'}`}</h2>
          <button type="button" onClick={() => ref.current.close()} aria-label="Close dialog" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-line"><Icon.close size={16} /></button>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={label} htmlFor="f-title">Title</label>
            <input id="f-title" className={input} value={f.title} onChange={set('title')} required maxLength={isProject ? 120 : 140} placeholder={isProject ? 'One query, every tenant' : 'The tenant boundary is a query, not a checkbox'} /></div>
          <div className="sm:col-span-2"><label className={label} htmlFor="f-slug">{isProject ? 'Link / anchor' : 'File path'}</label>
            <input id="f-slug" className={input} value={f.slug} onChange={set('slug')} placeholder={isProject ? 'projects/#new-case' : 'blog/posts/new-note.html'} /></div>
          <div><label className={label} htmlFor="f-cat">{isProject ? 'Category' : 'Topic'}</label>
            <select id="f-cat" className={input} value={f.category} onChange={set('category')}>
              {(isProject ? ['Web & API', 'Web', 'API', 'Network', 'Mobile & API', 'Mobile / RE', 'Research'] : ['Application security', 'Network & cloud', 'Mobile reversing', 'Security craft', 'Vulnerability research']).map((o) => <option key={o}>{o}</option>)}
            </select></div>
          {isProject && <div><label className={label} htmlFor="f-sev">Severity</label>
            <select id="f-sev" className={input} value={f.severity} onChange={set('severity')}>{['Critical', 'High', 'Medium', 'Low'].map((o) => <option key={o}>{o}</option>)}</select></div>}
          <div><label className={label} htmlFor="f-status">Status</label>
            <select id="f-status" className={input} value={f.status} onChange={set('status')}>{['Draft', 'Review', 'Published'].map((o) => <option key={o}>{o}</option>)}</select></div>
          <div className="sm:col-span-2"><label className={label} htmlFor="f-sum">Summary</label>
            <textarea id="f-sum" className={`${input} h-24 py-2`} value={f.summary} onChange={set('summary')} maxLength={280} placeholder={isProject ? 'One or two sentences. What failed, and what changed?' : 'One or two sentences. What will the reader learn?'} /></div>
          {isProject && <>
            <div className="sm:col-span-2"><label className={label} htmlFor="f-tags">Tags</label>
              <input id="f-tags" className={input} value={f.tags} onChange={set('tags')} placeholder="BOLA, Django REST, authorization" /></div>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-[#00FF87] h-4 w-4" checked={f.confidential} onChange={set('confidential')} />
              Confidential engagement — public write-up must remain sanitized
            </label>
          </>}
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-line">
          <button type="button" className={smallBtn} onClick={() => ref.current.close()}>Cancel</button>
          <button type="submit" className={primaryBtn}>Save draft</button>
        </div>
      </form>
    </dialog>
  );
}

export default function Studio() {
  const [state, setState] = useState(() => clone(DEFAULTS));
  const [view, setView] = useState('overview');
  const [query, setQuery] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const [dialog, setDialog] = useState(null); // { kind, item }
  const importRef = useRef(null);

  useEffect(() => {
    setState(load());
    const fromHash = () => { const v = window.location.hash.slice(1); setView(VIEWS[v] ? v : 'overview'); };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const commit = (next, activity) => {
    const s = activity ? { ...next, activity: [{ text: activity, time: 'Just now' }, ...next.activity].slice(0, 8) } : next;
    setState(s);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); toast('Saved locally in this browser.'); } catch { toast('This browser could not save locally.', 'error'); }
  };

  const go = (v) => { setView(v); setSidebar(false); window.history.replaceState(null, '', `#${v}`); };

  const exportState = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), note: 'Local authoring data only. Review before publishing.', ...state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'okasha-portfolio-content.json';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    toast('Content exported as JSON.');
  };
  const importState = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.posts)) throw new Error('Invalid content file.');
      commit(merge(parsed), 'Content imported from JSON');
      toast('Content imported.');
    } catch { toast('That file is not a valid content export.', 'error'); } finally { e.target.value = ''; }
  };
  const reset = () => {
    if (!window.confirm('Reset this local studio to the shipped defaults? Your browser-only edits will be replaced.')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* nothing stored */ }
    setState(clone(DEFAULTS));
    toast('Studio reset to shipped defaults.');
  };
  const onCheck = (id, checked) => commit({ ...state, checklist: state.checklist.map((c) => (c.id === id ? { ...c, checked } : c)) });

  const saveItem = (kind, item) => {
    const key = kind === 'project' ? 'projects' : 'posts';
    const exists = state[key].some((x) => x.id === item.id);
    const list = exists ? state[key].map((x) => (x.id === item.id ? item : x)) : [item, ...state[key]];
    const noun = kind === 'project' ? 'Case study' : 'Article';
    commit({ ...state, [key]: list }, `${noun} ${exists ? 'updated' : 'created'}: ${item.title}`);
    setDialog(null);
  };
  const deleteItem = (kind, item) => {
    if (!window.confirm(`Delete “${item.title}” from this local draft?`)) return;
    const key = kind === 'project' ? 'projects' : 'posts';
    commit({ ...state, [key]: state[key].filter((x) => x.id !== item.id) }, `${kind === 'project' ? 'Case study' : 'Article'} deleted: ${item.title}`);
  };

  const checked = state.checklist.filter((c) => c.checked).length;
  const q = query.trim().toLowerCase();
  const projects = state.projects.filter((p) => !q || `${p.title} ${p.category} ${p.tags} ${p.summary}`.toLowerCase().includes(q));

  const rowActions = (kind, item) => (
    <div className="flex gap-1.5">
      <button type="button" onClick={() => setDialog({ kind, item })} aria-label={`Edit ${item.title}`} title="Edit" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-line hover:border-neon/40"><Icon.edit size={15} /></button>
      <button type="button" onClick={() => deleteItem(kind, item)} aria-label={`Delete ${item.title}`} title="Delete" className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-line text-[#FF8FA3] hover:border-crit/50"><Icon.trash size={15} /></button>
    </div>
  );

  const NAV = [['overview', 'Overview'], ['projects', 'Case studies'], ['writing', 'Writing'], ['publish', 'Publish']];

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-neon focus:text-ink focus:px-3 focus:py-2 focus:rounded">Skip to studio</a>
      <aside aria-label="Studio navigation" className={`${sidebar ? 'fixed inset-0 z-40 block' : 'hidden'} lg:static lg:block border-r border-line bg-obsidian p-5`}>
        <div className="lg:sticky lg:top-5 grid gap-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" aria-label="Okasha Mehmood — portfolio home">
              <span className="h-9 w-9 rounded-md border border-neon/40 bg-neon/10 text-neon font-mono text-sm font-bold inline-flex items-center justify-center" aria-hidden="true">OM</span>
              <span className="leading-tight"><span className="block text-sm font-semibold">Okasha Mehmood</span><span className="block font-mono text-[11px] text-dim">content studio</span></span>
            </Link>
            <button type="button" onClick={() => setSidebar(false)} className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-md border border-line" aria-label="Close studio menu"><Icon.close size={18} /></button>
          </div>
          <nav aria-label="Studio sections" className="grid gap-1 text-sm">
            {NAV.map(([k, l]) => (
              <button key={k} type="button" onClick={() => go(k)} aria-current={view === k ? 'page' : undefined}
                className={`text-left h-10 px-3 rounded-md ${view === k ? 'bg-neon/10 text-neon border border-neon/30' : 'text-muted hover:text-fg border border-transparent'}`}>{l}</button>
            ))}
            <a href="/" target="_blank" rel="noopener" className="h-10 px-3 inline-flex items-center rounded-md text-muted hover:text-fg">View live site ↗</a>
          </nav>
          <p className="rounded-lg border border-amber/30 bg-amber/5 p-3 text-xs text-muted"><strong className="block text-amber mb-1">Local-only tool</strong>Nothing here is sent to a server. Do not enter client data, credentials, or secrets. This page is excluded from search indexing but is not an authentication boundary.</p>
        </div>
      </aside>

      <div id="admin-main" className="min-w-0 p-4 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button type="button" onClick={() => setSidebar(true)} className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-md border border-line" aria-label="Open studio menu"><Icon.menu size={18} /></button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{VIEWS[view][0]}</h1>
              <p className="mt-1 text-sm text-muted">{VIEWS[view][1]}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" className={smallBtn} onClick={exportState}><Icon.download size={16} /> Export</button>
            <a href="/" target="_blank" rel="noopener" className={primaryBtn}>View site</a>
          </div>
        </div>

        {view === 'overview' && (
          <section className="mt-8 grid gap-5">
            <p className="flex gap-3 rounded-xl border border-line bg-panel p-4 text-sm text-muted"><Icon.doc size={18} className="shrink-0 text-cyan mt-0.5" />
              <span><strong className="text-fg">Authoring companion, not a CMS.</strong> The public site is a prerendered React build for GitHub Pages. This studio stores draft metadata in your browser and exports JSON for review. Changes here do not update the live site automatically. Always remove client identifiers before publishing.</span></p>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[['Case studies', state.projects.length, 'in the collection'], ['Published', state.projects.filter((p) => p.status === 'Published').length, 'public entries'], ['Field notes', state.posts.length, 'article entries'], ['Checks passed', `${checked}/${state.checklist.length}`, 'confidentiality']].map(([l, v, s]) => (
                <div key={l} className={`${card} p-4 flex flex-col-reverse`}><dt className="text-xs text-muted">{l} <span className="text-dim">· {s}</span></dt><dd className="font-mono text-3xl font-bold text-neon">{v}</dd></div>
              ))}
            </dl>
            <div className="grid lg:grid-cols-2 gap-5">
              <div className={`${card} p-5`}>
                <div className="flex justify-between"><h3 className="font-semibold">Portfolio at a glance</h3><span className="font-mono text-xs text-dim">Local draft</span></div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div><dt className="font-mono text-[11px] uppercase text-dim">Positioning</dt><dd className="mt-0.5">Offensive security, written for the people who fix it.</dd></div>
                  <div><dt className="font-mono text-[11px] uppercase text-dim">Primary proof</dt><dd className="mt-0.5">50+ confidential engagements across 7 sectors.</dd></div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-1.5">{['Sanitized case studies', 'NDA-safe', 'Static / GitHub Pages', 'No trackers'].map((t) => <li key={t} className="font-mono text-[11px] px-2 py-1 rounded bg-obsidian border border-line text-muted">{t}</li>)}</ul>
              </div>
              <div className={`${card} p-5`}>
                <div className="flex justify-between"><h3 className="font-semibold">Recent activity</h3><span className="font-mono text-xs text-dim">Local</span></div>
                <ul className="mt-4 grid gap-3 text-sm">
                  {state.activity.map((a, i) => <li key={i} className="flex gap-3"><span className="mt-1.5 h-2 w-2 rounded-full bg-neon shrink-0" aria-hidden="true" /><p>{a.text}<time className="block font-mono text-[11px] text-dim">{a.time}</time></p></li>)}
                </ul>
              </div>
              <div className={`${card} p-5`}>
                <div className="flex justify-between"><h3 className="font-semibold">Publish readiness</h3><span className="font-mono text-xs text-dim">Before export</span></div>
                <div className="mt-4"><Checklist items={state.checklist} onCheck={onCheck} /></div>
              </div>
              <div className={`${card} p-5 grid gap-3 text-sm text-muted content-start`}>
                <h3 className="font-semibold text-fg">Studio notes</h3>
                <p><strong className="text-fg">Not a login.</strong> This page has no authentication. It is intentionally excluded from navigation and marked <code className="font-mono text-xs">noindex</code>. Do not put sensitive material here.</p>
                <p><strong className="text-fg">No client data.</strong> Use placeholders for names, domains, IPs, tokens, and records. The public case studies are deliberately generalized.</p>
                <p><strong className="text-fg">How publishing works.</strong> Edit metadata, export JSON, review it, then update <code className="font-mono text-xs">src/data</code> and commit. GitHub Pages serves the rebuilt files.</p>
              </div>
            </div>
          </section>
        )}

        {view === 'projects' && (
          <section className="mt-8 grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-semibold">Collection</h2><p className="text-sm text-muted">Edit the public project index, status, and disclosure flags. Local changes only.</p></div>
              <div className="flex gap-2">
                <button type="button" className={smallBtn} onClick={exportState}>Export JSON</button>
                <button type="button" className={primaryBtn} onClick={() => setDialog({ kind: 'project' })}><Icon.plus size={16} /> New case study</button>
              </div>
            </div>
            <div className={`${card} overflow-hidden`}>
              <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold">Collection</h3>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search case studies" aria-label="Search case studies" className={`${input} sm:w-72`} />
              </div>
              <div className="overflow-x-auto thin-scroll">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="text-left text-dim font-mono text-xs uppercase"><tr>{['Title', 'Category', 'Severity', 'Status', 'NDA', 'Actions'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-line">
                    {projects.length ? projects.map((p) => (
                      <tr key={p.id} className="hover:bg-obsidian/60">
                        <td className="px-4 py-3"><span className="font-semibold">{p.title}</span><small className="block font-mono text-[11px] text-dim">{p.slug}</small></td>
                        <td className="px-4 py-3 text-muted">{p.category}</td>
                        <td className="px-4 py-3"><Pill v={p.severity} /></td>
                        <td className="px-4 py-3"><Pill v={p.status} /></td>
                        <td className="px-4 py-3 text-muted">{p.confidential ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-3">{rowActions('project', p)}</td>
                      </tr>
                    )) : <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No case studies match that search.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-dim">Deleting here only removes the local draft entry. It does not change the static site or any published file.</p>
          </section>
        )}

        {view === 'writing' && (
          <section className="mt-8 grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-semibold">Writing</h2><p className="text-sm text-muted">Manage article metadata and publication state.</p></div>
              <button type="button" className={primaryBtn} onClick={() => setDialog({ kind: 'post' })}><Icon.plus size={16} /> New article</button>
            </div>
            <div className={`${card} overflow-hidden`}>
              <div className="p-4 border-b border-line flex justify-between"><h3 className="font-semibold">Field notes</h3><span className="font-mono text-xs text-dim">Prerendered from src/data/posts.json</span></div>
              <div className="overflow-x-auto thin-scroll">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="text-left text-dim font-mono text-xs uppercase"><tr>{['Title', 'Topic', 'Status', 'Summary', 'Actions'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-line">
                    {state.posts.map((p) => (
                      <tr key={p.id} className="hover:bg-obsidian/60">
                        <td className="px-4 py-3"><span className="font-semibold">{p.title}</span><small className="block font-mono text-[11px] text-dim">{p.slug}</small></td>
                        <td className="px-4 py-3 text-muted">{p.category}</td>
                        <td className="px-4 py-3"><Pill v={p.status} /></td>
                        <td className="px-4 py-3 text-muted">{p.summary}</td>
                        <td className="px-4 py-3">{rowActions('post', p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-dim">Article content lives in <code className="font-mono">src/data/posts.json</code>. Editing metadata here does not generate a page; update the data file and this index together.</p>
          </section>
        )}

        {view === 'publish' && (
          <section className="mt-8 grid gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h2 className="font-semibold">Pre-flight checks</h2><p className="text-sm text-muted">Run the confidentiality and quality checks before exporting.</p></div>
              <div className="flex gap-2">
                <button type="button" className={smallBtn} onClick={() => copyText(JSON.stringify(state, null, 2), 'Content JSON copied.')}>Copy JSON</button>
                <button type="button" className={primaryBtn} onClick={exportState}>Export JSON</button>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              <div className={`${card} p-5`}>
                <div className="flex justify-between"><h3 className="font-semibold">Confidentiality checklist</h3><span className="font-mono text-xs text-amber">Required</span></div>
                <div className="mt-4"><Checklist items={state.checklist} onCheck={onCheck} /></div>
                <p className="mt-4 text-xs text-muted">The checklist is a prompt, not proof. Review the actual content line by line. If a claim cannot be supported by an engagement record, remove it.</p>
              </div>
              <div className="grid gap-5 content-start">
                <div className={`${card} p-5`}>
                  <h3 className="font-semibold">Content handoff</h3>
                  <p className="mt-2 text-sm text-muted">Export a dated JSON snapshot of the local authoring state. Use it to review changes, share metadata, or rebuild the static pages.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className={primaryBtn} onClick={exportState}>Download JSON</button>
                    <button type="button" className={smallBtn} onClick={() => importRef.current?.click()}>Import JSON</button>
                    <button type="button" className={smallBtn} onClick={() => copyText(JSON.stringify(state, null, 2), 'Content JSON copied.')}>Copy</button>
                    <input ref={importRef} type="file" accept="application/json" hidden onChange={importState} />
                  </div>
                  <p className="mt-4 text-xs text-muted"><strong className="text-fg">Static publish flow:</strong> export → review identifiers → update data → commit → let GitHub Pages rebuild. There is no server-side publish button, by design.</p>
                </div>
                <div className="rounded-xl border border-crit/40 bg-crit/5 p-5">
                  <div className="flex justify-between"><h3 className="font-semibold">Danger zone</h3><span className="font-mono text-xs text-[#FF8FA3]">Local only</span></div>
                  <p className="mt-2 text-sm text-muted">Reset the browser-stored studio state to the shipped defaults. This does not touch the public site.</p>
                  <button type="button" onClick={reset} className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-md border border-crit/50 text-[#FF8FA3] text-sm font-semibold hover:bg-crit/10">Reset local studio</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {dialog && <EditDialog kind={dialog.kind} item={dialog.item} onClose={() => setDialog(null)} onSave={(item) => saveItem(dialog.kind, item)} />}
      <noscript><p className="p-4 text-sm">This local studio needs JavaScript. The public portfolio works without it.</p></noscript>
      <Toaster />
    </div>
  );
}
