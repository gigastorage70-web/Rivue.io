import { NextResponse } from 'next/server';
import { getD1Repository } from '@rivue/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = performance.now();
  const repo = getD1Repository();

  try {
    // 1. D1 Database Health
    const dbHealth = await repo.getDatabase().checkHealth();

    // 2. Provenance Telemetry Breakdown
    const provenance = await repo.getProvenanceBreakdown();

    // 3. Environment & Mock Guard
    const env = process.env.NODE_ENV || 'development';
    const useMockData = process.env.USE_MOCK_DATA === 'true';
    const isSerperConfigured = Boolean(process.env.SERPER_API_KEY);

    // Standard §8 check: USE_MOCK_DATA must be false in production
    const isMockLeakingInProd = env === 'production' && (useMockData || provenance.mockCount > 0);

    const overallStatus =
      dbHealth.status === 'healthy' && !isMockLeakingInProd ? 'ok' : isMockLeakingInProd ? 'critical' : 'degraded';

    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      healthCheckDurationMs: durationMs,
      environment: env,
      database: {
        provider: dbHealth.provider,
        status: dbHealth.status,
        latencyMs: dbHealth.latencyMs,
        tablesVerified: dbHealth.tableCount,
        storagePath: dbHealth.databasePath,
      },
      serperApi: {
        configured: isSerperConfigured,
        mode: isSerperConfigured ? 'live-api' : useMockData ? 'mock-fixtures-dev-only' : 'unconfigured',
      },
      provenance: {
        totalRequests: provenance.totalRequests,
        liveCount: provenance.liveCount,
        cachedCount: provenance.cachedCount,
        mockCount: provenance.mockCount,
        liveRatioPercent: provenance.liveRatio,
        cachedRatioPercent: provenance.cachedRatio,
        mockRatioPercent: provenance.mockRatio,
        averageLatencyMs: provenance.averageLatencyMs,
        productionStandardCompliant: provenance.mockCount === 0 || env !== 'production',
      },
      flags: {
        USE_MOCK_DATA: useMockData,
        NODE_ENV: env,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'down',
        timestamp: new Date().toISOString(),
        error: err.message || 'Health check probe failed',
      },
      { status: 503 }
    );
  }
}
