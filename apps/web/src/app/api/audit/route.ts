import { NextRequest, NextResponse } from 'next/server';
import { getD1Repository } from '@rivue/db';

export const dynamic = 'force-dynamic';

const repo = getD1Repository();

export async function GET() {
  try {
    const audit = await repo.getLatestAudit();
    return NextResponse.json(audit);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
