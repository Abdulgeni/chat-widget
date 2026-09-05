import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import pdfParse from 'pdf-parse';
import { embedText } from '../../../lib/rag/embeddings.mjs';
import { saveChunk } from '../../../lib/rag/store.mjs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const sessionId = formData.get('sessionId') as string | null;

  if (!file || !sessionId) {
    return NextResponse.json({ error: 'file and sessionId required' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    const text: string = parsed.text || '';

    const chunks: string[] = [];
    let current = '';
    for (const para of text.split(/\n\s*\n/)) {
      if ((current + para).length > 800) {
        if (current) chunks.push(current);
        current = para;
      } else {
        current += (current ? '\n\n' : '') + para;
      }
    }
    if (current) chunks.push(current);

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const embedding = await embedText(chunk);
      saveChunk(sessionId, randomUUID(), chunk, embedding);
    }

    return NextResponse.json({ ok: true, chunks: chunks.length });
  } catch (err: any) {
    console.error('[upload] full error:', err);
    return NextResponse.json({ error: err.message || 'upload failed' }, { status: 500 });
  }
}