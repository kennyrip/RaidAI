const axios = require('axios');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'huggingface';
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL || 'microsoft/DialoGPT-medium';
    this.conversations = new Map(); // Store conversation history
  }

  async generateResponse(message, context, conversationId) {
    try {
      // Build conversation history
      let conversation = this.conversations.get(conversationId) || [];
      
      // Add context about RAID to the prompt
      const systemPrompt = this.buildSystemPrompt(context);
      const userMessage = message.toLowerCase();
      
      // Check for specific RAID queries first
      const quickResponse = this.getQuickResponse(userMessage, context);
      if (quickResponse) {
        this.updateConversation(conversationId, message, quickResponse);
        return quickResponse;
      }
      
      // Generate AI response based on provider
      let response;
      switch (this.provider) {
        case 'huggingface':
          response = await this.generateHuggingFaceResponse(systemPrompt, message, conversation);
          break;
        case 'gemini':
          response = await this.generateGeminiResponse(systemPrompt, message, conversation);
          break;
        case 'groq':
          response = await this.generateGroqResponse(systemPrompt, message, conversation);
          break;
        case 'openai':
          response = await this.generateOpenAIResponse(systemPrompt, message, conversation);
          break;
        default:
          response = this.getFallbackResponse(userMessage, context);
      }
      
      this.updateConversation(conversationId, message, response);
      return response;
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(message, context);
    }
  }

  buildSystemPrompt(context) {
    return `You are a RAID Shadow Legends expert AI assistant. You help players with champion builds, team compositions, strategies, and current game events.

Current RAID Data:
${context.champions ? `Champions: ${context.champions.slice(0, 10).map(c => `${c.name} (${c.faction}, ${c.rarity})`).join(', ')}` : ''}
${context.events ? `Current Events: ${context.events.slice(0, 3).map(e => e.name).join(', ')}` : ''}

Guidelines:
- Be helpful and specific about RAID Shadow Legends
- Recommend actual champions and builds
- Mention current meta and strategies
- Keep responses concise but informative
- If you don't know something specific, suggest general RAID strategies
- Always stay focused on RAID Shadow Legends topics`;
  }

  getQuickResponse(message, context) {
    // Quick responses for common RAID questions
    const responses = {
      'hello': 'Hello! I\'m here to help with RAID Shadow Legends. Ask me about champions, team builds, current events, or strategies!',
      'hi': 'Hi there! What would you like to know about RAID Shadow Legends?',
      'help': 'I can help you with:\n• Champion builds and recommendations\n• Team compositions for dungeons, arena, clan boss\n• Current events and fusion guides\n• General strategies and tips\n\nWhat would you like to know?',
      'best champions': 'Some top champions in the current meta include Arbiter, Krisk, Duchess Lilitu, Bad-el-Kazar, and Scyl of the Drakes. What specific area are you looking for champions in?',
      'clan boss': 'For Clan Boss, focus on champions with poison, HP burn, or decrease attack. Popular choices include Frozen Banshee, Kael, Apothecary, and Coffin Smasher. What\'s your current team?',
      'arena': 'Arena teams typically need speed, crowd control, and damage. Arbiter is the best speed lead, while champions like Trunda and Candraphon excel at nuking. What\'s your arena rank?',
      'fusion': context.events?.find(e => e.type === 'fusion') ? 
        `Current fusion: ${context.events.find(e => e.type === 'fusion').name}. Make sure you have enough resources before starting!` :
        'No active fusion events right now. Save your resources for the next one!',
    };

    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    return null;
  }

  async generateHuggingFaceResponse(systemPrompt, message, conversation) {
    if (!this.apiKey) {
      return this.getFallbackResponse(message);
    }

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          inputs: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data[0] && response.data[0].generated_text) {
        return response.data[0].generated_text.trim();
      }
      
      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('Hugging Face API Error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  async generateGeminiResponse(systemPrompt, message, conversation) {
    if (!this.apiKey) {
      return this.getFallbackResponse(message);
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text.trim();
      }
      
      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  async generateGroqResponse(systemPrompt, message, conversation) {
    if (!this.apiKey) {
      return this.getFallbackResponse(message);
    }

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content.trim();
      }
      
      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('Groq API Error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  async generateOpenAIResponse(systemPrompt, message, conversation) {
    if (!this.apiKey) {
      return this.getFallbackResponse(message);
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content.trim();
      }
      
      return this.getFallbackResponse(message);
    } catch (error) {
      console.error('OpenAI API Error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // RAID-specific fallback responses
    if (lowerMessage.includes('champion') || lowerMessage.includes('hero')) {
      return 'For champion recommendations, I suggest focusing on Kael or Athel as starters, then work towards Apothecary for support and Warmaiden for decrease defense. What specific role are you looking for?';
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('comp')) {
      return 'A good starter team includes: 1 damage dealer (Kael/Athel), 1 support (Apothecary), 1 defense down (Warmaiden), 1 healer, and 1 tank. What content are you building for?';
    }
    
    if (lowerMessage.includes('gear') || lowerMessage.includes('artifact')) {
      return 'For early game, focus on Speed sets for supports, Lifesteal for damage dealers, and Defense sets for tanks. Prioritize Speed, HP%, and Defense% on main stats.';
    }
    
    if (lowerMessage.includes('dungeon')) {
      return 'Start with Dragon\'s Lair for Speed and Lifesteal gear. A team with decrease attack, heal, and AoE damage works well. Kael, Apothecary, Warmaiden are great starters.';
    }
    
    if (lowerMessage.includes('arena')) {
      return 'Arena teams need speed and damage. Use a speed lead (High Khatun), buffer (Spirithost), defense down (Warmaiden), and nuker (Kael). Speed is everything in arena!';
    }
    
    return 'I\'m here to help with RAID Shadow Legends! Ask me about champions, team builds, gear recommendations, dungeon strategies, or arena tips. What would you like to know?';
  }

  updateConversation(conversationId, userMessage, aiResponse) {
    if (!conversationId) return;
    
    let conversation = this.conversations.get(conversationId) || [];
    conversation.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiResponse }
    );
    
    // Keep only last 10 messages to prevent memory issues
    if (conversation.length > 10) {
      conversation = conversation.slice(-10);
    }
    
    this.conversations.set(conversationId, conversation);
    
    // Clean up old conversations (older than 1 hour)
    setTimeout(() => {
      this.conversations.delete(conversationId);
    }, 3600000);
  }
}

module.exports = new AIService();