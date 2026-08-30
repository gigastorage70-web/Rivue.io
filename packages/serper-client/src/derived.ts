import { OrganicResult, PeopleAlsoAsk, PlacesResult, NewsResult, KnowledgeGraph } from '@rivue/types';

// Standard logarithmic/decay organic CTR model by Google position
export const CTR_CURVE_BY_POSITION: Record<number, number> = {
  1: 28.5,
  2: 15.7,
  3: 11.0,
  4: 8.0,
  5: 6.1,
  6: 4.8,
  7: 3.9,
  8: 3.1,
  9: 2.5,
  10: 2.0,
};

export function computeEstimatedCtr(position: number, hasFeaturedSnippet = false): number {
  if (position < 1) return 0;
  if (position > 10) return Math.max(0.2, 1.8 - (position - 10) * 0.15);
  
  let baseCtr = CTR_CURVE_BY_POSITION[position] || 1.0;
  // If there is a featured snippet or rich answer above position 1, position 1 CTR decreases slightly
  if (hasFeaturedSnippet && position === 1) {
    baseCtr *= 0.82;
  }
  return Number(baseCtr.toFixed(2));
}

export function computeSerpFeatureCount(params: {
  knowledgeGraph?: KnowledgeGraph;
  peopleAlsoAsk?: PeopleAlsoAsk[];
  places?: PlacesResult[];
  news?: NewsResult[];
  ads?: any[];
  images?: any[];
}): number {
  let count = 0;
  if (params.knowledgeGraph && Object.keys(params.knowledgeGraph).length > 0) count += 1;
  if (params.peopleAlsoAsk && params.peopleAlsoAsk.length > 0) count += 1;
  if (params.places && params.places.length > 0) count += 1;
  if (params.news && params.news.length > 0) count += 1;
  if (params.ads && params.ads.length > 0) count += 1;
  if (params.images && params.images.length > 0) count += 1;
  return count;
}

export function extractDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }
}

export function computeTopCompetitorDomains(organic: OrganicResult[], limit = 5): string[] {
  const domains = new Set<string>();
  for (const item of organic) {
    if (item.link) {
      domains.add(extractDomainFromUrl(item.link));
    }
    if (domains.size >= limit) break;
  }
  return Array.from(domains);
}

export function computeSerpVolatility(dailyRankings: number[]): number {
  if (!dailyRankings || dailyRankings.length < 2) return 2.1; // Baseline baseline
  
  let totalDelta = 0;
  for (let i = 1; i < dailyRankings.length; i++) {
    totalDelta += Math.abs(dailyRankings[i] - dailyRankings[i - 1]);
  }
  const avgDelta = totalDelta / (dailyRankings.length - 1);
  // Scale 0.0 - 10.0
  const volatility = Math.min(10.0, Math.max(0.5, avgDelta * 1.8));
  return Number(volatility.toFixed(1));
}

export function computeContentGapScore(params: {
  yourWordCount: number;
  avgCompetitorWordCount: number;
  yourH2Headings: string[];
  competitorH2Headings: string[];
}): number {
  const wordCountRatio = Math.min(1.0, params.yourWordCount / Math.max(1, params.avgCompetitorWordCount));
  
  const yourLower = new Set(params.yourH2Headings.map(h => h.toLowerCase().trim()));
  let matchCount = 0;
  for (const compH2 of params.competitorH2Headings) {
    if (yourLower.has(compH2.toLowerCase().trim())) {
      matchCount++;
    }
  }
  const headingCoverage = params.competitorH2Headings.length > 0
    ? matchCount / params.competitorH2Headings.length
    : 0.8;

  const score = Math.round((wordCountRatio * 45) + (headingCoverage * 55));
  return Math.min(100, Math.max(0, score));
}
