import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, type Document, type Filter } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { findById } from '@/lib/collections';
import { serializeNovel } from '@/lib/serializers';
import { appendEpisode } from '@/lib/novel-episodes';
import { applyPublishDate } from '@/lib/publish-date';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await request.json();
  const title = String(body.title ?? '').trim();
  const content = String(body.content ?? '').trim();

  if (!title || !content) {
    return NextResponse.json(
      { error: 'Episode title and content are required' },
      { status: 400 }
    );
  }

  const existing = await findById('novels', id);
  if (!existing) {
    return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
  }

  let update: Record<string, unknown> = {
    ...appendEpisode(existing as Record<string, unknown>, {
      title,
      duration: body.duration,
      content,
    }),
    updatedAt: new Date(),
  };

  if (body.publishDate) {
    update = applyPublishDate(update, body.publishDate);
  }

  const db = await getDb();
  const filter: Filter<Document> = { _id: new ObjectId(id) };
  await db.collection('novels').updateOne(filter, { $set: update });

  const doc = await findById('novels', id);
  return NextResponse.json(serializeNovel(doc!));
}
