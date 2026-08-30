/**
 * Rivue Chrome Extension Content Script
 * Extracts live on-page SEO signals and computes real-time health score.
 */

export interface LivePageSignals {
  url: string;
  domain: string;
  title: string;
  titleLength: number;
  titleRating: 'good' | 'warn' | 'bad';
  titleMessage: string;
  
  metaDescription: string;
  metaDescriptionLength: number;
  metaRating: 'good' | 'warn' | 'bad';
  metaMessage: string;

  canonicalUrl: string;
  canonicalRating: 'good' | 'warn' | 'bad';
  canonicalMessage: string;

  h1Count: number;
  h1Rating: 'good' | 'warn' | 'bad';
  h1Message: string;
  headings: Array<{ tag: string; text: string }>;

  wordCount: number;
  wordCountRating: 'good' | 'warn';

  imagesTotal: number;
  imagesMissingAlt: number;
  imagesRating: 'good' | 'warn' | 'bad';
  imagesMessage: string;

  structuredDataPresent: boolean;
  schemaTypes: string[];

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  healthScore: number;
  domainRatingEstimate: number;
  criticalIssues: string[];
  recommendations: string[];
}

export function extractLivePageSignals(): LivePageSignals {
  const url = window.location.href;
  const domain = window.location.hostname.replace(/^www\./, '');
  
  // Title
  const title = document.title ? document.title.trim() : '';
  const titleLength = title.length;
  let titleRating: 'good' | 'warn' | 'bad' = 'good';
  let titleMessage = `${titleLength} characters (Ideal: 50–60 chars)`;
  if (!title) {
    titleRating = 'bad';
    titleMessage = 'Missing <title> tag entirely!';
  } else if (titleLength < 30) {
    titleRating = 'warn';
    titleMessage = `Too short (${titleLength} chars). Expand to at least 40–60 characters.`;
  } else if (titleLength > 65) {
    titleRating = 'warn';
    titleMessage = `Too long (${titleLength} chars). Google may truncate beyond 60 chars.`;
  }

  // Meta Description
  const metaDescEl = document.querySelector('meta[name="description"]');
  const metaDescription = metaDescEl ? (metaDescEl.getAttribute('content') || '').trim() : '';
  const metaDescriptionLength = metaDescription.length;
  let metaRating: 'good' | 'warn' | 'bad' = 'good';
  let metaMessage = `${metaDescriptionLength} characters (Ideal: 130–160 chars)`;
  if (!metaDescription) {
    metaRating = 'bad';
    metaMessage = 'Missing meta description! Search engines will auto-generate snippets.';
  } else if (metaDescriptionLength < 70) {
    metaRating = 'warn';
    metaMessage = `Short meta description (${metaDescriptionLength} chars). Expand to 140+ chars.`;
  } else if (metaDescriptionLength > 165) {
    metaRating = 'warn';
    metaMessage = `Meta description is ${metaDescriptionLength} chars (may be truncated).`;
  }

  // Canonical Tag
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalEl ? (canonicalEl.getAttribute('href') || '').trim() : '';
  let canonicalRating: 'good' | 'warn' | 'bad' = 'good';
  let canonicalMessage = 'Valid canonical tag specified';
  if (!canonicalUrl) {
    canonicalRating = 'warn';
    canonicalMessage = 'No canonical tag found. Add rel="canonical" to prevent duplicate URL issues.';
  }

  // Headings
  const headingEls = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headings: Array<{ tag: string; text: string }> = [];
  let h1Count = 0;
  headingEls.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1') h1Count++;
    const text = el.textContent ? el.textContent.trim().replace(/\s+/g, ' ') : '';
    if (text) {
      headings.push({ tag, text: text.substring(0, 120) });
    }
  });

  let h1Rating: 'good' | 'warn' | 'bad' = 'good';
  let h1Message = `1 Main H1 tag found (${h1Count === 1 ? headings.find(h => h.tag === 'h1')?.text : ''})`;
  if (h1Count === 0) {
    h1Rating = 'bad';
    h1Message = 'Critical: No <h1> heading found on this page!';
  } else if (h1Count > 1) {
    h1Rating = 'warn';
    h1Message = `Multiple H1 tags found (${h1Count}). Best practice is exactly one primary H1.`;
  }

  // Word Count
  const bodyText = document.body ? document.body.innerText || '' : '';
  const words = bodyText.match(/\b[\w'-]+\b/g);
  const wordCount = words ? words.length : 0;
  const wordCountRating = wordCount >= 300 ? 'good' : 'warn';

  // Images
  const imgEls = document.querySelectorAll('img');
  let imagesMissingAlt = 0;
  imgEls.forEach((img) => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') {
      imagesMissingAlt++;
    }
  });
  let imagesRating: 'good' | 'warn' | 'bad' = 'good';
  let imagesMessage = `${imgEls.length} images, all have alt attributes`;
  if (imagesMissingAlt > 0) {
    imagesRating = imagesMissingAlt > 3 ? 'bad' : 'warn';
    imagesMessage = `${imagesMissingAlt} of ${imgEls.length} images missing descriptive alt tags!`;
  }

  // Structured Data (JSON-LD)
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  jsonLdScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || '{}');
      if (data['@type']) {
        if (Array.isArray(data['@type'])) {
          schemaTypes.push(...data['@type']);
        } else {
          schemaTypes.push(data['@type']);
        }
      }
    } catch {
      // ignore
    }
  });

  // Open Graph
  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  const ogTitle = ogTitleEl ? (ogTitleEl.getAttribute('content') || undefined) : undefined;
  const ogDescEl = document.querySelector('meta[property="og:description"]');
  const ogDescription = ogDescEl ? (ogDescEl.getAttribute('content') || undefined) : undefined;
  const ogImageEl = document.querySelector('meta[property="og:image"]');
  const ogImage = ogImageEl ? (ogImageEl.getAttribute('content') || undefined) : undefined;

  // Real Health Score Calculation (0-100)
  let score = 100;
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  if (titleRating === 'bad') {
    score -= 20;
    criticalIssues.push('Add a descriptive <title> tag to this page.');
  } else if (titleRating === 'warn') {
    score -= 8;
    recommendations.push(titleMessage);
  }

  if (metaRating === 'bad') {
    score -= 15;
    criticalIssues.push('Add a compelling meta description (140-160 characters).');
  } else if (metaRating === 'warn') {
    score -= 6;
    recommendations.push(metaMessage);
  }

  if (h1Rating === 'bad') {
    score -= 15;
    criticalIssues.push('Add a single primary <h1> tag defining the topic of this page.');
  } else if (h1Rating === 'warn') {
    score -= 6;
    recommendations.push(h1Message);
  }

  if (canonicalRating !== 'good') {
    score -= 8;
    recommendations.push(canonicalMessage);
  }

  if (imagesMissingAlt > 0) {
    const penalty = Math.min(15, imagesMissingAlt * 4);
    score -= penalty;
    criticalIssues.push(`${imagesMissingAlt} images need alt tags for SEO and accessibility.`);
  }

  if (schemaTypes.length === 0) {
    score -= 8;
    recommendations.push('Inject Schema.org JSON-LD (e.g. Organization, Article, WebSite).');
  }

  if (wordCount < 250) {
    score -= 10;
    recommendations.push(`Thin content detected (${wordCount} words). Add substantive content.`);
  }

  const healthScore = Math.max(15, Math.min(100, Math.round(score)));

  // Estimate DR based on domain characteristics
  let domainRatingEstimate = 45;
  if (domain.includes('google') || domain.includes('github') || domain.includes('microsoft') || domain.includes('apple') || domain.includes('wikipedia')) {
    domainRatingEstimate = 95;
  } else if (domain.includes('thezensodigital')) {
    domainRatingEstimate = 58;
  } else if (domain.includes('rivue')) {
    domainRatingEstimate = 64;
  }

  return {
    url,
    domain,
    title,
    titleLength,
    titleRating,
    titleMessage,
    metaDescription,
    metaDescriptionLength,
    metaRating,
    metaMessage,
    canonicalUrl,
    canonicalRating,
    canonicalMessage,
    h1Count,
    h1Rating,
    h1Message,
    headings,
    wordCount,
    wordCountRating,
    imagesTotal: imgEls.length,
    imagesMissingAlt,
    imagesRating,
    imagesMessage,
    structuredDataPresent: schemaTypes.length > 0,
    schemaTypes,
    ogTitle,
    ogDescription,
    ogImage,
    healthScore,
    domainRatingEstimate,
    criticalIssues,
    recommendations,
  };
}

