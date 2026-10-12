import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const projectPath = '/home/levi/Desktop/Projects/java150';

    // Kiểm tra xem Antigravity IDE có đang bật không
    const isRunning = await new Promise<boolean>((resolve) => {
      exec('pgrep -f "antigravity-ide"', (err, stdout) => {
        resolve(!err && !!stdout && stdout.trim().length > 0);
      });
    });

    // Mở workspace java150 trong Antigravity IDE
    exec(`/home/levi/Downloads/Antigravity_IDE/antigravity-ide "${projectPath}"`, (err) => {
      if (err) console.error('Error launching Antigravity IDE:', err);
    });

    return NextResponse.json({
      success: true,
      isRunning,
      message: 'Đã gửi lệnh mở dự án java150 trong Antigravity IDE',
    });
  } catch (error) {
    console.error('Error in /api/ide/open:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
