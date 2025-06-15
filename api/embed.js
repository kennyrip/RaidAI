export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const embedScript = `
(function() {
  const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;
  
  function createChatWidget() {
    if (document.getElementById('raid-chat-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'raid-chat-widget';
    widget.innerHTML = \`
      <div id="raid-chat-btn" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:50%;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:10000;transition:all 0.3s ease;">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>
      
      <div id="raid-chat-box" style="position:fixed;bottom:90px;right:20px;width:320px;height:450px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.3);display:none;flex-direction:column;z-index:10001;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:15px;border-radius:10px 10px 0 0;font-weight:600;">
          RAID AI Assistant
          <span id="raid-chat-close" style="float:right;cursor:pointer;font-size:18px;">&times;</span>
        </div>
        
        <div id="raid-messages" style="flex:1;padding:15px;overflow-y:auto;background:#f8f9fa;">
          <div style="background:#e3f2fd;padding:10px;border-radius:8px;margin-bottom:10px;font-size:14px;">
            Hi! I'm your RAID Shadow Legends AI assistant. Ask me about champions, team builds, or strategies!
          </div>
        </div>
        
        <div style="padding:15px;border-top:1px solid #eee;background:white;border-radius:0 0 10px 10px;">
          <div style="display:flex;gap:10px;">
            <input id="raid-chat-input" type="text" placeholder="Ask about RAID..." style="flex:1;padding:10px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:14px;">
            <button id="raid-chat-send" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(widget);
    
    const btn = document.getElementById('raid-chat-btn');
    const box = document.getElementById('raid-chat-box');
    const close = document.getElementById('raid-chat-close');
    const input = document.getElementById('raid-chat-input');
    const send = document.getElementById('raid-chat-send');
    const messages = document.getElementById('raid-messages');
    
    btn.addEventListener('click', () => {
      box.style.display = box.style.display === 'none' ? 'flex' : 'none';
      if (box.style.display === 'flex') {
        input.focus();
      }
    });
    
    close.addEventListener('click', () => {
      box.style.display = 'none';
    });
    
    function addMessage(text, isUser = false) {
      const div = document.createElement('div');
      div.style.cssText = \`margin-bottom:10px;padding:10px;border-radius:8px;font-size:14px;line-height:1.4;\${isUser ? 'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;margin-left:20px;' : 'background:white;border:1px solid #eee;margin-right:20px;'}\`;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
    
    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;
      
      addMessage(message, true);
      input.value = '';
      
      // Show typing indicator
      const typing = document.createElement('div');
      typing.id = 'typing-indicator';
      typing.style.cssText = 'background:white;border:1px solid #eee;margin-right:20px;padding:10px;border-radius:8px;margin-bottom:10px;font-size:14px;color:#666;';
      typing.textContent = 'AI is thinking...';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      
      try {
        const response = await fetch(\`\${API_BASE}/api/chat\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        document.getElementById('typing-indicator')?.remove();
        
        if (data.response) {
          addMessage(data.response);
        } else {
          addMessage('Sorry, I could not process that. Try asking about RAID champions!');
        }
      } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        addMessage('Connection error. Please try again.');
      }
    }
    
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();
  `;
  
  res.send(embedScript);
}