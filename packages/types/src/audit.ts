import { z } from 'zod';

export const IssueSeveritySchema = z.enum(['error', 'warning', 'notice']);
export type IssueSeverity = z.infer<typeof IssueSeveritySchema>;

export const IssueCategorySchema = z.enum([
  'crawlability',
  'performance',
  'onpage',
  'security',
  'structured_data',
  'links',
  'international'
]);
export type IssueCategory = z.infer<typeof IssueCategorySchema>;

export const AuditIssueSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  severity: IssueSeveritySchema,
  category: IssueCategorySchema,
  impact: z.string(),
  howToFix: z.string(),
  affectedUrlsCount: z.number(),
  sampleUrls: z.array(z.string()),
});

export type AuditIssue = z.infer<typeof AuditIssueSchema>;

export const CoreWebVitalsSchema = z.object({
  lcp: z.object({ value: z.number(), unit: z.string(), rating: z.enum(['good', 'needs_improvement', 'poor']) }),
  inp: z.object({ value: z.number(), unit: z.string(), rating: z.enum(['good', 'needs_improvement', 'poor']) }),
  cls: z.object({ value: z.number(), unit: z.string(), rating: z.enum(['good', 'needs_improvement', 'poor']) }),
  ttfb: z.object({ value: z.number(), unit: z.string(), rating: z.enum(['good', 'needs_improvement', 'poor']) }),
  fcp: z.object({ value: z.number(), unit: z.string(), rating: z.enum(['good', 'needs_improvement', 'poor']) }),
});

export type CoreWebVitals = z.infer<typeof CoreWebVitalsSchema>;

export const PageAuditDetailSchema = z.object({
  url: z.string(),
  statusCode: z.number(),
  title: z.string().optional(),
  titleLength: z.number().optional(),
  metaDescription: z.string().optional(),
  metaDescriptionLength: z.number().optional(),
  canonicalUrl: z.string().optional(),
  h1: z.array(z.string()).optional(),
  h2: z.array(z.string()).optional(),
  wordCount: z.number().optional(),
  loadTimeMs: z.number().optional(),
  imagesCount: z.number().optional(),
  imagesMissingAlt: z.number().optional(),
  internalLinksCount: z.number().optional(),
  externalLinksCount: z.number().optional(),
  structuredDataPresent: z.boolean().optional(),
  schemaTypes: z.array(z.string()).optional(),
  issues: z.array(z.string()).optional(),
});

export type PageAuditDetail = z.infer<typeof PageAuditDetailSchema>;

export const AuditRunSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  targetUrl: z.string(),
  healthScore: z.number(), // 0 - 100
  previousScore: z.number().optional(),
  crawledPagesCount: z.number(),
  errorsCount: z.number(),
  warningsCount: z.number(),
  noticesCount: z.number(),
  passedChecksCount: z.number(),
  status: z.enum(['queued', 'crawling', 'analyzing', 'completed', 'failed']),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  coreWebVitals: CoreWebVitalsSchema,
  issues: z.array(AuditIssueSchema),
  crawledPages: z.array(PageAuditDetailSchema).optional(),
});

export type AuditRun = z.infer<typeof AuditRunSchema>;
