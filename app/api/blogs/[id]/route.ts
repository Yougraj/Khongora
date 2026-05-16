import { NextResponse } from 'next/server';
import { findById } from '@/lib/collections';
import { serializeBlog } from '@/lib/serializers';
import { jsonCached } from '@/lib/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await findById('blogs', id);

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return jsonCached(serializeBlog(blog));
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
