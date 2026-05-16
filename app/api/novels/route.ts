import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';

export async function GET() {
  try {
    const novels = await fetchAllSorted('novels');
    return NextResponse.json(novels);
  } catch (error) {
    console.error('Novels API error:', error);
    return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 });
  }
}
