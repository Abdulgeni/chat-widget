export const chatStyles = `
  .chat-window {
    width: 340px;
    height: 460px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    color: #1f2937;
  }
  .chat-header {
    padding: 14px 16px;
    color: #fff;
    font-weight: 600;
  }
  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f9fafb;
  }
  .bubble-row { display: flex; }
  .bubble-row.user { justify-content: flex-end; }
  .bubble-row.assistant { justify-content: flex-start; }
  .bubble {
    max-width: 75%;
    padding: 8px 12px;
    border-radius: 14px;
    line-height: 1.4;
    position: relative;
    word-wrap: break-word;
  }
  .bubble.user { color: #fff; border-bottom-right-radius: 4px; }
  .bubble.assistant { background: #e5e7eb; color: #111827; border-bottom-left-radius: 4px; }
  .status-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,.7);
    margin-left: 6px;
  }
  .status-check { font-size: 11px; opacity: .8; }
  .bubble.typing { display: flex; gap: 4px; padding: 12px; }
  .bubble.typing span {
    width: 6px; height: 6px; border-radius: 50%;
    background: #9ca3af;
    animation: chatTypingBounce 1.2s infinite ease-in-out;
  }
  .bubble.typing span:nth-child(2) { animation-delay: .15s; }
  .bubble.typing span:nth-child(3) { animation-delay: .3s; }
  @keyframes chatTypingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: .5; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
    .bubble-text { white-space: pre-wrap; }
  .msg-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 2px;
  }
  .msg-time { font-size: 10px; opacity: .6; }
  .status-check { font-size: 10px; opacity: .8; }
  .chat-input-row {
    display: flex;
    gap: 8px;
    padding: 10px;
    border-top: 1px solid #e5e7eb;
    background: #fff;
  }
  .chat-input {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 14px;
    outline: none;
  }
  .chat-input:focus { border-color: #9ca3af; }
  .chat-send {
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
  }
`;