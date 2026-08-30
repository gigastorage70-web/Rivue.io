import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rivue/db';

export async function GET() {
  try {
    const rank = await db.getRankTracking();
    return NextResponse.json(rank);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, location } = body;
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }
    await db.addTrackedKeyword(keyword, location);
    const updated = await db.getRankTracking();
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
