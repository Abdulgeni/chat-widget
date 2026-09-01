import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { WebSocketServer } from 'ws';
import {
  registerConnection,
  removeConnection,
  handleIncoming,
  heartbeatSweep,
} from './lib/ws/connectionManager.mjs';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url);
    if (pathname === '/api/ws') {
      // NOTE: Origin allowlisting per-appId arrives in Loop 6.
      // For now this accepts any origin, matching Loop 1-5 scope.
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    const sessionId = registerConnection(ws);
    ws.on('message', (raw) => handleIncoming(sessionId, ws, raw));
    ws.on('close', () => removeConnection(sessionId));
  });

  // Heartbeat sweep every 30s: pings clients, drops dead connections.
  setInterval(heartbeatSweep, 30000);

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});