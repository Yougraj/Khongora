import { NextResponse } from 'next/server';
import { findById } from '@/lib/collections';
import { serializeArticle } from '@/lib/serializers';
import { jsonCached } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await findById('articles', id);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return jsonCached(serializeArticle(article));
  } catch (error) {
    console.error('Article API error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
