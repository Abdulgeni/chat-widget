import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { isOriginAllowed } from '../../../lib/security/checkOrigin.mjs';
import { checkRateLimit } from '../../../lib/security/rateLimiter.mjs';
import { sanitizeText } from '../../../lib/security/sanitize.mjs';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

function cors(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  return new NextResponse(null, { status: 204, headers: cors(origin) });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const body = await req.json();
  const { text, sessionId, appId } = body;

  if (!isOriginAllowed(appId, origin)) {
    return NextResponse.json({ error: 'origin not allowed for this appId' }, { status: 403, headers: cors(origin) });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`${ip}:${sessionId}`)) {
    return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429, headers: cors(origin) });
  }

  const safeText = sanitizeText(text);

  try {
    const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: safeText });
    const replyText =
      result.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '(empty response)';

    return NextResponse.json(
      {
        type: 'message',
        payload: { id: randomUUID(), role: 'assistant', text: replyText },
        timestamp: Date.now(),
        sessionId,
      },
      { headers: cors(origin) }
    );
  } catch (err) {
    return NextResponse.json(
      {
        type: 'message',
        payload: { id: randomUUID(), role: 'assistant', text: 'Error generating reply.' },
        timestamp: Date.now(),
        sessionId,
      },
      { headers: cors(origin) }
    );
  }
}