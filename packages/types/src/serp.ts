import { z } from 'zod';

export const OrganicResultSchema = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  snippet: z.string().optional(),
  date: z.string().optional(),
  sitelinks: z.array(z.object({
    title: z.string(),
    link: z.string(),
  })).optional(),
  domain: z.string().optional(),
  estimatedCtr: z.number().optional(),
});

export type OrganicResult = z.infer<typeof OrganicResultSchema>;

export const PeopleAlsoAskSchema = z.object({
  question: z.string(),
  snippet: z.string().optional(),
  title: z.string().optional(),
  link: z.string().optional(),
});

export type PeopleAlsoAsk = z.infer<typeof PeopleAlsoAskSchema>;

export const RelatedSearchSchema = z.object({
  query: z.string(),
});

export type RelatedSearch = z.infer<typeof RelatedSearchSchema>;

export const KnowledgeGraphSchema = z.object({
  title: z.string().optional(),
  type: z.string().optional(),
  website: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  attributes: z.record(z.string()).optional(),
});

export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

export const PlacesResultSchema = z.object({
  position: z.number().optional(),
  title: z.string(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  rating: z.number().optional(),
  ratingCount: z.number().optional(),
  category: z.string().optional(),
  phoneNumber: z.string().optional(),
  website: z.string().optional(),
  cid: z.string().optional(),
});

export type PlacesResult = z.infer<typeof PlacesResultSchema>;

export const NewsResultSchema = z.object({
  title: z.string(),
  link: z.string(),
  snippet: z.string().optional(),
  date: z.string().optional(),
  source: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type NewsResult = z.infer<typeof NewsResultSchema>;

export const SerpSnapshotSchema = z.object({
  id: z.string(),
  query: z.string(),
  geo: z.string().default('us'),
  language: z.string().default('en'),
  device: z.enum(['desktop', 'mobile']).default('desktop'),
  fetchedAt: z.string(),
  searchParameters: z.record(z.any()).optional(),
  organic: z.array(OrganicResultSchema),
  peopleAlsoAsk: z.array(PeopleAlsoAskSchema).optional(),
  relatedSearches: z.array(RelatedSearchSchema).optional(),
  knowledgeGraph: KnowledgeGraphSchema.optional(),
  places: z.array(PlacesResultSchema).optional(),
  news: z.array(NewsResultSchema).optional(),
  // Derived attributes computed from raw payload
  derived: z.object({
    serpFeatureCount: z.number(),
    localPackPresent: z.boolean(),
    organicCtrEstimate: z.number(),
    serpVolatilityIndex: z.number(),
    topCompetitors: z.array(z.string()),
  }).optional(),
});

export type SerpSnapshot = z.infer<typeof SerpSnapshotSchema>;
