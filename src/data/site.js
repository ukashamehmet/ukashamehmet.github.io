/* ============ CONTENT — edit here ============
   Home-page and shared copy. Full case studies live in cases.json and field
   notes in posts.json (both extracted verbatim from the original site). */

export const SITE = {
  url: 'https://ukashamehmet.github.io',
  name: 'Okasha Mehmood',
  role: 'Penetration Tester & Reverse Engineer',
  location: 'Islamabad, PK · Remote worldwide',
  email: 'ukashamehmet@gmail.com',
  linkedin: 'https://www.linkedin.com/in/okasha-mehmood-0394261a2/',
  phone: '+92 321 911 6318',
  tel: '+923219116318',
  whatsapp: 'https://wa.me/923219116318',
  cv: '/assets/Okasha-Mehmood-CV.pdf',
};

export const MAILTO_ENGAGEMENT = `mailto:${SITE.email}?subject=Security%20engagement%20%E2%80%94%20portfolio`;
export const MAILTO_REPORT = `mailto:${SITE.email}?subject=Redacted%20report%20request%20(NDA)`;

export const METRICS = [
  { value: '50', accent: '+', label: 'Confidential engagements' },
  { value: '3', accent: '+', label: 'Years in offensive security' },
  { value: '7', label: 'Sectors tested' },
  { value: '0', label: 'Client records retained', neon: true },
];

export const SECTORS = ['Government', 'Financial services', 'Telecom', 'SaaS', 'Logistics', 'Legal', 'Identity'];

export const HOME_CASES = [
  { no: '01', cat: 'Web & API', sev: 'Critical', sector: 'SaaS', id: 'saas-bola', img: 'work-saas', alt: 'Modern glass architecture',
    title: 'One query, every tenant',
    body: 'A multi-tenant platform checked that a user was logged in — but not which organization the record belonged to. We proved cross-tenant access, then moved enforcement into the data layer and retested every object route.',
    outcomes: ['Tenant isolation restored', 'Retested across 40+ routes'], tags: ['BOLA / IDOR', 'Django REST', 'AuthZ'] },
  { no: '02', cat: 'Network', sev: 'High', sector: 'Logistics', id: 'logistics-perimeter', img: 'work-network', alt: 'Container port seen from above',
    title: 'The WAF was never the wall',
    body: 'The edge was doing its job. The origin was not behind it. Public records exposed the hosting range, direct-to-origin requests bypassed the WAF, and management interfaces were sitting on the public internet.',
    outcomes: ['78% external surface reduction', 'Origin locked to edge'], tags: ['ASM', 'WAF bypass', 'ZTNA'] },
  { no: '03', cat: 'Mobile RE', sev: 'Critical', sector: 'Android', id: 'android-rat', img: 'work-mobile', alt: 'Macro detail of a circuit board',
    title: 'The app that became the network',
    body: 'A fake traffic-notice app asked for VPN permission, then routed every outbound connection through a local TUN interface. We reconstructed the dropper, the route, and the secondary payload loader — and built detection content for the fleet.',
    outcomes: ['Delivery chain mapped', 'YARA + Sigma delivered'], tags: ['VpnService', 'Frida', 'Malware'] },
  { no: '04', cat: 'Research', sev: 'Critical', sector: 'CI/CD', id: 'cicd-rce', img: 'work-research', alt: 'Server racks and network cabling',
    title: 'Trust, but deserialize',
    body: 'A build-agent endpoint accepted XML from a synthetic worker and passed it into an unpinned deserializer. We built the smallest proof that reached command execution, stopped there, and worked with the vendor on the allowlist.',
    outcomes: ['Pre-auth path closed', 'Fix validated'], tags: ['XStream', 'Deserialization', 'CWE-502'] },
];

