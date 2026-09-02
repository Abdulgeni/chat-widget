import { randomUUID } from 'node:crypto';
import { streamReply } from '../ai/geminiProvider.mjs';
import { ensureSession, saveMessage } from '../db/db.mjs';

const connections = new Map();

export function registerConnection(ws, sessionId) {
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
    const userText = msg.payload?.text || '';
    saveMessage(sessionId, msg.payload?.id || randomUUID(), 'user', userText);

    send(ws, { type: 'ack', payload: { id: msg.payload?.id }, timestamp: Date.now(), sessionId });

    const replyId = randomUUID();
    send(ws, { type: 'stream_start', payload: { id: replyId }, timestamp: Date.now(), sessionId });

    let fullReply = '';
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini call timed out after 15s')), 15000)
      );

      const runStream = (async () => {
        for await (const delta of streamReply(userText)) {
          fullReply += delta;
          send(ws, { type: 'stream_chunk', payload: { id: replyId, delta }, timestamp: Date.now(), sessionId });
        }
      })();

      await Promise.race([runStream, timeout]);
    } catch (err) {
      console.error('[ai] stream error:', err.message);
      const errText = ` (error: ${err.message})`;
      fullReply += errText;
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