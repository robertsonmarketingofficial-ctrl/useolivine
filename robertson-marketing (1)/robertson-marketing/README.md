# Robertson Marketing — Lead Finder

A local business lead finder and outreach tool built for Callum Robertson.

## Features
- 🔍 Search 50+ business categories with Google Places
- 📞 Phone numbers + scraped emails for every lead
- 📊 Lead scoring and Hot/Warm/Cold tier system
- 📋 Pipeline with stage tracking and notes
- ✉ AI-personalised outreach emails (2 per lead)
- ✉ Bulk email template for your full pipeline
- 🤖 AI business researcher powered by Gemini
- ⚡ Lovable.dev website prompt generator

## Deployment (10 minutes)

### Step 1 — Get your API keys

**Google Places API:**
1. Go to https://console.cloud.google.com
2. Create a new project
3. Go to APIs & Services → Library → search "Places API (New)" → Enable
4. Go to APIs & Services → Credentials → Create Credentials → API Key
5. Copy the key

**Google Gemini API:**
1. Go to https://aistudio.google.com/apikey
2. Click "Create API key"
3. Copy the key

### Step 2 — Push to GitHub
1. Create a new repository at https://github.com/new (name it "robertson-marketing")
2. Upload all these files to the repo

### Step 3 — Deploy to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project" → Import your robertson-marketing repo
3. Before clicking Deploy, click "Environment Variables" and add:
   - Name: `GOOGLE_PLACES_API_KEY` → Value: your Google Places key
   - Name: `GEMINI_API_KEY` → Value: your Gemini key
4. Click Deploy
5. Your app is live at https://robertson-marketing.vercel.app

## Contact
Callum Robertson
robertsonmarketingofficial@gmail.com
0405 866 392
