# RAID AI Chat - Complete Setup Guide

## STEP-BY-STEP SETUP (30 minutes)

### Step 1: Get Free AI API Key (5 minutes)

**Choose ONE option:**

#### Option A: Hugging Face (Recommended - 1000 requests/day free)
1. Go to: https://huggingface.co/join
2. Create free account
3. Go to: https://huggingface.co/settings/tokens
4. Click "New token"
5. Name: "RAID-AI-Chat"
6. Type: "Read"
7. Click "Generate"
8. Copy the token - you'll need it in Step 3

#### Option B: Google Gemini (21,600 requests/day free)
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy the API key

#### Option C: Groq (6000 requests/day free)
1. Go to: https://console.groq.com/keys
2. Sign up for free account
3. Click "Create API Key"
4. Copy the API key

### Step 2: Deploy to Vercel (10 minutes)

1. Go to: https://vercel.com/signup
2. Sign up with GitHub account (free)
3. Import project:
   - Click "Add New" then "Project"
   - Import from Git Repository
   - Upload the files or connect repository
4. Configure:
   - Project Name: raid-ai-chat
   - Framework: Leave as "Other"
   - Root Directory: ./
5. Click "Deploy"

### Step 3: Set Environment Variables (5 minutes)

In your Vercel dashboard:

1. Go to your project then "Settings" then "Environment Variables"
2. Add these variables:

```
AI_PROVIDER = huggingface
AI_API_KEY = your_api_key_from_step_1
API_URL = https://your-project-name.vercel.app
```

3. Click "Save"
4. Redeploy: Go to "Deployments" then click "..." then "Redeploy"

### Step 4: Get Your Embed Code (2 minutes)

Your embed code is:
```html
<script src="https://your-project-name.vercel.app/embed.js"></script>
```

Replace your-project-name with your actual Vercel project name.

### Step 5: Add to Your Website (5 minutes)

#### For HTML websites:
Add before closing body tag:
```html
<script src="https://your-project-name.vercel.app/embed.js"></script>
</body>
```

#### For WordPress:
1. Admin Dashboard then "Appearance" then "Theme Editor"
2. Select footer.php
3. Add before closing body tag:
```html
<script src="https://your-project-name.vercel.app/embed.js"></script>
```
4. Click "Update File"

### Step 6: Test Your Chat (3 minutes)

1. Visit your website
2. Look for chat bubble in bottom-right corner
3. Click to open chat
4. Test with: "What's the best starter champion?"
5. Should respond with RAID-specific advice

## VERIFICATION CHECKLIST

- API key obtained and working
- Vercel deployment successful
- Environment variables set correctly
- Embed code added to website
- Chat widget appears on site
- AI responds to RAID questions
- No console errors in browser

## TROUBLESHOOTING

### Chat Widget Not Appearing
Problem: No chat bubble on website
Solution: 
1. Check browser console for errors (F12)
2. Verify embed script URL is correct
3. Check if script is blocked by ad blockers

### AI Not Responding
Problem: Chat opens but AI doesn't respond
Solution:
1. Check Vercel deployment logs
2. Verify API key is correct in environment variables
3. Test API endpoint directly

### Rate Limit Exceeded
Problem: Too many requests error
Solution:
1. Switch to different AI provider (Gemini has higher limits)
2. Upgrade to paid plan
3. Implement request caching

## TESTING COMMANDS

Test these questions in your chat:

- "Hello" - Should greet and explain capabilities
- "What's the best starter champion?" - Should recommend Kael/Athel
- "Build for Kael" - Should suggest Lifesteal + Speed sets
- "Current events" - Should list active events
- "Arena team help" - Should suggest team composition
- "Clan boss strategy" - Should recommend champions/builds

## RAID-SPECIFIC FEATURES

Your AI chat knows about:
- Current meta champions (June 2025)
- Active events and fusions
- Team building strategies
- Dungeon guides and tips
- Arena recommendations
- Gear and artifact advice

Data updates automatically every 6 hours from:
- Reddit discussions
- Community tier lists  
- Current game events
- Meta changes

Your RAID AI Chat is now ready to help your website visitors!