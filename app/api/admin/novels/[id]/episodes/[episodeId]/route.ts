import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, type Document, type Filter } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { findById } from '@/lib/collections';
import { serializeNovel } from '@/lib/serializers';
import { deleteEpisode, updateEpisode } from '@/lib/novel-episodes';
import { applyPublishDate } from '@/lib/publish-date';

function parseEpisodeId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, episodeId: episodeIdRaw } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const episodeId = parseEpisodeId(episodeIdRaw);
  if (episodeId === null) {
    return NextResponse.json({ error: 'Invalid episode id' }, { status: 400 });
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

  const patch = updateEpisode(existing as Record<string, unknown>, episodeId, {
    title,
    duration: body.duration,
    content,
  });

  if (!patch) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  }

  let update: Record<string, unknown> = {
    ...patch,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, episodeId: episodeIdRaw } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const episodeId = parseEpisodeId(episodeIdRaw);
  if (episodeId === null) {
    return NextResponse.json({ error: 'Invalid episode id' }, { status: 400 });
  }

  const existing = await findById('novels', id);
  if (!existing) {
    return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
  }

  const patch = deleteEpisode(existing as Record<string, unknown>, episodeId);
  if (!patch) {
    return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
  }

  const db = await getDb();
  const filter: Filter<Document> = { _id: new ObjectId(id) };
  await db.collection('novels').updateOne(filter, {
    $set: { ...patch, updatedAt: new Date() },
  });

  const doc = await findById('novels', id);
  return NextResponse.json(serializeNovel(doc!));
}
