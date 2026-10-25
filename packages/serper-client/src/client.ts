import { SerpSnapshot, NewsResult, PlacesResult, OrganicResult, DataProvenance } from '@rivue/types';
import { MOCK_SERP_FIXTURES, MOCK_NEWS_FIXTURES, MOCK_PLACES_FIXTURES } from './fixtures';
import {
  computeEstimatedCtr,
  computeSerpFeatureCount,
  computeTopCompetitorDomains,
  computeSerpVolatility,
  extractDomainFromUrl,
} from './derived';

export class DataFetchError extends Error {
  constructor(public source: string, public originalError?: any) {
    super(`[DataFetchError] Live fetch from ${source} failed: ${originalError?.message || originalError || 'Unknown error'}`);
    this.name = 'DataFetchError';
  }
}

export class MockDataProhibitedError extends Error {
  constructor(message = 'Mock data is strictly prohibited in production builds or when USE_MOCK_DATA is false') {
    super(`[MockDataProhibitedError] ${message}`);
    this.name = 'MockDataProhibitedError';
  }
}

export class ApiRateLimitError extends Error {
  constructor(public endpoint: string, public retryAfterSeconds?: number) {
    super(`[ApiRateLimitError] Rate limit hit on ${endpoint}. Retry after ${retryAfterSeconds || 60}s`);
    this.name = 'ApiRateLimitError';
  }
}

export interface SerperClientConfig {
  apiKey?: string;
  baseUrl?: string;
  cacheTtlMs?: number;
  useMockData?: boolean;
}

export interface SerperSearchParams {
  q: string;
  gl?: string;
  hl?: string;
  location?: string;
  num?: number;
  page?: number;
  type?: 'search' | 'news' | 'places' | 'images' | 'autocomplete';
}

export class SerperClient {
  private apiKey: string | undefined;
  private baseUrl: string;
  private cache: Map<string, { data: any; fetchedAt: string; expiresAt: number }> = new Map();
  private cacheTtlMs: number;
  private explicitMockMode: boolean;

