import { NextRequest, NextResponse } from 'next/server';
import { getTopicEntries } from '@/lib/cheatsheet';

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await props.params;
  const topicId = params.id;
  const result = getTopicEntries(topicId);

  if (!result) {
    return NextResponse.json({ message: `Topic '${topicId}' not found` }, { status: 404 });
  }

  return NextResponse.json(result);
}
