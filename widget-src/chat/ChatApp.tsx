import { useState, useRef, useEffect } from 'react';
import { ChatTransport } from './transport';
import { TabSync } from './tabSync';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'sending' | 'sent';
  time: number;
  quickReplies?: string[];
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
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi! How can I help you today?',
      time: Date.now(),
      quickReplies: ['What can you do?', 'Upload a document', 'Talk to support'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<ChatTransport | null>(null);
  const tabSyncRef = useRef<TabSync | null>(null);
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
    const tabSync = new TabSync(sessionIdRef.current);
    tabSyncRef.current = tabSync;
    const isLeader = tabSync.claimLeadership();

    const handleIncoming = (msg: any) => {
      try {
        if (msg.type === 'ack') {
          setMessages((prev) => prev.map((m) => (m.id === msg.payload?.id ? { ...m, status: 'sent' } : m)));
          return;
        }
        if (msg.type === 'stream_start') {
          setIsTyping(true);
          setMessages((prev) => [...prev, { id: msg.payload.id, role: 'assistant', text: '', time: Date.now() }]);
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
    };

    if (isLeader) {
      // This tab owns the real connection. Broadcast every incoming
      // frame to any other open tabs too.
      const transport = new ChatTransport(apiOrigin, sessionIdRef.current, appId || '', (msg) => {
        handleIncoming(msg);
        tabSync.broadcastIncoming(msg);
      });
      transport.connect();
      transportRef.current = transport;
      tabSync.onOutgoingRequest = (text, id) => transport.send(text, id);
    } else {
      // Follower tab: no socket of its own, just listens for broadcasts.
      tabSync.onIncoming = handleIncoming;
    }

    return () => {
      transportRef.current?.close();
      tabSync.close();
    };
  }, [apiOrigin, appId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isTyping]);

  async function handleSend(override?: string) {
    const content = (override ?? input).trim();
    if (!content) return;

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: 'user', text: content, status: 'sending', time: Date.now() }]);
    setInput('');
    setIsTyping(true);

    try {
      if (tabSyncRef.current?.leader) {
        await transportRef.current?.send(content, id);
      } else {
        tabSyncRef.current?.requestSend(content, id);
      }
    } catch (err) {
      console.error('[ai-chat-widget] send failed:', err);
      setIsTyping(false);
    }
  }

  async function handleFileUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionIdRef.current);

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: `📎 Uploaded: ${file.name}`, time: Date.now() },
    ]);

    try {
      const res = await fetch(`${apiOrigin}/api/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: data.ok
            ? `Got it — I've read "${file.name}" (${data.chunks} sections). Ask me anything about it.`
            : `Sorry, I couldn't process that file: ${data.error || 'unknown error'}`,
          time: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: 'Upload failed — please try again.', time: Date.now() },
      ]);
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
              {m.quickReplies && m.quickReplies.length > 0 && (
                <div className="quick-replies">
                  {m.quickReplies.map((qr) => (
                    <button key={qr} className="quick-reply-btn" onClick={() => handleSend(qr)}>
                      {qr}
                    </button>
                  ))}
                </div>
              )}
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
        <label className="attach-btn" title="Attach a PDF">
          📎
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
        </label>
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
        <button className="chat-send" type="button" onClick={() => handleSend()} style={{ background: primary }}>
          Send
        </button>
      </div>
    </div>
  );
}