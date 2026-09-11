export const chatStyles = `
  .chat-window {
    width: 360px;
    height: 500px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0,0,0,.18), 0 4px 14px rgba(0,0,0,.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    color: #1f2937;
    animation: chatWindowIn .22s ease;
  }
  @keyframes chatWindowIn {
    from { opacity: 0; transform: translateY(12px) scale(.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .chat-header {
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    position: relative;
  }
  .header-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .header-text { flex: 1; min-width: 0; }
  .header-title { font-weight: 700; font-size: 15px; line-height: 1.2; }
  .header-status { font-size: 11px; opacity: .85; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .status-online-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 0 2px rgba(255,255,255,.3);
  }
  .header-close {
    background: rgba(255,255,255,.18);
    border: none;
    width: 28px; height: 28px;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: background .15s ease;
  }
  .header-close:hover { background: rgba(255,255,255,.32); }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #f8f9fb;
  }
  .chat-list::-webkit-scrollbar { width: 6px; }
  .chat-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }

  .bubble-row { display: flex; animation: bubbleIn .18s ease; }
  .bubble-row.user { justify-content: flex-end; }
  .bubble-row.assistant { justify-content: flex-start; }
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .bubble {
    max-width: 78%;
    padding: 10px 14px;
    border-radius: 16px;
    line-height: 1.45;
    position: relative;
    word-wrap: break-word;
    box-shadow: 0 1px 2px rgba(0,0,0,.04);
  }
  .bubble.user { color: #fff; border-bottom-right-radius: 5px; }
  .bubble.assistant {
    background: #fff;
    color: #1f2937;
    border: 1px solid #eef0f3;
    border-bottom-left-radius: 5px;
  }

  .bubble-text { white-space: pre-wrap; }
  .msg-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
  }
  .msg-time { font-size: 10px; opacity: .55; }
  .status-check { font-size: 10px; opacity: .85; }
  .status-dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,.8);
    animation: statusPulse 1s infinite ease-in-out;
  }
  @keyframes statusPulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }

  .bubble.typing { display: flex; gap: 4px; padding: 12px 14px; background: #fff; border: 1px solid #eef0f3; }
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

  .quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .quick-reply-btn {
    background: #fff;
    border: 1px solid #e2e5ea;
    border-radius: 16px;
    padding: 6px 12px;
    font-size: 12.5px;
    cursor: pointer;
    color: #374151;
    transition: all .15s ease;
  }
  .quick-reply-btn:hover { border-color: #c7cbd1; background: #f9fafb; transform: translateY(-1px); }

  .chat-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-top: 1px solid #eef0f3;
    background: #fff;
  }
  .chat-input {
    flex: 1;
    border: 1px solid #e2e5ea;
    background: #f8f9fb;
    border-radius: 22px;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color .15s ease, background .15s ease;
  }
  .chat-input:focus { border-color: #c7cbd1; background: #fff; }

  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform .12s ease, opacity .12s ease;
  }
  .icon-btn:active { transform: scale(.92); }
  .icon-btn:disabled { cursor: not-allowed; opacity: .55; }

  .upload-btn { background: #f1f2f5; color: #4b5563; font-size: 16px; }
  .upload-btn:hover:not(:disabled) { background: #e5e7eb; }
  .upload-spinner {
    width: 14px; height: 14px;
    border: 2px solid #d1d5db;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: uploadSpin .7s linear infinite;
  }
  @keyframes uploadSpin { to { transform: rotate(360deg); } }

  .chat-send { color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
  .chat-send svg { width: 16px; height: 16px; }
`;