import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getVisibleComments, serializeComment } from '@/lib/comments';
import { isContentType } from '@/lib/content-types';
import { jsonCached } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const contentType = request.nextUrl.searchParams.get('contentType') ?? '';
    const contentId = request.nextUrl.searchParams.get('contentId') ?? '';

    if (!isContentType(contentType) || !contentId) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const comments = await getVisibleComments(contentType, contentId);
    return jsonCached(comments, 15);
  } catch (error) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, contentId, name, email, text } = body;

    if (!isContentType(contentType) || !contentId) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }
    if (!name?.trim() || !email?.trim() || !text?.trim()) {
      return NextResponse.json({ error: 'Name, email, and comment are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const db = await getDb();
    const doc = {
      contentType,
      contentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      text: text.trim(),
      hidden: false,
      createdAt: new Date(),
    };

    const result = await db.collection('comments').insertOne(doc);
    const inserted = { ...doc, _id: result.insertedId };

    return NextResponse.json(serializeComment(inserted), { status: 201 });
  } catch (error) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
