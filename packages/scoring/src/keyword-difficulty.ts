export interface KeywordDifficultyFactors {
  topDomainsAverageDr: number; // 0 - 100
  topPageBacklinkMedian: number; // e.g. 45
  serpFeaturesCount: number; // e.g. 3 (PAA, Snippet, Local Pack)
  commercialIntentWeight: number; // 0.0 - 1.0
  totalCompetitorsInTop10: number; // usually 10
}

/**
 * Computes Keyword Difficulty (KD) score from 0 to 100.
 * Mirrors industry benchmark models (Semrush/Ahrefs) by evaluating the strength
 * of domains currently ranking in top 10 organic positions.
 */
export function calculateKeywordDifficulty(factors: KeywordDifficultyFactors): number {
  const drWeight = 0.55;
  const backlinkWeight = 0.25;
  const serpFeatureWeight = 0.10;
  const commercialWeight = 0.10;

  // Normalized backlink strength (logarithmic scale up to 500 links)
  const backlinkScore = Math.min(100, Math.log10(Math.max(1, factors.topPageBacklinkMedian) + 1) * 37);

  // SERP features crowd out organic CTR, making organic rank even more difficult
  const serpFeatureScore = Math.min(100, factors.serpFeaturesCount * 20);

  const commercialScore = factors.commercialIntentWeight * 100;

  const rawKD =
    factors.topDomainsAverageDr * drWeight +
    backlinkScore * backlinkWeight +
    serpFeatureScore * serpFeatureWeight +
    commercialScore * commercialWeight;

  return Math.max(1, Math.min(99, Math.round(rawKD)));
}

export function getKdDifficultyLabel(kd: number): {
  label: 'Very Easy' | 'Easy' | 'Possible' | 'Hard' | 'Very Hard';
  badgeColor: string;
  description: string;
} {
  if (kd <= 15) {
    return {
      label: 'Very Easy',
      badgeColor: '#10b981',
      description: 'Your chances to rank in top 10 are high with quality content alone.',
    };
  }
  if (kd <= 30) {
    return {
      label: 'Easy',
      badgeColor: '#34d399',
      description: 'You will need quality content and a few moderate backlinks.',
    };
  }
  if (kd <= 50) {
    return {
      label: 'Possible',
      badgeColor: '#fbbf24',
      description: 'Competitive. Requires well-structured content + 10-25 referring domains.',
    };
  }
  if (kd <= 75) {
    return {
      label: 'Hard',
      badgeColor: '#f97316',
      description: 'High competition. Requires strong brand authority and 50+ high-DR backlinks.',
    };
  }
  return {
    label: 'Very Hard',
    badgeColor: '#ef4444',
    description: 'Dominated by major authority brands. Very difficult to rank on page 1.',
  };
}
