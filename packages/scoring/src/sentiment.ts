import { ReviewSentiment } from '@rivue/types';

const POSITIVE_WORDS = new Set([
  'great', 'excellent', 'amazing', 'love', 'best', 'helpful', 'fast', 'recommend', 'perfect',
  'outstanding', 'superb', 'smooth', 'reliable', 'friendly', 'professional', 'awesome', 'good'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'worst', 'poor', 'slow', 'rude', 'broken', 'horrible', 'waste', 'scam',
  'disappointed', 'unresponsive', 'frustrating', 'buggy', 'error', 'failed', 'never'
]);

export function analyzeSentiment(text: string, rating?: number): {
  sentiment: ReviewSentiment;
  sentimentScore: number; // 0.0 to 1.0 (1.0 = highly positive)
} {
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  let posCount = 0;
  let negCount = 0;

  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) posCount++;
    if (NEGATIVE_WORDS.has(w)) negCount++;
  }

  // If star rating is provided, combine with word analysis
  let score = 0.5;
  if (rating !== undefined) {
    score = (rating - 1) / 4; // 1 star = 0, 5 star = 1.0
  }

  const wordDelta = posCount - negCount;
  score = Math.max(0, Math.min(1.0, score + (wordDelta * 0.1)));

  let sentiment: ReviewSentiment = 'neutral';
  if (score >= 0.65) sentiment = 'positive';
  else if (score <= 0.35) sentiment = 'negative';

  return {
    sentiment,
    sentimentScore: Number(score.toFixed(2)),
  };
}
