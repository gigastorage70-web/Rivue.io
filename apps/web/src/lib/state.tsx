'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuditRun,
  KeywordExplorerResult,
  BacklinkProfileOverview,
  RankTrackingOverview,
  CompetitorIntelligenceOverview,
  ListingsManagementOverview,
  SocialSchedulingOverview,
  DigitalPrOverview,
  QuotaLedger,
  TrackedKeyword,
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
} from '@rivue/db';
import { calculateSiteHealthScore } from '@rivue/scoring';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  organization: string;
  timezone: string;
  apiToken: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Invited';
}

export interface RivueContextType {
  // Target Domain
  targetDomain: string;
  setTargetDomain: (domain: string) => void;
  savedDomains: string[];
  addSavedDomain: (domain: string) => void;
  removeSavedDomain: (domain: string) => void;

  // Credits & Quota
  quota: QuotaLedger;
  deductCredits: (module: any, amount: number, description: string) => void;
  refillCredits: (amount: number) => void;

  // Profile & Org
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  teamMembers: TeamMember[];
  inviteTeamMember: (name: string, email: string, role: any) => void;
  removeTeamMember: (id: string) => void;

  // Live Audits
  audit: AuditRun;
  runLiveAudit: (url: string) => Promise<AuditRun>;
  isAuditing: boolean;

  // Rank Tracking
  rankData: RankTrackingOverview;
  addTrackedKeyword: (kw: string, location?: string) => void;

  // PR CRM & Pitches
  prData: DigitalPrOverview;
  sendPitch: (journalistId: string, subject: string, message: string) => void;

  // Social Posts
  socialData: SocialSchedulingOverview;
  createSocialPost: (content: string, platforms: any[], scheduledFor: string) => void;
}

const RivueContext = createContext<RivueContextType | undefined>(undefined);

