import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Blog from './pages/Blog.jsx';
import Post from './pages/Post.jsx';
import Resume from './pages/Resume.jsx';
import NotFound from './pages/NotFound.jsx';
import POSTS from './data/posts.json';

export { ROUTES, NOT_FOUND, PAGE_FILES } from './routes.js';
export { POSTS };

const pages = { home: Home, projects: Projects, blog: Blog, post: Post, resume: Resume, notfound: NotFound };

export function render(url) {
  return renderToString(
    <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App pages={pages} />
    </StaticRouter>,
  );
}
