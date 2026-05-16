import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';

export async function GET() {
  try {
    const articles = await fetchAllSorted('articles');
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
