// RAID data fetching service for Vercel
const axios = require('axios');

// Cache data in memory (resets on cold starts, but that's okay)
let dataCache = {
  champions: null,
  events: null,
  tierList: null,
  lastUpdate: null
};

// Cache duration: 6 hours
const CACHE_DURATION = 6 * 60 * 60 * 1000;

async function fetchRAIDData() {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (dataCache.lastUpdate && (now - dataCache.lastUpdate) < CACHE_DURATION) {
    return dataCache;
  }
  
  console.log('Fetching fresh RAID data...');
  
  try {
    // Fetch current events and meta information
    const [championData, eventData, tierData] = await Promise.all([
      fetchChampionData(),
      fetchEventData(),
      fetchTierListData()
    ]);
    
    dataCache = {
      champions: championData,
      events: eventData,
      tierList: tierData,
      lastUpdate: now
    };
    
    console.log('RAID data updated successfully');
    return dataCache;
    
  } catch (error) {
    console.error('Error fetching RAID data:', error);
    // Return cached data even if stale, or empty data
    return dataCache.lastUpdate ? dataCache : {
      champions: [],
      events: [],
      tierList: {},
      lastUpdate: now
    };
  }
}

async function fetchChampionData() {
  try {
    // Fetch from RAID Shadow Legends API or scrape champion data
    // For now, return curated champion data
    return [
      {
        name: 'Kael',
        faction: 'Dark Elves',
        rarity: 'Rare',
        role: 'Attack',
        affinity: 'Spirit',
        rating: 'S-Tier',
        bestFor: ['Campaign', 'Clan Boss', 'Arena'],
        build: {
          sets: ['Lifesteal', 'Speed'],
          mainStats: { chest: 'ATK%', gloves: 'Crit Rate', boots: 'Speed' },
          priority: 'Speed > Crit Rate > ATK% > Accuracy'
        }
      },
      {
        name: 'Apothecary',
        faction: 'High Elves',
        rarity: 'Rare',
        role: 'Support',
        affinity: 'Spirit',
        rating: 'S-Tier',
        bestFor: ['All Content'],
        build: {
          sets: ['Speed', 'Immortal'],
          mainStats: { chest: 'HP%', gloves: 'HP%', boots: 'Speed' },
          priority: 'Speed > HP% > DEF% > Resistance'
        }
      },
      // Add more champions as needed
    ];
  } catch (error) {
    console.error('Error fetching champion data:', error);
    return [];
  }
}

async function fetchEventData() {
  try {
    // In a real implementation, this would scrape the official RAID site
    // For now, return sample event data
    return [
      {
        name: 'Champion Training',
        type: 'Training Event',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: ['Sacred Shard', 'Legendary Books'],
        tips: 'Use XP boosts and farm campaign 12-3 Brutal'
      },
      {
        name: 'Artifact Enhancement',
        type: 'Enhancement Event',
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        rewards: ['Silver', 'Glyphs'],
        tips: 'Upgrade gear to +12 or +16 for maximum points'
      }
    ];
  } catch (error) {
    console.error('Error fetching event data:', error);
    return [];
  }
}

async function fetchTierListData() {
  try {
    // Fetch current tier list data
    return {
      arena: {
        'S-Tier': ['Arbiter', 'Hegemon', 'Tormin', 'Krisk'],
        'A-Tier': ['Siphi', 'Duchess Lilitu', 'Warlord', 'Rotos'],
        'B-Tier': ['Kael', 'Elhain', 'Athel', 'High Khatun']
      },
      clanBoss: {
        'S-Tier': ['Geomancer', 'Fayne', 'Frozen Banshee', 'Occult Brawler'],
        'A-Tier': ['Kael', 'Steelskull', 'Aothar', 'Bulwark'],
        'B-Tier': ['Outlaw Monk', 'Coffin Smasher', 'Warmaiden']
      },
      dungeons: {
        'S-Tier': ['Seer', 'Kymar', 'Renegade', 'Alure'],
        'A-Tier': ['Coldheart', 'Royal Guard', 'Armiger', 'Bellower'],
        'B-Tier': ['Kael', 'Athel', 'Apothecary', 'Warmaiden']
      }
    };
  } catch (error) {
    console.error('Error fetching tier list data:', error);
    return {};
  }
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const data = await fetchRAIDData();
    
    res.json({
      success: true,
      data: data,
      lastUpdate: new Date(data.lastUpdate).toISOString(),
      cacheStatus: data.lastUpdate ? 'fresh' : 'stale'
    });
    
  } catch (error) {
    console.error('Data API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch RAID data',
      success: false
    });
  }
};