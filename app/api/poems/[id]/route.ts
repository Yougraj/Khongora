import { NextResponse } from 'next/server';
import { findById } from '@/lib/collections';
import { serializePoem } from '@/lib/serializers';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poem = await findById('poems', id);

    if (!poem) {
      return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    }

    return NextResponse.json(serializePoem(poem));
  } catch (error) {
    console.error('Poem API error:', error);
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 });
  }
}
