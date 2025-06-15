# RAID Shadow Legends AI Chat Widget

A specialized AI chat assistant for RAID Shadow Legends that provides current game information, champion builds, team compositions, and strategies. Built with auto-updating data scraping and easy website embedding.

## Features

- **Current RAID Data** - Auto-scrapes Reddit, events, and tier lists
- **Champion Database** - Complete champion stats and builds
- **Team Building** - AI-powered team composition suggestions  
- **Event Tracking** - Current events and fusion guides
- **Easy Embedding** - One-line embed code for any website
- **Multiple AI Providers** - Supports Hugging Face, Gemini, Groq, OpenAI
- **Auto-Updates** - Data refreshes every 6 hours automatically

## Quick Setup

### 1. Get AI API Key (Free)

**Option A: Hugging Face (Recommended)**
- Go to https://huggingface.co/settings/tokens
- Create new token
- Free tier: 1000 requests/day

**Option B: Google Gemini**
- Go to https://makersuite.google.com/app/apikey
- Create API key
- Free tier: 21,600 requests/day

**Option C: Groq**
- Go to https://console.groq.com/keys
- Create API key
- Free tier: 6000 requests/day

### 2. Deploy to Vercel (Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/raid-ai-chat)

1. Click "Deploy" button above
2. Connect your GitHub account
3. Set environment variables:
   - `AI_PROVIDER`: `huggingface` (or `gemini`, `groq`)
   - `AI_API_KEY`: Your API key from step 1
   - `API_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)

### 3. Embed on Your Website

Add this single line to your website:

```html
<script src="https://your-app.vercel.app/embed.js"></script>
```

That's it! The chat widget will appear on your site.

## Alternative Deployment

### Railway (Free)
1. Go to https://railway.app
2. Connect GitHub and import this repo
3. Set environment variables in Railway dashboard
4. Deploy automatically

### Render (Free)
1. Go to https://render.com
2. Connect GitHub and create new Web Service
3. Use `render.yaml` configuration
4. Set environment variables
5. Deploy

## Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd raid-ai-chat

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
# Set AI_PROVIDER and AI_API_KEY

# Start development server
npm run dev

# Server runs on http://localhost:3000
# Embed script: http://localhost:3000/embed.js
```

## Environment Variables

```env
# Required
AI_PROVIDER=huggingface
AI_API_KEY=your_api_key_here
API_URL=https://your-app.vercel.app

# Optional
PORT=3000
NODE_ENV=production
RATE_LIMIT_REQUESTS=50
```

## Embedding Options

### Basic Embed
```html
<script src="https://your-app.vercel.app/embed.js"></script>
```

### Custom Positioning
```html
<div id="raid-ai-chat"></div>
<script src="https://your-app.vercel.app/embed.js"></script>
```

### WordPress
Add to your theme's `functions.php`:
```php
function add_raid_ai_chat() {
    echo '<script src="https://your-app.vercel.app/embed.js"></script>';
}
add_action('wp_footer', 'add_raid_ai_chat');
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Chat with AI
- `GET /api/champions` - Get champions data
- `GET /api/events` - Get current events
- `GET /embed.js` - Embed script

## Chat Features

### Champion Questions
- "What's the best build for Kael?"
- "Counter for Hegemon teams?"
- "Current fusion champion worth it?"

### Team Building
- "Build me a speed team for Dragon 25"
- "Best clan boss team with my champions"
- "Arena defense for Gold IV"

### Current Events
- "What events are running now?"
- "When is the next 2x event?"
- "Should I pull shards now?"

### Strategy Help
- "Best starter champion?"
- "How to beat Spider 20?"
- "Arena team suggestions?"

## Data Sources

The AI automatically scrapes and updates from:
- Reddit r/RaidShadowLegends
- Current game events
- Community tier lists
- Meta discussions

Updates every 6 hours automatically.

## Switching AI Providers

Easy to switch providers by changing environment variables:

```env
# Switch to Gemini
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_key

# Switch to Groq  
AI_PROVIDER=groq
AI_API_KEY=your_groq_key

# Switch to OpenAI
AI_PROVIDER=openai
AI_API_KEY=your_openai_key
```

No code changes needed - takes effect immediately.

## Customization

### Styling
Edit the CSS in `server.js` embed script section to match your website theme.

### AI Responses
Modify `services/aiService.js` to customize AI behavior and responses.

### Data Sources
Update `services/scraperService.js` to add new data sources or change scraping frequency.

## Troubleshooting

### Chat Not Loading
1. Check browser console for errors
2. Verify embed script URL is correct
3. Ensure CORS is enabled (automatic)

### AI Not Responding
1. Check API key is valid
2. Verify AI provider is correct
3. Check rate limits not exceeded

### Data Not Current
1. Check scraping logs in deployment
2. Verify Reddit API access
3. Manual data refresh available

## Support

- Check deployment logs for errors
- Verify environment variables are set
- Test API endpoints directly
- Check AI provider status pages

## License

MIT License - Free to use and modify.