import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';

export async function GET() {
  try {
    const blogs = await fetchAllSorted('blogs');
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Blogs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
