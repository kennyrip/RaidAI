const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DataService {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'data', 'raid.db');
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      // Create data directory if it doesn't exist
      const fs = require('fs');
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const tables = [
        `CREATE TABLE IF NOT EXISTS champions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          faction TEXT NOT NULL,
          rarity TEXT NOT NULL,
          role TEXT NOT NULL,
          affinity TEXT NOT NULL,
          hp INTEGER,
          attack INTEGER,
          defense INTEGER,
          speed INTEGER,
          crit_rate INTEGER,
          crit_damage INTEGER,
          resistance INTEGER,
          accuracy INTEGER,
          skills TEXT,
          recommended_sets TEXT,
          tier_rating INTEGER,
          notes TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          start_date TEXT,
          end_date TEXT,
          description TEXT,
          rewards TEXT,
          requirements TEXT,
          active BOOLEAN DEFAULT 1,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        `CREATE TABLE IF NOT EXISTS meta_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          data TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      ];

      let completed = 0;
      tables.forEach((sql, index) => {
        this.db.run(sql, (err) => {
          if (err) {
            console.error(`Error creating table ${index}:`, err);
            reject(err);
          } else {
            completed++;
            if (completed === tables.length) {
              console.log('Database tables created successfully');
              this.seedInitialData().then(resolve).catch(reject);
            }
          }
        });
      });
    });
  }

  async seedInitialData() {
    // Check if we already have data
    return new Promise((resolve) => {
      this.db.get('SELECT COUNT(*) as count FROM champions', (err, row) => {
        if (err || row.count > 0) {
          resolve();
          return;
        }

        // Seed with current RAID champions (June 2025 data)
        const champions = [
          {
            name: 'Arbiter',
            faction: 'High Elves',
            rarity: 'Legendary',
            role: 'Support',
            affinity: 'Void',
            hp: 19650,
            attack: 1266,
            defense: 1233,
            speed: 110,
            tier_rating: 5,
            recommended_sets: 'Speed, Perception, Accuracy',
            notes: 'Best speed lead in game, team revive, turn meter boost'
          },
          {
            name: 'Krisk the Ageless',
            faction: 'Lizardmen',
            rarity: 'Legendary',
            role: 'Defense',
            affinity: 'Void',
            hp: 23790,
            attack: 958,
            defense: 1542,
            speed: 96,
            tier_rating: 5,
            recommended_sets: 'Stoneskin, Immunity, Speed',
            notes: 'Top tier support, ally protection, crowd control'
          },
          {
            name: 'Duchess Lilitu',
            faction: 'Demonspawn',
            rarity: 'Legendary',
            role: 'Support',
            affinity: 'Void',
            hp: 20145,
            attack: 1112,
            defense: 1255,
            speed: 104,
            tier_rating: 5,
            recommended_sets: 'Speed, Immunity, Perception',
            notes: 'Perfect veil, team revive, block debuffs'
          },
          {
            name: 'Kael',
            faction: 'Dark Elves',
            rarity: 'Rare',
            role: 'Attack',
            affinity: 'Magic',
            hp: 15195,
            attack: 1378,
            defense: 958,
            speed: 103,
            tier_rating: 4,
            recommended_sets: 'Lifesteal, Speed, Cruel',
            notes: 'Best starter champion, poison damage, campaign farmer'
          },
          {
            name: 'Apothecary',
            faction: 'High Elves',
            rarity: 'Rare',
            role: 'Support',
            affinity: 'Spirit',
            hp: 16350,
            attack: 958,
            defense: 1145,
            speed: 122,
            tier_rating: 4,
            recommended_sets: 'Speed, Perception, Immortal',
            notes: 'Excellent speed booster, heal, turn meter manipulation'
          },
          {
            name: 'Scyl of the Drakes',
            faction: 'Barbarians',
            rarity: 'Legendary',
            role: 'Support',
            affinity: 'Magic',
            hp: 21300,
            attack: 1101,
            defense: 1200,
            speed: 105,
            tier_rating: 5,
            recommended_sets: 'Speed, Immortal, Perception',
            notes: 'Login reward champion, revive, stun, heal'
          },
          {
            name: 'Coldheart',
            faction: 'Dark Elves',
            rarity: 'Epic',
            role: 'Attack',
            affinity: 'Spirit',
            hp: 14535,
            attack: 1443,
            defense: 815,
            speed: 98,
            tier_rating: 5,
            recommended_sets: 'Savage, Cruel, Speed',
            notes: 'Max HP damage, turn meter reduction, dungeon specialist'
          },
          {
            name: 'Bad-el-Kazar',
            faction: 'Undead Hordes',
            rarity: 'Legendary',
            role: 'HP',
            affinity: 'Spirit',
            hp: 23790,
            attack: 1112,
            defense: 1145,
            speed: 98,
            tier_rating: 5,
            recommended_sets: 'Lifesteal, Speed, Immortal',
            notes: 'Poison damage, continuous heal, extend buffs'
          },
          {
            name: 'Tayrel',
            faction: 'High Elves',
            rarity: 'Epic',
            role: 'Defense',
            affinity: 'Spirit',
            hp: 18330,
            attack: 1068,
            defense: 1350,
            speed: 99,
            tier_rating: 4,
            recommended_sets: 'Speed, Accuracy, Perception',
            notes: 'Decrease attack and defense, turn meter reduction'
          },
          {
            name: 'Miscreated Monster',
            faction: 'Demonspawn',
            rarity: 'Epic',
            role: 'HP',
            affinity: 'Magic',
            hp: 21135,
            attack: 1002,
            defense: 1101,
            speed: 98,
            tier_rating: 4,
            recommended_sets: 'Shield, Speed, Immortal',
            notes: 'Shield generation, provoke, ally protection'
          }
        ];

        const events = [
          {
            name: 'Champion Training Event',
            type: 'training',
            start_date: '2025-06-15',
            end_date: '2025-06-18',
            description: 'Earn points by leveling up champions',
            rewards: 'Sacred Shards, Energy, Silver',
            active: 1
          },
          {
            name: 'Dungeon Divers',
            type: 'dungeon',
            start_date: '2025-06-16',
            end_date: '2025-06-19',
            description: 'Complete dungeon stages to earn points',
            rewards: 'Ancient Shards, Gems, Artifacts',
            active: 1
          },
          {
            name: '2x Ancient Shards',
            type: 'summon_boost',
            start_date: '2025-06-20',
            end_date: '2025-06-22',
            description: 'Double chance for Epic and Legendary champions',
            rewards: 'Increased summon rates',
            active: 0
          }
        ];

        // Insert champions
        const insertChampion = this.db.prepare(`
          INSERT OR IGNORE INTO champions 
          (name, faction, rarity, role, affinity, hp, attack, defense, speed, tier_rating, recommended_sets, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        champions.forEach(champion => {
          insertChampion.run([
            champion.name, champion.faction, champion.rarity, champion.role,
            champion.affinity, champion.hp, champion.attack, champion.defense,
            champion.speed, champion.tier_rating, champion.recommended_sets, champion.notes
          ]);
        });

        insertChampion.finalize();

        // Insert events
        const insertEvent = this.db.prepare(`
          INSERT OR IGNORE INTO events 
          (name, type, start_date, end_date, description, rewards, active)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        events.forEach(event => {
          insertEvent.run([
            event.name, event.type, event.start_date, event.end_date,
            event.description, event.rewards, event.active
          ]);
        });

        insertEvent.finalize();

        console.log('Initial RAID data seeded successfully');
        resolve();
      });
    });
  }

  async getChampions(filters = {}) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM champions WHERE 1=1';
      const params = [];

      if (filters.search) {
        sql += ' AND name LIKE ?';
        params.push(`%${filters.search}%`);
      }

      if (filters.faction) {
        sql += ' AND faction = ?';
        params.push(filters.faction);
      }

      if (filters.rarity) {
        sql += ' AND rarity = ?';
        params.push(filters.rarity);
      }

      sql += ' ORDER BY tier_rating DESC, name ASC LIMIT 50';

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getCurrentEvents() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM events WHERE active = 1 ORDER BY start_date ASC';
      
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getRelevantContext(message) {
    const lowerMessage = message.toLowerCase();
    const context = {};

    try {
      // Get relevant champions based on message content
      if (lowerMessage.includes('champion') || lowerMessage.includes('hero')) {
        context.champions = await this.getChampions({ search: this.extractChampionName(message) });
      }

      // Get events if asking about events
      if (lowerMessage.includes('event') || lowerMessage.includes('fusion') || lowerMessage.includes('tournament')) {
        context.events = await this.getCurrentEvents();
      }

      // Get faction-specific champions
      const factions = ['high elves', 'dark elves', 'sacred order', 'banner lords', 'barbarians', 'lizardmen', 'skinwalkers', 'orcs', 'demonspawn', 'undead hordes', 'knights revenant', 'dwarves'];
      for (const faction of factions) {
        if (lowerMessage.includes(faction)) {
          context.champions = await this.getChampions({ faction: faction.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') });
          break;
        }
      }

      // Get role-specific champions
      const roles = ['attack', 'defense', 'support', 'hp'];
      for (const role of roles) {
        if (lowerMessage.includes(role)) {
          context.champions = await this.getChampions({ role: role.charAt(0).toUpperCase() + role.slice(1) });
          break;
        }
      }

      return context;
    } catch (error) {
      console.error('Error getting context:', error);
      return {};
    }
  }

  extractChampionName(message) {
    // Extract potential champion names from message
    const commonNames = ['kael', 'athel', 'galek', 'elhain', 'arbiter', 'krisk', 'duchess', 'scyl', 'apothecary', 'coldheart', 'tayrel', 'miscreated monster', 'bad-el-kazar'];
    
    for (const name of commonNames) {
      if (message.toLowerCase().includes(name)) {
        return name;
      }
    }
    
    return '';
  }

  async updateChampionData(championData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO champions 
        (name, faction, rarity, role, affinity, hp, attack, defense, speed, tier_rating, recommended_sets, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      this.db.run(sql, [
        championData.name, championData.faction, championData.rarity, championData.role,
        championData.affinity, championData.hp, championData.attack, championData.defense,
        championData.speed, championData.tier_rating, championData.recommended_sets, championData.notes
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async updateEventData(eventData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO events 
        (name, type, start_date, end_date, description, rewards, active, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      this.db.run(sql, [
        eventData.name, eventData.type, eventData.start_date, eventData.end_date,
        eventData.description, eventData.rewards, eventData.active
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
}

module.exports = new DataService();