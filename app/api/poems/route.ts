import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';
import { jsonCached } from '@/lib/api-response';

export async function GET() {
  try {
    const poems = await fetchAllSorted('poems');
    return jsonCached(poems);
  } catch (error) {
    console.error('Poems API error:', error);
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}
