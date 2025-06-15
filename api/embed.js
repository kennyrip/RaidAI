export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const embedScript = `
(function() {
  function createChatWidget() {
    if (document.getElementById('raid-chat')) return;
    
    const widget = document.createElement('div');
    widget.id = 'raid-chat';
    widget.innerHTML = \`
      <div id="chat-btn" style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#667eea;border-radius:50%;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:10000;">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      </div>
      <div id="chat-box" style="position:fixed;bottom:90px;right:20px;width:300px;height:400px;background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.3);display:none;flex-direction:column;z-index:10001;font-family:Arial,sans-serif;">
        <div style="background:#667eea;color:white;padding:15px;border-radius:10px 10px 0 0;font-weight:600;">
          RAID AI
          <span id="chat-close" style="float:right;cursor:pointer;">&times;</span>
        </div>
        <div id="messages" style="flex:1;padding:15px;overflow-y:auto;background:#f8f9fa;">
          <div style="background:#e3f2fd;padding:10px;border-radius:8px;font-size:14px;">Hi! Ask me about RAID champions!</div>
        </div>
        <div style="padding:15px;border-top:1px solid #eee;">
          <div style="display:flex;gap:10px;">
            <input id="chat-input" type="text" placeholder="Ask about RAID..." style="flex:1;padding:10px;border:1px solid #ddd;border-radius:20px;outline:none;">
            <button id="chat-send" style="background:#667eea;color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;">></button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(widget);
    
    const btn = document.getElementById('chat-btn');
    const box = document.getElementById('chat-box');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('messages');
    
    btn.onclick = () => box.style.display = box.style.display === 'none' ? 'flex' : 'none';
    close.onclick = () => box.style.display = 'none';
    
    function addMsg(text, user = false) {
      const div = document.createElement('div');
      div.style.cssText = \`margin:10px 0;padding:10px;border-radius:8px;font-size:14px;\${user ? 'background:#667eea;color:white;margin-left:20px;' : 'background:white;border:1px solid #eee;margin-right:20px;'}\`;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
    
    async function sendMsg() {
      const msg = input.value.trim();
      if (!msg) return;
      
      addMsg(msg, true);
      input.value = '';
      
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        addMsg(data.response || 'Sorry, try again!');
      } catch (e) {
        addMsg('Connection error!');
      }
    }
    
    send.onclick = sendMsg;
    input.onkeypress = (e) => e.key === 'Enter' && sendMsg();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();
  `;
  
  res.send(embedScript);
}