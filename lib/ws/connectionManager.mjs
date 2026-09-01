import { randomUUID } from 'node:crypto';

const connections = new Map(); // sessionId -> ws

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

export function handleIncoming(sessionId, ws, raw) {
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
    // Ack receipt immediately so the client can flip "sending" -> "sent".
    send(ws, { type: 'ack', payload: { id: msg.payload?.id }, timestamp: Date.now(), sessionId });

    // Mock echo reply so the transport is fully testable end-to-end.
    // Loop 4 replaces this block with a real AI provider call.
    setTimeout(() => {
      send(ws, {
        type: 'message',
        payload: {
          id: randomUUID(),
          role: 'assistant',
          text: `[WS] You said: "${msg.payload?.text}"`,
        },
        timestamp: Date.now(),
        sessionId,
      });
    }, 700);
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