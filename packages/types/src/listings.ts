import { z } from 'zod';

export const DirectoryPlatformSchema = z.enum(['google', 'bing', 'apple', 'yelp', 'facebook', 'tripadvisor']);
export type DirectoryPlatform = z.infer<typeof DirectoryPlatformSchema>;

export const ListingSyncStatusSchema = z.enum(['synced', 'discrepancy_detected', 'pending', 'error']);
export type ListingSyncStatus = z.infer<typeof ListingSyncStatusSchema>;

export const BusinessListingSchema = z.object({
  id: z.string(),
  platform: DirectoryPlatformSchema,
  platformName: z.string(),
  status: ListingSyncStatusSchema,
  publishedName: z.string(),
  publishedAddress: z.string(),
  publishedPhone: z.string(),
  publishedWebsite: z.string(),
  listingUrl: z.string().optional(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  lastSyncedAt: z.string(),
  discrepancies: z.array(z.string()).optional(),
});

export type BusinessListing = z.infer<typeof BusinessListingSchema>;

export const ReviewSentimentSchema = z.enum(['positive', 'neutral', 'negative']);
export type ReviewSentiment = z.infer<typeof ReviewSentimentSchema>;

export const CustomerReviewSchema = z.object({
  id: z.string(),
  platform: DirectoryPlatformSchema,
  authorName: z.string(),
  authorAvatar: z.string().optional(),
  rating: z.number(), // 1 - 5
  sentiment: ReviewSentimentSchema,
  sentimentScore: z.number(), // 0.0 - 1.0
  comment: z.string(),
  publishedAt: z.string(),
  hasReplied: z.boolean().default(false),
  replyText: z.string().optional(),
  replyDate: z.string().optional(),
  aiSuggestedReply: z.string().optional(),
});

export type CustomerReview = z.infer<typeof CustomerReviewSchema>;

export const NAPConsistencyAuditSchema = z.object({
  canonicalName: z.string(),
  canonicalAddress: z.string(),
  canonicalPhone: z.string(),
  canonicalWebsite: z.string(),
  napScore: z.number(), // 0 - 100%
  directoriesCount: z.number(),
  syncedCount: z.number(),
  issuesCount: z.number(),
});

export type NAPConsistencyAudit = z.infer<typeof NAPConsistencyAuditSchema>;

export const ListingsManagementOverviewSchema = z.object({
  napAudit: NAPConsistencyAuditSchema,
  listings: z.array(BusinessListingSchema),
  reviews: z.array(CustomerReviewSchema),
  averageRating: z.number(),
  totalReviews: z.number(),
  responseRatePercentage: z.number(),
  averageResponseTimeHours: z.number(),
});

export type ListingsManagementOverview = z.infer<typeof ListingsManagementOverviewSchema>;
