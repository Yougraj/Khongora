import { NextResponse } from 'next/server';
import { findById } from '@/lib/collections';
import { serializeNovel } from '@/lib/serializers';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novel = await findById('novels', id);

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    return NextResponse.json(serializeNovel(novel));
  } catch (error) {
    console.error('Novel API error:', error);
    return NextResponse.json({ error: 'Failed to fetch novel' }, { status: 500 });
  }
}
