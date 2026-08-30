export interface SiteHealthInput {
  totalPages: number;
  errorsCount: number;
  warningsCount: number;
  noticesCount: number;
  coreWebVitalsPassRate?: number; // 0.0 - 1.0
}

/**
 * Calculates proprietary Site Health Score (0 - 100).
 * Scaled defect density model.
 */
export function calculateSiteHealthScore(input: SiteHealthInput): number {
  if (input.totalPages <= 0) return 100;

  const total = Math.max(1, input.totalPages);
  const errorPenalty = (input.errorsCount / total) * 250;
  const warningPenalty = (input.warningsCount / total) * 80;
  const noticePenalty = (input.noticesCount / total) * 20;

  let rawScore = 100 - (errorPenalty + warningPenalty + noticePenalty);

  // Core Web Vitals adjustment
  if (input.coreWebVitalsPassRate !== undefined) {
    const cwvFactor = (input.coreWebVitalsPassRate - 0.7) * 15;
    rawScore += cwvFactor;
  }

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getHealthScoreGrade(score: number): {
  grade: 'Good' | 'Fair' | 'Poor' | 'Critical';
  color: string;
} {
  if (score >= 85) return { grade: 'Good', color: '#10b981' }; // Emerald
  if (score >= 70) return { grade: 'Fair', color: '#f59e0b' }; // Amber
  if (score >= 50) return { grade: 'Poor', color: '#f97316' }; // Orange
  return { grade: 'Critical', color: '#ef4444' }; // Red
}
