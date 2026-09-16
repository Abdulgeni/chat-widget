import { NextRequest, NextResponse } from 'next/server';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

function doBackup() {
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

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return doBackup();
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return doBackup();
}