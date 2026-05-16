import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';
import { jsonCached } from '@/lib/api-response';

export async function GET() {
  try {
    const blogs = await fetchAllSorted('blogs');
    return jsonCached(blogs);
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
