import { NextResponse } from 'next/server';
import { fetchLatest } from '@/lib/db-queries';
import { getRandomComments } from '@/lib/comments';

export async function GET() {
  try {
    const [books, novels, poems, articles, blogs, recentComments] = await Promise.all([
      fetchLatest('books', 4),
      fetchLatest('novels', 3),
      fetchLatest('poems', 3),
      fetchLatest('articles', 3),
      fetchLatest('blogs', 3),
      getRandomComments(4),
    ]);

    const latest = [...books, ...novels, ...poems, ...articles, ...blogs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({
      latest: latest.slice(0, 5),
      books,
      novels,
      poems,
      articles,
      blogs,
      recentComments,
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json({ error: 'Failed to load home' }, { status: 500 });
  }
}
