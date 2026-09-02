import { NextRequest, NextResponse } from 'next/server';
import { getHistory, ensureSession } from '../../../lib/db/db.mjs';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ messages: [] });
  ensureSession(sessionId);
  const messages = getHistory(sessionId);
  return NextResponse.json({ messages });
}