import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

const PROJECT_ROOT = '/home/levi/Desktop/Projects/java150';
const IDE_BINARY = '/home/levi/Downloads/Antigravity_IDE/antigravity-ide';

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

  // 1. Exact case-insensitive match (e.g. ValidSudoku.java vs validSudoku.java)
  for (const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (base.toLowerCase() === targetBaseName.toLowerCase() && ext === '.java') {
      return path.join(dirPath, file);
    }
  }

  // 2. Alphanumeric match
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

export async function POST(req: Request) {
  try {
    let body: { file?: string; content?: string; shouldSave?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      // Empty or non-JSON body is valid
    }

    const { file, content, shouldSave } = body;
    let actualFilePath: string | null = null;
    let created = false;

    if (file && typeof file === 'string') {
      const relPath = sanitizePath(file);
      const exactPath = path.resolve(PROJECT_ROOT, relPath);

      // Security check: Must reside within PROJECT_ROOT
      if (exactPath.startsWith(PROJECT_ROOT)) {
        const dir = path.dirname(exactPath);
        const targetBase = path.basename(exactPath, path.extname(exactPath));

        if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
          actualFilePath = exactPath;
        } else {
          // Check fuzzy match
          const fuzzy = findFuzzyMatchInDir(dir, targetBase);
          if (fuzzy) {
            actualFilePath = fuzzy;
          }
        }

        // If file does not exist, create it with given content or boilerplate
        if (!actualFilePath) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          let fileContent = typeof content === 'string' && content.trim().length > 0 ? content : '';
          if (!fileContent) {
            const rawBaseName = path.basename(relPath, path.extname(relPath));
            const safeClassName = rawBaseName.replace(/[^a-zA-Z0-9]/g, '') || 'Solution';
            fileContent = `package l;

import java.util.*;

public class ${safeClassName} {
    // Viết giải thuật của bạn tại đây (Type your solution here)

    public static void main(String[] args) {
        System.out.println("Kiểm tra giải thuật cho: ${safeClassName}");
    }
}
`;
          }

          fs.writeFileSync(exactPath, fileContent, 'utf-8');
          actualFilePath = exactPath;
          created = true;
        } else if (shouldSave && typeof content === 'string') {
          // File exists and caller explicitly wants to sync latest edits before opening IDE
          fs.writeFileSync(actualFilePath, content, 'utf-8');
        }
      }
    }

    // Check if Antigravity IDE is currently running
    const isRunning = await new Promise<boolean>((resolve) => {
      exec('pgrep -f "antigravity-ide"', (err, stdout) => {
        resolve(!err && !!stdout && stdout.trim().length > 0);
      });
    });

    // Launch Antigravity IDE
    // If a specific file was targeted, open both workspace and that file
    const launchCommand = actualFilePath
      ? `"${IDE_BINARY}" "${PROJECT_ROOT}" "${actualFilePath}"`
      : `"${IDE_BINARY}" "${PROJECT_ROOT}"`;

    exec(launchCommand, (err) => {
      if (err) console.error('Error launching Antigravity IDE:', err);
    });

    return NextResponse.json({
      success: true,
      isRunning,
      created,
      file: actualFilePath ? path.relative(PROJECT_ROOT, actualFilePath) : null,
      message: created
        ? 'Đã tự động tạo file và mở trong Antigravity IDE'
        : 'Đã gửi lệnh mở trong Antigravity IDE',
    });
  } catch (error) {
    console.error('Error in /api/ide/open:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
