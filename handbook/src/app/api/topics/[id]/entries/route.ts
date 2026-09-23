import { NextRequest, NextResponse } from 'next/server';
import { addEntry } from '@/lib/cheatsheet';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const topicId = params.id;
  const body = await req.json().catch(() => ({}));

  const entries = addEntry(topicId, body);
  if (!entries) {
    return NextResponse.json({ message: `Topic '${topicId}' not found` }, { status: 404 });
  }

  return NextResponse.json(entries, { status: 201 });
}
