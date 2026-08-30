'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Star,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Send,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import {
  MetricCard,
  ProgressRing,
  Card,
  Badge,
  Button,
  Tabs,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_LISTINGS_OVERVIEW } from '@rivue/db';
import { CustomerReview } from '@rivue/types';

export default function ListingsPage() {
  const [data, setData] = useState(SEED_LISTINGS_OVERVIEW);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const handleApplyAiReply = (reviewId: string, aiText?: string) => {
    if (!aiText) return;
    setReplyInput({ ...replyInput, [reviewId]: aiText });
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInput[reviewId];
    if (!text) return;
    setData({
      ...data,
      reviews: data.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              hasReplied: true,
              replyText: text,
              replyDate: 'Just now',
            }
          : r
      ),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="cyan" size="sm">Listing & Review Management</Badge>
          <span className="text-xs text-slate-400">Local SEO & Reputation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Directory Synchronization & Review AI
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Audit NAP consistency across Google, Bing, Apple Maps, and Yelp, and draft AI review replies in seconds.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="NAP Consistency"
          termKey="nap_consistency"
          value={`${data.napAudit.napScore}%`}
          subtitle="3 of 4 directories in sync"
          badge={<Badge variant="emerald" size="sm">High Match</Badge>}
          variant="cyan"
        />
        <MetricCard
          title="Average Rating"
          termKey="sentiment_score"
          value={`${data.averageRating} ★`}
          subtitle={`Across ${data.totalReviews} customer reviews`}
          icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
          variant="amber"
        />
        <MetricCard
          title="Review Sentiment"
          termKey="sentiment_score"
          value="92% Positive"
          subtitle="AI sentiment classifier"
          badge={<Badge variant="emerald" size="sm">Delighted</Badge>}
          variant="emerald"
        />
        <MetricCard
          title="Response Time SLA"
          termKey="sentiment_score"
          value={`${data.averageResponseTimeHours} hrs`}
          subtitle="88.5% response rate"
          variant="violet"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Tabs
          tabs={[
            { id: 'listings', label: 'Directory Synced Listings', count: data.listings.length },
            { id: 'reviews', label: 'Review Aggregation & AI Drafter', count: data.reviews.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* View 1: Directory Listings & NAP Audit */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Canonical Business Information
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                {data.napAudit.canonicalName}
              </h3>
              <p className="text-xs text-slate-400">
                {data.napAudit.canonicalAddress} • {data.napAudit.canonicalPhone}
              </p>
            </div>
            <Badge variant="cyan" size="md">
              Canonical Source
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.listings.map((list) => (
              <Card
                key={list.id}
                title={list.platformName}
                subtitle={`Last synced: ${list.lastSyncedAt}`}
                headerAction={
                  <Badge
                    variant={list.status === 'synced' ? 'emerald' : 'rose'}
                    size="sm"
                  >
                    {list.status === 'synced' ? 'Synced' : 'Discrepancy'}
                  </Badge>
                }
              >
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Published Name:</span>
                    <span className="font-semibold text-white">{list.publishedName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Published Address:</span>
                    <span className="text-slate-200">{list.publishedAddress}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono text-cyan-400">{list.publishedPhone}</span>
                  </div>

                  {list.discrepancies && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Action Required:</span>
                      </div>
                      {list.discrepancies.map((d, i) => (
                        <p key={i} className="text-[11px] text-slate-300">
                          • {d}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Reviews & AI Suggested Replies */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {data.reviews.map((rev) => (
            <Card
              key={rev.id}
              title={`${rev.authorName} on ${rev.platform.toUpperCase()}`}
              subtitle={`Published: ${rev.publishedAt}`}
              headerAction={
                <div className="flex items-center gap-2">
                  <Badge variant={rev.sentiment === 'positive' ? 'emerald' : 'slate'} size="sm">
                    {rev.sentiment.toUpperCase()}
                  </Badge>
                  <div className="flex items-center text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    {rev.rating}.0
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>

                {/* Existing Reply if already sent */}
                {rev.hasReplied && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Replied by Owner ({rev.replyDate})</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{rev.replyText}</p>
                  </div>
                )}

                {/* AI Reply Assistant if not replied yet */}
                {!rev.hasReplied && (
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Drafted Reply Suggestion:
                      </span>
                      {rev.aiSuggestedReply && (
                        <button
                          onClick={() => handleApplyAiReply(rev.id, rev.aiSuggestedReply)}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                        >
                          Use this template
                        </button>
                      )}
                    </div>

                    {rev.aiSuggestedReply && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        "{rev.aiSuggestedReply}"
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyInput[rev.id] || ''}
                        onChange={(e) =>
                          setReplyInput({ ...replyInput, [rev.id]: e.target.value })
                        }
                        placeholder="Customize and send your reply..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSendReply(rev.id)}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Publish Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
