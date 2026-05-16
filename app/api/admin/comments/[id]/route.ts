import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { verifyAdminRequest } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const db = await getDb();

  if (body.delete) {
    await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  }

  if (typeof body.hidden === 'boolean') {
    await db.collection('comments').updateOne(
      { _id: new ObjectId(id) },
      { $set: { hidden: body.hidden } }
    );
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
}
