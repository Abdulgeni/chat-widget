type IncomingHandler = (msg: any) => void;

export class ChatTransport {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private sessionId: string;
  private apiOrigin: string;
  private onMessage: IncomingHandler;
  private reconnectAttempts = 0;
  private usingFallback = false;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private connectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(apiOrigin: string, sessionId: string, onMessage: IncomingHandler) {
    this.apiOrigin = apiOrigin;
    this.sessionId = sessionId;
    this.onMessage = onMessage;
  }

  connect() {
    const wsUrl = this.apiOrigin.replace(/^http/, 'ws') + '/api/ws';
    try {
      this.ws = new WebSocket(wsUrl);
    } catch {
      this.fallbackToSSE();
      return;
    }

    this.connectTimeout = setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.ws?.close();
        this.fallbackToSSE();
      }
    }, 4000);

    this.ws.onopen = () => {
      if (this.connectTimeout) clearTimeout(this.connectTimeout);
      this.reconnectAttempts = 0;
      this.usingFallback = false;
      this.startHeartbeat();
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'pong') return;
        this.onMessage(msg);
      } catch {
        /* ignore malformed frame */
      }
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      if (!this.usingFallback) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private scheduleReconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
    setTimeout(() => this.connect(), delay);
  }

  private startHeartbeat() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({ type: 'ping', payload: {}, timestamp: Date.now(), sessionId: this.sessionId })
        );
      }
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
  }

  private fallbackToSSE() {
    this.usingFallback = true;
    this.eventSource = new EventSource(`${this.apiOrigin}/api/events?sessionId=${this.sessionId}`);
    this.eventSource.onmessage = (ev) => {
      try {
        this.onMessage(JSON.parse(ev.data));
      } catch {
        /* ignore */
      }
    };
  }

  async send(text: string, id: string) {
    if (!this.usingFallback && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ type: 'message', payload: { id, text }, timestamp: Date.now(), sessionId: this.sessionId })
      );
      return;
    }
    const res = await fetch(`${this.apiOrigin}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sessionId: this.sessionId }),
    });
    this.onMessage(await res.json());
  }

  close() {
    this.stopHeartbeat();
    this.ws?.close();
    this.eventSource?.close();
  }
}