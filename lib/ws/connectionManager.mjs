import { randomUUID } from 'node:crypto';
import { streamReply } from '../ai/geminiProvider.mjs';
const connections = new Map();

export function registerConnection(ws) {
  const sessionId = randomUUID();
  connections.set(sessionId, ws);
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
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
    console.log('[ai] sending ack');
    send(ws, { type: 'ack', payload: { id: msg.payload?.id }, timestamp: Date.now(), sessionId });

    const replyId = randomUUID();
    console.log('[ai] sending stream_start');
    send(ws, { type: 'stream_start', payload: { id: replyId }, timestamp: Date.now(), sessionId });

    try {
      console.log('[ai] calling streamReply with:', msg.payload?.text);
      let chunkCount = 0;

      // Hard 15s timeout so a hung Gemini call can't hang the whole connection silently.
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini call timed out after 15s')), 15000)
      );

      const runStream = (async () => {
        for await (const delta of streamReply(msg.payload?.text || '')) {
          chunkCount++;
          console.log('[ai] chunk', chunkCount, ':', delta);
          send(ws, { type: 'stream_chunk', payload: { id: replyId, delta }, timestamp: Date.now(), sessionId });
        }
      })();

      await Promise.race([runStream, timeout]);
      console.log('[ai] stream complete, total chunks:', chunkCount);
    } catch (err) {
      console.error('[ai] stream error FULL:', err);
      send(ws, {
        type: 'stream_chunk',
        payload: { id: replyId, delta: ` (error: ${err.message})` },
        timestamp: Date.now(),
        sessionId,
      });
    }

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