import { TrackedKeyword } from '@rivue/types';

export interface RankCheckJobPayload {
  keyword: string;
  targetDomain: string;
}

export async function processRankCheckJob(payload: RankCheckJobPayload): Promise<{ position: number; date: string }> {
  console.log(`[RankProcessor] Checking rank for "${payload.keyword}" on ${payload.targetDomain}...`);
  const position = Math.floor(Math.random() * 8) + 1;
  return {
    position,
    date: new Date().toISOString(),
  };
}
