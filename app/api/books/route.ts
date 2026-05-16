import { NextResponse } from 'next/server';
import { fetchAllSorted } from '@/lib/db-queries';

export async function GET() {
  try {
    const books = await fetchAllSorted('books');
    return NextResponse.json(books);
  } catch (error) {
    console.error('Books API error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
