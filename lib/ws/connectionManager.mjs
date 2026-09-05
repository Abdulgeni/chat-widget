import { randomUUID } from 'node:crypto';
import { streamReply } from '../ai/geminiProvider.mjs';
import { ensureSession, saveMessage } from '../db/db.mjs';
import { checkRateLimit } from '../security/rateLimiter.mjs';
import { sanitizeText } from '../security/sanitize.mjs';
import { embedText } from '../rag/embeddings.mjs';
import { topKChunks } from '../rag/store.mjs';
import { logger } from '../logger.mjs';
import { captureError } from '../monitoring/sentry.mjs';
const connections = new Map();

export function registerConnection(ws, sessionId, ip) {
  ws.clientIp = ip || 'unknown';
  connections.set(sessionId, ws);
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ensureSession(sessionId);
  send(ws, { type: 'connected', payload: { sessionId }, timestamp: Date.now(), sessionId });
  return sessionId;
}

export function removeConnection(sessionId) {
  connections.delete(sessionId);
}

export async function handleIncoming(sessionId, ws, raw) {
  let msg;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (msg.type === 'ping') {
    send(ws, { type: 'pong', payload: {}, timestamp: Date.now(), sessionId });
    return;
  }

  if (msg.type === 'message') {
    if (!checkRateLimit(`${ws.clientIp}:${sessionId}`)) {
      send(ws, {
        type: 'stream_chunk',
        payload: { id: randomUUID(), delta: "You're sending messages too quickly. Please wait a moment." },
        timestamp: Date.now(),
        sessionId,
      });
      return;
    }

    const userText = sanitizeText(msg.payload?.text);
    saveMessage(sessionId, msg.payload?.id || randomUUID(), 'user', userText);

    send(ws, { type: 'ack', payload: { id: msg.payload?.id }, timestamp: Date.now(), sessionId });
        let context = '';
    try {
      const qEmbedding = await embedText(userText);
      const top = topKChunks(sessionId, qEmbedding, 3);
      if (top.length) context = top.map((c) => c.text).join('\n\n---\n\n');
    } catch (err) {
      console.warn('[rag] retrieval skipped:', err.message);
    }
    const replyId = randomUUID();
    send(ws, { type: 'stream_start', payload: { id: replyId }, timestamp: Date.now(), sessionId });

    let fullReply = '';
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini call timed out after 15s')), 15000)
      );

      const runStream = (async () => {
        for await (const delta of streamReply(userText, context)) {
          fullReply += delta;
          send(ws, { type: 'stream_chunk', payload: { id: replyId, delta }, timestamp: Date.now(), sessionId });
        }
      })();

      await Promise.race([runStream, timeout]);
    } catch (err) {
    logger.error({ err, sessionId }, 'AI stream error');
captureError(err, { sessionId, userText });
 const errText = err.message?.includes('UNAVAILABLE') || err.message?.includes('high demand')
  ? ' (The AI service is temporarily overloaded — please try again in a moment.)'
  : ' (Something went wrong generating a reply. Please try again.)';fullReply += errText;
      send(ws, { type: 'stream_chunk', payload: { id: replyId, delta: errText }, timestamp: Date.now(), sessionId });
    }

    saveMessage(sessionId, replyId, 'assistant', fullReply);
    send(ws, { type: 'stream_end', payload: { id: replyId }, timestamp: Date.now(), sessionId });
  }
}

function send(ws, obj) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

export function heartbeatSweep() {
  connections.forEach((ws, id) => {
    if (ws.isAlive === false) {
      ws.terminate();
      connections.delete(id);
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}