'use client';

import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  Send,
  Plus,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Tabs,
  Modal,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_SOCIAL_OVERVIEW } from '@rivue/db';
import { SocialPost, SocialPlatform } from '@rivue/types';

export default function SocialSchedulingPage() {
  const [data, setData] = useState(SEED_SOCIAL_OVERVIEW);
  const [activeTab, setActiveTab] = useState<'composer' | 'calendar' | 'competitors'>('composer');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // Form state
  const [newContent, setNewContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['x', 'linkedin']);
  const [scheduledDate, setScheduledDate] = useState('2026-09-01T10:00');

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      content: newContent,
      platforms: selectedPlatforms,
      status: 'scheduled',
      scheduledFor: scheduledDate,
      author: 'Growth Team',
    };
    setData({
      ...data,
      scheduledCount: data.scheduledCount + 1,
      posts: [newPost, ...data.posts],
    });
    setNewContent('');
    setIsNewPostModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">Social Media Toolkit</Badge>
            <span className="text-xs text-slate-400">Multi-Network Scheduler & Ad Monitor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Social Scheduling & Competitor Ad Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compose and schedule content across X, LinkedIn, Instagram, and spy on competitor ad creatives.
          </p>
        </div>

        <Button onClick={() => setIsNewPostModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Schedule New Post
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Scheduled Queue"
          termKey="engagement_rate"
          value={data.scheduledCount}
          subtitle="Ready for dispatch"
          badge={<Badge variant="cyan" size="sm">Active</Badge>}
          variant="cyan"
        />
        <MetricCard
          title="Published (Month)"
          termKey="engagement_rate"
          value={data.publishedThisMonth}
          subtitle="Across 3 connected networks"
          trend={{ value: 14.5, direction: 'up' }}
          variant="default"
        />
        <MetricCard
          title="Avg Engagement Rate"
          termKey="engagement_rate"
          value={`${data.avgEngagementRate}%`}
          subtitle="LinkedIn & X combined"
          badge={<Badge variant="emerald" size="sm">Top Tier</Badge>}
          variant="emerald"
        />
        <MetricCard
          title="Audience Growth"
          termKey="engagement_rate"
          value={`+${data.audienceGrowthRate}%`}
          subtitle="Monthly net followers"
          trend={{ value: 4.8, direction: 'up' }}
          variant="violet"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Tabs
          tabs={[
            { id: 'composer', label: 'Post Queue & Drafts', count: data.posts.length },
            { id: 'competitors', label: 'Competitor Social & Ad Library', count: data.competitorSocial.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* View 1: Scheduled Posts Queue */}
      {activeTab === 'composer' && (
        <div className="space-y-4">
          {data.posts.map((post) => (
            <Card
              key={post.id}
              title={`Scheduled for ${new Date(post.scheduledFor).toLocaleDateString()} at ${new Date(
                post.scheduledFor
              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              subtitle={`Author: ${post.author || 'Team'}`}
              headerAction={
                <div className="flex items-center gap-2">
                  <Badge
                    variant={post.status === 'published' ? 'emerald' : 'cyan'}
                    size="sm"
                  >
                    {post.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {post.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.engagement && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Impressions: <strong className="text-white">{post.engagement.impressions.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-400">
                      Likes: <strong className="text-cyan-400">{post.engagement.likes}</strong>
                    </span>
                    <span className="text-slate-400">
                      Shares: <strong className="text-emerald-400">{post.engagement.shares}</strong>
                    </span>
                    <span className="text-slate-400">
                      Clicks: <strong className="text-violet-400">{post.engagement.clicks}</strong>
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View 2: Competitor Social & Ad Library */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.competitorSocial.map((comp, idx) => (
              <Card
                key={idx}
                title={`${comp.competitorDomain} (${comp.handle})`}
                subtitle={`Platform: ${comp.platform.toUpperCase()}`}
                headerAction={
                  <Badge variant="cyan" size="sm">
                    {comp.followersCount.toLocaleString()} Followers
                  </Badge>
                }
              >
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Posting Frequency:</span>
                    <span className="font-semibold text-white">{comp.postingFrequencyPerWeek} posts/week</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Avg Engagement Rate:</span>
                    <span className="font-mono text-emerald-400">{comp.averageEngagementRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Monthly Audience Growth:</span>
                    <span className="font-semibold text-cyan-300">+{comp.growthRateMonthly}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card
            title="Competitor Ad Creative Monitoring"
            termKey="engagement_rate"
            subtitle="Live sponsored ad snapshots from Meta & Google Ad Libraries"
          >
            <div className="space-y-4">
              {data.competitorAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ad.competitorDomain} Ad</span>
                    <Badge variant="emerald" size="sm">{ad.lastActive}</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-cyan-300">{ad.adHeadline}</h4>
                  <p className="text-xs text-slate-300">{ad.adBody}</p>
                  <p className="text-[10px] font-mono text-slate-500">{ad.landingPageUrl}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Compose & Schedule Post"
        subtitle="Publish to multiple social networks simultaneously."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewPostModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost} leftIcon={<Send className="w-4 h-4" />}>
              Queue Post
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Publishing Channels
            </label>
            <div className="flex items-center gap-2">
              {(['x', 'linkedin', 'instagram', 'facebook'] as SocialPlatform[]).map((p) => {
                const isSelected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Post Content
            </label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Draft your post, announcement, thread, or growth lesson..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Scheduled Date & Time (UTC)
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
