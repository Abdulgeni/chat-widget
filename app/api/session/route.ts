import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ensureSession } from '../../../lib/db/db.mjs';

export async function POST() {
  const sessionId = randomUUID();
  ensureSession(sessionId);
  // token is a placeholder for now — Loop 6 replaces this with a real signed JWT.
  return NextResponse.json({ sessionId, token: sessionId });
}