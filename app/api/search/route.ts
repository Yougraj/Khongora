import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/db-queries';
import { jsonCached } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? '';
    const results = await searchContent(q);
    return jsonCached(results, 30);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
