import { NextResponse } from 'next/server';
import { getAllTopics } from '@/lib/cheatsheet';

export async function GET() {
  const topics = getAllTopics();
  return NextResponse.json(topics);
}
