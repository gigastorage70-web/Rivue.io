import { z } from 'zod';

export type ProvenanceSource = 'live' | 'cached' | 'mock';

export const ProvenanceSourceSchema = z.enum(['live', 'cached', 'mock']);

export const DataProvenanceSchema = z.object({
  source: ProvenanceSourceSchema,
  fetchedAt: z.string(),
  staleAfter: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  provider: z.string().optional(),
  latencyMs: z.number().optional(),
});

export type DataProvenance = z.infer<typeof DataProvenanceSchema>;

export interface ProvenanceTagged<T> {
  data: T;
  provenance: DataProvenance;
}

export interface MetricWithProvenance<T = number | string> {
  metric: string;
  value: T;
  source: ProvenanceSource;
  fetchedAt: string;
  staleAfter?: string;
  confidence?: number;
}

export interface ProvenanceTelemetryEntry {
  id: string;
  endpoint: string;
  metricKey: string;
  source: ProvenanceSource;
  durationMs: number;
  cacheHit: boolean;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ProvenanceBreakdown {
  totalRequests: number;
  liveCount: number;
  cachedCount: number;
  mockCount: number;
  liveRatio: number;
  cachedRatio: number;
  mockRatio: number;
  averageLatencyMs: number;
}
