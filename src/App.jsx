import { Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES, NOT_FOUND } from './routes.js';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    if (!hash) { if (!isFirst) window.scrollTo(0, 0); return undefined; }
    // Target may render a frame or two later (lazy page, opened case study) — retry briefly.
    let tries = 0; let raf = 0;
    const seek = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ behavior: isFirst ? 'auto' : 'smooth', block: 'start' });
      else if (tries++ < 30) raf = requestAnimationFrame(seek);
    };
    raf = requestAnimationFrame(seek);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

function Page({ C, r }) {
  useEffect(() => { document.title = r.title; }, [r.title]);
  return <C slug={r.slug} />;
}

export default function App({ pages }) {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Routes>
          {ROUTES.map((r) => <Route key={r.path} path={r.path} element={<Page C={pages[r.page]} r={r} />} />)}
          <Route path="*" element={<Page C={pages.notfound} r={NOT_FOUND} />} />
        </Routes>
      </Suspense>
    </>
  );
}
