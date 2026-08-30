import { SerperClient } from '@rivue/serper-client';
import { SerpSnapshot } from '@rivue/types';

const serper = new SerperClient();

export interface SerpJobPayload {
  query: string;
  geo?: string;
  device?: 'desktop' | 'mobile';
}

export async function processSerpSnapshotJob(payload: SerpJobPayload): Promise<SerpSnapshot> {
  console.log(`[SerpProcessor] Fetching & caching SERP snapshot for "${payload.query}"...`);
  return await serper.search({
    q: payload.query,
    gl: payload.geo || 'us',
  });
}
