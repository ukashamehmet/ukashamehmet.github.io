import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SITE, HOME_CASES, CREDENTIALS, EXPERIENCE, CAPABILITIES, APPROACH, NOTES, postPath } from '../data/site.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (s, n) => esc(s) + ' '.repeat(Math.max(1, n - s.length));

const HELP = [
  ['whoami', 'who I am'], ['cases', 'sanitized case studies'], ['certs', 'credentials & education'],
  ['experience', "where I've worked"], ['skills', 'capabilities & toolbelt'], ['approach', 'how an engagement runs'],
  ['notes', 'field notes'], ['contact', 'how to reach me'], ['cv', 'download my CV'], ['clear', 'clear screen'],
];

const CMDS = {
  help: () => `<span class="text-fg">available commands</span>\n  ${HELP.map(([c, d]) => `<span class="text-neon">${pad(c, 11)}</span>${esc(d)}`).join('\n  ')}`,
  whoami: () => `<span class="text-fg">${esc(SITE.name)}</span>\n${esc(SITE.role)}\n${esc(SITE.location)}\n3+ yrs offensive security · 50+ engagements`,
  cases: () => HOME_CASES.map((c) => `<span class="text-cyan">${c.no}</span> ${pad(c.sev, 9)}<span class="text-fg">${esc(c.title)}</span>`).join('\n')
    + '\n<a class="text-neon underline" href="/projects/">→ all 10 case studies</a>',
  certs: () => CREDENTIALS.map((c) => `<span class="text-neon">[✓]</span> ${esc(c.name)} <span class="text-dim">— ${esc(c.issuer)}</span>`).join('\n'),
  experience: () => EXPERIENCE.map((x) => `<span class="text-amber">${esc(x.date)}</span>\n  ${esc(x.role)} · ${esc(x.org)}`).join('\n'),
  skills: () => CAPABILITIES.map((c) => `<span class="text-amber">${esc(c.title)}:</span> ${esc(c.items.slice(0, 5).join(', '))}`).join('\n'),
  approach: () => APPROACH.map((s, i) => `<span class="text-cyan">0${i + 1}</span> ${esc(s.title.toLowerCase())}`).join('\n'),
  notes: () => NOTES.map((n) => `<a class="text-cyan underline" href="${postPath(n.slug)}">${esc(n.title)}</a> <span class="text-dim">${n.mins}m</span>`).join('\n'),
  contact: () => `email     <a class="text-cyan underline" href="mailto:${SITE.email}">${SITE.email}</a>\nlinkedin  <a class="text-cyan underline" href="${SITE.linkedin}" target="_blank" rel="noopener">okasha-mehmood</a>\nphone     ${esc(SITE.phone)}`,
  cv: () => { setTimeout(() => { window.location.href = SITE.cv; }, 400); return 'fetching Okasha-Mehmood-CV.pdf … <span class="text-neon">ok</span>'; },
  ls: () => 'cases/  notes/  cv.pdf  approach.md  contact.txt',
  'cat contact.txt': () => CMDS.contact(),
  'cat approach.md': () => CMDS.approach(),
};

const BOOT = [
  ['<span class="text-neon">$</span> verify --scope production', 'text-muted'],
  ['<span class="text-neon">[ok]</span> rules of engagement signed', 'text-muted'],
  ['<span class="text-amber">[!]</span>  authorization boundary crossed', 'text-muted'],
  ['<span class="text-neon">[ok]</span> fix validated · retest clean', 'text-muted'],
  ['\nType <span class="text-neon">help</span> or tap a command below.', 'text-muted'],
];

export default function Terminal() {
  const [lines, setLines] = useState(BOOT);
  const [value, setValue] = useState('');
  const hist = useRef([]); const hIdx = useRef(0);
  const out = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { out.current.scrollTop = out.current.scrollHeight; }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    hist.current.push(raw); hIdx.current = hist.current.length;
    if (cmd === 'clear') { setLines([]); return; }
    const echo = [`<span class="text-neon">guest@okasha:~$</span> <span class="text-fg">${esc(raw)}</span>`, 'text-muted'];
    let res;
    if (cmd.startsWith('sudo')) res = ['<span class="text-crit">permission denied — out of scope. this attempt has been logged.</span>', 'text-muted'];
    else res = [CMDS[cmd] ? CMDS[cmd]() : `command not found: ${esc(cmd)} — try <span class="text-neon">help</span>`, 'text-muted'];
    setLines((ls) => [...ls, echo, res]);
  };

  const onKey = (e) => {
    const h = hist.current;
    if (e.key === 'ArrowUp' && hIdx.current > 0) { hIdx.current -= 1; setValue(h[hIdx.current]); e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIdx.current = Math.min(h.length, hIdx.current + 1); setValue(h[hIdx.current] || ''); e.preventDefault(); }
    if (e.key === 'Tab' && value) {
      const m = Object.keys(CMDS).find((k) => k.startsWith(value.toLowerCase()));
      if (m) { setValue(m); e.preventDefault(); }
    }
  };

  const onOutClick = (e) => {
    const a = e.target.closest('a[href^="/"]');
    if (a) { e.preventDefault(); navigate(a.getAttribute('href')); }
  };

  return (
    <div className="lg:col-span-5 w-full min-w-0">
      <div className="rounded-xl border border-line bg-obsidian shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-line bg-panel">
          <div className="flex gap-1.5" aria-hidden="true"><span className="h-3 w-3 rounded-full bg-crit/80" /><span className="h-3 w-3 rounded-full bg-amber/80" /><span className="h-3 w-3 rounded-full bg-neon/80" /></div>
          <span className="font-mono text-xs text-dim">guest@okasha: ~</span>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-neon/30 text-neon">interactive</span>
        </div>
        <div className="font-mono text-[13px] leading-relaxed p-4 h-80 flex flex-col">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div ref={out} onClick={onOutClick} className="thin-scroll flex-1 overflow-y-auto pr-1" aria-live="polite">
            {lines.map(([html, cls], i) => (
              <div key={i} className={`${cls} whitespace-pre-wrap break-words`} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
          <form className="flex items-center gap-2 pt-2 border-t border-line/60 mt-2" autoComplete="off"
            onSubmit={(e) => { e.preventDefault(); run(value); setValue(''); }}>
            <label htmlFor="term-in" className="text-neon shrink-0">guest@okasha:~$</label>
            <input id="term-in" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
              className="flex-1 min-w-0 bg-transparent outline-none text-fg placeholder:text-dim" placeholder="type 'help'" spellCheck="false" autoCapitalize="off" />
          </form>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2" aria-label="Quick commands">
        {['whoami', 'cases', 'certs', 'experience', 'contact'].map((c) => (
          <button key={c} type="button" onClick={() => run(c)} className="font-mono text-xs px-3 h-9 rounded border border-line text-muted hover:text-neon hover:border-neon/40">{c}</button>
        ))}
      </div>
    </div>
  );
}
