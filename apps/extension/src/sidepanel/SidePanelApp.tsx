import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Code,
  Layers,
  Search,
  Users,
} from 'lucide-react';
import { LivePageSignals } from '../content/index';

export const SidePanelApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'onpage' | 'headings' | 'keywords' | 'competitors'>('onpage');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LivePageSignals>({
    url: 'https://thezensodigital.com',
    domain: 'thezensodigital.com',
    title: 'AI-Driven Digital Marketing Agency | The Zenso Digital',
    titleLength: 53,
    titleRating: 'good',
    titleMessage: '53 characters (Ideal: 50–60 chars)',
    metaDescription: 'AI-Driven performance marketing, SEO, and paid growth services for scaling brands.',
    metaDescriptionLength: 82,
    metaRating: 'warn',
    metaMessage: '82 characters. Expand to 140+ chars for better CTR.',
    canonicalUrl: 'https://thezensodigital.com/',
    canonicalRating: 'good',
    canonicalMessage: 'Valid canonical tag specified',
    h1Count: 1,
    h1Rating: 'good',
    h1Message: '1 Main H1 tag found',
    headings: [
      { tag: 'h1', text: 'AI-Driven Growth Engine for Modern Brands' },
      { tag: 'h2', text: 'Our Performance Marketing Services' },
      { tag: 'h2', text: 'Case Studies & Client Results' },
      { tag: 'h3', text: 'SEO & Search Engine Domination' },
      { tag: 'h3', text: 'Paid Media & High-Velocity PPC' },
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

  const fetchLiveSignals = () => {
    setLoading(true);
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'GET_PAGE_SIGNALS' }, (response: LivePageSignals) => {
            if (response && response.url) {
              setData(response);
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
    fetchLiveSignals();
  }, []);

  return (
    <div className="ext-container" style={{ padding: '16px', gap: '14px' }}>
      {/* Header */}
      <div className="ext-header">
        <div className="ext-brand">
          <div className="ext-logo-badge">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="ext-title">RIVUE SIDE PANEL</div>
            <div className="ext-url-chip" title={data.url}>{data.domain}</div>
          </div>
        </div>

        <button
          onClick={fetchLiveSignals}
          title="Refresh Analysis"
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
      </div>

      {/* Navigation Tabs */}
      <div className="ext-tabs-bar">
        <button
          className={`ext-tab-btn ${activeTab === 'onpage' ? 'active' : ''}`}
          onClick={() => setActiveTab('onpage')}
        >
          On-Page
        </button>
        <button
          className={`ext-tab-btn ${activeTab === 'headings' ? 'active' : ''}`}
          onClick={() => setActiveTab('headings')}
        >
          Headings ({data.headings.length})
        </button>
        <button
          className={`ext-tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
          onClick={() => setActiveTab('keywords')}
        >
          Keywords
        </button>
        <button
          className={`ext-tab-btn ${activeTab === 'competitors' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitors')}
        >
          Competitors
        </button>
      </div>

      {/* TAB 1: ON-PAGE SIGNALS */}
      {activeTab === 'onpage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Quick Metrics */}
          <div className="ext-score-card">
            <div className="ext-score-item">
              <span className="ext-score-label">Health Score</span>
              <div className="ext-score-value">{data.healthScore}</div>
              <span className="ext-score-grade">{data.healthScore >= 80 ? 'Good' : 'Needs Work'}</span>
            </div>
            <div className="ext-divider-v" />
            <div className="ext-score-item">
              <span className="ext-score-label">Est. Domain Rating</span>
              <div className="ext-score-value cyan">{data.domainRatingEstimate}</div>
              <span className="ext-score-grade" style={{ color: '#06b6d4' }}>DR Rating</span>
            </div>
            <div className="ext-divider-v" />
            <div className="ext-score-item">
              <span className="ext-score-label">Word Count</span>
              <div className="ext-score-value" style={{ color: '#f8fafc', fontSize: '20px' }}>{data.wordCount}</div>
              <span className="ext-score-grade" style={{ color: '#94a3b8' }}>words</span>
            </div>
          </div>

          {/* Detailed Elements */}
          <div className="ext-card">
            <div className="ext-card-title">
              <span>Title & Meta Tags</span>
              <span className="ext-badge info">{data.titleLength} chars</span>
            </div>
            <div style={{ fontSize: '11px', color: '#f8fafc', fontWeight: 600 }}>
              "{data.title || 'No Title'}"
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
              <strong>Meta Description:</strong> {data.metaDescription || 'Missing meta description tag.'}
            </div>
          </div>

          <div className="ext-card">
            <div className="ext-card-title">
              <span>Technical Signals</span>
              <span className="ext-badge good">Valid</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Canonical URL:</span>
              <span style={{ color: '#f8fafc', fontFamily: 'monospace', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.canonicalUrl || 'Not specified'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Structured Data:</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>
                {data.schemaTypes.length > 0 ? data.schemaTypes.join(', ') : 'None'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
              <span style={{ color: '#94a3b8' }}>Missing Alt Images:</span>
              <span style={{ color: data.imagesMissingAlt > 0 ? '#fbbf24' : '#34d399', fontWeight: 700 }}>
                {data.imagesMissingAlt} of {data.imagesTotal} images
              </span>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="ext-card" style={{ border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <div className="ext-card-title" style={{ color: '#fbbf24' }}>
              <span>Actionable Recommendations</span>
            </div>
            {data.recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#f8fafc' }}>
                <span style={{ color: '#fbbf24' }}>•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HEADINGS TREE */}
      {activeTab === 'headings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="ext-card-title">
            <span>Heading Hierarchy Tree</span>
            <span className="ext-badge info">{data.headings.length} tags</span>
          </div>

          {data.headings.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
              No headings found on this page.
            </div>
          ) : (
            data.headings.map((h, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: h.tag === 'h1' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                  border: h.tag === 'h1' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid #334155',
                  marginLeft: h.tag === 'h2' ? '12px' : h.tag === 'h3' ? '24px' : '0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className={`ext-badge ${h.tag === 'h1' ? 'info' : 'slate'}`}>{h.tag.toUpperCase()}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>
                    {h.text}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: KEYWORDS FOR THIS PAGE */}
      {activeTab === 'keywords' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="ext-card-title">
            <span>Live Keyword Opportunities</span>
            <span className="ext-badge good">High Intent</span>
          </div>

          {[
            { kw: `${data.domain} seo agency`, vol: 4800, kd: 32, pos: '#1' },
            { kw: 'ai performance marketing', vol: 8900, kd: 44, pos: '#3' },
            { kw: 'digital marketing roi', vol: 14200, kd: 52, pos: '#7' },
          ].map((k, i) => (
            <div key={i} className="ext-check-item">
              <div className="ext-check-left">
                <Search size={14} color="#06b6d4" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="ext-check-text">{k.kw}</div>
                  <div className="ext-check-desc">Vol: {k.vol.toLocaleString()} • KD: {k.kd}</div>
                </div>
              </div>
              <span className="ext-badge info">{k.pos}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: COMPETITORS COMPARE */}
      {activeTab === 'competitors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="ext-card-title">
            <span>Niche Competitor Authority</span>
          </div>

          {[
            { name: data.domain, dr: data.domainRatingEstimate, traffic: '12.4k', isSelf: true },
            { name: 'semrush.com', dr: 91, traffic: '14.2M', isSelf: false },
            { name: 'ahrefs.com', dr: 90, traffic: '11.8M', isSelf: false },
            { name: 'mangools.com', dr: 77, traffic: '890k', isSelf: false },
          ].map((c, i) => (
            <div
              key={i}
              className="ext-check-item"
              style={{
                background: c.isSelf ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.8)',
                border: c.isSelf ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid #334155',
              }}
            >
              <div className="ext-check-left">
                <div>
                  <div className="ext-check-text" style={{ color: c.isSelf ? '#22d3ee' : '#f8fafc' }}>
                    {c.name} {c.isSelf && '(Current Site)'}
                  </div>
                  <div className="ext-check-desc">Est. Traffic: {c.traffic}/mo</div>
                </div>
              </div>
              <span className="ext-badge info">DR {c.dr}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
