import { z } from 'zod';

export const JournalistSchema = z.object({
  id: z.string(),
  name: z.string(),
  outlet: z.string(),
  beat: z.array(z.string()),
  email: z.string(),
  twitterHandle: z.string().optional(),
  relevanceScore: z.number(), // 0 - 100
  recentArticleTitle: z.string().optional(),
  recentArticleUrl: z.string().optional(),
  pitchStatus: z.enum(['not_contacted', 'pitched', 'opened', 'replied', 'published', 'declined']).default('not_contacted'),
  lastContactedAt: z.string().optional(),
});

export type Journalist = z.infer<typeof JournalistSchema>;

export const OutreachCampaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetTopic: z.string(),
  status: z.enum(['draft', 'active', 'completed', 'paused']),
  totalProspects: z.number(),
  sentCount: z.number(),
  openRate: z.number(), // percentage
  replyRate: z.number(), // percentage
  placementsCount: z.number(),
  emailSubjectTemplate: z.string(),
  emailBodyTemplate: z.string(),
  createdAt: z.string(),
});

export type OutreachCampaign = z.infer<typeof OutreachCampaignSchema>;

export const BrandMentionSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceDomain: z.string(),
  title: z.string(),
  url: z.string(),
  snippet: z.string(),
  publishedAt: z.string(),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  domainRating: z.number(),
  isLinked: z.boolean(), // whether mention links to target site
  reachEstimate: z.number(),
});

export type BrandMention = z.infer<typeof BrandMentionSchema>;

export const DigitalPrOverviewSchema = z.object({
  totalJournalists: z.number(),
  activeCampaignsCount: z.number(),
  averageReplyRate: z.number(),
  totalBrandMentions: z.number(),
  unlinkedMentionsCount: z.number(),
  journalists: z.array(JournalistSchema),
  campaigns: z.array(OutreachCampaignSchema),
  mentions: z.array(BrandMentionSchema),
});

export type DigitalPrOverview = z.infer<typeof DigitalPrOverviewSchema>;
