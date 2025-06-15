// Vercel serverless function for chat
const axios = require('axios');

// Simple in-memory storage for demo
const champions = [
  { name: 'Kael', faction: 'Dark Elves', rarity: 'Rare', role: 'Attack', notes: 'Best starter champion' },
  { name: 'Arbiter', faction: 'High Elves', rarity: 'Legendary', role: 'Support', notes: 'Best speed lead' },
  { name: 'Scyl of the Drakes', faction: 'Barbarians', rarity: 'Legendary', role: 'Support', notes: 'Free legendary' }
];

async function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Quick responses for common questions
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I\'m your RAID Shadow Legends AI assistant. Ask me about champions, team builds, or strategies!';
  }
  
  if (lowerMessage.includes('starter') || lowerMessage.includes('best champion')) {
    return 'Kael is the best starter champion! He has poison damage, can farm campaign efficiently, and works well in clan boss. Build him with Lifesteal + Speed sets.';
  }
  
  if (lowerMessage.includes('kael')) {
    return 'Kael is excellent! Use Lifesteal + Speed sets. Focus on Attack%, Crit Rate, and Speed. He\'s great for campaign farming, clan boss, and early dungeons.';
  }
  
  if (lowerMessage.includes('arena')) {
    return 'For arena, you need: 1) Speed lead (High Khatun), 2) Buffer (Spirithost), 3) Defense down (Warmaiden), 4) Nuker (Kael). Speed is everything!';
  }
  
  if (lowerMessage.includes('clan boss')) {
    return 'Clan boss teams need: Decrease Attack (Coffin Smasher), Poison (Kael/Frozen Banshee), Heal (Apothecary), and survivability. Lifesteal sets are crucial!';
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('build')) {
    return 'Good starter team: Kael (damage), Apothecary (speed/heal), Warmaiden (defense down), Spirithost (attack up), and a tank. What content are you building for?';
  }
  
  // Try AI if we have API key
  if (process.env.AI_API_KEY && process.env.AI_PROVIDER === 'gemini') {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `You are a RAID Shadow Legends expert. Answer this question about RAID: ${message}`
            }]
          }]
        },
        { timeout: 8000 }
      );
      
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text.trim();
      }
    } catch (error) {
      console.error('AI Error:', error.message);
    }
  }
  
  return 'I\'m here to help with RAID Shadow Legends! Ask me about champions like Kael, team building, arena strategies, or clan boss tips.';
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    
    const response = await generateResponse(message);
    
    res.json({
      response: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      fallback: 'Ask me about RAID champions, team builds, or strategies!'
    });
  }
}