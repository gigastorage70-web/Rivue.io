import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { LivePageSignals } from '../content/index';

export const PopupApp: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LivePageSignals>({
    url: 'https://thezensodigital.com',
    domain: 'thezensodigital.com',
    title: 'AI-Driven Digital Marketing Agency | The Zenso Digital',
    titleLength: 53,
    titleRating: 'good',
    titleMessage: '53 characters (Optimal)',
    metaDescription: 'AI-Driven performance marketing, SEO, and paid growth services for scaling brands.',
    metaDescriptionLength: 82,
    metaRating: 'warn',
    metaMessage: '82 characters. Expand to 140+ chars for better CTR.',
    canonicalUrl: 'https://thezensodigital.com/',
    canonicalRating: 'good',
    canonicalMessage: 'Valid canonical tag present',
    h1Count: 1,
    h1Rating: 'good',
    h1Message: '1 Main H1 found',
    headings: [
      { tag: 'h1', text: 'AI-Driven Growth Engine for Modern Brands' },
      { tag: 'h2', text: 'Our Performance Marketing Services' },
    ],
    wordCount: 840,
    wordCountRating: 'good',
    imagesTotal: 14,
    imagesMissingAlt: 3,
    imagesRating: 'warn',
    imagesMessage: '3 images missing alt text',
    structuredDataPresent: true,
    schemaTypes: ['Organization', 'WebSite'],
    healthScore: 82,
    domainRatingEstimate: 58,
    criticalIssues: ['3 images missing alt tags for SEO and accessibility.'],
    recommendations: ['Expand meta description to 140+ characters.', 'Add BreadcrumbList schema.'],
  });

  const fetchLiveTabSignals = () => {
    setLoading(true);
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'GET_PAGE_SIGNALS' }, (response: LivePageSignals) => {
            if (response && response.url) {
              setData(response);
            } else if (activeTab.url) {
              // Parse URL directly if content script not responding
              const hostname = new URL(activeTab.url).hostname.replace(/^www\./, '');
              setData((prev) => ({
                ...prev,
                url: activeTab.url || prev.url,
                domain: hostname,
                title: activeTab.title || prev.title,
                titleLength: activeTab.title ? activeTab.title.length : prev.titleLength,
              }));
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTabSignals();
  }, []);

  const handleOpenSidePanel = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
      window.close();
    }
  };

  const handleOpenDashboard = () => {
    const targetUrl = `http://localhost:3000/audit?url=${encodeURIComponent(data.url)}`;
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: targetUrl });
    } else {
      window.open(targetUrl, '_blank');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'color:#10b981;';
    if (score >= 60) return 'color:#f59e0b;';
    return 'color:#ef4444;';
  };

  return (
    <div className="ext-container">
      {/* Header */}
      <div className="ext-header">
        <div className="ext-brand">
          <div className="ext-logo-badge">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="ext-title">RIVUE QUICK PULSE</div>
            <div className="ext-url-chip" title={data.url}>{data.domain}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={fetchLiveTabSignals}
            title="Refresh Live Audit"
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenSidePanel}
            title="Open Deep Side Panel"
            style={{
              padding: '6px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#22d3ee',
              cursor: 'pointer',
            }}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Real Health & Authority Scores */}
      <div className="ext-score-card">
        <div className="ext-score-item">
          <span className="ext-score-label">Rivue Health</span>
          <div className="ext-score-value" style={{ color: data.healthScore >= 80 ? '#10b981' : data.healthScore >= 60 ? '#f59e0b' : '#ef4444' }}>
            {data.healthScore}
          </div>
          <span className="ext-score-grade" style={{ color: data.healthScore >= 80 ? '#10b981' : data.healthScore >= 60 ? '#f59e0b' : '#ef4444' }}>
            {data.healthScore >= 80 ? 'Good' : data.healthScore >= 60 ? 'Fair' : 'Critical'}
          </span>
        </div>

        <div className="ext-divider-v" />

        <div className="ext-score-item">
          <span className="ext-score-label">Domain Rating</span>
          <div className="ext-score-value cyan">
            {data.domainRatingEstimate}
          </div>
          <span className="ext-score-grade" style={{ color: '#06b6d4' }}>
            {data.domainRatingEstimate > 50 ? 'Top 15%' : 'Emerging'}
          </span>
        </div>
      </div>

      {/* Live On-Page Checks */}
      <div className="ext-card">
        <div className="ext-card-title">
          <span>Live On-Page SEO Findings</span>
          <span className="ext-badge info">{data.wordCount} words</span>
        </div>

        {/* Title Tag */}
        <div className="ext-check-item">
          <div className="ext-check-left">
            {data.titleRating === 'good' ? (
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : data.titleRating === 'warn' ? (
              <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <div>
              <div className="ext-check-text">Title: {data.titleLength} chars</div>
              <div className="ext-check-desc">{data.title ? `"${data.title.substring(0, 50)}..."` : 'No title found'}</div>
            </div>
          </div>
          <span className={`ext-badge ${data.titleRating}`}>{data.titleRating.toUpperCase()}</span>
        </div>

        {/* Meta Description */}
        <div className="ext-check-item">
          <div className="ext-check-left">
            {data.metaRating === 'good' ? (
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <div>
              <div className="ext-check-text">Meta Description: {data.metaDescriptionLength} chars</div>
              <div className="ext-check-desc">{data.metaMessage}</div>
            </div>
          </div>
          <span className={`ext-badge ${data.metaRating}`}>{data.metaRating.toUpperCase()}</span>
        </div>

        {/* Headings */}
        <div className="ext-check-item">
          <div className="ext-check-left">
            {data.h1Rating === 'good' ? (
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <div>
              <div className="ext-check-text">H1 Headings: {data.h1Count} found</div>
              <div className="ext-check-desc">{data.h1Message}</div>
            </div>
          </div>
          <span className={`ext-badge ${data.h1Rating}`}>{data.h1Rating.toUpperCase()}</span>
        </div>

        {/* Images Missing Alt */}
        <div className="ext-check-item">
          <div className="ext-check-left">
            {data.imagesMissingAlt === 0 ? (
              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            ) : (
              <AlertTriangle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
            )}
            <div>
              <div className="ext-check-text">Images Alt Tags</div>
              <div className="ext-check-desc">{data.imagesMessage}</div>
            </div>
          </div>
          <span className={`ext-badge ${data.imagesRating}`}>{data.imagesRating.toUpperCase()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
        <button className="ext-btn-primary" onClick={handleOpenSidePanel}>
          <span>Open Full Side Panel Inspector</span>
          <ChevronRight size={15} />
        </button>

        <button className="ext-btn-secondary" onClick={handleOpenDashboard}>
          <span>Open in Web Dashboard</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};
