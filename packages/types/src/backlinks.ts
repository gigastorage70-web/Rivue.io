import { z } from 'zod';

export const BacklinkItemSchema = z.object({
  id: z.string(),
  sourceUrl: z.string(),
  sourceTitle: z.string().optional(),
  targetUrl: z.string(),
  anchorText: z.string(),
  linkType: z.enum(['dofollow', 'nofollow', 'ugc', 'sponsored']),
  domainRating: z.number(), // 0 - 100
  pageAuthority: z.number(), // 0 - 100
  spamScore: z.number(), // 0 - 100%
  firstSeen: z.string(),
  lastSeen: z.string(),
  isLost: z.boolean().default(false),
});

export type BacklinkItem = z.infer<typeof BacklinkItemSchema>;

export const ReferringDomainSchema = z.object({
  domain: z.string(),
  domainRating: z.number(),
  backlinksCount: z.number(),
  dofollowCount: z.number(),
  ipAddress: z.string().optional(),
  country: z.string().optional(),
  firstSeen: z.string(),
});

export type ReferringDomain = z.infer<typeof ReferringDomainSchema>;

export const AnchorTextDistributionSchema = z.object({
  anchorText: z.string(),
  backlinksCount: z.number(),
  domainsCount: z.number(),
  percentage: z.number(),
});

export type AnchorTextDistribution = z.infer<typeof AnchorTextDistributionSchema>;

export const LinkProspectStatusSchema = z.enum(['discovered', 'contacted', 'in_progress', 'acquired', 'rejected']);
export type LinkProspectStatus = z.infer<typeof LinkProspectStatusSchema>;

export const LinkProspectTypeSchema = z.enum(['guest_post', 'broken_link', 'resource_page', 'competitor_backlink', 'unlinked_mention']);
export type LinkProspectType = z.infer<typeof LinkProspectTypeSchema>;

export const LinkProspectSchema = z.object({
  id: z.string(),
  domain: z.string(),
  contactEmail: z.string().optional(),
  contactName: z.string().optional(),
  type: LinkProspectTypeSchema,
  opportunityUrl: z.string(),
  domainRating: z.number(),
  status: LinkProspectStatusSchema,
  notes: z.string().optional(),
  lastContactedAt: z.string().optional(),
});

export type LinkProspect = z.infer<typeof LinkProspectSchema>;

export const BacklinkProfileOverviewSchema = z.object({
  targetDomain: z.string(),
  domainRating: z.number(),
  totalBacklinks: z.number(),
  referringDomainsCount: z.number(),
  dofollowRatio: z.number(), // 0 - 100
  spamScoreAvg: z.number(),
  velocityHistory: z.array(z.object({
    month: z.string(),
    gained: z.number(),
    lost: z.number(),
    net: z.number(),
  })),
  recentBacklinks: z.array(BacklinkItemSchema),
  topReferringDomains: z.array(ReferringDomainSchema),
  anchorDistributions: z.array(AnchorTextDistributionSchema),
  prospects: z.array(LinkProspectSchema),
});

export type BacklinkProfileOverview = z.infer<typeof BacklinkProfileOverviewSchema>;
