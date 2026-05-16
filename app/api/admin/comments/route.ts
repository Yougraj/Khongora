import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';
import { toId } from '@/lib/serializers';

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const comments = await db
    .collection('comments')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    comments.map((c) => ({
      _id: toId(c._id),
      contentType: c.contentType,
      contentId: c.contentId,
      name: c.name,
      email: c.email,
      text: c.text,
      hidden: c.hidden ?? false,
      createdAt: c.createdAt,
    }))
  );
}
