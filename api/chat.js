const axios = require('axios');

// RAID Champions database
const champions = [
  { name: 'Kael', faction: 'Dark Elves', rarity: 'Rare', role: 'Attack', notes: 'Best starter champion, poison damage, campaign farmer' },
  { name: 'Arbiter', faction: 'High Elves', rarity: 'Legendary', role: 'Support', notes: 'Best speed lead, team revive, turn meter boost' },
  { name: 'Scyl of the Drakes', faction: 'Barbarians', rarity: 'Legendary', role: 'Support', notes: 'Free legendary, revive, stun, heal' },
  { name: 'Apothecary', faction: 'High Elves', rarity: 'Rare', role: 'Support', notes: 'Speed booster, heal, turn meter manipulation' },
  { name: 'Coldheart', faction: 'Dark Elves', rarity: 'Epic', role: 'Attack', notes: 'Max HP damage, turn meter reduction, dungeon specialist' }
];

async function generateAIResponse(message) {
  if (!process.env.AI_API_KEY || process.env.AI_PROVIDER !== 'gemini') {
    return null;
  }

  try {
    const prompt = `You are a RAID Shadow Legends expert AI assistant. Answer this question about RAID Shadow Legends with specific, helpful advice: ${message}`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.AI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      { 
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text.trim();
    }
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
  }
  
  return null;
}

function getQuickResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! I am your RAID Shadow Legends AI assistant. Ask me about champions, team builds, current events, or strategies!';
  }
  
  if (lowerMessage.includes('starter') || lowerMessage.includes('best champion')) {
    return 'Kael is the best starter champion! He has poison damage, can farm campaign efficiently, and works well in clan boss. Build him with Lifesteal + Speed sets. Focus on Attack%, Crit Rate, and Speed stats.';
  }
  
  if (lowerMessage.includes('kael')) {
    return 'Kael build: Lifesteal + Speed sets. Main stats: Chest (Attack%), Gloves (Crit Rate), Boots (Speed). Substats: Attack%, Crit Rate, Speed, Accuracy. Great for campaign, clan boss, and early dungeons!';
  }
  
  if (lowerMessage.includes('arena')) {
    return 'Arena team setup: 1) Speed lead (High Khatun/Arbiter), 2) Buffer (Spirithost), 3) Defense down (Warmaiden), 4) Nuker (Kael). Speed is everything - aim for 200+ speed on your lead!';
  }
  
  if (lowerMessage.includes('clan boss')) {
    return 'Clan boss essentials: Decrease Attack (Coffin Smasher/Tayrel), Poison (Kael/Frozen Banshee), Heal (Apothecary), and survivability. Use Lifesteal sets and focus on accuracy for debuffs!';
  }
  
  if (lowerMessage.includes('team') || lowerMessage.includes('build')) {
    return 'Good starter team: Kael (damage), Apothecary (speed/heal), Warmaiden (defense down), Spirithost (attack up), and a tank. What specific content are you building for?';
  }
  
  if (lowerMessage.includes('gear') || lowerMessage.includes('artifact')) {
    return 'Early game gear priority: Speed sets for supports, Lifesteal for damage dealers, Defense for tanks. Focus on Speed, HP%, Defense%, and Attack% main stats. Speed is the most important stat!';
  }
  
  if (lowerMessage.includes('dungeon')) {
    return 'Start with Dragon Lair for Speed and Lifesteal gear. Team needs: decrease attack, heal, and AoE damage. Kael, Apothecary, Warmaiden are great starters for Dragon 13-15.';
  }
  
  if (lowerMessage.includes('fusion')) {
    return 'Fusion events require careful planning! Save resources (energy, shards, silver) beforehand. Focus on rare champions first, then epics. Do not start unless you can finish!';
  }
  
  if (lowerMessage.includes('event')) {
    return 'Current events typically include: Champion Training, Dungeon Divers, Arena tournaments. Check in-game for active events. Save resources for 2x events and fusions!';
  }
  
  return null;
}

module.exports = async (req, res) => {
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
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Try quick response first
    let response = getQuickResponse(message);
    
    // If no quick response, try AI
    if (!response) {
      response = await generateAIResponse(message);
    }
    
    // Fallback response
    if (!response) {
      response = 'I am here to help with RAID Shadow Legends! Ask me about champions like Kael, team building, arena strategies, clan boss tips, or gear recommendations. What would you like to know?';
    }
    
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
};