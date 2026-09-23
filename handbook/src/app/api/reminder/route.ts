import { NextResponse } from 'next/server';
import { exec, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const dynamic = 'force-dynamic';

const SERVICE_NAME = 'dsa-reminder.service';
const TIMER_NAME = 'dsa-reminder.timer';
const USER_SYSTEMD_DIR = path.join(os.homedir(), '.config', 'systemd', 'user');

// Resolve the script path reliably
function getScriptPath(): string {
  const candidates = [
    path.resolve(process.cwd(), '../remind-srs.sh'),
    path.resolve(process.cwd(), 'remind-srs.sh'),
    '/home/levi/Desktop/Projects/java150/remind-srs.sh',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return '/home/levi/Desktop/Projects/java150/remind-srs.sh';
}

function ensureSystemdFiles(time: string = '10:00') {
  if (!fs.existsSync(USER_SYSTEMD_DIR)) {
    fs.mkdirSync(USER_SYSTEMD_DIR, { recursive: true });
  }

  const scriptPath = getScriptPath();
  const serviceContent = `[Unit]
Description=NeetCode 150 SRS Review Reminder Service

[Service]
Type=oneshot
ExecStart=${scriptPath}
`;

  const timerContent = `[Unit]
Description=Daily DSA SRS Review Reminder

[Timer]
OnCalendar=*-*-* ${time}:00
Persistent=true

[Install]
WantedBy=timers.target
`;

  fs.writeFileSync(path.join(USER_SYSTEMD_DIR, SERVICE_NAME), serviceContent, 'utf-8');
  fs.writeFileSync(path.join(USER_SYSTEMD_DIR, TIMER_NAME), timerContent, 'utf-8');
}

function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        resolve(''); // Resolve with empty string rather than rejecting to handle inactive/disabled gracefully
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export async function GET() {
  try {
    const isEnabledOut = await runCommand(`systemctl --user is-enabled ${TIMER_NAME}`);
    const isEnabled = isEnabledOut.includes('enabled');

    const isActiveOut = await runCommand(`systemctl --user is-active ${TIMER_NAME}`);
    const isActive = isActiveOut.includes('active');

    const timersOut = await runCommand(`systemctl --user list-timers ${TIMER_NAME} --no-legend`);
    
    // Parse time from timer file if exists
    let time = '10:00';
    const timerPath = path.join(USER_SYSTEMD_DIR, TIMER_NAME);
    if (fs.existsSync(timerPath)) {
      const content = fs.readFileSync(timerPath, 'utf-8');
      const match = content.match(/OnCalendar=\*-\*-\*\s+([0-9]{1,2}:[0-9]{2})/);
      if (match) {
        time = match[1];
      }
    }

    return NextResponse.json({
      enabled: isEnabled,
      active: isActive,
      time,
      timerOutput: timersOut || null,
    });
  } catch (error) {
    console.error('Error fetching reminder status:', error);
    return NextResponse.json({ enabled: false, active: false, time: '10:00' });
  }
}

export async function POST(req: Request) {
  try {
    const { action, time = '10:00' } = await req.json();

    if (action === 'test') {
      const scriptPath = getScriptPath();
      try {
        execSync(`export DISPLAY=\${DISPLAY:-:0}; export DBUS_SESSION_BUS_ADDRESS=\${DBUS_SESSION_BUS_ADDRESS:-unix:path=/run/user/$(id -u)/bus}; notify-send "NeetCode 150 SRS" "Thông báo thử nghiệm thành công! Hệ thống nhắc nhở đã sẵn sàng." -i dialog-information -u normal`);
      } catch {
        // Fallback execute script
        if (fs.existsSync(scriptPath)) {
          execSync(`bash "${scriptPath}"`);
        }
      }
      return NextResponse.json({ success: true, message: 'Test notification sent' });
    }

    if (action === 'enable') {
      ensureSystemdFiles(time);
      execSync('systemctl --user daemon-reload');
      execSync(`systemctl --user enable --now ${TIMER_NAME}`);
      return NextResponse.json({ success: true, enabled: true, active: true, time });
    }

    if (action === 'disable') {
      try {
        execSync(`systemctl --user disable --now ${TIMER_NAME}`);
        execSync('systemctl --user daemon-reload');
      } catch (err) {
        console.error('Error disabling timer:', err);
      }
      return NextResponse.json({ success: true, enabled: false, active: false });
    }

    if (action === 'update_time') {
      ensureSystemdFiles(time);
      execSync('systemctl --user daemon-reload');
      execSync(`systemctl --user restart ${TIMER_NAME}`);
      return NextResponse.json({ success: true, enabled: true, active: true, time });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error modifying reminder service:', error);
    return NextResponse.json({ error: 'Failed to execute action' }, { status: 500 });
  }
}
