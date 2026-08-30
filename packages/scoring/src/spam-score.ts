export interface SpamScoreFactors {
  lowQualityLinkRatio: number; // 0.0 - 1.0 (exact match anchors, casino/pbn footprints)
  sitewideLinkRatio: number; // 0.0 - 1.0
  unnaturalLinkVelocity: boolean;
  excessiveOutboundLinks: boolean;
  tldSpamProfile: boolean; // e.g. .xyz / .click spam networks
}

/**
 * Calculates Backlink Spam Score (0 - 100%).
 * Low risk: 1-30%, Medium risk: 31-60%, High risk: 61-100%.
 */
export function calculateSpamScore(factors: SpamScoreFactors): number {
  let score = factors.lowQualityLinkRatio * 45 + factors.sitewideLinkRatio * 20;

  if (factors.unnaturalLinkVelocity) score += 15;
  if (factors.excessiveOutboundLinks) score += 10;
  if (factors.tldSpamProfile) score += 10;

  return Math.min(100, Math.max(1, Math.round(score)));
}
