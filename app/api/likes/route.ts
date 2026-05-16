import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { findById } from '@/lib/collections';
import { isContentType } from '@/lib/content-types';

export async function GET(request: NextRequest) {
  try {
    const contentType = request.nextUrl.searchParams.get('contentType') ?? '';
    const contentId = request.nextUrl.searchParams.get('contentId') ?? '';

    if (!isContentType(contentType) || !contentId) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const doc = await findById(contentType, contentId);

    return NextResponse.json({ likeCount: doc?.likeCount ?? 0 });
  } catch (error) {
    console.error('Likes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId } = body;

    if (!isContentType(contentType) || !contentId) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }

    const db = await getDb();
    const { ObjectId } = await import('mongodb');
    const filter = ObjectId.isValid(contentId)
      ? { _id: new ObjectId(contentId) }
      : { _id: contentId };

    const result = await db
      .collection(contentType)
      .findOneAndUpdate(filter, { $inc: { likeCount: 1 } }, { returnDocument: 'after' });

    return NextResponse.json({ likeCount: result?.likeCount ?? 1 });
  } catch (error) {
    console.error('Likes POST error:', error);
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}
