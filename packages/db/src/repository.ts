import {
  AuditRun,
  BacklinkProfileOverview,
  RankTrackingOverview,
  CompetitorIntelligenceOverview,
  ListingsManagementOverview,
  SocialSchedulingOverview,
  DigitalPrOverview,
  QuotaLedger,
  KeywordExplorerResult,
} from '@rivue/types';
import {
  SEED_KEYWORD_RESULT,
  SEED_SITE_AUDIT,
  SEED_BACKLINK_OVERVIEW,
  SEED_RANK_TRACKING,
  SEED_COMPETITOR_OVERVIEW,
  SEED_LISTINGS_OVERVIEW,
  SEED_SOCIAL_OVERVIEW,
  SEED_PR_OVERVIEW,
  SEED_QUOTA_LEDGER,
} from './seed';

export class RivueRepository {
  private keywordData = { ...SEED_KEYWORD_RESULT };
  private auditData = { ...SEED_SITE_AUDIT };
  private backlinkData = { ...SEED_BACKLINK_OVERVIEW };
  private rankData = { ...SEED_RANK_TRACKING };
  private competitorData = { ...SEED_COMPETITOR_OVERVIEW };
  private listingsData = { ...SEED_LISTINGS_OVERVIEW };
  private socialData = { ...SEED_SOCIAL_OVERVIEW };
  private prData = { ...SEED_PR_OVERVIEW };
  private quotaData = { ...SEED_QUOTA_LEDGER };

  // Keywords
  async getKeywordExplorerData(query?: string): Promise<KeywordExplorerResult> {
    if (!query || query.toLowerCase() === 'crm software') {
      return this.keywordData;
    }
    // Dynamic generated response for arbitrary queries
    return {
      seedKeyword: query,
      overview: {
        id: `kw_${query.replace(/\s+/g, '_')}`,
        keyword: query,
        volume: 48500,
        kdScore: 46,
        cpc: 6.25,
        competition: 0.62,
        intent: 'commercial',
        serpFeatures: ['People Also Ask', 'Sitelinks'],
        trend: [
          { month: 'Mar', volume: 42000 },
          { month: 'Apr', volume: 45000 },
          { month: 'May', volume: 49000 },
          { month: 'Jun', volume: 51000 },
          { month: 'Jul', volume: 48000 },
          { month: 'Aug', volume: 48500 },
        ],
        lastUpdated: 'Just now',
      },
      suggestions: [
        { keyword: `best ${query} for small business`, volume: 14200, kdScore: 28, cpc: 5.4, intent: 'commercial', trendType: 'rising' },
        { keyword: `free ${query} tools`, volume: 22100, kdScore: 39, cpc: 3.2, intent: 'transactional', trendType: 'stable' },
        { keyword: `${query} pricing`, volume: 8900, kdScore: 22, cpc: 7.1, intent: 'commercial', trendType: 'rising' },
      ],
      questions: [
        { keyword: `what is ${query}`, volume: 11200, kdScore: 14, cpc: 1.8, intent: 'informational', trendType: 'stable' },
        { keyword: `how to use ${query} effectively`, volume: 5600, kdScore: 19, cpc: 2.9, intent: 'informational', trendType: 'rising' },
      ],
    };
  }

  // Site Audit
  async getLatestAudit(): Promise<AuditRun> {
    return this.auditData;
  }

  async runNewAudit(targetUrl: string): Promise<AuditRun> {
    const newRun: AuditRun = {
      ...this.auditData,
      id: `audit_${Date.now()}`,
      targetUrl,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      healthScore: Math.floor(Math.random() * 15) + 82,
    };
    this.auditData = newRun;
    this.deductCredits('site_audit', 100, `Site Audit run for ${targetUrl}`);
    return newRun;
  }

  // Backlinks
  async getBacklinkOverview(): Promise<BacklinkProfileOverview> {
    return this.backlinkData;
  }

  async updateProspectStatus(prospectId: string, status: any): Promise<void> {
    this.backlinkData.prospects = this.backlinkData.prospects.map((p) =>
      p.id === prospectId ? { ...p, status } : p
    );
  }

  // Rank Tracking
  async getRankTracking(): Promise<RankTrackingOverview> {
    return this.rankData;
  }

  async addTrackedKeyword(keyword: string, location = 'United States'): Promise<void> {
    const newKw = {
      id: `trk_${Date.now()}`,
      keyword,
      currentPosition: Math.floor(Math.random() * 20) + 1,
      previousPosition: Math.floor(Math.random() * 20) + 1,
      bestPosition: 1,
      searchVolume: Math.floor(Math.random() * 25000) + 1000,
      location,
      device: 'desktop' as const,
      rankingUrl: `https://rivue.io/${keyword.replace(/\s+/g, '-')}`,
      serpFeatures: ['People Also Ask'],
      history: [
        { date: '2026-08-28', position: 5 },
        { date: '2026-08-29', position: 4 },
        { date: '2026-08-30', position: 3 },
      ],
      lastChecked: 'Just now',
    };
    this.rankData.keywords = [newKw, ...this.rankData.keywords];
    this.rankData.totalTracked += 1;
    this.deductCredits('rank_check', 1, `Added tracked keyword: ${keyword}`);
  }

  // Competitor Intelligence
  async getCompetitorOverview(): Promise<CompetitorIntelligenceOverview> {
    return this.competitorData;
  }

  // Listings & Reviews
  async getListingsOverview(): Promise<ListingsManagementOverview> {
    return this.listingsData;
  }

  async addReviewReply(reviewId: string, replyText: string): Promise<void> {
    this.listingsData.reviews = this.listingsData.reviews.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            hasReplied: true,
            replyText,
            replyDate: 'Just now',
          }
        : r
    );
  }

  // Social Scheduling
  async getSocialOverview(): Promise<SocialSchedulingOverview> {
    return this.socialData;
  }

  async createSocialPost(post: { content: string; platforms: any[]; scheduledFor: string }): Promise<void> {
    const newPost = {
      id: `post_${Date.now()}`,
      content: post.content,
      platforms: post.platforms,
      status: 'scheduled' as const,
      scheduledFor: post.scheduledFor,
      author: 'Marketing Team',
    };
    this.socialData.posts = [newPost, ...this.socialData.posts];
    this.socialData.scheduledCount += 1;
    this.deductCredits('social_publish', 5, 'Scheduled multi-network post');
  }

  // Digital PR CRM
  async getPrOverview(): Promise<DigitalPrOverview> {
    return this.prData;
  }

  async updatePitchStatus(journalistId: string, status: any): Promise<void> {
    this.prData.journalists = this.prData.journalists.map((j) =>
      j.id === journalistId ? { ...j, pitchStatus: status, lastContactedAt: new Date().toISOString() } : j
    );
  }

  // Credits
  async getQuotaLedger(): Promise<QuotaLedger> {
    return this.quotaData;
  }

  deductCredits(module: any, amount: number, description: string): void {
    this.quotaData.creditsRemaining = Math.max(0, this.quotaData.creditsRemaining - amount);
    this.quotaData.creditsUsedThisBillingCycle += amount;
    this.quotaData.usageByModule[module] = (this.quotaData.usageByModule[module] || 0) + amount;
    this.quotaData.recentTransactions = [
      {
        id: `tx_${Date.now()}`,
        module,
        creditsDeducted: amount,
        balanceAfter: this.quotaData.creditsRemaining,
        description,
        timestamp: 'Just now',
        userId: 'usr_current',
      },
      ...this.quotaData.recentTransactions.slice(0, 19),
    ];
  }
}

// Global Singleton Repository
export const db = new RivueRepository();
