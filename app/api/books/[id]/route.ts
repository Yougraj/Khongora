import { NextResponse } from 'next/server';
import { findById } from '@/lib/collections';
import { serializeBook } from '@/lib/serializers';
import { jsonCached } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await findById('books', id);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return jsonCached(serializeBook(book));
  } catch (error) {
    console.error('Book API error:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
}
