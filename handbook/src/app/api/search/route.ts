import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/cheatsheet';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const topic = searchParams.get('topic') ?? '';

  if (!q.trim() && !topic.trim()) {
    return NextResponse.json([]);
  }

  const results = searchAll(q, topic);
  return NextResponse.json(results);
}
