import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, sessionId } = body;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
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
      payload: { id: randomUUID(), role: 'assistant', text: 'Error generating reply — check GOOGLE_API_KEY.' },
      timestamp: Date.now(),
      sessionId,
    });
  }
}