// Injects floating Rivue Badge overlay
function injectFloatingOverlay() {
  if (document.getElementById('rivue-floating-badge')) return;

  const data = extractLivePageSignals();

  const badge = document.createElement('div');
  badge.id = 'rivue-floating-badge';
  badge.style.position = 'fixed';
  badge.style.bottom = '20px';
  badge.style.right = '20px';
  badge.style.zIndex = '9999999';
  badge.style.cursor = 'pointer';
  badge.style.display = 'flex';
  badge.style.alignItems = 'center';
  badge.style.gap = '8px';
  badge.style.padding = '8px 14px';
  badge.style.borderRadius = '9999px';
  badge.style.backgroundColor = '#070b14';
  badge.style.border = '1px solid rgba(6, 182, 212, 0.5)';
  badge.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(6, 182, 212, 0.3)';
  badge.style.color = '#ffffff';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = '700';
  badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  badge.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

  const dotColor = data.healthScore >= 80 ? '#10b981' : data.healthScore >= 60 ? '#f59e0b' : '#ef4444';

  badge.innerHTML = `
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dotColor};"></span>
    <span style="letter-spacing:0.5px;">RIVUE: <strong style="color:#22d3ee;">${data.healthScore}</strong>/100</span>
  `;

  badge.onmouseenter = () => {
    badge.style.transform = 'scale(1.06)';
  };
  badge.onmouseleave = () => {
    badge.style.transform = 'scale(1)';
  };

  badge.onclick = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
    }
  };

  document.body.appendChild(badge);
}

// Message Listener
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_PAGE_SIGNALS') {
      const liveData = extractLivePageSignals();
      sendResponse(liveData);
    }
    return true;
  });
}

if (document.readyState === 'complete') {
  injectFloatingOverlay();
} else {
  window.addEventListener('load', injectFloatingOverlay);
}
