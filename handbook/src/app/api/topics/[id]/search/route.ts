import { NextRequest, NextResponse } from 'next/server';
import { searchInTopic } from '@/lib/cheatsheet';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await props.params;
  const topicId = params.id;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';

  const entries = searchInTopic(topicId, q);
  if (!entries) {
    return NextResponse.json({ message: `Topic '${topicId}' not found` }, { status: 404 });
  }

  return NextResponse.json(entries);
}
