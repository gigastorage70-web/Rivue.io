import { z } from 'zod';

export const RankHistoryPointSchema = z.object({
  date: z.string(),
  position: z.number(), // 1 - 100+
  serpFeatures: z.array(z.string()).optional(),
  url: z.string().optional(),
});

export type RankHistoryPoint = z.infer<typeof RankHistoryPointSchema>;

export const TrackedKeywordSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  currentPosition: z.number(),
  previousPosition: z.number(),
  bestPosition: z.number(),
  searchVolume: z.number(),
  location: z.string().default('United States'),
  device: z.enum(['desktop', 'mobile']).default('desktop'),
  rankingUrl: z.string(),
  serpFeatures: z.array(z.string()),
  history: z.array(RankHistoryPointSchema),
  competitorPositions: z.record(z.number()).optional(), // e.g. { "competitor1.com": 3, "competitor2.com": 8 }
  tags: z.array(z.string()).optional(),
  lastChecked: z.string(),
});

export type TrackedKeyword = z.infer<typeof TrackedKeywordSchema>;

export const RankTrackingOverviewSchema = z.object({
  totalTracked: z.number(),
  top3Count: z.number(),
  top10Count: z.number(),
  top100Count: z.number(),
  improvedCount: z.number(),
  declinedCount: z.number(),
  unchangedCount: z.number(),
  averagePosition: z.number(),
  serpVolatilityIndex: z.number(), // 0 - 10 (e.g. 3.2 is calm, 7.8 is high flux)
  visibilityScore: z.number(), // 0 - 100%
  keywords: z.array(TrackedKeywordSchema),
});

export type RankTrackingOverview = z.infer<typeof RankTrackingOverviewSchema>;
