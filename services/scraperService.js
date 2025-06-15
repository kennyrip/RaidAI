const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const dataService = require('./dataService');

class ScraperService {
  constructor() {
    this.isRunning = false;
    this.lastUpdate = null;
  }

  startScheduledScraping() {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', () => {
      this.scrapeAllData();
    });

    // Run once on startup after 30 seconds
    setTimeout(() => {
      this.scrapeAllData();
    }, 30000);

    console.log('Scheduled scraping started - runs every 6 hours');
  }

  async scrapeAllData() {
    if (this.isRunning) {
      console.log('Scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    console.log('Starting RAID data scraping...');

    try {
      await Promise.all([
        this.scrapeRedditData(),
        this.scrapeEventData(),
        this.scrapeTierListData()
      ]);

      this.lastUpdate = new Date();
      console.log('RAID data scraping completed successfully');
    } catch (error) {
      console.error('Error during scraping:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async scrapeRedditData() {
    try {
      console.log('Scraping Reddit for RAID discussions...');
      
      // Scrape r/RaidShadowLegends for current discussions
      const response = await axios.get('https://www.reddit.com/r/RaidShadowLegends/hot.json?limit=25', {
        headers: {
          'User-Agent': 'RAID-AI-Bot/1.0'
        },
        timeout: 10000
      });

      if (response.data && response.data.data && response.data.data.children) {
        const posts = response.data.data.children;
        
        for (const post of posts) {
          const title = post.data.title.toLowerCase();
          const content = post.data.selftext || '';
          
          // Look for event mentions
          if (title.includes('event') || title.includes('fusion') || title.includes('tournament')) {
            await this.processEventMention(post.data);
          }
          
          // Look for champion discussions
          if (title.includes('champion') || title.includes('build') || title.includes('guide')) {
            await this.processChampionMention(post.data);
          }
        }
      }
      
      console.log('Reddit scraping completed');
    } catch (error) {
      console.error('Reddit scraping error:', error.message);
    }
  }

  async scrapeEventData() {
    try {
      console.log('Scraping current events...');
      
      // Mock current events based on typical RAID patterns
      const currentDate = new Date();
      const events = [
        {
          name: 'Champion Training Event',
          type: 'training',
          start_date: this.formatDate(currentDate),
          end_date: this.formatDate(new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)),
          description: 'Earn points by leveling up champions',
          rewards: 'Sacred Shards, Energy, Silver',
          active: 1
        },
        {
          name: 'Dungeon Divers',
          type: 'dungeon',
          start_date: this.formatDate(new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000)),
          end_date: this.formatDate(new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000)),
          description: 'Complete dungeon stages to earn points',
          rewards: 'Ancient Shards, Gems, Artifacts',
          active: 1
        }
      ];

      // Add weekend events
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) { // Friday, Saturday, Sunday
        events.push({
          name: '2x Ancient Shards',
          type: 'summon_boost',
          start_date: this.formatDate(currentDate),
          end_date: this.formatDate(new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000)),
          description: 'Double chance for Epic and Legendary champions',
          rewards: 'Increased summon rates',
          active: 1
        });
      }

      // Update events in database
      for (const event of events) {
        await dataService.updateEventData(event);
      }
      
      console.log('Event data updated');
    } catch (error) {
      console.error('Event scraping error:', error.message);
    }
  }

  async scrapeTierListData() {
    try {
      console.log('Updating tier list data...');
      
      // Update champion tier ratings based on current meta (June 2025)
      const tierUpdates = [
        { name: 'Arbiter', tier_rating: 5, notes: 'Still the best speed lead and team reviver' },
        { name: 'Krisk the Ageless', tier_rating: 5, notes: 'Top tier support with ally protection' },
        { name: 'Duchess Lilitu', tier_rating: 5, notes: 'Perfect veil and team utility' },
        { name: 'Kael', tier_rating: 4, notes: 'Best starter, excellent for early-mid game' },
        { name: 'Scyl of the Drakes', tier_rating: 5, notes: 'Free legendary with amazing utility' },
        { name: 'Coldheart', tier_rating: 5, notes: 'Essential for dungeon speed teams' },
        { name: 'Bad-el-Kazar', tier_rating: 5, notes: 'Poison king and sustain master' },
        { name: 'Apothecary', tier_rating: 4, notes: 'Best rare support champion' },
        { name: 'Tayrel', tier_rating: 4, notes: 'Solid debuffer and turn meter control' },
        { name: 'Miscreated Monster', tier_rating: 4, notes: 'Shield support and crowd control' }
      ];

      for (const update of tierUpdates) {
        try {
          // Get current champion data
          const champions = await dataService.getChampions({ search: update.name });
          if (champions.length > 0) {
            const champion = champions[0];
            champion.tier_rating = update.tier_rating;
            champion.notes = update.notes;
            await dataService.updateChampionData(champion);
          }
        } catch (error) {
          console.error(`Error updating ${update.name}:`, error);
        }
      }
      
      console.log('Tier list data updated');
    } catch (error) {
      console.error('Tier list scraping error:', error.message);
    }
  }

  async processEventMention(postData) {
    try {
      const title = postData.title;
      const content = postData.selftext || '';
      
      // Extract event information from Reddit post
      if (title.includes('fusion') && (title.includes('new') || title.includes('upcoming'))) {
        // New fusion event detected
        const eventData = {
          name: this.extractEventName(title) || 'New Fusion Event',
          type: 'fusion',
          start_date: this.formatDate(new Date()),
          end_date: this.formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 2 weeks
          description: 'Fusion event - collect fragments to fuse legendary champion',
          rewards: 'Legendary Champion',
          active: 1
        };
        
        await dataService.updateEventData(eventData);
      }
    } catch (error) {
      console.error('Error processing event mention:', error);
    }
  }

  async processChampionMention(postData) {
    try {
      const title = postData.title;
      const content = postData.selftext || '';
      
      // Look for champion build discussions
      const championName = this.extractChampionName(title);
      if (championName) {
        // Update champion notes with community insights
        const champions = await dataService.getChampions({ search: championName });
        if (champions.length > 0) {
          const champion = champions[0];
          // Add community insights to notes (simplified)
          if (title.includes('build') || title.includes('guide')) {
            champion.notes += ' | Community: Active discussion on Reddit';
            await dataService.updateChampionData(champion);
          }
        }
      }
    } catch (error) {
      console.error('Error processing champion mention:', error);
    }
  }

  extractEventName(text) {
    // Extract event name from text
    const matches = text.match(/fusion[:\s]+([^,\n]+)/i);
    return matches ? matches[1].trim() : null;
  }

  extractChampionName(text) {
    // Common champion names to look for
    const championNames = [
      'arbiter', 'krisk', 'duchess', 'kael', 'athel', 'scyl', 'coldheart',
      'bad-el-kazar', 'apothecary', 'tayrel', 'miscreated monster', 'rotos',
      'siphi', 'martyr', 'venus', 'turvold', 'rhazin', 'drexthar', 'visix'
    ];
    
    const lowerText = text.toLowerCase();
    for (const name of championNames) {
      if (lowerText.includes(name)) {
        return name;
      }
    }
    
    return null;
  }

  formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  getLastUpdateTime() {
    return this.lastUpdate;
  }

  isScrapingActive() {
    return this.isRunning;
  }
}

module.exports = new ScraperService();