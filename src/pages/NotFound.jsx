import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { btn } from '../lib/ui.jsx';

export default function NotFound() {
  return (
    <Layout section="home404">
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-28 text-center">
          <p className="font-mono text-sm text-crit">HTTP/1.1 404 Not Found</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">This path is <span className="text-neon">out of scope.</span></h1>
          <p className="mt-5 text-muted">The page you asked for doesn&rsquo;t exist — or was never in the rules of engagement.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className={btn.primary}>Back to home</Link>
            <Link to="/projects/" className={btn.ghost}>Case studies</Link>
            <Link to="/blog/" className={btn.ghost}>Field notes</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
