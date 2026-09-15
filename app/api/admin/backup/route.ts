import { NextRequest, NextResponse } from 'next/server';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

function checkAuth(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const dbPath = path.join(process.cwd(), 'chat.db');
    const backupDir = path.join(process.cwd(), 'backups');
    if (!existsSync(backupDir)) mkdirSync(backupDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `chat-${timestamp}.db`);
    copyFileSync(dbPath, backupPath);

    return NextResponse.json({ ok: true, backupPath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}