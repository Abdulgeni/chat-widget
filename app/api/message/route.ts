import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { isOriginAllowed } from '../../../lib/security/checkOrigin.mjs';
import { checkRateLimit } from '../../../lib/security/rateLimiter.mjs';
import { sanitizeText } from '../../../lib/security/sanitize.mjs';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, sessionId, appId } = body;
  const origin = req.headers.get('origin') || '';

  if (!isOriginAllowed(appId, origin)) {
    return NextResponse.json({ error: 'origin not allowed for this appId' }, { status: 403 });
  }

  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`${ip}:${sessionId}`)) {
    return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
  }

  const safeText = sanitizeText(text);

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: safeText,
    });

    const replyText =
      result.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '(empty response)';

    return NextResponse.json({
      type: 'message',
      payload: { id: randomUUID(), role: 'assistant', text: replyText },
      timestamp: Date.now(),
      sessionId,
    });
  } catch (err) {
    return NextResponse.json({
      type: 'message',
      payload: { id: randomUUID(), role: 'assistant', text: 'Error generating reply.' },
      timestamp: Date.now(),
      sessionId,
    });
  }
}