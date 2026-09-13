export const chatStyles = `
  :host {
    --canvas: #0D0E12;
    --canvas-alt: rgba(255,255,255,0.04);
    --text-primary: #F2F3F5;
    --text-secondary: rgba(242,243,245,0.6);
    --bubble-user: rgba(255,255,255,0.08);
    --bubble-assistant: rgba(255,255,255,0.05);
    --border-glass: rgba(255,255,255,0.12);
    --accent-1: #4338ca;
    --accent-2: #8b5cf6;
  }
  @media (prefers-color-scheme: light) {
    :host {
      --canvas: #ffffff;
      --canvas-alt: rgba(0,0,0,0.03);
      --text-primary: #14151a;
      --text-secondary: rgba(20,21,26,0.55);
      --bubble-user: rgba(0,0,0,0.04);
      --bubble-assistant: #ffffff;
      --border-glass: rgba(0,0,0,0.08);
    }
  }

  * { box-sizing: border-box; }

  .chat-window {
    width: 370px;
    height: 540px;
    background: var(--canvas);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
    border-radius: 28px;
    border: 1px solid var(--border-glass);
    box-shadow:
      0 2px 8px rgba(0,0,0,.25),
      0 30px 80px rgba(0,0,0,.35),
      0 0 0 1px rgba(255,255,255,.03) inset;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    color: var(--text-primary);
    animation: chatWindowIn .5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes chatWindowIn {
    from { opacity: 0; transform: translateY(16px) scale(.94); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .chat-header {
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    border-bottom: 1px solid var(--border-glass);
    background: linear-gradient(180deg, rgba(255,255,255,.03), transparent);
  }
  .header-avatar {
    width: 38px; height: 38px; border-radius: 14px;
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(139,92,246,.35);
  }
  .header-text { flex: 1; min-width: 0; }
  .header-title { font-weight: 600; font-size: 14.5px; line-height: 1.2; color: var(--text-primary); }
  .header-status { font-size: 11.5px; color: var(--text-secondary); display: flex; align-items: center; gap: 5px; margin-top: 3px; }
  .status-online-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 0 3px rgba(74,222,128,.15);
  }
  .header-close {
    background: var(--canvas-alt);
    border: 1px solid var(--border-glass);
    width: 30px; height: 30px;
    border-radius: 11px;
    color: var(--text-primary);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    transition: background .18s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .header-close:hover { background: rgba(255,255,255,.1); }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chat-list::-webkit-scrollbar { width: 5px; }
  .chat-list::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 3px; }

  .bubble-row {
    display: flex;
    animation: bubbleIn .45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .bubble-row.user { justify-content: flex-end; }
  .bubble-row.assistant { justify-content: flex-start; }
  @keyframes bubbleIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .bubble {
    max-width: 78%;
    padding: 11px 15px;
    line-height: 1.5;
    position: relative;
    word-wrap: break-word;
  }
  .bubble.user {
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
    color: #fff;
    border-radius: 20px 20px 4px 20px;
    box-shadow: 0 4px 16px rgba(99,60,222,.28);
  }
  .bubble.assistant {
    background: var(--bubble-assistant);
    color: var(--text-primary);
    border: 1px solid var(--border-glass);
    border-radius: 20px 20px 20px 4px;
  }

  .bubble-text { white-space: pre-wrap; }
  .msg-meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 5px;
  }
  .msg-time { font-size: 10px; opacity: .6; }
  .status-check { font-size: 10px; opacity: .9; }
  .status-dot {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,.85);
    animation: statusPulse 1s infinite ease-in-out;
  }
  @keyframes statusPulse { 0%,100% { opacity: .4; } 50% { opacity: 1; } }

  /* "Living" breathing typing indicator — replaces bouncing dots */
  .bubble.typing {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 14px 16px;
    background: var(--bubble-assistant);
    border: 1px solid var(--border-glass);
    border-radius: 20px 20px 20px 4px;
    height: 18px;
  }
  .bubble.typing span {
    width: 3px;
    height: 10px;
    border-radius: 2px;
    background: var(--text-secondary);
    animation: breathe 1.1s ease-in-out infinite;
  }
  .bubble.typing span:nth-child(2) { animation-delay: .12s; }
  .bubble.typing span:nth-child(3) { animation-delay: .24s; }
  .bubble.typing span:nth-child(4) { animation-delay: .36s; }
  @keyframes breathe {
    0%, 100% { transform: scaleY(.5); opacity: .5; }
    50% { transform: scaleY(1.6); opacity: 1; }
  }

  .quick-replies { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
  .quick-reply-btn {
    background: var(--canvas-alt);
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    padding: 7px 13px;
    font-size: 12.5px;
    cursor: pointer;
    color: var(--text-primary);
    transition: all .18s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .quick-reply-btn:hover { background: rgba(255,255,255,.1); transform: translateY(-1px); }

  .chat-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px;
    border-top: 1px solid var(--border-glass);
    background: linear-gradient(0deg, rgba(255,255,255,.02), transparent);
  }
  .chat-input {
    flex: 1;
    border: 1px solid var(--border-glass);
    background: var(--canvas-alt);
    color: var(--text-primary);
    border-radius: 18px;
    padding: 11px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color .18s ease;
  }
  .chat-input::placeholder { color: var(--text-secondary); }
  .chat-input:focus { border-color: var(--accent-2); }

  .icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform .12s ease, opacity .12s ease;
  }
  .icon-btn:active { transform: scale(.9); }
  .icon-btn:disabled { cursor: not-allowed; opacity: .5; }

  .upload-btn { background: var(--canvas-alt); border: 1px solid var(--border-glass); color: var(--text-secondary); font-size: 16px; }
  .upload-btn:hover:not(:disabled) { background: rgba(255,255,255,.1); }
  .upload-spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border-glass);
    border-top-color: var(--accent-2);
    border-radius: 50%;
    animation: uploadSpin .7s linear infinite;
  }
  @keyframes uploadSpin { to { transform: rotate(360deg); } }

  .chat-send {
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
    box-shadow: 0 4px 14px rgba(139,92,246,.4);
  }
  .chat-send svg { width: 16px; height: 16px; }

  /* Pre-chat name capture */
  .prechat {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    justify-content: center;
    animation: bubbleIn .4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .prechat h3 { margin: 0; font-size: 16px; color: var(--text-primary); }
  .prechat p { margin: 0; font-size: 13px; color: var(--text-secondary); }
  .prechat input {
    border: 1px solid var(--border-glass);
    background: var(--canvas-alt);
    color: var(--text-primary);
    border-radius: 14px;
    padding: 11px 14px;
    font-size: 14px;
    outline: none;
  }
  .prechat input:focus { border-color: var(--accent-2); }
  .prechat-submit {
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
    color: #fff;
    border: none;
    border-radius: 14px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(139,92,246,.35);
  }
  .prechat-skip {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 12.5px;
    cursor: pointer;
    text-decoration: underline;
  }
`;