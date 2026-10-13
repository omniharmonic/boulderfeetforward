import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Everything BFF staff can edit lives in these collections (and in src/data/*.json).
 * The admin editor at /admin/ is configured in public/admin/config.yml to match.
 */

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Shown as a quiet note in the editor until Libby approves the wording. */
    draft: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    context: z.string().optional(),
    videoUrl: z.string().optional(),
    order: z.number().default(100),
    /** True until the speaker's written OK to publish is on file. */
    needsConsent: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

const programs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/programs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    impact: z.string(),
    impactApprox: z.boolean().default(true),
    zeffyUrl: z.string(),
    order: z.number().default(100),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['weekly', 'special']).default('weekly'),
    /** Weekly: the weekday name. Special: an ISO date (YYYY-MM-DD). */
    day: z.string(),
    time: z.string(),
    place: z.string().default('Central Park, Boulder'),
    since: z.number().optional(),
    summary: z.string(),
    offerings: z.array(z.string()).default([]),
    needsVolunteers: z.boolean().default(true),
    order: z.number().default(100),
    /** For special events, hide after this date. */
    until: z.string().optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().default(100),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    page: z.string().default('volunteer'),
    order: z.number().default(100),
  }),
});

export const collections = { pages, testimonials, programs, events, team, faq };
