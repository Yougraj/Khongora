import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { isContentType, type ContentType } from '@/lib/content-types';
import {
  serializeBook,
  serializeNovel,
  serializePoem,
  serializeArticle,
  serializeBlog,
  toId,
} from '@/lib/serializers';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const db = await getDb();
  const docs = await db.collection(type).find({}).sort({ uploadedAt: -1 }).toArray();
  return NextResponse.json(
    docs.map((d) => ({ ...d, _id: toId(d._id) }))
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await params;
  if (!isContentType(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const body = await request.json();
  const now = new Date();
  let doc = sanitizePlainTextDoc({
    ...body,
    createdAt: now,
    updatedAt: now,
    likeCount: body.likeCount ?? 0,
  }) as Record<string, unknown>;
  doc = applyPublishDate(doc, body.publishDate);
  delete doc._id;
  if (type === 'novels') doc = applyNovelPlainContent(doc);
  if (type === 'blogs' && typeof doc.content === 'string') {
    doc.body = doc.content;
  }

  const db = await getDb();
  const result = await db.collection(type).insertOne(doc);
  const inserted = await db.collection(type).findOne({ _id: result.insertedId });

  return NextResponse.json(
    SERIALIZERS[type as ContentType](inserted!),
    { status: 201 }
  );
}
