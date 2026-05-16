import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';
import { jsonCached } from '@/lib/api-response';

export async function GET() {
  try {
    const novels = await fetchAllSorted('novels');
    return jsonCached(novels);
  } catch (error) {
    console.error('Novels API error:', error);
    return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 });
  }
}
