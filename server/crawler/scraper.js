import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';

const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

// Common browser User-Agent to avoid scraping blocks
const HTTP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Fetch and parse an RSS feed
 */
export async function fetchFeedItems(feedSource) {
  try {
    const response = await axios.get(feedSource.url, {
      headers: HTTP_HEADERS,
      timeout: 8000,
    });

    const parsedXml = await parser.parseStringPromise(response.data);
    const channel = parsedXml?.rss?.channel || parsedXml?.feed;
    if (!channel) return [];

    const rawItems = channel.item || channel.entry || [];
    const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    return itemsArray.slice(0, 10).map((item) => {
      // Extract title & clean HTML
      const title = cleanText(item.title?._ || item.title || '');
      const link = item.link?.href || item.link || '';
      const pubDate = item.pubDate || item.published || item.updated || new Date().toISOString();
      const description = cleanText(item.description?._ || item.description || item.summary?._ || item.summary || '');
      
      // Extract image from media:content, enclosure, or description HTML
      let imageUrl = null;
      if (item['media:content']?.url) {
        imageUrl = item['media:content'].url;
      } else if (item['media:thumbnail']?.url) {
        imageUrl = item['media:thumbnail'].url;
      } else if (item.enclosure?.url && item.enclosure?.type?.startsWith('image')) {
        imageUrl = item.enclosure.url;
      } else {
        // Try extracting from description html
        const $desc = cheerio.load(item.description || '');
        imageUrl = $desc('img').first().attr('src') || null;
      }

      return {
        sourceId: feedSource.id,
        sourceName: feedSource.name,
        category: feedSource.category,
        region: feedSource.region,
        title,
        link,
        pubDate,
        summary: description.slice(0, 300),
        rawContent: description,
        imageUrl: imageUrl || getFallbackCelebrityImage(title, feedSource.category),
      };
    });
  } catch (error) {
    console.warn(`[Crawler] Failed fetching ${feedSource.name} (${feedSource.url}): ${error.message}`);
    return [];
  }
}

/**
 * Fetch full article page and extract clean body + metadata
 */
export async function scrapeArticlePage(url) {
  if (!url || !url.startsWith('http')) return null;

  try {
    const response = await axios.get(url, {
      headers: HTTP_HEADERS,
      timeout: 8000,
    });

    const $ = cheerio.load(response.data);

    // Remove noise
    $('script, style, nav, footer, iframe, noscript, .ad, .advertisement, .social-share, .comments').remove();

    // OpenGraph metadata
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');

    // Extract main paragraphs
    const paragraphs = [];
    $('article p, .article-content p, .entry-content p, .story-details p, p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40 && !text.includes('Subscribe') && !text.includes('Copyright')) {
        paragraphs.push(text);
      }
    });

    const bodyText = paragraphs.slice(0, 8).join('\n\n');

    return {
      title: ogTitle || $('h1').first().text().trim(),
      description: ogDesc || '',
      imageUrl: ogImage || null,
      fullText: bodyText || ogDesc || '',
    };
  } catch (err) {
    console.warn(`[Scraper] Could not scrape page ${url}: ${err.message}`);
    return null;
  }
}

function cleanText(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * High-quality fallback curated entertainment images for demo & offline reliability
 */
export function getFallbackCelebrityImage(title = '', category = 'Tollywood') {
  const t = title.toLowerCase();

  if (t.includes('prabhas') || t.includes('kalki') || t.includes('spirit') || t.includes('salaar')) {
    return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop';
  }
  if (t.includes('pushpa') || t.includes('allu arjun') || t.includes('sukumar')) {
    return 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop';
  }
  if (t.includes('deepika') || t.includes('ranveer') || t.includes('alia') || t.includes('actress')) {
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop';
  }
  if (t.includes('shah rukh') || t.includes('srk') || t.includes('salman') || t.includes('khan')) {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop';
  }
  if (t.includes('vijay') || t.includes('kollywood') || t.includes('thalapathy')) {
    return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop';
  }
  if (category === 'Box Office') {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop';
  }
  if (category === 'Exclusive Gossip' || category === 'Paparazzi & Style') {
    return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop';
  }
  // Generic cinema backdrop
  return 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop';
}
