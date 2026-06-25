// Prefix an internal path with the site's base (e.g. '/blog') so links work
// both locally and on GitHub Pages. Use this for every internal href.
const base = import.meta.env.BASE_URL; // '/blog/' in prod, '/' in some setups

export const withBase = (path: string) =>
  base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
