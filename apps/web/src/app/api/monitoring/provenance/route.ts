import { NextResponse } from 'next/server';
import { getD1Repository } from '@rivue/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const repo = getD1Repository();
  try {
    const breakdown = await repo.getProvenanceBreakdown();

    // Query latest 25 telemetry events
    const latestEvents = await repo.getDatabase()
      .prepare(`
        SELECT id, endpoint, metric_key, source, duration_ms, cache_hit, timestamp
        FROM provenance_telemetry
        ORDER BY timestamp DESC
        LIMIT 25;
      `)
      .all<any>();

    return NextResponse.json({
      breakdown,
      latestEvents: (latestEvents.results || []).map((e) => ({
        ...e,
        cacheHit: Boolean(e.cache_hit),
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve provenance telemetry' },
      { status: 500 }
    );
  }
}
