export interface DomainRatingInput {
  referringDomainsCount: number;
  totalBacklinksCount: number;
  dofollowRatio: number; // 0.0 - 1.0
  averageReferringDomainDr: number; // 0 - 100
  domainAgeMonths?: number;
}

/**
 * Calculates Rivue Domain Rating (DR equivalent 0–100).
 * Uses a logarithmic curve modeled after industry authority engines.
 */
export function calculateDomainRating(input: DomainRatingInput): number {
  if (input.referringDomainsCount <= 0) return 1;

  // Logarithmic volume of unique referring domains
  const volumeComponent = Math.min(70, (Math.log10(input.referringDomainsCount + 1) / 4) * 70);

  // Quality multiplier based on average DR of links pointing in
  const qualityFactor = Math.min(1.0, Math.max(0.2, input.averageReferringDomainDr / 75));

  // Dofollow vs nofollow impact
  const dofollowImpact = Math.min(1.0, Math.max(0.4, 0.5 + input.dofollowRatio * 0.5));

  const totalScore = volumeComponent * qualityFactor * dofollowImpact * 1.35;

  return Math.max(1, Math.min(99, Math.round(totalScore)));
}
