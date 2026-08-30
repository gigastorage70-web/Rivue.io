import { z } from 'zod';

export const CreditTransactionSchema = z.object({
  id: z.string(),
  module: z.enum(['keyword_search', 'site_audit', 'serp_snapshot', 'backlink_crawl', 'rank_check', 'pr_enrichment', 'social_publish']),
  creditsDeducted: z.number(),
  balanceAfter: z.number(),
  description: z.string(),
  timestamp: z.string(),
  userId: z.string(),
});

export type CreditTransaction = z.infer<typeof CreditTransactionSchema>;

export const QuotaLedgerSchema = z.object({
  organizationId: z.string(),
  tier: z.enum(['starter', 'pro', 'agency', 'enterprise']),
  monthlyAllowance: z.number(),
  creditsRemaining: z.number(),
  creditsUsedThisBillingCycle: z.number(),
  resetDate: z.string(),
  usageByModule: z.record(z.number()),
  recentTransactions: z.array(CreditTransactionSchema),
});

export type QuotaLedger = z.infer<typeof QuotaLedgerSchema>;
