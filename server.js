import pkg from '@next/env';
const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { getWidgetConfig } from './lib/db/db.mjs';
import { verifyJwt } from './lib/security/jwt.mjs';


function randomUUIDFallback() {
  return randomUUID();
}

const { registerConnection, removeConnection, handleIncoming, heartbeatSweep } =
  await import('./lib/ws/connectionManager.mjs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = Number(process.env.PORT || 3000);

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.on('error', (err) => {
    if (err.code === 'EACCES') {
      console.error(
        `Port ${port} is blocked or requires elevated access. Try a different port, for example: PORT=3001 npm run dev`
      );
    } else if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the other process or run with a different port, for example: PORT=3001 npm run dev`
      );
    } else {
      console.error('Server startup error:', err);
    }
    process.exit(1);
  });

  const wss = new WebSocketServer({ noServer: true });

      server.on('upgrade', (req, socket, head) => {
    const { pathname, query } = parse(req.url, true);
    if (pathname !== '/api/ws') {
      socket.destroy();
      return;
    }

    const appId = query.appId || '';
    const config = appId ? getWidgetConfig(appId) : null;
    const origin = req.headers.origin || '';

    if (config && !config.allowedDomains.includes('*') && !config.allowedDomains.includes(origin)) {
      console.warn(`[security] rejected WS connection: origin "${origin}" not allowed for appId "${appId}"`);
      socket.destroy();
      return;
    }

    if (query.jwt && !verifyJwt(query.jwt)) {
      console.warn('[security] rejected WS connection: invalid JWT');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

    wss.on('connection', (ws, req) => {
    const { query } = parse(req.url, true);
    const sessionId = query.sessionId || randomUUID();
    const ip = req.socket.remoteAddress || 'unknown';
    registerConnection(ws, sessionId, ip);
    ws.on('message', (raw) => handleIncoming(sessionId, ws, raw));
    ws.on('close', () => removeConnection(sessionId));
  });

  setInterval(heartbeatSweep, 30000);

  server.listen(port, '0.0.0.0', () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});