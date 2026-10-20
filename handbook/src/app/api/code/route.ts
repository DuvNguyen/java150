import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const PROJECT_ROOT = '/home/levi/Desktop/Projects/java150';

function sanitizePath(filePathParam: string): string {
  const normalized = path.normalize(filePathParam).replace(/^(\.\.(\/|\\|$))+/, '');
  return normalized.startsWith('/') ? normalized.slice(1) : normalized;
}

function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findFuzzyMatchInDir(dirPath: string, targetBaseName: string): string | null {
  if (!fs.existsSync(dirPath)) return null;
  const targetClean = normalizeName(targetBaseName);
  const files = fs.readdirSync(dirPath);

  // 1. Exact case-insensitive match (e.g. TwoSum.java vs twoSum.java)
  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (base.toLowerCase() === targetBaseName.toLowerCase() && ext === '.java') {
      return path.join(dirPath, file);
    }
  }

  // 2. Alphanumeric clean match (e.g. LongestConsecutiveSequence vs longetConsecutiveSequence)
  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (ext === '.java') {
      const clean = normalizeName(base);
      if (clean === targetClean || clean.includes(targetClean) || targetClean.includes(clean)) {
        return path.join(dirPath, file);
      }
    }
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filePathParam = searchParams.get('file');

    if (!filePathParam) {
      return NextResponse.json({ error: 'Missing file param' }, { status: 400 });
    }

    const relPath = sanitizePath(filePathParam);
    const exactPath = path.resolve(PROJECT_ROOT, relPath);

    let targetPath: string | null = null;
    if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
      targetPath = exactPath;
    } else {
      // Try fuzzy search in target directory
      const dir = path.dirname(exactPath);
      const targetBase = path.basename(exactPath, path.extname(exactPath));
      targetPath = findFuzzyMatchInDir(dir, targetBase);
    }

    // Generate class name for default template
    const rawBaseName = path.basename(relPath, path.extname(relPath));
    const safeClassName = rawBaseName.replace(/[^a-zA-Z0-9]/g, '') || 'Solution';

    if (!targetPath) {
      // File does not exist yet -> return clean boilerplate starter code
      const template = `package l;

import java.util.*;

public class ${safeClassName} {
    // Viết giải thuật của bạn tại đây (Type your solution here)

    public static void main(String[] args) {
        System.out.println("Kiểm tra giải thuật cho: ${safeClassName}");
    }
}
`;
      return NextResponse.json({
        file: relPath,
        content: template,
        exists: false,
        optimizedContent: null,
        reviewMarkdown: null,
      });
    }

    const content = fs.readFileSync(targetPath, 'utf-8');
    const actualRelPath = path.relative(PROJECT_ROOT, targetPath);

    // Look for companion files: Optimized solution or AGY markdown review
    let optimizedContent: string | null = null;
    let reviewMarkdown: string | null = null;

    const dir = path.dirname(targetPath);
    const baseName = path.basename(targetPath, path.extname(targetPath));

    const possibleOptimized = [
      path.join(dir, `${baseName}Optimized.java`),
      path.join(dir, `optimized${baseName}.java`),
      path.join(dir, `${baseName}Practice.java`),
    ];

    for (const optPath of possibleOptimized) {
      if (fs.existsSync(optPath) && fs.statSync(optPath).isFile() && optPath !== targetPath) {
        optimizedContent = fs.readFileSync(optPath, 'utf-8');
        break;
      }
    }

    const possibleMd = [
      path.join(dir, `${baseName}.md`),
      path.join(dir, `${baseName.toLowerCase()}.md`),
    ];

    for (const mdPath of possibleMd) {
      if (fs.existsSync(mdPath) && fs.statSync(mdPath).isFile()) {
        reviewMarkdown = fs.readFileSync(mdPath, 'utf-8');
        break;
      }
    }

    return NextResponse.json({
      file: actualRelPath,
      content,
      exists: true,
      optimizedContent,
      reviewMarkdown,
    });
  } catch (error) {
    console.error('Error in GET /api/code:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file, content } = body;

    if (!file || typeof content !== 'string') {
      return NextResponse.json({ error: 'Thiếu thông tin file hoặc content' }, { status: 400 });
    }

    const relPath = sanitizePath(file);
    const targetPath = path.resolve(PROJECT_ROOT, relPath);

    // Security check: Must reside within PROJECT_ROOT
    if (!targetPath.startsWith(PROJECT_ROOT)) {
      return NextResponse.json({ error: 'Đường dẫn không hợp lệ' }, { status: 403 });
    }

    // Ensure parent directory exists
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file directly to local repo
    fs.writeFileSync(targetPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      file: path.relative(PROJECT_ROOT, targetPath),
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in POST /api/code:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
