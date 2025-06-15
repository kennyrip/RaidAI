module.exports = (req, res) => {
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
    const { message } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // Simple RAID responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = 'Hello! I am your RAID Shadow Legends AI assistant. Ask me about champions, team builds, or strategies!';
    }
    else if (lowerMessage.includes('starter') || lowerMessage.includes('best champion')) {
      response = 'Kael is the best starter champion! He has poison damage and can farm campaign efficiently. Build him with Lifesteal + Speed sets.';
    }
    else if (lowerMessage.includes('kael')) {
      response = 'Kael build: Lifesteal + Speed sets. Main stats: Attack% chest, Crit Rate gloves, Speed boots. Great for campaign and clan boss!';
    }
    else if (lowerMessage.includes('arena')) {
      response = 'Arena team: Speed lead (High Khatun), Buffer (Spirithost), Defense down (Warmaiden), Nuker (Kael). Speed is everything!';
    }
    else if (lowerMessage.includes('clan boss')) {
      response = 'Clan boss needs: Decrease Attack, Poison damage, Heal, and survivability. Use Lifesteal sets and focus on accuracy!';
    }
    else if (lowerMessage.includes('team') || lowerMessage.includes('build')) {
      response = 'Good starter team: Kael (damage), Apothecary (speed/heal), Warmaiden (defense down), Spirithost (attack up), and a tank.';
    }
    else {
      response = 'I can help with RAID Shadow Legends! Ask me about champions like Kael, team building, arena strategies, or clan boss tips.';
    }
    
    return res.json({
      response: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Sorry, I encountered an error.',
      fallback: 'Ask me about RAID champions!'
    });
  }
};