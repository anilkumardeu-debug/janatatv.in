# JanataTV (`janatatv.in`) - Movie News & Celebrity Gossip Platform with AI Local Language Agent

JanataTV is a premier, high-velocity entertainment media platform powered by an **Autonomous Web Ingestion & AI Localization Agent**. It crawls entertainment sources, filters noise, assesses virality, rewrites stories with punchy entertainment journalism flair, and transcreates them into regional Indian languages (**Telugu**, **Hindi**, **Tamil**, and **English**).

---

## 🌟 Key Highlights & Best-in-Class Architecture

### 1. Autonomous Web Crawler & Ingestion Radar
- **Multi-Source Wires**: Built-in monitoring of top entertainment RSS feeds across Tollywood (123telugu, Gulte, Mirchi9), Bollywood (Pinkvilla, Bollywood Hungama), Kollywood, and Hollywood (Variety, TMZ).
- **Clean Article Extraction**: Scrapes full pages, extracts high-res hero images, dates, and core paragraphs while filtering out ads and navigational clutter.
- **Fuzzy Clustering & Deduplication**: Prevents duplicate stories when multiple outlets report on the same event (e.g. trailer launches or box office collections), grouping them into a single master story.
- **Virality Scoring (0-100%)**: Automatically assesses buzz based on high-sensationalism keywords, celebrity tier ratings (A-listers like Prabhas, Allu Arjun, SRK, Deepika, Mahesh Babu), and recency.

### 2. AI Localization & Transcreation Agent
- **Transcreation over Translation**: Avoids robotic literal translations. Rewrites content with authentic regional entertainment vernacular (e.g., Telugu: *"బాక్సాఫీస్ వద్ద రికార్డుల వేట"*, *"టాక్ ఆఫ్ ద టౌన్"*; Hindi: *"सोशल मीडिया पर मची खलबली"*, *"बॉक्स ऑफिस पर बंपर धमाకా"*).
- **Celebrity Phonetic Transliteration**: Accurate native script rendering for stars (e.g., *Prabhas* ➔ *ప్రభాస్* / *प्रभास*, *Allu Arjun* ➔ *అల్లు అర్జున్* / *अल्लू अर्जुन*, *Deepika Padukone* ➔ *దీపికా పదుకొణె* / *दीपिका पादुकोण*).
- **Dual Mode Intelligence**:
  - Out of the box: Built-in deterministic cultural transcreation engine (works immediately without external API keys).
  - LLM Powered: Plug in `GEMINI_API_KEY` in `.env` to enable live Gemini 1.5/2.0 editorial generation.

### 3. Viral Engagement & Distribution Toolkit
- **In-Article Multi-Language Switcher**: Readers can switch between Telugu, Hindi, Tamil, and English inside the article on the fly.
- **30-Second Gossip Highlights (TL;DR)**: Snappy bullet points for mobile readers on the go.
- **Interactive Spicy Reactions Bar**: 🔥 Fire, 😱 Shocking, 🍿 Juicy, 😂 Hilarious, 💔 Heartbreak with live real-time counters.
- **1-Click WhatsApp Blast**: Generates emoji-formatted WhatsApp share text optimized for family and cinema fan groups.
- **A/B Headline Variants**: Agent creates 3 distinct headline variants (Curiosity, Spicy, SEO) per story.

### 4. AI Agent Control Room (Admin Studio)
- Click **"AI Agent Studio"** in the top navigation bar.
- Monitor active feeds, total stories, and reader reactions.
- **Trigger Full Web Crawl** on demand.
- **Custom Ingestion Sandbox**: Paste any news URL or raw text to instantly watch the agent extract, rewrite, and localize the story.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone or navigate to the directory
cd janatatv.in

# Install dependencies
npm install
```

### Running the Platform
You can run the full-stack system with a single command:
```bash
# Starts both Backend API (Port 5000) and Vite Dev Server (Port 3000)
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend Express Server
npm run server

# Terminal 2: Frontend Vite Client
npm run client
```

Open your browser at:
- **Frontend App**: `http://localhost:3000` (or `http://localhost:5000` for production build)
- **API Health**: `http://localhost:5000/api/health`
- **Articles Endpoint**: `http://localhost:5000/api/articles?language=te`

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in the root directory:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here # Optional: enables Google Gemini LLM
```
*Note: If no API key is provided, the platform automatically runs on its built-in Intelligent Cultural Transcreation Engine.*

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/articles` | `GET` | Get articles filtered by `?category=...&language=te&search=...` |
| `/api/articles/:id` | `GET` | Get single article details and all localized editions |
| `/api/articles/:id/react` | `POST` | React to an article (`fire`, `shock`, `popcorn`, `laugh`, `sad`) |
| `/api/crawler/run` | `POST` | Trigger autonomous web crawl and AI transcreation |
| `/api/agent/localize-custom` | `POST` | Submit any custom URL or text to the AI Agent |
| `/api/stats` | `GET` | Get crawler and interaction statistics |
| `/api/config` | `GET` | Get supported categories, feeds, and languages |

---

## 📁 Project Structure

```
janatatv.in/
├── server/
│   ├── crawler/
│   │   ├── feedSources.js      # Curated RSS feed catalog & categories
│   │   └── scraper.js          # Cheerio & XML parser for article extraction
│   ├── agent/
│   │   ├── viralityEngine.js   # Scoring, deduplication & entity tags
│   │   └── translatorAgent.js  # Regional transcreation & transliteration
│   ├── storage/
│   │   ├── db.js               # Persistence, query filtering & reaction counts
│   │   └── articles.json       # Persisted article database
│   └── index.js                # Express API server & static host
├── src/
│   ├── components/
│   │   ├── Header.jsx          # JanataTV branding & language switcher
│   │   ├── BreakingTicker.jsx  # Hot gossip animated ticker
│   │   ├── TrendingBar.jsx     # Cinema hashtag filters
│   │   ├── HeroFeatured.jsx    # Magazine-style spotlight grid
│   │   ├── ArticleCard.jsx     # High-CTR article card with WhatsApp share
│   │   ├── ArticleDetailModal.jsx # Multi-language reader & spicy reactions
│   │   └── AdminStudio.jsx     # Agent control room & custom ingestion
│   ├── services/
│   │   └── api.js              # REST client
│   ├── App.jsx                 # Main state coordinator
│   ├── index.css               # Tailwind & Indic typography fonts
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```