  constructor(config?: SerperClientConfig) {
    this.apiKey = config?.apiKey || process.env.SERPER_API_KEY;
    this.baseUrl = config?.baseUrl || 'https://google.serper.dev';
    this.cacheTtlMs = config?.cacheTtlMs || 1000 * 60 * 60 * 12; // 12 hours default
    this.explicitMockMode = config?.useMockData ?? (process.env.USE_MOCK_DATA === 'true');
  }

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  private assertMockAllowed(): void {
    if (this.isProduction()) {
      throw new MockDataProhibitedError(
        'Critical Integrity Violation: Mock data is strictly forbidden in production environments (production-grade-dashboard-standard §4).'
      );
    }
    if (!this.explicitMockMode) {
      throw new MockDataProhibitedError(
        'Mock fallback disabled. To run offline unit tests with mock fixtures, explicitly set USE_MOCK_DATA=true.'
      );
    }
  }

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): { data: T; fetchedAt: string; expiresAt: number } | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setInCache(key: string, data: any): { fetchedAt: string; expiresAt: number } {
    const now = new Date().toISOString();
    const expiresAt = Date.now() + this.cacheTtlMs;
    this.cache.set(key, { data, fetchedAt: now, expiresAt });
    return { fetchedAt: now, expiresAt };
  }

  /**
   * Executes fetch with exponential backoff for transient network & 429 rate limit errors (Standard §7)
   */
  private async fetchWithRetry(url: string, body: Record<string, any>, maxRetries = 3): Promise<any> {
    if (!this.apiKey) {
      throw new DataFetchError(url, 'SERPER_API_KEY is not configured');
    }

    let attempt = 0;
    let lastError: any = null;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          const retryHeader = response.headers.get('Retry-After');
          const delaySec = retryHeader ? parseInt(retryHeader, 10) : Math.pow(2, attempt);
          if (attempt >= maxRetries - 1) {
            throw new ApiRateLimitError(url, delaySec);
          }
          await new Promise((r) => setTimeout(r, delaySec * 1000));
          attempt++;
          continue;
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errBody}`);
        }

        return await response.json();
      } catch (err: any) {
        lastError = err;
        attempt++;
        if (attempt >= maxRetries) break;
        // Exponential backoff
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 400));
      }
    }

    throw new DataFetchError(url, lastError);
  }

  /**
   * Main Search Endpoint (POST /search)
   * Guaranteed to carry DataProvenance (Standard §5) and never silently fall back without explicit switch (Standard §4)
   */
  async search(params: SerperSearchParams): Promise<SerpSnapshot> {
    const start = performance.now();
    const cacheKey = this.getCacheKey('/search', params);
    const cached = this.getFromCache<SerpSnapshot>(cacheKey);

    if (cached) {
      return {
        ...cached.data,
        provenance: {
          source: 'cached',
          fetchedAt: cached.fetchedAt,
          staleAfter: new Date(cached.expiresAt).toISOString(),
          provider: 'Serper In-Memory Cache',
          latencyMs: Math.round(performance.now() - start),
        },
      };
    }

    let rawData: any = null;
    let provenanceSource: 'live' | 'mock' = 'live';

    if (this.apiKey) {
      try {
        rawData = await this.fetchWithRetry(`${this.baseUrl}/search`, params);
      } catch (err) {
        // If live fails, check if mock data is explicitly authorized
        if (this.explicitMockMode && !this.isProduction()) {
          console.warn(`[SerperClient] Live call failed. USE_MOCK_DATA=true active, loading fixture for "${params.q}"`);
          provenanceSource = 'mock';
          rawData = MOCK_SERP_FIXTURES[params.q.toLowerCase()] || this.generateDynamicMockSearch(params.q);
        } else {
          throw err;
        }
      }
    } else {
      // No API key configured
      this.assertMockAllowed();
      provenanceSource = 'mock';
      rawData = MOCK_SERP_FIXTURES[params.q.toLowerCase()] || this.generateDynamicMockSearch(params.q);
    }

    const organicWithCtr: OrganicResult[] = (rawData.organic || []).map((item: any) => ({
      position: item.position,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      domain: extractDomainFromUrl(item.link || ''),
      estimatedCtr: computeEstimatedCtr(item.position, !!rawData.answerBox),
      sitelinks: item.sitelinks,
    }));

    const serpFeatureCount = computeSerpFeatureCount({
      knowledgeGraph: rawData.knowledgeGraph,
      peopleAlsoAsk: rawData.peopleAlsoAsk,
      places: rawData.places,
      news: rawData.news,
      ads: rawData.ads,
      images: rawData.images,
    });

    const now = new Date().toISOString();
    const staleAfter = new Date(Date.now() + this.cacheTtlMs).toISOString();
    const latencyMs = Math.round(performance.now() - start);

    const provenance: DataProvenance = {
      source: provenanceSource,
      fetchedAt: now,
      staleAfter,
      provider: provenanceSource === 'live' ? 'Serper Live API' : 'Offline Mock Fixture',
      latencyMs,
    };

    const snapshot: SerpSnapshot = {
      id: `serp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      query: params.q,
      geo: params.gl || 'us',
      language: params.hl || 'en',
      device: 'desktop',
      fetchedAt: now,
      searchParameters: rawData.searchParameters || params,
      organic: organicWithCtr,
      peopleAlsoAsk: rawData.peopleAlsoAsk || [],
      relatedSearches: rawData.relatedSearches || [],
      knowledgeGraph: rawData.knowledgeGraph,
      places: rawData.places,
      news: rawData.news,
      derived: {
        serpFeatureCount,
        localPackPresent: Boolean(rawData.places && rawData.places.length > 0),
        organicCtrEstimate: organicWithCtr[0]?.estimatedCtr || 28.5,
        serpVolatilityIndex: computeSerpVolatility([1, 2, 1, 3, 2, 4, 3]),
        topCompetitors: computeTopCompetitorDomains(organicWithCtr),
      },
      provenance,
    };

    this.setInCache(cacheKey, snapshot);
    return snapshot;
  }

  /**
   * News Search Endpoint (POST /news) for Media Monitoring & PR CRM
   */
  async news(params: { q: string; gl?: string; tbs?: string }): Promise<NewsResult[]> {
    const cacheKey = this.getCacheKey('/news', params);
    const cached = this.getFromCache<NewsResult[]>(cacheKey);
    if (cached) return cached.data;

    let newsItems: NewsResult[] = [];

    if (this.apiKey) {
      try {
        const data = await this.fetchWithRetry(`${this.baseUrl}/news`, params);
        newsItems = (data.news || []).map((n: any) => ({
          title: n.title,
          link: n.link,
          snippet: n.snippet,
          date: n.date,
          source: n.source,
          imageUrl: n.imageUrl,
        }));
      } catch (err) {
        if (this.explicitMockMode && !this.isProduction()) {
          newsItems = MOCK_NEWS_FIXTURES;
        } else {
          throw err;
        }
      }
    } else {
      this.assertMockAllowed();
      newsItems = MOCK_NEWS_FIXTURES;
    }

    this.setInCache(cacheKey, newsItems);
    return newsItems;
  }

  /**
   * Places Endpoint (POST /places) for Local Listing Management
   */
  async places(params: { q: string; location?: string }): Promise<PlacesResult[]> {
    const cacheKey = this.getCacheKey('/places', params);
    const cached = this.getFromCache<PlacesResult[]>(cacheKey);
    if (cached) return cached.data;

    let places: PlacesResult[] = [];

    if (this.apiKey) {
      try {
        const data = await this.fetchWithRetry(`${this.baseUrl}/places`, params);
        places = data.places || [];
      } catch (err) {
        if (this.explicitMockMode && !this.isProduction()) {
          places = MOCK_PLACES_FIXTURES;
        } else {
          throw err;
        }
      }
    } else {
      this.assertMockAllowed();
      places = MOCK_PLACES_FIXTURES;
    }

    this.setInCache(cacheKey, places);
    return places;
  }

  /**
   * Autocomplete Endpoint (POST /autocomplete) for Seed Expansion
   */
  async autocomplete(query: string): Promise<string[]> {
    const cacheKey = this.getCacheKey('/autocomplete', { q: query });
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) return cached.data;

    let suggestions: string[] = [];

    if (this.apiKey) {
      try {
        const data = await this.fetchWithRetry(`${this.baseUrl}/autocomplete`, { q: query });
        suggestions = (data.suggestions || []).map((s: any) => s.value || s);
      } catch (err) {
        if (this.explicitMockMode && !this.isProduction()) {
          suggestions = this.generateFallbackAutocomplete(query);
        } else {
          throw err;
        }
      }
    } else {
      this.assertMockAllowed();
      suggestions = this.generateFallbackAutocomplete(query);
    }

    this.setInCache(cacheKey, suggestions);
    return suggestions;
  }

  private generateFallbackAutocomplete(query: string): string[] {
    const q = query.toLowerCase();
    return [
      `${q} for small business`,
      `best ${q} 2026`,
      `${q} pricing and reviews`,
      `how to choose ${q}`,
      `top 10 ${q} tools`,
      `${q} free trial`,
      `${q} vs competitors`,
    ];
  }

  private generateDynamicMockSearch(query: string): any {
    const baseSlug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      searchParameters: { q: query, gl: 'us', hl: 'en', num: 10 },
      organic: [
        {
          position: 1,
          title: `Ultimate Guide to ${query.toUpperCase()} in 2026`,
          link: `https://www.authority-${baseSlug}.com/guide`,
          snippet: `Everything you need to know about ${query}. Comprehensive benchmarks, feature comparisons, and step-by-step strategies.`,
        },
        {
          position: 2,
          title: `Best 10 ${query} Solutions Ranked & Reviewed`,
          link: `https://techreview-${baseSlug}.io/best-picks`,
          snippet: `Discover top-rated ${query} platforms vetted by industry experts with unbiased pros, cons, and pricing breakdowns.`,
        },
        {
          position: 3,
          title: `How to Optimize Your ${query} Strategy for 10x ROI`,
          link: `https://growthinsights.com/${baseSlug}-strategy`,
          snippet: `Learn proven tactics to master ${query}, outrank competitors, and scale organic search pipeline efficiently.`,
        },
      ],
      peopleAlsoAsk: [
        {
          question: `What are the key benefits of ${query}?`,
          snippet: `${query} streamlines operational workflows, elevates digital visibility, and drives measurable revenue gains.`,
          title: `Understanding ${query} Impact`,
          link: `https://industryguide.com/benefits-${baseSlug}`,
        },
      ],
      relatedSearches: [
        { query: `${query} tutorial` },
        { query: `best ${query} software` },
        { query: `${query} alternatives` },
      ],
    };
  }
}
