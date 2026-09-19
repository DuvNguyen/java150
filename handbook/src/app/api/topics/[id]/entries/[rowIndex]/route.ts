import { NextRequest, NextResponse } from 'next/server';
import { updateEntry, deleteEntry } from '@/lib/cheatsheet';

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string; rowIndex: string }> | { id: string; rowIndex: string } }
) {
  const params = await props.params;
  const topicId = params.id;
  const rowIndex = parseInt(params.rowIndex, 10);
  const body = await req.json().catch(() => ({}));

  const entries = updateEntry(topicId, rowIndex, body);
  if (!entries) {
    return NextResponse.json({ message: `Entry not found or invalid index` }, { status: 404 });
  }

  return NextResponse.json(entries);
}

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string; rowIndex: string }> | { id: string; rowIndex: string } }
) {
  const params = await props.params;
  const topicId = params.id;
  const rowIndex = parseInt(params.rowIndex, 10);

  const entries = deleteEntry(topicId, rowIndex);
  if (!entries) {
    return NextResponse.json({ message: `Entry not found or invalid index` }, { status: 404 });
  }

  return NextResponse.json(entries);
}