export const RivueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetDomain, setTargetDomainState] = useState<string>('thezensodigital.com');
  const [savedDomains, setSavedDomains] = useState<string[]>([
    'thezensodigital.com',
    'rivue.io',
    'semrush.com',
    'ahrefs.com',
  ]);

  const [quota, setQuota] = useState<QuotaLedger>(SEED_QUOTA_LEDGER);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex@rivue.io',
    role: 'Owner',
    organization: 'Zenso Growth Agency',
    timezone: 'America/Los_Angeles (PST)',
    apiToken: 'rivue_live_sec_89f0291ba48c90',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'tm_1', name: 'Alex Rivera', email: 'alex@rivue.io', role: 'Admin', status: 'Active' },
    { id: 'tm_2', name: 'Marcus Vance', email: 'marcus@rivue.io', role: 'Editor', status: 'Active' },
    { id: 'tm_3', name: 'Elena Rostova', email: 'elena@agency.com', role: 'Viewer', status: 'Invited' },
  ]);

  const [audit, setAudit] = useState<AuditRun>({
    ...SEED_SITE_AUDIT,
    targetUrl: 'https://thezensodigital.com',
    healthScore: 84,
  });
  const [isAuditing, setIsAuditing] = useState(false);

  const [rankData, setRankData] = useState<RankTrackingOverview>(SEED_RANK_TRACKING);
  const [prData, setPrData] = useState<DigitalPrOverview>(SEED_PR_OVERVIEW);
  const [socialData, setSocialData] = useState<SocialSchedulingOverview>(SEED_SOCIAL_OVERVIEW);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rivue_target_domain');
      if (saved) setTargetDomainState(saved);
      const savedCredits = localStorage.getItem('rivue_credits');
      if (savedCredits) {
        setQuota((prev) => ({ ...prev, creditsRemaining: parseInt(savedCredits, 10) }));
      }
    } catch {
      // ignore
    }
  }, []);

  const setTargetDomain = (domain: string) => {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    setTargetDomainState(cleanDomain);
    try {
      localStorage.setItem('rivue_target_domain', cleanDomain);
    } catch {}
    // Automatically trigger a live audit for the new target domain
    runLiveAudit(`https://${cleanDomain}`);
  };

  const addSavedDomain = (domain: string) => {
    const clean = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (!savedDomains.includes(clean)) {
      setSavedDomains([...savedDomains, clean]);
    }
  };

  const removeSavedDomain = (domain: string) => {
    setSavedDomains(savedDomains.filter((d) => d !== domain));
  };

  const deductCredits = (module: any, amount: number, description: string) => {
    setQuota((prev) => {
      const newRemaining = Math.max(0, prev.creditsRemaining - amount);
      try {
        localStorage.setItem('rivue_credits', newRemaining.toString());
      } catch {}
      return {
        ...prev,
        creditsRemaining: newRemaining,
        creditsUsedThisBillingCycle: prev.creditsUsedThisBillingCycle + amount,
        usageByModule: {
          ...prev.usageByModule,
          [module]: (prev.usageByModule[module] || 0) + amount,
        },
        recentTransactions: [
          {
            id: `tx_${Date.now()}`,
            module,
            creditsDeducted: amount,
            balanceAfter: newRemaining,
            description,
            timestamp: 'Just now',
            userId: profile.email,
          },
          ...prev.recentTransactions.slice(0, 19),
        ],
      };
    });
  };

  const refillCredits = (amount: number) => {
    setQuota((prev) => {
      const newRemaining = prev.creditsRemaining + amount;
      try {
        localStorage.setItem('rivue_credits', newRemaining.toString());
      } catch {}
      return {
        ...prev,
        creditsRemaining: newRemaining,
        recentTransactions: [
          {
            id: `tx_${Date.now()}`,
            module: 'keyword_search',
            creditsDeducted: -amount,
            balanceAfter: newRemaining,
            description: `Refilled +${amount.toLocaleString()} credits (Admin simulation)`,
            timestamp: 'Just now',
            userId: profile.email,
          },
          ...prev.recentTransactions.slice(0, 19),
        ],
      };
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const inviteTeamMember = (name: string, email: string, role: any) => {
    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      name,
      email,
      role,
      status: 'Invited',
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const runLiveAudit = async (url: string): Promise<AuditRun> => {
    setIsAuditing(true);
    deductCredits('site_audit', 100, `Live crawl and Core Web Vitals audit for ${url}`);

    try {
      // Call backend live analysis API
      const res = await fetch('/api/audit/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (res.ok) {
        const auditData = await res.json();
        setAudit(auditData);
        setIsAuditing(false);
        return auditData;
      }
    } catch (err) {
      console.warn('[Audit Engine] Fallback to simulated crawler:', err);
    }

    // Dynamic local fallback if server unreachable
    const hostname = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const score = Math.floor(Math.random() * 12) + 80;
    const dynamicAudit: AuditRun = {
      id: `audit_${Date.now()}`,
      siteId: `site_${hostname}`,
      targetUrl: url,
      healthScore: score,
      previousScore: score - 4,
      crawledPagesCount: 184,
      errorsCount: 3,
      warningsCount: 14,
      noticesCount: 22,
      passedChecksCount: 345,
      status: 'completed',
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      coreWebVitals: {
        lcp: { value: 1.8, unit: 's', rating: 'good' },
        inp: { value: 95, unit: 'ms', rating: 'good' },
        cls: { value: 0.04, unit: '', rating: 'good' },
        ttfb: { value: 290, unit: 'ms', rating: 'good' },
        fcp: { value: 1.1, unit: 's', rating: 'good' },
      },
      issues: [
        {
          id: 'iss_alt',
          code: 'missing_alt_tags',
          title: `3 Images Missing Alt Text on ${hostname}`,
          description: 'Images lack descriptive alt tags for accessibility and image search indexation.',
          severity: 'warning',
          category: 'onpage',
          impact: 'Lower visibility in Google Images and accessibility warnings.',
          howToFix: 'Add descriptive alt="keyword description" to all <img> tags.',
          affectedUrlsCount: 3,
          sampleUrls: [`${url}/assets/hero-banner.png`, `${url}/assets/logo.png`],
        },
        {
          id: 'iss_canonical',
          code: 'canonical_verification',
          title: 'Self-referencing Canonical URL Active',
          description: 'Canonical tag points cleanly to root domain.',
          severity: 'notice',
          category: 'onpage',
          impact: 'Prevents duplicate parameter indexation.',
          howToFix: 'Ensure parameter URLs point back to clean master URL.',
          affectedUrlsCount: 1,
          sampleUrls: [url],
        },
      ],
    };

    setAudit(dynamicAudit);
    setIsAuditing(false);
    return dynamicAudit;
  };

  const addTrackedKeyword = (kw: string, location = 'United States') => {
    deductCredits('rank_check', 5, `Added tracked keyword: "${kw}"`);
    const newKw: TrackedKeyword = {
      id: `trk_${Date.now()}`,
      keyword: kw,
      currentPosition: Math.floor(Math.random() * 8) + 1,
      previousPosition: Math.floor(Math.random() * 12) + 2,
      bestPosition: 1,
      searchVolume: Math.floor(Math.random() * 25000) + 2500,
      location,
      device: 'desktop',
      rankingUrl: `https://${targetDomain}/${kw.toLowerCase().replace(/\s+/g, '-')}`,
      serpFeatures: ['People Also Ask', 'Featured Snippet'],
      history: [
        { date: '2026-08-28', position: 5 },
        { date: '2026-08-29', position: 4 },
        { date: '2026-08-30', position: 2 },
      ],
      competitorPositions: { 'semrush.com': 2, 'ahrefs.com': 4 },
      lastChecked: 'Just now',
    };
    setRankData({
      ...rankData,
      totalTracked: rankData.totalTracked + 1,
      keywords: [newKw, ...rankData.keywords],
    });
  };

  const sendPitch = (journalistId: string, subject: string, message: string) => {
    deductCredits('pr_enrichment', 10, 'Outreach email pitch sent');
    setPrData({
      ...prData,
      journalists: prData.journalists.map((j) =>
        j.id === journalistId ? { ...j, pitchStatus: 'pitched', lastContactedAt: 'Just now' } : j
      ),
    });
  };

  const createSocialPost = (content: string, platforms: any[], scheduledFor: string) => {
    deductCredits('social_publish', 5, 'Scheduled social post');
    const newPost = {
      id: `post_${Date.now()}`,
      content,
      platforms,
      status: 'scheduled' as const,
      scheduledFor,
      author: profile.name,
    };
    setSocialData({
      ...socialData,
      scheduledCount: socialData.scheduledCount + 1,
      posts: [newPost, ...socialData.posts],
    });
  };

  return (
    <RivueContext.Provider
      value={{
        targetDomain,
        setTargetDomain,
        savedDomains,
        addSavedDomain,
        removeSavedDomain,
        quota,
        deductCredits,
        refillCredits,
        profile,
        updateProfile,
        teamMembers,
        inviteTeamMember,
        removeTeamMember,
        audit,
        runLiveAudit,
        isAuditing,
        rankData,
        addTrackedKeyword,
        prData,
        sendPitch,
        socialData,
        createSocialPost,
      }}
    >
      {children}
    </RivueContext.Provider>
  );
};

export const useRivue = () => {
  const context = useContext(RivueContext);
  if (!context) {
    throw new Error('useRivue must be used within a RivueProvider');
  }
  return context;
};
