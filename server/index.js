import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FEED_SOURCES, CATEGORIES, TARGET_LANGUAGES } from './crawler/feedSources.js';
import { fetchFeedItems, scrapeArticlePage } from './crawler/scraper.js';
import { clusterAndDeduplicate } from './agent/viralityEngine.js';
import { processAndLocalizeArticle } from './agent/translatorAgent.js';
import { db } from './storage/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'JanataTV Cinema Agent API', timestamp: new Date() });
});

// Meta configs
app.get('/api/config', (req, res) => {
  res.json({
    categories: CATEGORIES,
    languages: TARGET_LANGUAGES,
    feedSources: FEED_SOURCES,
  });
});

// Fetch Articles
app.get('/api/articles', (req, res) => {
  const { category, search, language, limit } = req.query;
  const articles = db.getAllArticles({
    category,
    search,
    language: language || 'te',
    limit: limit ? parseInt(limit, 10) : 50,
  });
  res.json({ success: true, count: articles.length, articles });
});

// Fetch Single Article
app.get('/api/articles/:id', (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }
  res.json({ success: true, article });
});

// React to Article (Fire, Shock, Laugh, Sad, Popcorn)
app.post('/api/articles/:id/react', (req, res) => {
  const { type } = req.body;
  const validTypes = ['fire', 'shock', 'laugh', 'sad', 'popcorn'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid reaction type' });
  }

  const updatedReactions = db.updateReaction(req.params.id, type);
  if (!updatedReactions) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  res.json({ success: true, reactions: updatedReactions });
});

