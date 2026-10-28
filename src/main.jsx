import { lazy, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// One chunk per page; the prerendered HTML is shown while the chunk loads.
const loaders = {
  home: () => import('./pages/Home.jsx'),
  projects: () => import('./pages/Projects.jsx'),
  blog: () => import('./pages/Blog.jsx'),
  post: () => import('./pages/Post.jsx'),
  resume: () => import('./pages/Resume.jsx'),
  studio: () => import('./pages/Studio.jsx'),
  notfound: () => import('./pages/NotFound.jsx'),
};
const pages = Object.fromEntries(Object.entries(loaders).map(([k, load]) => [k, lazy(load)]));

const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App pages={pages} />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById('root');
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

// Warm the other page chunks once the browser is idle so navigation is instant.
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
idle(() => ['home', 'projects', 'blog', 'post'].forEach((k) => loaders[k]()));
