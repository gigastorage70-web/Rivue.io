import { z } from 'zod';

export const GlossaryTermSchema = z.object({
  id: z.string(),
  term: z.string(),
  plainEnglishName: z.string(),
  shortDefinition: z.string(),
  whyItMatters: z.string(),
  benchmarkGuide: z.object({
    good: z.string(),
    average: z.string(),
    poor: z.string(),
  }).optional(),
  category: z.enum([
    'keywords',
    'site_audit',
    'backlinks',
    'rank_tracking',
    'competitors',
    'listings',
    'social',
    'pr_crm',
    'general'
  ]),
  learnMoreUrl: z.string().optional(),
});

export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;
