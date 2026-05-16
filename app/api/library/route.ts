import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { serializeLibraryItem } from '@/lib/serializers';

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection('library').find({}).toArray();
    return NextResponse.json(items.map(serializeLibraryItem));
  } catch (error) {
    console.error('Library API error:', error);
    return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
  }
}
