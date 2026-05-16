import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, type Filter, type Document } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { isContentType, type ContentType } from '@/lib/content-types';
import {
  serializeBook,
  serializeNovel,
  serializePoem,
  serializeArticle,
  serializeBlog,
} from '@/lib/serializers';
import { findById } from '@/lib/collections';
import {
  applyNovelPlainContent,
  sanitizePlainTextDoc,
} from '@/lib/plain-text';
import { applyPublishDate } from '@/lib/publish-date';

const SERIALIZERS = {
  books: serializeBook,
  novels: serializeNovel,
  poems: serializePoem,
  articles: serializeArticle,
  blogs: serializeBlog,
} as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const body = await request.json();
  let update = sanitizePlainTextDoc({
    ...body,
    updatedAt: new Date(),
  }) as Record<string, unknown>;
  delete update._id;
  if (body.publishDate) {
    update = applyPublishDate(update, body.publishDate);
  }
  if (type === 'novels') update = applyNovelPlainContent(update);
  if (type === 'blogs' && typeof update.content === 'string') {
    update.body = update.content;
  }

  const db = await getDb();
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const filter: Filter<Document> = { _id: new ObjectId(id) };
  await db.collection(type).updateOne(filter, { $set: update });

  const doc = await findById(type, id);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(SERIALIZERS[type as ContentType](doc));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const db = await getDb();
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const filter: Filter<Document> = { _id: new ObjectId(id) };
  await db.collection(type).deleteOne(filter);
  await db.collection('comments').deleteMany({ contentType: type, contentId: id });

  return NextResponse.json({ ok: true });
}
