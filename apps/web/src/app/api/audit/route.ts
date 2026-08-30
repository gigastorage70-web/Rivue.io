import { NextRequest, NextResponse } from 'next/server';
import { db } from '@rivue/db';

export async function GET() {
  try {
    const audit = await db.getLatestAudit();
    return NextResponse.json(audit);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl } = body;
    if (!targetUrl) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }
    const newAudit = await db.runNewAudit(targetUrl);
    return NextResponse.json(newAudit);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
