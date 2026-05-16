import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';
import { jsonCached } from '@/lib/api-response';

export async function GET() {
  try {
    const articles = await fetchAllSorted('articles');
    return jsonCached(articles);
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
