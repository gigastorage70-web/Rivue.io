import { z } from 'zod';

export const SearchIntentSchema = z.enum(['informational', 'commercial', 'transactional', 'navigational']);
export type SearchIntent = z.infer<typeof SearchIntentSchema>;

export const KeywordMetricSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  volume: z.number(),
  kdScore: z.number(), // 0 - 100
  cpc: z.number(), // e.g. 2.45
  competition: z.number(), // 0.0 - 1.0
  intent: SearchIntentSchema,
  serpFeatures: z.array(z.string()),
  trend: z.array(z.object({
    month: z.string(),
    volume: z.number(),
  })),
  history: z.array(z.number()).optional(),
  lastUpdated: z.string(),
});

export type KeywordMetric = z.infer<typeof KeywordMetricSchema>;

export const KeywordSuggestionSchema = z.object({
  keyword: z.string(),
  volume: z.number(),
  kdScore: z.number(),
  cpc: z.number(),
  intent: SearchIntentSchema,
  trendType: z.enum(['rising', 'stable', 'declining']).optional(),
});

export type KeywordSuggestion = z.infer<typeof KeywordSuggestionSchema>;

export const KeywordExplorerResultSchema = z.object({
  seedKeyword: z.string(),
  overview: KeywordMetricSchema,
  suggestions: z.array(KeywordSuggestionSchema),
  questions: z.array(KeywordSuggestionSchema),
  serpSnapshot: z.any().optional(),
});

export type KeywordExplorerResult = z.infer<typeof KeywordExplorerResultSchema>;
