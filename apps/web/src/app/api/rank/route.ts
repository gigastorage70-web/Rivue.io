import { NextRequest, NextResponse } from 'next/server';
import { getD1Repository } from '@rivue/db';
import { TrackedKeyword } from '@rivue/types';

export const dynamic = 'force-dynamic';

const repo = getD1Repository();

export async function GET() {
  try {
    const rank = await repo.getRankTrackingOverview();
    return NextResponse.json(rank);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, location = 'United States', device = 'desktop' } = body;
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const newKw: TrackedKeyword = {
      id: `trk_${Date.now()}`,
      keyword,
      currentPosition: 3,
      previousPosition: 4,
      bestPosition: 1,
      searchVolume: 12000,
      location,
      device: device as any,
      rankingUrl: `https://thezensodigital.com/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
      serpFeatures: ['People Also Ask'],
      history: [{ date: new Date().toISOString().split('T')[0], position: 3 }],
      lastChecked: 'Just now',
    };

    await repo.addTrackedKeyword(newKw);
    const updated = await repo.getRankTrackingOverview();
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
