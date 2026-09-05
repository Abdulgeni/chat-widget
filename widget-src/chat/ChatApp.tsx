import { useState, useRef, useEffect } from 'react';
import { ChatTransport } from './transport';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'sending' | 'sent';
  time: number;
}

interface ChatAppProps {
  theme?: { primaryColor?: string };
  apiOrigin: string;
  appId?: string;
}

function formatTime(ts: number) {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) return time;

  const day = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${day}, ${time}`;
}

export default function ChatApp({ theme, apiOrigin, appId }: ChatAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi! How can I help you today?', time: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<ChatTransport | null>(null);
  const sessionIdRef = useRef<string>(
    (typeof localStorage !== 'undefined' && localStorage.getItem('aiChatSessionId')) ||
      (() => {
        const id = crypto.randomUUID();
        localStorage.setItem('aiChatSessionId', id);
        return id;
      })()
  );

  useEffect(() => {
    fetch(`${apiOrigin}/api/history?sessionId=${sessionIdRef.current}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              text: m.text,
              time: m.created_at || Date.now(),
            }))
          );
        }
      })
      .catch(() => {});
  }, [apiOrigin]);

  useEffect(() => {
    const transport = new ChatTransport(apiOrigin, sessionIdRef.current, appId || '', (msg) => {
      try {
        if (msg.type === 'ack') {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.payload?.id ? { ...m, status: 'sent' } : m))
          );
          return;
        }
        if (msg.type === 'stream_start') {
          setIsTyping(true);
          setMessages((prev) => [
            ...prev,
            { id: msg.payload.id, role: 'assistant', text: '', time: Date.now() },
          ]);
          return;
        }
        if (msg.type === 'stream_chunk') {
          const delta = typeof msg.payload?.delta === 'string' ? msg.payload.delta : '';
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.payload?.id ? { ...m, text: m.text + delta } : m))
          );
          return;
        }
        if (msg.type === 'stream_end') {
          setIsTyping(false);
          return;
        }
        if (msg.type === 'message' && msg.payload?.role === 'assistant') {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: msg.payload.id, role: 'assistant', text: String(msg.payload.text ?? ''), time: Date.now() },
          ]);
        }
      } catch (err) {
        console.error('[ai-chat-widget] failed to handle message:', err, msg);
        setIsTyping(false);
      }
    });
    transport.connect();
    transportRef.current = transport;
    return () => transport.close();
  }, [apiOrigin, appId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isTyping]);

  async function handleSend() {
    const content = input.trim();
    if (!content) return;

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: 'user', text: content, status: 'sending', time: Date.now() }]);
    setInput('');
    setIsTyping(true);

    try {
      await transportRef.current?.send(content, id);
    } catch (err) {
      console.error('[ai-chat-widget] send failed:', err);
      setIsTyping(false);
    }
  }

  const primary = theme?.primaryColor || '#4f46e5';

  return (
    <div className="chat-window">
      <div className="chat-header" style={{ background: primary }}>
        <span>AI Support</span>
      </div>

      <div className="chat-list" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`bubble-row ${m.role}`}>
            <div className={`bubble ${m.role}`} style={m.role === 'user' ? { background: primary } : undefined}>
              <div className="bubble-text">{m.text}</div>
              <div className="msg-meta">
                <span className="msg-time">{formatTime(m.time)}</span>
                {m.status === 'sending' && <span className="status-dot" aria-label="sending" />}
                {m.status === 'sent' && <span className="status-check" aria-label="sent">✓</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="bubble-row assistant">
            <div className="bubble assistant typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          aria-label="Message"
        />
        <button
          className="chat-send"
          type="button"
          onClick={handleSend}
          style={{ background: primary }}
        >
          Send
        </button>
      </div>
    </div>
  );
}