import { NextRequest, NextResponse } from 'next/server';
import { SerperClient, DataFetchError, MockDataProhibitedError, ApiRateLimitError } from '@rivue/serper-client';
import { getD1Repository } from '@rivue/db';

export const dynamic = 'force-dynamic';

const client = new SerperClient();
const repo = getD1Repository();

export async function POST(req: NextRequest) {
  const start = performance.now();
  try {
    const body = await req.json();
    const { endpoint = 'search', query, geo = 'us', device = 'desktop', ...params } = body;

    if (!query) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: 'Query parameter is required',
          },
        },
        { status: 400 }
      );
    }

    if (endpoint === 'autocomplete') {
      const suggestions = await client.autocomplete(query);
      return NextResponse.json({ suggestions });
    }

    if (endpoint === 'news') {
      const news = await client.news({ q: query, gl: geo, ...params });
      return NextResponse.json({ news });
    }

    if (endpoint === 'places') {
      const places = await client.places({ q: query, location: geo, ...params });
      return NextResponse.json({ places });
    }

    // 1. Check Cloudflare D1 SQLite Cache
    const cached = await repo.getSerpSnapshot(query, geo, device);
    if (cached) {
      const durationMs = Math.round(performance.now() - start);
      await repo.recordProvenanceTelemetry({
        id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        endpoint: '/api/serper',
        metricKey: `search:${query}`,
        source: 'cached',
        durationMs,
        cacheHit: true,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(cached);
    }

    // 2. Live pipeline fetch via Serper Client
    const snapshot = await client.search({ q: query, gl: geo, ...params });

    // 3. Persist into Cloudflare D1 SQLite Lake
    await repo.saveSerpSnapshot(snapshot);

    // 4. Record provenance telemetry
    const durationMs = Math.round(performance.now() - start);
    await repo.recordProvenanceTelemetry({
      id: `tel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      endpoint: '/api/serper',
      metricKey: `search:${query}`,
      source: snapshot.provenance?.source || 'live',
      durationMs,
      cacheHit: false,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(snapshot);
  } catch (error: any) {
    const durationMs = Math.round(performance.now() - start);

    if (error instanceof MockDataProhibitedError) {
      return NextResponse.json(
        {
          error: {
            code: 'MOCK_DATA_PROHIBITED',
            message: error.message,
          },
        },
        { status: 403 }
      );
    }

    if (error instanceof ApiRateLimitError) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: error.message,
            retryAfter: error.retryAfterSeconds,
          },
        },
        { status: 429 }
      );
    }

    if (error instanceof DataFetchError) {
      return NextResponse.json(
        {
          error: {
            code: 'DATA_FETCH_ERROR',
            message: error.message,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'An unexpected error occurred while fetching SERP intelligence',
        },
      },
      { status: 500 }
    );
  }
}
