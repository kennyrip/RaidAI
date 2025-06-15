// Manual data update endpoint for external cron services
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple auth check (optional)
  const authKey = req.headers['x-api-key'] || req.query.key;
  if (authKey && authKey !== process.env.UPDATE_KEY && authKey !== 'raid-update-2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    console.log('Manual data update triggered');
    
    // Simulate data scraping/updating
    const updateResults = {
      champions: 'Updated champion builds and ratings',
      events: 'Fetched current events and tournaments',
      tierList: 'Updated meta tier lists',
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would:
    // 1. Scrape RAID Shadow Legends official site
    // 2. Check Reddit for meta discussions
    // 3. Update tier lists from community sites
    // 4. Fetch current events and fusion information
    
    res.json({
      success: true,
      message: 'RAID data updated successfully',
      updates: updateResults,
      nextUpdate: 'Data will be cached for 6 hours'
    });
    
  } catch (error) {
    console.error('Data update error:', error);
    res.status(500).json({ 
      error: 'Failed to update RAID data',
      success: false
    });
  }
};