export const APPROACH = [
  { title: 'Scope without surprises', body: 'Threat model, rules of engagement, test accounts, escalation path, and success criteria. Production is treated as production from the first request.' },
  { title: 'Map what the system trusts', body: 'Recon, role matrices, data flows, API contracts, and configuration review. I look for the assumptions between components, not just missing patches.' },
  { title: 'Prove the smallest real path', body: 'Manual exploitation with the minimum access needed to demonstrate impact. No bulk data collection, no unnecessary persistence, no theatre.' },
  { title: 'Translate risk into repair', body: 'Business impact, CVSS, affected component, exact remediation, owner, and priority. A finding an engineer cannot action is an unfinished finding.' },
  { title: 'Retest, then close', body: 'Replay the original path, test adjacent routes, review the fix, and issue a closure memo. The client gets evidence, not a promise.' },
];

export const ARTIFACTS = [
  ['Rules of engagement', 'scope · limits · escalation'],
  ['Evidence log', 'hashed · timestamped'],
  ['Finding dossier', 'impact · CVSS · repair'],
  ['Retest memo', 'replay · adjacent paths · closure'],
];

export const CAPABILITIES = [
  { title: 'Application & API security', color: 'text-neon', body: 'Manual testing of the authorization, session, and business-logic decisions that scanners miss — with enough code context to explain why the bug exists.',
    items: ['BOLA / IDOR', 'BFLA', 'Auth & session', 'SSRF', 'File upload', 'Deserialization', 'Business logic', 'GraphQL'] },
  { title: 'Network & external surface', color: 'text-cyan', body: 'Mapping the estate the way an outsider sees it: DNS, certificates, hosting ranges, forgotten staging, management planes, and the path around the edge.',
    items: ['External ASM', 'Origin exposure', 'WAF bypass', 'AD review', 'Segmentation', 'TLS', 'VPN / ZTNA', 'OSINT'] },
  { title: 'Mobile & reverse engineering', color: 'text-amber', body: 'Android APK analysis, runtime instrumentation, protocol reconstruction, and malware teardown — from the manifest to the encrypted payload.',
    items: ['Android', 'Frida', 'Jadx / Apktool', 'SSL pinning', 'Crypto protocols', 'Native libs', 'Malware', 'MASVS'] },
  { title: 'Tooling & remediation', color: 'text-[#C4B5FD]', body: 'Small, purpose-built automation for the repetitive parts — then sitting with the team on the fix, the regression test, and the closure evidence.',
    items: ['Python', 'Bash', 'PowerShell', 'Burp extensions', 'Evidence automation', 'CVSS', 'MITRE ATT&CK', 'Retest'] },
];

export const LEDGER = [
  ['Web applications', 'Authorization, session handling, file processing, business logic, and secure code review.', 'Critical paths closed'],
  ['APIs & services', 'BOLA, BFLA, mass assignment, token lifecycle, replay, rate limiting, GraphQL, and crypto boundaries.', 'Object access verified'],
  ['Network & ASM', 'Origin exposure, WAF bypass, exposed management planes, segmentation, TLS, and external footprint.', 'Surface reduced'],
  ['Mobile & embedded', 'Android reversing, pinning and root checks, crypto protocols, IPC, malware behavior, and detection content.', 'Trust model rebuilt'],
  ['Vulnerability research', 'Deserialization, upload chains, parser gaps, and pre-auth paths — with coordinated vendor disclosure.', 'Fixes shipped'],
  ['Remediation & retest', 'Fix validation, regression testing, closure memos, and developer handoff after the report.', 'Verified, not assumed'],
];

export const TOOLBELT = ['Burp Suite Pro', 'Nmap', 'Masscan', 'Amass', 'ffuf', 'SQLmap', 'Frida', 'Jadx', 'Ghidra', 'Wireshark', 'Metasploit', 'Python', 'Docker', 'Git'];

