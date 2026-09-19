import { NextRequest, NextResponse } from 'next/server';
import { searchAll } from '@/lib/cheatsheet';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = searchAll(q);
  return NextResponse.json(results);
}
