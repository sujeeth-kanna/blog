import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // Change this to your deployed URL (used for sitemaps / canonical links).
  site: 'https://example.com',

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