export const EXPERIENCE = [
  { date: 'Jan 2024 — Present', role: 'Penetration Tester', org: 'VisionTech 360', place: 'Islamabad, PK', current: true,
    body: 'Web, network, API, and mobile assessments for enterprise and public-sector clients; internal adversary simulations and remediation support.',
    cv: ['Lead web, API, network, and mobile assessments for enterprise and public-sector clients; scope, test, report, and retest.',
      'Found and helped close critical cross-tenant authorization, session, upload, and perimeter-exposure paths; built Python/Bash automation to reduce repetitive testing.'] },
  { date: 'Apr 2024 — Dec 2024', role: 'OSINT Analyst', org: 'VisionTech 360', place: 'Islamabad, PK',
    body: 'External attack surface mapping, shadow IT discovery, exposed credentials, and rogue infrastructure tracking.',
    cv: ['Mapped external attack surfaces and shadow IT using Maltego, Shodan, SpiderFoot, and Recon-ng; automated intelligence pipelines for exposed credentials and rogue infrastructure.'] },
  { date: 'Nov 2021 — Present', role: 'Independent Security Consultant', org: 'Remote', place: 'Remote', current: true,
    body: '50+ assessments for clients across fintech, SaaS, legal, logistics, telecom, and government-adjacent environments.',
    cv: ['Delivered 50+ assessments across fintech, SaaS, legal, logistics, telecom, and government-adjacent clients; produced executive and developer-facing reports with CVSS, reproducible evidence, prioritised remediation, and re-test memos for SOC 2 and ISO 27001 readiness.'] },
  { date: 'Jun 2023 — Mar 2024', role: 'Web Penetration Testing Intern', org: 'Codesvista', place: 'Islamabad, PK',
    body: 'Targeted web and API testing with Burp Suite, OWASP ZAP, and Nmap; remediation advisories and internal research labs.',
    cv: ['Performed targeted web and REST API testing with Burp Suite Professional, OWASP ZAP, and Nmap; authored remediation advisories and supported internal research labs.'] },
];

export const CREDENTIALS = [
  { name: 'Certified Red Team Analyst', issuer: 'CyberWarFare Labs · CRTA', primary: true },
  { name: 'BSc Computer Science', issuer: 'University of Science & Technology · 2023' },
  { name: 'Cybersecurity Specialist', issuer: 'NAVTTC' },
  { name: 'Python for Cybersecurity', issuer: 'Cybrary' },
];

export const PRINCIPLES = [
  ['Minimum necessary', 'Proof without bulk collection, persistence, or collateral access.'],
  ['Evidence discipline', 'Reproducible requests, timestamps, and a clean audit trail.'],
  ['Repair, not score', 'Prioritised fixes with an owner and a testable acceptance criterion.'],
  ['Confidentiality by default', 'Client identity never becomes marketing material.'],
];

/* Card copy differs slightly between the home page and the writing index,
   exactly as on the original site. */
export const NOTES = [
  { slug: 'tenant-boundaries', cat: 'Application security', mins: 9, date: 'February 2026',
    title: 'The tenant boundary is a query, not a checkbox',
    home: 'A practical model for testing multi-tenant authorization — and why the fix belongs in the data layer, not in a controller guard.',
    index: 'Why multi-tenant authorization fails in the same place again and again — and the data-layer pattern that makes the boundary hard to bypass.' },
  { slug: 'waf-origin', cat: 'Network & cloud', mins: 7, date: 'March 2026',
    title: 'Your WAF only protects the hostname',
    home: 'Origin exposure is still one of the most reliable ways around an edge control. Here is where it hides, and how to close it.',
    index: 'Where origin exposure hides, how to verify it safely, and why the fix is a network boundary rather than another WAF rule.' },
  { slug: 'android-vpn', cat: 'Mobile reversing', mins: 8, date: 'April 2026',
    title: 'What a rogue VPN service looks like from the inside',
    home: 'Static and dynamic signals from an Android dropper that turns the device into the network — and the limits of what it can actually see.',
    index: 'The permission model, the TUN route, the second-stage loader, and the limits of what a local VPN can actually observe.' },
  { slug: 'findings-engineers-fix', cat: 'Security craft', mins: 6, date: 'May 2026',
    title: 'Write findings engineers can actually fix',
    home: 'A report is a handoff, not a scoreboard. A lightweight structure for findings that make it into the release.',
    index: 'A report is a handoff, not a scoreboard. A lightweight structure for findings that make it into the release.' },
];

export const postPath = (slug) => `/blog/posts/${slug}.html`;
