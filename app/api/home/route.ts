import { NextResponse } from 'next/server';
import { fetchLatest } from '@/lib/db-queries';
import { getRandomComments } from '@/lib/comments';
import { CONTENT_TYPES } from '@/lib/content-types';

export async function GET() {
  try {
    const [perType, recentComments] = await Promise.all([
      Promise.all(CONTENT_TYPES.map((type) => fetchLatest(type, 2))),
      getRandomComments(4),
    ]);

    const latest = perType
      .flat()
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
      .slice(0, 5);

    return NextResponse.json({ latest, recentComments });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json({ error: 'Failed to load home' }, { status: 500 });
  }
}
