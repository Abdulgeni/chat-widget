import { NextRequest, NextResponse } from 'next/server';
import { listWidgetConfigs, upsertWidgetConfig, deleteWidgetConfig } from '../../../../lib/db/db.mjs';

function checkAuth(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret');
  return secret && secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ configs: listWidgetConfigs() });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { appId, allowedDomains, primaryColor } = body;

  if (!appId || !Array.isArray(allowedDomains)) {
    return NextResponse.json({ error: 'appId and allowedDomains[] are required' }, { status: 400 });
  }

  upsertWidgetConfig(appId, allowedDomains, { primaryColor: primaryColor || '#4f46e5' });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { appId } = await req.json();
  if (!appId) return NextResponse.json({ error: 'appId required' }, { status: 400 });
  deleteWidgetConfig(appId);
  return NextResponse.json({ ok: true });
}