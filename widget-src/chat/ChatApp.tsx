import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'sending' | 'sent';
}

interface ChatAppProps {
  theme?: { primaryColor?: string };
}

function mockAiReply(userText: string): Promise<string> {
  // Placeholder for Loop 4, which replaces this with a real streamed
  // response from the backend.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`You said: "${userText}". Real AI replies arrive in Loop 4.`);
    }, 900);
  });
}

export default function ChatApp({ theme }: ChatAppProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isTyping]);

  async function handleSend(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: content,
      status: 'sending',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Optimistic UI: mark as sent almost immediately (real ack comes in Loop 3).
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'sent' } : m))
      );
    }, 150);

    setIsTyping(true);
    const reply = await mockAiReply(content);
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', text: reply },
    ]);
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