// Run Autonomous Web Crawler & AI Localization Agent
app.post('/api/crawler/run', async (req, res) => {
  const { sourceId, limitPerSource = 3 } = req.body;
  
  try {
    const sourcesToFetch = sourceId 
      ? FEED_SOURCES.filter(s => s.id === sourceId)
      : FEED_SOURCES.filter(s => s.enabled);

    console.log(`[Crawler] Ingesting from ${sourcesToFetch.length} sources...`);
    let rawItems = [];

    for (const source of sourcesToFetch) {
      const items = await fetchFeedItems(source);
      rawItems = rawItems.concat(items.slice(0, limitPerSource));
    }

    if (rawItems.length === 0) {
      return res.json({
        success: true,
        message: 'No new raw items discovered or feeds temporarily unreachable. Existing database active.',
        newArticlesCount: 0,
        articles: db.getAllArticles({ limit: 10 })
      });
    }

    // Step 2: Deduplication and Clustering
    const clusteredItems = clusterAndDeduplicate(rawItems);
    console.log(`[Crawler] Clustered ${rawItems.length} raw articles into ${clusteredItems.length} unique stories`);

    // Step 3: Run AI Localization Agent on the top 4 stories to prevent rate limits
    const newlyCreated = [];
    for (const item of clusteredItems.slice(0, 4)) {
      // Check if already in DB
      const existing = db.articles.some(a => 
        a.originalTitle.toLowerCase() === item.title.toLowerCase() ||
        (a.originalUrl && a.originalUrl === item.link)
      );

      if (!existing) {
        console.log(`[AI Agent] Processing & Translating: "${item.title}"`);
        const processed = await processAndLocalizeArticle(item);
        db.saveArticle(processed);
        newlyCreated.push(processed);
      }
    }

    res.json({
      success: true,
      message: `Crawl completed. Discovered ${rawItems.length} stories, created ${newlyCreated.length} newly localized articles.`,
      newArticlesCount: newlyCreated.length,
      newlyCreated,
      totalArticles: db.articles.length
    });
  } catch (error) {
    console.error('[Crawler] Execution error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Custom URL or Text Transcreation by AI Agent
app.post('/api/agent/localize-custom', async (req, res) => {
  const { url, title, content, category } = req.body;

  try {
    let itemData = {
      title: title || 'Breaking Entertainment News',
      summary: content || '',
      rawContent: content || '',
      link: url || 'https://janatatv.in',
      sourceName: 'User Ingestion',
      category: category || 'Tollywood',
      pubDate: new Date().toISOString()
    };

    if (url) {
      const scraped = await scrapeArticlePage(url);
      if (scraped) {
        itemData.title = scraped.title || itemData.title;
        itemData.summary = scraped.description || scraped.fullText?.slice(0, 300) || itemData.summary;
        itemData.rawContent = scraped.fullText || itemData.rawContent;
        itemData.imageUrl = scraped.imageUrl;
      }
    }

    const processed = await processAndLocalizeArticle(itemData);
    db.saveArticle(processed);

    res.json({
      success: true,
      message: 'Article successfully crawled, rewritten and localized across 4 languages!',
      article: processed
    });
  } catch (error) {
    console.error('[Agent] Custom localization error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Article (Edit headline, status, etc.)
app.put('/api/articles/:id', (req, res) => {
  const article = db.getArticleById(req.params.id);
  if (!article) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }

  const updated = db.saveArticle({ ...article, ...req.body });
  res.json({ success: true, article: updated });
});

// Delete Article
app.delete('/api/articles/:id', (req, res) => {
  const deleted = db.deleteArticle(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Article not found' });
  }
  res.json({ success: true, message: 'Article deleted successfully' });
});

// Stats
app.get('/api/stats', (req, res) => {
  res.json({ success: true, stats: db.getStats() });
});

// Settings & Ad Configuration
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: db.getSettings() });
});

app.post('/api/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// Dynamic XML Sitemap for Google News & Search Console
app.get('/sitemap.xml', (req, res) => {
  const articles = db.getAllArticles({ limit: 100 });
  const baseUrl = 'https://janatatv.in';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;
  xml += `  <url>\n    <loc>${baseUrl}</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  for (const art of articles) {
    xml += `  <url>\n    <loc>${baseUrl}/article/${art.id}</loc>\n    <lastmod>${new Date(art.publishedAt).toISOString().split('T')[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Multilingual RSS Feed for News Aggregators & Flipboard
app.get('/feed.xml', (req, res) => {
  const lang = req.query.lang || 'te';
  const articles = db.getAllArticles({ language: lang, limit: 30 });
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n`;
  xml += `    <title>JanataTV Cinema News &amp; Gossip (${lang.toUpperCase()})</title>\n`;
  xml += `    <link>https://janatatv.in</link>\n`;
  xml += `    <description>Latest Indian Cinema Scoops, Box Office &amp; Celebrity Gossip</description>\n`;

  for (const art of articles) {
    const loc = art.localized?.[lang] || art.localized?.['en'];
    const title = (loc?.title || art.originalTitle).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const desc = (loc?.subtitle || loc?.content?.slice(0, 200) || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    xml += `    <item>\n      <title>${title}</title>\n      <link>https://janatatv.in/article/${art.id}</link>\n      <description>${desc}</description>\n      <pubDate>${new Date(art.publishedAt).toUTCString()}</pubDate>\n    </item>\n`;
  }
  xml += `  </channel>\n</rss>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Autonomous Auto-Pilot Crawler Loop (Every 30 minutes)
let autoPilotInterval = setInterval(async () => {
  try {
    const settings = db.getSettings();
    if (!settings.autoPilotCrawler) return;
    
    console.log('[Auto-Pilot Agent] Waking up for automated web crawl...');
    const sources = FEED_SOURCES.filter(s => s.enabled);
    let raw = [];
    for (const s of sources.slice(0, 3)) {
      const items = await fetchFeedItems(s);
      raw = raw.concat(items.slice(0, 2));
    }
    const clusters = clusterAndDeduplicate(raw);
    for (const item of clusters.slice(0, 2)) {
      const exists = db.articles.some(a => a.originalTitle.toLowerCase() === item.title.toLowerCase());
      if (!exists) {
        console.log(`[Auto-Pilot Agent] Ingesting new viral story: "${item.title}"`);
        const processed = await processAndLocalizeArticle(item);
        db.saveArticle(processed);
      }
    }
  } catch (err) {
    console.warn('[Auto-Pilot] Error during loop:', err.message);
  }
}, 30 * 60 * 1000);

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route to serve React index.html for client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎬 JanataTV Entertainment & Gossip Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Agent: Ready (Telugu, Hindi, Tamil, English)`);
  console.log(`=======================================================`);
});
