(function() {
  const script = document.currentScript;
  const clientId = script.getAttribute('data-client-id') || 'default';
  const color = script.getAttribute('data-color') || '#2563eb';
  const title = script.getAttribute('data-title') || 'AI Assistant';
  
  const bubble = document.createElement('div');
  bubble.innerHTML = '💬';
  bubble.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: ${color};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    border: none;
    transition: transform 0.2s;
  `;
  bubble.onmouseover = () => bubble.style.transform = 'scale(1.1)';
  bubble.onmouseout = () => bubble.style.transform = 'scale(1)';
  
  const chatWindow = document.createElement('div');
  chatWindow.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 380px;
    height: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 9999;
    display: none;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  `;
  
  chatWindow.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:${color};color:white;border-radius:16px 16px 0 0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:8px;height:8px;background:#4ade80;border-radius:50%;"></div>
        <span style="font-weight:600;font-size:14px;">${title}</span>
      </div>
      <button id="chat-close" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">✕</button>
    </div>
    <div id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;">
      <div style="align-self:flex-start;background:#f3f4f6;padding:12px;border-radius:12px;max-width:85%;font-size:14px;color:#374151;">
        Hi! Ask me anything about our business.
      </div>
    </div>
    <div style="padding:12px;border-top:1px solid #e5e7eb;display:flex;gap:8px;">
      <input id="chat-input" type="text" placeholder="Ask me anything..." style="flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;color:#374151;">
      <button id="chat-send" style="padding:10px 16px;background:${color};color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Send</button>
    </div>
  `;
  
  document.body.appendChild(bubble);
  document.body.appendChild(chatWindow);
  
  let isOpen = false;
  bubble.onclick = () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    bubble.style.display = isOpen ? 'none' : 'flex';
  };
  
  document.getElementById('chat-close').onclick = () => {
    isOpen = false;
    chatWindow.style.display = 'none';
    bubble.style.display = 'flex';
  };
  
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const text = input.value.trim();
    if (!text) return;
    
    messages.innerHTML += `
      <div style="align-self:flex-end;background:${color};color:white;padding:12px;border-radius:12px;max-width:85%;font-size:14px;">
        ${text}
      </div>
    `;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.style.cssText = 'align-self:flex-start;background:#f3f4f6;padding:12px;border-radius:12px;font-size:14px;color:#9ca3af;';
    loadingDiv.textContent = 'Typing...';
    messages.appendChild(loadingDiv);
    
    try {
      const res = await fetch('https://chat-widget-2kfiv5u2m-abdulgeniabdulaziz-6073s-projects.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      loadingDiv.remove();
      
      messages.innerHTML += `
        <div style="align-self:flex-start;background:#f3f4f6;padding:12px;border-radius:12px;max-width:85%;font-size:14px;color:#374151;">
          ${data.reply || 'Sorry, I could not generate a response. Please try again.'}
        </div>
      `;
    } catch (error) {
      loadingDiv.textContent = 'Sorry, something went wrong. Please try again.';
    }
    
    messages.scrollTop = messages.scrollHeight;
  }
  
  document.getElementById('chat-send').onclick = sendMessage;
  document.getElementById('chat-input').onkeydown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };
})();