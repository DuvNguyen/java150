import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filePathParam = searchParams.get('file');

    if (!filePathParam) {
      return NextResponse.json({ error: 'Missing file param' }, { status: 400 });
    }

    // Sanitize path to prevent path traversal outside src/
    const normalized = path.normalize(filePathParam).replace(/^(\.\.(\/|\\|$))+/, '');
    const candidates = [
      path.resolve(process.cwd(), '..', normalized),
      path.resolve(process.cwd(), normalized),
      path.resolve('/home/levi/Desktop/Projects/java150', normalized),
    ];

    let targetPath: string | null = null;
    for (const p of candidates) {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        targetPath = p;
        break;
      }
    }

    if (!targetPath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(targetPath, 'utf-8');
    return NextResponse.json({
      file: filePathParam,
      content,
    });
  } catch (error) {
    console.error('Error reading code file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
