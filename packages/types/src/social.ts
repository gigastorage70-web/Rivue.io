import { z } from 'zod';

export const SocialPlatformSchema = z.enum(['x', 'linkedin', 'instagram', 'facebook', 'tiktok']);
export type SocialPlatform = z.infer<typeof SocialPlatformSchema>;

export const SocialPostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'failed']);
export type SocialPostStatus = z.infer<typeof SocialPostStatusSchema>;

export const SocialPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  mediaUrls: z.array(z.string()).optional(),
  platforms: z.array(SocialPlatformSchema),
  status: SocialPostStatusSchema,
  scheduledFor: z.string(),
  publishedAt: z.string().optional(),
  engagement: z.object({
    impressions: z.number().default(0),
    likes: z.number().default(0),
    comments: z.number().default(0),
    shares: z.number().default(0),
    clicks: z.number().default(0),
  }).optional(),
  author: z.string().optional(),
});

export type SocialPost = z.infer<typeof SocialPostSchema>;

export const CompetitorSocialMetricSchema = z.object({
  competitorDomain: z.string(),
  platform: SocialPlatformSchema,
  handle: z.string(),
  followersCount: z.number(),
  postingFrequencyPerWeek: z.number(),
  averageEngagementRate: z.number(), // percentage e.g. 3.4
  growthRateMonthly: z.number(),
  topPostExample: z.string().optional(),
});

export type CompetitorSocialMetric = z.infer<typeof CompetitorSocialMetricSchema>;

export const CompetitorAdSnapshotSchema = z.object({
  id: z.string(),
  competitorDomain: z.string(),
  platform: z.string(),
  adHeadline: z.string(),
  adBody: z.string(),
  landingPageUrl: z.string(),
  firstSeen: z.string(),
  lastActive: z.string(),
  mediaType: z.enum(['image', 'video', 'carousel', 'text']),
});

export type CompetitorAdSnapshot = z.infer<typeof CompetitorAdSnapshotSchema>;

export const SocialSchedulingOverviewSchema = z.object({
  scheduledCount: z.number(),
  publishedThisMonth: z.number(),
  avgEngagementRate: z.number(),
  audienceGrowthRate: z.number(),
  posts: z.array(SocialPostSchema),
  competitorSocial: z.array(CompetitorSocialMetricSchema),
  competitorAds: z.array(CompetitorAdSnapshotSchema),
});

export type SocialSchedulingOverview = z.infer<typeof SocialSchedulingOverviewSchema>;
