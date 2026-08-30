/**
 * Rivue Chrome Extension Content Script
 * Extracts live on-page SEO signals and enables floating overlay.
 */

export interface OnPageSignals {
  url: string;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  canonicalUrl: string;
  headings: Array<{ tag: string; text: string }>;
  wordCount: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  structuredDataPresent: boolean;
  schemaTypes: string[];
  ogTitle?: string;
  ogImage?: string;
  robotsDirectives?: string;
}

export function extractPageSignals(): OnPageSignals {
  const url = window.location.href;
  const title = document.title || '';
  
  const metaDescEl = document.querySelector('meta[name="description"]');
  const metaDescription = metaDescEl?.getAttribute('content') || '';

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonicalEl?.getAttribute('href') || '';

  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  const ogTitle = ogTitleEl?.getAttribute('content') || undefined;

  const ogImageEl = document.querySelector('meta[property="og:image"]');
  const ogImage = ogImageEl?.getAttribute('content') || undefined;

  const robotsEl = document.querySelector('meta[name="robots"]');
  const robotsDirectives = robotsEl?.getAttribute('content') || undefined;

  // Headings
  const headingEls = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headings: Array<{ tag: string; text: string }> = [];
  headingEls.forEach((el) => {
    headings.push({
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || '',
    });
  });

  // Word count
  const bodyText = document.body?.innerText || '';
  const words = bodyText.match(/\b\w+\b/g);
  const wordCount = words ? words.length : 0;

  // Images
  const imgEls = document.querySelectorAll('img');
  let imagesMissingAlt = 0;
  imgEls.forEach((img) => {
    if (!img.getAttribute('alt')?.trim()) {
      imagesMissingAlt++;
    }
  });

  // Structured data (JSON-LD)
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  jsonLdScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || '{}');
      if (data['@type']) {
        schemaTypes.push(data['@type']);
      }
    } catch {
      // ignore
    }
  });

  return {
    url,
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    canonicalUrl,
    headings,
    wordCount,
    imagesTotal: imgEls.length,
    imagesMissingAlt,
    structuredDataPresent: jsonLdScripts.length > 0,
    schemaTypes,
    ogTitle,
    ogImage,
    robotsDirectives,
  };
}

// Inject floating Rivue overlay trigger
function injectFloatingOverlay() {
  if (document.getElementById('rivue-floating-badge')) return;

  const badge = document.createElement('div');
  badge.id = 'rivue-floating-badge';
  badge.style.position = 'fixed';
  badge.style.bottom = '20px';
  badge.style.right = '20px';
  badge.style.zIndex = '999999';
  badge.style.cursor = 'pointer';
  badge.style.display = 'flex';
  badge.style.alignItems = 'center';
  badge.style.gap = '8px';
  badge.style.padding = '8px 14px';
  badge.style.borderRadius = '9999px';
  badge.style.backgroundColor = '#0f172a';
  badge.style.border = '1px solid rgba(6, 182, 212, 0.4)';
  badge.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.3)';
  badge.style.color = '#ffffff';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = '700';
  badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  badge.style.transition = 'transform 0.2s ease';

  badge.innerHTML = `
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;"></span>
    <span>RIVUE: <strong>88</strong>/100</span>
  `;

  badge.onmouseenter = () => {
    badge.style.transform = 'scale(1.05)';
  };
  badge.onmouseleave = () => {
    badge.style.transform = 'scale(1)';
  };

  badge.onclick = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
    }
  };

  document.body.appendChild(badge);
}

// Listen for messages from popup or sidepanel
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_PAGE_SIGNALS') {
      const signals = extractPageSignals();
      sendResponse(signals);
    }
  });
}

// Initialize floating badge on document load
if (document.readyState === 'complete') {
  injectFloatingOverlay();
} else {
  window.addEventListener('load', injectFloatingOverlay);
}
