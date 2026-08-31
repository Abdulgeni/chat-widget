// widget-src/widget.js
// Enhanced embeddable chat widget with Shadow DOM isolation

(function() {
  // Configuration from script tag attributes
  const script = document.currentScript;
  const config = {
    clientId: script?.getAttribute('data-client-id') || 'default',
    color: script?.getAttribute('data-color') || '#2563eb',
    title: script?.getAttribute('data-title') || 'AI Assistant',
    apiUrl: script?.getAttribute('data-api-url') || new URL(script?.src || window.location.href).origin,
    position: script?.getAttribute('data-position') || 'bottom-right',
    welcomeMessage: script?.getAttribute('data-welcome') || 'Hi! Ask me anything about our business.',
    primaryColor: script?.getAttribute('data-primary-color') || '#2563eb',
    secondaryColor: script?.getAttribute('data-secondary-color') || '#ffffff',
    fontFamily: script?.getAttribute('data-font') || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  // Create Shadow DOM host
  const host = document.createElement('div');
  host.id = `ai-chat-widget-${config.clientId}`;
  host.style.cssText = `
    position: fixed;
    z-index: 2147483647;
    ${config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
    bottom: 20px;
    font-family: ${config.fontFamily};
  `;
  document.body.appendChild(host);

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: 'open' });

  // Styles for the widget (isolated from host page)
  const styles = `
    :host {
      all: initial;
      font-family: ${config.fontFamily};
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .chat-bubble {
      width: 60px;
      height: 60px;
      background: ${config.primaryColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: none;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .chat-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
    }
    
    .chat-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    .chat-bubble .notification-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      display: none;
    }
    
    .chat-window {
      position: fixed;
      bottom: 90px;
      ${config.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;'}
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: ${config.primaryColor};
      color: white;
      border-radius: 16px 16px 0 0;
    }
    
    .chat-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .chat-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    
    .chat-title {
      font-weight: 600;
      font-size: 16px;
    }
    
    .chat-status {
      font-size: 12px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .online-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      display: inline-block;
    }
    
    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }
    
    .close-button:hover {
      background: rgba(255,255,255,0.2);
    }
    
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
      animation: messageIn 0.3s ease;
    }
    
    @keyframes messageIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .message.user {
      align-self: flex-end;
      background: ${config.primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .message.bot {
      align-self: flex-start;
      background: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
    }
    
    .message.typing {
      background: white;
      border: 1px solid #e5e7eb;
      align-self: flex-start;
      display: flex;
      gap: 4px;
      padding: 16px;
    }
    
    .typing-dot {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }
    
    .input-container {
      display: flex;
      gap: 8px;
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    
    .message-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    
    .message-input:focus {
      border-color: ${config.primaryColor};
      box-shadow: 0 0 0 3px ${config.primaryColor}20;
    }
    
    .send-button {
      padding: 10px 16px;
      background: ${config.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
      font-family: inherit;
    }
    
    .send-button:hover:not(:disabled) {
      background: ${config.primaryColor}dd;
    }
    
    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .quick-replies {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: white;
      border-top: 1px solid #f3f4f6;
      flex-wrap: wrap;
    }
    
    .quick-reply {
      padding: 6px 12px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
      font-family: inherit;
      color: #374151;
    }
    
    .quick-reply:hover {
      background: ${config.primaryColor};
      color: white;
      border-color: ${config.primaryColor};
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.textContent = styles;

  // Create chat bubble (FAB)
  const bubble = document.createElement('button');
  bubble.className = 'chat-bubble';
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
    <span class="notification-dot"></span>
  `;

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
  
  chatWindow.innerHTML = `
    <div class="chat-header">
      <div class="chat-header-left">
        <div class="chat-avatar">🤖</div>
        <div>
          <div class="chat-title">${config.title}</div>
          <div class="chat-status">
            <span class="online-dot"></span>
            Online
          </div>
        </div>
      </div>
      <button class="close-button" aria-label="Close chat">✕</button>
    </div>
    <div class="messages-container"></div>
    <div class="quick-replies"></div>
    <div class="input-container">
      <input type="text" class="message-input" placeholder="Type your message..." />
      <button class="send-button">Send</button>
    </div>
  `;

  // Append elements to shadow DOM
  shadow.appendChild(styleElement);
  shadow.appendChild(bubble);
  shadow.appendChild(chatWindow);

  // Get references to elements
  const messagesContainer = chatWindow.querySelector('.messages-container');
  const messageInput = chatWindow.querySelector('.message-input');
  const sendButton = chatWindow.querySelector('.send-button');
  const closeButton = chatWindow.querySelector('.close-button');
  const quickRepliesContainer = chatWindow.querySelector('.quick-replies');

  // State
  let isOpen = false;
  let isTyping = false;
  let sessionId = localStorage.getItem(`chat-session-${config.clientId}`) || generateSessionId();

  function generateSessionId() {
    const id = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(`chat-session-${config.clientId}`, id);
    return id;
  }

  // Add welcome message
  function addMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
  }

  // Show typing indicator
  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message typing';
    typingDiv.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
  }

  // Remove typing indicator
  function removeTyping(typingDiv) {
    typingDiv.remove();
  }

  // Add quick replies
  function addQuickReplies(replies) {
    quickRepliesContainer.innerHTML = '';
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.className = 'quick-reply';
      button.textContent = reply;
      button.addEventListener('click', () => {
        messageInput.value = reply;
        sendMessage();
      });
      quickRepliesContainer.appendChild(button);
    });
  }

  // Send message to API
  async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || isTyping) return;

    // Clear input
    messageInput.value = '';
    quickRepliesContainer.innerHTML = '';

    // Add user message
    addMessage('user', text);

    // Show typing indicator
    isTyping = true;
    sendButton.disabled = true;
    const typingDiv = showTyping();

    try {
      const response = await fetch(`${config.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          clientId: config.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Remove typing indicator
      removeTyping(typingDiv);
      
      // Add bot response
      addMessage('bot', data.reply);

      // Add quick replies if available
      if (data.quickReplies && data.quickReplies.length > 0) {
        addQuickReplies(data.quickReplies);
      }

    } catch (error) {
      removeTyping(typingDiv);
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
      console.error('Chat error:', error);
    }

    isTyping = false;
    sendButton.disabled = false;
    messageInput.focus();
  }

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      messageInput.focus();
      // Hide notification dot
      bubble.querySelector('.notification-dot').style.display = 'none';
    }
  }

  // Event listeners
  bubble.addEventListener('click', toggleChat);
  closeButton.addEventListener('click', toggleChat);
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Add welcome message
  addMessage('bot', config.welcomeMessage);

  // Add initial quick replies
  addQuickReplies([
    'What services do you offer?',
    'How can you help me?',
    'Tell me about pricing'
  ]);

  // Listen for programmatic commands
  window.addEventListener('ai-chat-command', (e) => {
    const { command, data } = e.detail;
    if (command === 'open') {
      if (!isOpen) toggleChat();
    } else if (command === 'close') {
      if (isOpen) toggleChat();
    } else if (command === 'send') {
      messageInput.value = data.message;
      sendMessage();
    }
  });

  // Expose API for programmatic control
  window[`aiChatWidget_${config.clientId}`] = {
    open: () => { if (!isOpen) toggleChat(); },
    close: () => { if (isOpen) toggleChat(); },
    send: (message) => {
      messageInput.value = message;
      sendMessage();
    },
    isOpen: () => isOpen,
  };

  console.log(`✅ AI Chat Widget initialized (${config.clientId})`);
})();
