import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, sessionId } = body;

  // Loop 4 wires this to the real AI provider instead of echoing.
  return NextResponse.json({
    type: 'message',
    payload: {
      id: randomUUID(),
      role: 'assistant',
      text: `[POST] You said: "${text}"`,
    },
    timestamp: Date.now(),
    sessionId,
  });
}