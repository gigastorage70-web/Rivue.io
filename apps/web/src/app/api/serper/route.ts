import { NextRequest, NextResponse } from 'next/server';
import { SerperClient } from '@rivue/serper-client';

const client = new SerperClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint = 'search', query, ...params } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (endpoint === 'autocomplete') {
      const suggestions = await client.autocomplete(query);
      return NextResponse.json({ suggestions });
    }

    if (endpoint === 'news') {
      const news = await client.news({ q: query, ...params });
      return NextResponse.json({ news });
    }

    if (endpoint === 'places') {
      const places = await client.places({ q: query, ...params });
      return NextResponse.json({ places });
    }

    // Default search
    const snapshot = await client.search({ q: query, ...params });
    return NextResponse.json(snapshot);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
