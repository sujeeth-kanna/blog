import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages settings.
  //   site = https://<username>.github.io
  //   base = '/<repo-name>'   (the leading slash matters; no trailing slash)
  // If you name the repo something other than "blog", change `base` to match.
  site: 'https://sujeeth-kanna.github.io',
  base: '/blog',

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // Light, neutral theme that reads well for C/C++, Python, and config files.
      theme: 'github-light',
      wrap: false,
    },
  },
});
