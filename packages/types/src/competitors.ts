import { z } from 'zod';

export const CompetitorDomainProfileSchema = z.object({
  domain: z.string(),
  name: z.string(),
  domainRating: z.number(),
  estimatedMonthlyTraffic: z.number(),
  organicKeywordsCount: z.number(),
  totalBacklinksCount: z.number(),
  trafficTrendPercentage: z.number(),
  topPages: z.array(z.object({
    url: z.string(),
    estimatedTraffic: z.number(),
    keywordsCount: z.number(),
    topKeyword: z.string(),
  })),
});

export type CompetitorDomainProfile = z.infer<typeof CompetitorDomainProfileSchema>;

export const KeywordGapTypeSchema = z.enum(['missing', 'weak', 'strong', 'shared', 'untapped']);
export type KeywordGapType = z.infer<typeof KeywordGapTypeSchema>;

export const KeywordGapItemSchema = z.object({
  keyword: z.string(),
  searchVolume: z.number(),
  kdScore: z.number(),
  cpc: z.number(),
  yourPosition: z.number().nullable(),
  competitorPositions: z.record(z.number().nullable()), // { "ahrefs.com": 2, "semrush.com": 4 }
  gapType: KeywordGapTypeSchema,
  opportunityScore: z.number(), // 0 - 100
});

export type KeywordGapItem = z.infer<typeof KeywordGapItemSchema>;

export const GrowthFeedEventTypeSchema = z.enum([
  'ranking_jump',
  'ranking_drop',
  'new_backlink',
  'lost_backlink',
  'new_content',
  'social_viral_post',
  'ad_campaign_detected'
]);
export type GrowthFeedEventType = z.infer<typeof GrowthFeedEventTypeSchema>;

export const GrowthFeedEventSchema = z.object({
  id: z.string(),
  domain: z.string(),
  type: GrowthFeedEventTypeSchema,
  title: z.string(),
  description: z.string(),
  impact: z.enum(['high', 'medium', 'low']),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type GrowthFeedEvent = z.infer<typeof GrowthFeedEventSchema>;

export const CompetitorIntelligenceOverviewSchema = z.object({
  trackedDomain: z.string(),
  competitors: z.array(CompetitorDomainProfileSchema),
  keywordGap: z.array(KeywordGapItemSchema),
  growthFeed: z.array(GrowthFeedEventSchema),
});

export type CompetitorIntelligenceOverview = z.infer<typeof CompetitorIntelligenceOverviewSchema>;
