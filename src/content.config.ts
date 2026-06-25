import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared frontmatter shape. Anything not listed here is rejected at build
// time, which keeps your Markdown files honest.
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

// Long-form project post-mortems.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: baseSchema,
});

// Short, chronological "digital garden" entries.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: baseSchema,
});

export const collections = { projects, notes };
