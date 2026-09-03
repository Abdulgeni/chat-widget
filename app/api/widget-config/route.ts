import { NextRequest, NextResponse } from 'next/server';
import { getWidgetConfig } from '../../../lib/db/db.mjs';

export async function GET(req: NextRequest) {
  const appId = req.nextUrl.searchParams.get('appId');
  if (!appId) return NextResponse.json({ error: 'appId required' }, { status: 400 });

  const config = getWidgetConfig(appId);
  if (!config) return NextResponse.json({ error: 'unknown appId' }, { status: 404 });

  return NextResponse.json({ theme: config.theme, allowedDomains: config.allowedDomains });
}