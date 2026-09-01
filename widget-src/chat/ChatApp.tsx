import { useState, useRef, useEffect } from 'react';
import { ChatTransport } from './transport';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'sending' | 'sent';
}

interface ChatAppProps {
  theme?: { primaryColor?: string };
  apiOrigin: string;
}

export default function ChatApp({ theme, apiOrigin }: ChatAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef<ChatTransport | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const transport = new ChatTransport(apiOrigin, sessionIdRef.current, (msg) => {
      if (msg.type === 'ack') {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.payload?.id ? { ...m, status: 'sent' } : m))
        );
        return;
      }
      if (msg.type === 'message' && msg.payload?.role === 'assistant') {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: msg.payload.id, role: 'assistant', text: msg.payload.text },
        ]);
      }
    });
    transport.connect();
    transportRef.current = transport;
    return () => transport.close();
  }, [apiOrigin]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isTyping]);

  async function handleSend() {
    const content = input.trim();
    if (!content) return;

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: 'user', text: content, status: 'sending' }]);
    setInput('');
    setIsTyping(true);

    await transportRef.current?.send(content, id);
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
              {m.text}
              {m.status === 'sending' && <span className="status-dot" aria-label="sending" />}
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

      <form
        className="chat-input-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          aria-label="Message"
        />
        <button className="chat-send" type="submit" style={{ background: primary }}>
          Send
        </button>
      </form>
    </div>
  );
}