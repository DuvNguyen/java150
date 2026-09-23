import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

function getSrsProgressFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), '../srs_progress.json'),
    path.resolve(process.cwd(), 'srs_progress.json'),
    '/home/levi/Desktop/Projects/java150/srs_progress.json',
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default fallback: parent directory of handbook or current cwd
  const parentPath = path.resolve(process.cwd(), '../srs_progress.json');
  return parentPath;
}

export async function GET() {
  try {
    const filePath = getSrsProgressFilePath();
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({});
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content || '{}');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading srs_progress.json:', error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filePath = getSrsProgressFilePath();

    // Read existing data
    let existingData: Record<string, unknown> = {};
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(content || '{}');
      } catch {
        existingData = {};
      }
    }

    // Merge or replace
    const updatedData = { ...existingData, ...body };
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error writing srs_progress.json:', error);
    return NextResponse.json({ error: 'Failed to update SRS progress' }, { status: 500 });
  }
}
