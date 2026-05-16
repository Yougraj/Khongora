import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';

export async function GET() {
  try {
    const poems = await fetchAllSorted('poems');
    return NextResponse.json(poems);
  } catch (error) {
    console.error('Poems API error:', error);
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}
