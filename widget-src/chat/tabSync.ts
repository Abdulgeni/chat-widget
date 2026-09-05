type Listener = (msg: any) => void;

export class TabSync {
  private channel: BroadcastChannel;
  private isLeader = false;
  private leaderKey: string;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  public onIncoming: Listener = () => {};
  public onOutgoingRequest: (text: string, id: string) => void = () => {};

  constructor(sessionId: string) {
    this.channel = new BroadcastChannel(`ai-chat-sync-${sessionId}`);
    this.leaderKey = `ai-chat-leader-${sessionId}`;
    this.channel.onmessage = (ev) => {
      const msg = ev.data;
      if (msg?.__kind === 'incoming') this.onIncoming(msg.payload);
      if (msg?.__kind === 'outgoing_request' && this.isLeader) {
        this.onOutgoingRequest(msg.text, msg.id);
      }
    };
  }

  claimLeadership(): boolean {
    const now = Date.now();
    const raw = localStorage.getItem(this.leaderKey);
    const existing = raw ? JSON.parse(raw) : null;

    if (!existing || now - existing.ts > 5000) {
      localStorage.setItem(this.leaderKey, JSON.stringify({ ts: now }));
      this.isLeader = true;
      this.heartbeatInterval = setInterval(() => {
        localStorage.setItem(this.leaderKey, JSON.stringify({ ts: Date.now() }));
      }, 2000);
      return true;
    }
    return false;
  }

  get leader() {
    return this.isLeader;
  }

  broadcastIncoming(payload: any) {
    this.channel.postMessage({ __kind: 'incoming', payload });
  }

  requestSend(text: string, id: string) {
    this.channel.postMessage({ __kind: 'outgoing_request', text, id });
  }

  close() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.channel.close();
  }
}