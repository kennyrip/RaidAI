// Comprehensive RAID Shadow Legends response system
function generateRAIDResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
    return 'Hello! I am your RAID Shadow Legends AI assistant. I can help with champions, team builds, strategies, events, and more. What would you like to know?';
  }
  
  // Starter Champions
  if (lowerMessage.match(/\b(starter|beginning|new player|which champion|best champion to start)\b/)) {
    return 'For starters, I recommend:\n\n**KAEL (Dark Elves)** - Best overall starter\n- Excellent farmer and poisoner\n- Great for Clan Boss and Campaign\n- Build: Lifesteal + Speed sets\n\n**ATHEL (Sacred Order)** - Strong damage dealer\n**GALEK (Orcs)** - AOE specialist\n**ELHAIN (High Elves)** - Speed and damage\n\nKael is generally the best choice for new players!';
  }
  
  // Specific Champions
  if (lowerMessage.includes('kael')) {
    return '**KAEL BUILD GUIDE:**\n\n**Early Game:** Lifesteal + Speed\n- Chest: ATK%\n- Gloves: Crit Rate\n- Boots: Speed\n- Substats: Speed, Crit Rate, ATK%\n\n**Late Game:** Speed + Cruel/Savage\n- Focus on 100% Crit Rate\n- High Speed (170+ for CB)\n- Accuracy for debuffs\n\n**Best for:** Campaign farming, Clan Boss, Arena nuker';
  }
  
  if (lowerMessage.includes('athel')) {
    return '**ATHEL BUILD GUIDE:**\n\n**Sets:** Lifesteal + Speed (early) -> Savage + Speed (late)\n- Chest: ATK%\n- Gloves: Crit Rate\n- Boots: Speed\n\n**Great for:** Campaign, Arena, Dungeons\n**Skills:** Strong single target and AOE damage';
  }
  
  if (lowerMessage.includes('apothecary')) {
    return '**APOTHECARY BUILD:**\n\n**Sets:** Speed + Immortal/Divine Life\n- Chest: HP%\n- Gloves: HP%\n- Boots: Speed\n- Focus: Speed (220+), HP, DEF\n\n**Role:** Speed booster, healer, turn meter manipulation\n**Best for:** All content - amazing support champion!';
  }
  
  if (lowerMessage.includes('warmaiden')) {
    return '**WARMAIDEN BUILD:**\n\n**Sets:** Speed + Accuracy\n- Chest: HP%\n- Gloves: HP%\n- Boots: Speed\n- Focus: Speed (170+), Accuracy (200+), HP\n\n**Role:** AOE Decrease DEF debuffer\n**Best for:** Arena, Dungeons, Clan Boss\n**Skill Priority:** A3 (60% DEF down) is her main value';
  }
  
  if (lowerMessage.includes('spirithost')) {
    return '**SPIRITHOST BUILD:**\n\n**Sets:** Speed + Immortal\n- Chest: HP%\n- Gloves: HP%\n- Boots: Speed\n- Focus: Speed (180+), HP, Resistance\n\n**Role:** ATK buffer, cleanser, reviver\n**Best for:** Arena, support teams\n**Key Skill:** A3 gives team ATK up and cleanses debuffs';
  }
  
  // Arena
  if (lowerMessage.match(/\b(arena|pvp|classic arena|tag team)\b/)) {
    return '**ARENA STRATEGY:**\n\n**Classic Team Setup:**\n1. **Speed Lead** - High Khatun, Gorgorab, Arbiter\n2. **Buffer** - Spirithost (ATK up), Seeker (TM boost)\n3. **Debuffer** - Warmaiden (DEF down), Decrease DEF\n4. **Nuker** - Kael, Elhain, Sinesha\n\n**Key Tips:**\n- Speed is everything! Aim for 200+ speed on your lead\n- Use speed sets on everyone\n- Focus on going first\n- Target teams you can beat, not the highest power';
  }
  
  // Clan Boss
  if (lowerMessage.match(/\b(clan boss|cb|unkillable|counter attack)\b/)) {
    return '**CLAN BOSS GUIDE:**\n\n**Essential Debuffs:**\n- Decrease ATK (most important!)\n- Poison/HP Burn damage\n- Weaken/Decrease DEF\n\n**Good Early CB Champions:**\n- Kael (poison)\n- Warmaiden (DEF down)\n- Coffin Smasher (DEF down + weaken)\n- Apothecary (speed/heal)\n\n**Advanced Strategies:**\n- Unkillable teams (Maneater + Painkeeper)\n- Counter-attack teams (Valkyrie, Skullcrusher)\n- Speed tuning is crucial!';
  }
  
  // Dungeons
  if (lowerMessage.match(/\b(dungeon|dragon|ice golem|fire knight|spider|minotaur)\b/)) {
    return '**DUNGEON GUIDE:**\n\n**Dragons Lair:** Focus on poisoners and healers\n**Ice Golem:** Bring decrease ATK and block debuffs\n**Fire Knight:** Multi-hit champions and turn meter reduction\n**Spiders Den:** AOE damage and HP burn\n**Minotaur:** High damage dealers\n\n**Universal Team:** Kael, Apothecary, Warmaiden, healer, +1\n\nStart with Dragon 20 for the best gear!';
  }
  
  // Gear and Artifacts
  if (lowerMessage.match(/\b(gear|artifact|set|stats|main stat)\b/)) {
    return '**GEAR PRIORITY:**\n\n**Main Stats Priority:**\n- Chest: HP%/ATK%/DEF% (role dependent)\n- Gloves: Crit Rate > Crit DMG > HP%/ATK%\n- Boots: Speed > HP%/ATK%\n\n**Best Sets:**\n- **Speed:** Universal, always useful\n- **Lifesteal:** Early game survival\n- **Cruel/Savage:** Late game damage\n- **Accuracy:** For debuffers\n\n**Substat Priority:** Speed > Crit Rate > HP%/ATK% > Accuracy';
  }
  
  // Team Building
  if (lowerMessage.match(/\b(team|composition|synergy|who should i use)\b/)) {
    return '**TEAM BUILDING BASICS:**\n\n**Balanced Team Structure:**\n1. **Damage Dealer** - Kael, Athel, Elhain\n2. **Support/Healer** - Apothecary, Warpriest\n3. **Debuffer** - Warmaiden, Spirithost\n4. **Tank/Utility** - High HP champion\n5. **Flex spot** - Based on content needs\n\n**Key Synergies:**\n- Speed boost + Damage dealers\n- DEF down + Nukers\n- Healers + Damage over time\n\nTell me what content you are focusing on for specific recommendations!';
  }
  
  // Events and Fusion
  if (lowerMessage.match(/\b(event|fusion|tournament|fragment)\b/)) {
    return '**EVENTS & FUSIONS:**\n\n**Current Focus:**\n- Check in-game events tab for active events\n- Prioritize fragment summon events\n- Save resources for fusion events\n\n**Event Tips:**\n- Plan your energy usage\n- Do not chase every event\n- Focus on events that give good rewards\n- Fragment champions are usually worth it\n\n**Fusion Strategy:**\n- Save rare champions for fusions\n- Keep food champions ready\n- Plan your resources 2-3 events ahead';
  }
  
  // Progression
  if (lowerMessage.match(/\b(progress|stuck|next step|what should i do)\b/)) {
    return '**PROGRESSION GUIDE:**\n\n**Early Game Priority:**\n1. Get Kael to 6-star level 60\n2. Farm Campaign 12-3 Brutal for XP\n3. Complete Arbiter missions\n4. Build basic Arena team\n5. Start Dragon dungeon\n\n**Mid Game:**\n1. Build Clan Boss team\n2. Progress in all dungeons\n3. Expand champion roster\n4. Focus on Great Hall upgrades\n\n**Late Game:**\n1. Optimize speed tuning\n2. Build specialized teams\n3. Push higher dungeon levels\n4. Focus on Doom Tower';
  }
  
  // Specific questions about game mechanics
  if (lowerMessage.match(/\b(masteries|great hall|books|skill books)\b/)) {
    return '**MASTERIES & SKILL BOOKS:**\n\n**Mastery Priority:**\n1. Offense tree for damage dealers\n2. Defense tree for tanks/supports\n3. Support tree for healers\n\n**Skill Book Priority:**\n1. Legendary champions first\n2. Key skills (cooldown reduction)\n3. Champions you use everywhere\n\n**Great Hall:** Focus on Speed, ATK, HP, DEF bonuses for your main factions first.';
  }
  
  if (lowerMessage.match(/\b(food|level|rank up|6 star)\b/)) {
    return '**LEVELING & RANKING UP:**\n\n**6-Star Priority:**\n1. Your farmer (usually Kael)\n2. Main damage dealer\n3. Key support (Apothecary)\n4. Arena team members\n\n**Food Strategy:**\n- Use 1-star champions as food\n- Level 2-star champions to make 3-star food\n- Farm Campaign 12-3 Brutal for XP\n- Use XP boosts efficiently\n\n**Never use rare+ champions as food unless you have duplicates!**';
  }
  
  if (lowerMessage.match(/\b(energy|gem|silver|resource)\b/)) {
    return '**RESOURCE MANAGEMENT:**\n\n**Energy Usage:**\n- Campaign farming for XP\n- Dragon dungeon for gear\n- Events and tournaments\n\n**Gem Priority:**\n1. Energy refills (early game)\n2. Masteries for key champions\n3. Vault space\n4. Market refreshes (late game)\n\n**Silver Spending:**\n- Upgrading gear (main priority)\n- Ascending champions\n- Great Hall upgrades';
  }
  
  // Default response with helpful suggestions
  return 'I am here to help with RAID Shadow Legends! I can assist with:\n\n**CHAMPIONS** - Builds, ratings, and strategies\n**TEAM BUILDING** - Compositions for any content\n**ARENA** - PvP strategies and team setups\n**CLAN BOSS** - Damage optimization\n**DUNGEONS** - Farming strategies\n**GEAR** - Artifact recommendations\n**PROGRESSION** - Next steps guidance\n**RESOURCES** - Energy, gems, silver management\n\nJust ask me about any specific champion, strategy, or content you need help with!';
}

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
    
    const response = generateRAIDResponse(message);
    
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