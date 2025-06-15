const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const aiService = require('./services/aiService');
const dataService = require('./services/dataService');
const scraperService = require('./services/scraperService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 50,
  duration: 60,
});

const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', rateLimitMiddleware, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = await dataService.getRelevantContext(message);
    const response = await aiService.generateResponse(message, context, conversationId);
    
    res.json({
      response: response,
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      fallback: 'I am having trouble right now. Try asking about RAID champions, team builds, or current events!'
    });
  }
});

// Get champions data
app.get('/api/champions', async (req, res) => {
  try {
    const { search, faction, rarity } = req.query;
    const champions = await dataService.getChampions({ search, faction, rarity });
    res.json(champions);
  } catch (error) {
    console.error('Champions error:', error);
    res.status(500).json({ error: 'Failed to fetch champions' });
  }
});

// Get current events
app.get('/api/events', async (req, res) => {
  try {
    const events = await dataService.getCurrentEvents();
    res.json(events);
  } catch (error) {
    console.error('Events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Embed script endpoint
app.get('/embed.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const embedScript = `
(function() {
  const CHAT_API_URL = '${process.env.API_URL || `http://localhost:${PORT}`}';
  
  function createChatWidget() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'raid-ai-chat-widget';
    chatContainer.innerHTML = \`
      <div id="chat-toggle" style="position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 10000; transition: all 0.3s ease;">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>
      
      <div id="chat-window" style="position: fixed; bottom: 90px; right: 20px; width: 350px; height: 500px; background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); display: none; flex-direction: column; z-index: 10001; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 10px 10px 0 0; font-weight: 600;">
          RAID AI Assistant
          <span id="chat-close" style="float: right; cursor: pointer; font-size: 18px;">&times;</span>
        </div>
        
        <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; background: #f8f9fa;">
          <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 14px;">
            Hi! I am your RAID Shadow Legends AI assistant. Ask me about champions, team builds, current events, or strategies!
          </div>
        </div>
        
        <div style="padding: 15px; border-top: 1px solid #eee; background: white; border-radius: 0 0 10px 10px;">
          <div style="display: flex; gap: 10px;">
            <input id="chat-input" type="text" placeholder="Ask about RAID..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; outline: none; font-size: 14px;">
            <button id="chat-send" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(chatContainer);
    
    const toggle = document.getElementById('chat-toggle');
    const window = document.getElementById('chat-window');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
    
    let conversationId = null;
    
    toggle.addEventListener('click', () => {
      window.style.display = window.style.display === 'none' ? 'flex' : 'none';
      if (window.style.display === 'flex') {
        input.focus();
      }
    });
    
    close.addEventListener('click', () => {
      window.style.display = 'none';
    });
    
    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = \`margin-bottom: 10px; padding: 10px; border-radius: 8px; font-size: 14px; line-height: 1.4; \${isUser ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-left: 20px;' : 'background: white; border: 1px solid #eee; margin-right: 20px;'}\`;
      messageDiv.innerHTML = content;
      messages.appendChild(messageDiv);
      messages.scrollTop = messages.scrollHeight;
    }
    
    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;
      
      addMessage(message, true);
      input.value = '';
      
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing';
      typingDiv.style.cssText = 'background: white; border: 1px solid #eee; margin-right: 20px; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 14px; color: #666;';
      typingDiv.innerHTML = 'AI is thinking...';
      messages.appendChild(typingDiv);
      messages.scrollTop = messages.scrollHeight;
      
      try {
        const response = await fetch(\`\${CHAT_API_URL}/api/chat\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, conversationId })
        });
        
        const data = await response.json();
        
        document.getElementById('typing')?.remove();
        
        if (data.response) {
          addMessage(data.response);
          conversationId = data.conversationId;
        } else {
          addMessage('Sorry, I could not process that. Try asking about RAID champions or strategies!');
        }
      } catch (error) {
        document.getElementById('typing')?.remove();
        addMessage('Connection error. Please check your internet and try again.');
      }
    }
    
    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();
  `;
  
  res.send(embedScript);
});

async function startServer() {
  try {
    await dataService.initialize();
    scraperService.startScheduledScraping();
    
    app.listen(PORT, () => {
      console.log(`RAID AI Chat Server running on port ${PORT}`);
      console.log(`Embed script: ${process.env.API_URL || `http://localhost:${PORT}`}/embed.js`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();