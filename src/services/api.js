import axios from 'axios';
import { FALLBACK_ARTICLES } from './fallbackData';
import { crawlLiveWebFeeds } from './clientCrawler';
import { 
  fetchArticlesFromFirestore, 
  saveArticleToFirestore, 
  updateArticleInFirestore, 
  deleteArticleFromFirestore, 
  incrementReactionInFirestore 
} from './firestoreService';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '/api';

const STORAGE_ARTICLES_KEY = 'janatatv_articles_v1';
const STORAGE_SETTINGS_KEY = 'janatatv_settings_v1';

function getLocalArticles() {
  if (typeof window === 'undefined') return [...FALLBACK_ARTICLES];
  try {
    const raw = localStorage.getItem(STORAGE_ARTICLES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(FALLBACK_ARTICLES));
      return [...FALLBACK_ARTICLES];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(FALLBACK_ARTICLES));
    return [...FALLBACK_ARTICLES];
  } catch (e) {
    return [...FALLBACK_ARTICLES];
  }
}

function saveLocalArticles(articles) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(articles));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

function getLocalSettings() {
  const defaults = {
    adSensePublisherId: 'ca-pub-6908323709317289',
    taboolaEnabled: true,
    inArticleAdsEnabled: true,
    mobileAnchorEnabled: true,
    sponsorLeaderboardText: 'Pushpa 2 Theatrical Advance Booking Live',
    sponsorLeaderboardUrl: 'https://in.bookmyshow.com',
    sponsorName: 'Mythri Movie Makers & BookMyShow',
    autoPilotCrawler: true
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {
    return defaults;
  }
}

function saveLocalSettings(settings) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }
}

function isJsonResponse(response) {
  return response && typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data);
}

export async function fetchArticles({ category = 'All', search = '', language = 'te', limit = 50 } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    if (language) params.append('language', language);
    if (limit) params.append('limit', limit);

    const response = await axios.get(`${API_BASE}/articles?${params.toString()}`);
    if (isJsonResponse(response) && response.data.success && Array.isArray(response.data.articles)) {
      return response.data;
    }
    throw new Error('Invalid JSON from server');
  } catch (error) {
    // 1. Try Cloud Firestore first
    try {
      const firestoreArticles = await fetchArticlesFromFirestore({ category, limit });
      if (Array.isArray(firestoreArticles) && firestoreArticles.length > 0) {
        saveLocalArticles(firestoreArticles);
        let filtered = [...firestoreArticles];
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(a => 
            (a.localized?.[language]?.title || a.originalTitle || '').toLowerCase().includes(q) ||
            (a.tags || []).some(t => t.toLowerCase().includes(q))
          );
        }
        return { success: true, count: filtered.length, articles: filtered, source: 'firestore' };
      }
    } catch (e) {
      // Ignore and proceed to local storage fallback
    }

    // 2. Client-side fallback from localStorage
    let all = getLocalArticles();
    let filtered = [...all];
    if (category && category !== 'All') {
      filtered = filtered.filter(a => a.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a => 
        (a.localized?.[language]?.title || a.originalTitle || '').toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    return { success: true, count: filtered.length, articles: filtered, isLocalFallback: true };
  }
}

export async function fetchArticleById(id) {
  try {
    const response = await axios.get(`${API_BASE}/articles/${id}`);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid JSON');
  } catch (error) {
    const all = getLocalArticles();
    const found = all.find(a => a.id === id);
    if (!found) throw new Error('Article not found');
    return { success: true, article: found };
  }
}

export async function createArticle(articleData) {
  const newArt = {
    ...articleData,
    id: articleData.id || `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    publishedAt: articleData.publishedAt || new Date().toISOString(),
    reactions: articleData.reactions || { fire: 0, shock: 0, laugh: 0, sad: 0, popcorn: 0 },
    status: articleData.status || 'published'
  };

  // Sync to Cloud Firestore in background
  saveArticleToFirestore(newArt).catch(() => null);

  try {
    const response = await axios.post(`${API_BASE}/articles`, articleData);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
  } catch (error) {}

  const all = getLocalArticles();
  all.unshift(newArt);
  saveLocalArticles(all);
  return { success: true, article: newArt };
}

export async function updateArticle(id, articleData) {
  // Sync to Cloud Firestore in background
  updateArticleInFirestore(id, articleData).catch(() => null);

  try {
    const response = await axios.put(`${API_BASE}/articles/${id}`, articleData);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
  } catch (error) {}

  const all = getLocalArticles();
  const idx = all.findIndex(a => a.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...articleData };
    saveLocalArticles(all);
    return { success: true, article: all[idx] };
  }
  throw new Error('Article not found to update');
}

export async function deleteArticle(id) {
  // Sync to Cloud Firestore in background
  deleteArticleFromFirestore(id).catch(() => null);

  try {
    const response = await axios.delete(`${API_BASE}/articles/${id}`);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
  } catch (error) {}

  const all = getLocalArticles();
  const filtered = all.filter(a => a.id !== id);
  saveLocalArticles(filtered);
  return { success: true, message: 'Article deleted successfully' };
}

export async function reactToArticle(id, type) {
  // Sync reaction to Cloud Firestore in background
  incrementReactionInFirestore(id, type).catch(() => null);

  try {
    const response = await axios.post(`${API_BASE}/articles/${id}/react`, { type });
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
  } catch (error) {}

  const all = getLocalArticles();
  const art = all.find(a => a.id === id);
  if (art) {
    art.reactions = art.reactions || { fire: 0, shock: 0, laugh: 0, sad: 0, popcorn: 0 };
    art.reactions[type] = (art.reactions[type] || 0) + 1;
    saveLocalArticles(all);
    return { success: true, reactions: art.reactions };
  }
  throw new Error('Article not found');
}

export async function runCrawler({ sourceId, limitPerSource = 3 } = {}) {
  try {
    const response = await axios.post(`${API_BASE}/crawler/run`, { sourceId, limitPerSource });
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.log('[API] Backend unavailable or static host, executing Live Web Feed Ingestion in browser...');
    const all = getLocalArticles();
    const newlyDiscovered = await crawlLiveWebFeeds(all);

    if (newlyDiscovered.length > 0) {
      const updated = [...newlyDiscovered, ...all];
      saveLocalArticles(updated);

      // Persist newly discovered articles to Cloud Firestore
      for (const art of newlyDiscovered) {
        saveArticleToFirestore(art).catch(() => null);
      }

      return {
        success: true,
        message: `AI Live Crawler successfully discovered and ingested ${newlyDiscovered.length} fresh real-time entertainment stories from the internet!`,
        newArticlesCount: newlyDiscovered.length,
        totalArticles: updated.length
      };
    } else {
      return {
        success: true,
        message: `AI Live Crawler checked 5 entertainment wires. All latest stories are already in your database!`,
        newArticlesCount: 0,
        totalArticles: all.length
      };
    }
  }
}

export async function localizeCustomArticle({ url, title, content, category }) {
  try {
    const response = await axios.post(`${API_BASE}/agent/localize-custom`, { url, title, content, category });
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const baseTitle = title || 'Breaking Cinema Scoop';
    const newArt = {
      id: `art-${Date.now()}-custom`,
      originalTitle: baseTitle,
      sourceName: "User Ingestion / AI Agent",
      category: category || "Tollywood",
      imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      viralityScore: 92,
      tags: ["#CinemaUpdate", "#JanataTV", "#ExclusiveScoop"],
      reactions: { fire: 120, shock: 45, laugh: 10, sad: 0, popcorn: 85 },
      status: "published",
      localized: {
        te: {
          title: `సంచలనం: ${baseTitle} పై ఇండస్ట్రీలో తాజా హాట్ బజ్!`,
          subtitle: "ఫిలింనగర్ లో వైరల్ అవుతున్న క్రేజీ అప్‌డేట్!",
          tldr: [
            `${baseTitle} గురించిన ఆసక్తికరమైన సమాచారం బయటకు వచ్చింది.`,
            "సోషల్ మీడియాలో విపరీతంగా ట్రెండ్ అవుతున్న వార్త.",
            "పూర్తి వివరాలు త్వరలోనే వెల్లడి కానున్నాయి."
          ],
          content: `${content || baseTitle}\n\nఈ సమాచారం ఇప్పుడు సోషల్ మీడియాలో విపరీతంగా ట్రెండ్ అవుతోంది. సినీ అభిమానులు, ప్రేక్షకులు ఈ అప్‌డేట్ తో ఎంతగానో ఆనందం వ్యక్తం చేస్తున్నారు!`,
          whatsappShareText: `🔥 *జనతా టీవీ:* ${baseTitle}!\n\n👉 https://janatatv.in`
        },
        hi: {
          title: `बड़ा खुलासा: ${baseTitle} को लेकर इंडस्ट्री में मची हलचल!`,
          subtitle: "सोशल मीडिया पर छाया यह नया अपडेट!",
          tldr: [
            `${baseTitle} से जुड़ी बड़ी खबर सामने आई है।`,
            "फैंस के बीच उत्साह का माहौल।"
          ],
          content: `${content || baseTitle}\n\nइस खबर के सामने आते ही सिनेमा जगत में चर्चाएं तेज हो गई हैं।`,
          whatsappShareText: `🔥 *जनता टीवी:* ${baseTitle}!\n\n👉 https://janatatv.in`
        },
        ta: {
          title: `பரபரப்பு: ${baseTitle} சினிமா வட்டாரத்தில் வைரல்!`,
          subtitle: "ரசிகர்களை ஈர்க்கும் புதிய செய்தி!",
          tldr: [`${baseTitle} பற்றிய லேட்டஸ்ட் தகவல்.`],
          content: `${content || baseTitle}\n\nஇணையத்தில் இந்த செய்தி வேகமாக பரவி வருகிறது.`,
          whatsappShareText: `🔥 *ஜனதா டிவி:* ${baseTitle}!\n\n👉 https://janatatv.in`
        },
        en: {
          title: `EXCLUSIVE: ${baseTitle} - Inside The Viral Tinsel Town Scoop!`,
          subtitle: "Latest breaking buzz shakes up the entertainment circuits.",
          tldr: [
            `Key details emerging around ${baseTitle}.`,
            "Trending across entertainment networks."
          ],
          content: `${content || baseTitle}\n\nThe viral scoop is currently the hottest topic in the entertainment circle.`,
          whatsappShareText: `🔥 *JanataTV:* ${baseTitle}!\n\n👉 https://janatatv.in`
        }
      }
    };
    const all = getLocalArticles();
    all.unshift(newArt);
    saveLocalArticles(all);
    return { success: true, article: newArt };
  }
}

export async function fetchStats() {
  try {
    const response = await axios.get(`${API_BASE}/stats`);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const all = getLocalArticles();
    const published = all.filter(a => a.status === 'published').length;
    const drafts = all.filter(a => a.status === 'draft').length;
    const totalInteractions = all.reduce((sum, a) => {
      const r = a.reactions || {};
      return sum + (r.fire || 0) + (r.shock || 0) + (r.popcorn || 0) + (r.laugh || 0) + (r.sad || 0);
    }, 0);
    return {
      success: true,
      stats: {
        totalArticles: all.length,
        published,
        drafts,
        totalInteractions,
        languages: 4,
        categoriesCount: 8
      }
    };
  }
}

export async function fetchConfig() {
  try {
    const response = await axios.get(`${API_BASE}/config`);
    if (isJsonResponse(response)) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    return {
      categories: [
        'All', 'Tollywood', 'Bollywood', 'Kollywood', 'Hollywood',
        'OTT Releases', 'Box Office', 'Exclusive Gossip', 'Paparazzi & Style'
      ],
      languages: [
        { code: 'te', name: 'Telugu', script: 'తెలుగు' },
        { code: 'hi', name: 'Hindi', script: 'हिन्दी' },
        { code: 'ta', name: 'Tamil', script: 'தமிழ்' },
        { code: 'en', name: 'English', script: 'English' }
      ],
      feedSources: [
        { id: '123telugu', name: '123Telugu', category: 'Tollywood', enabled: true },
        { id: 'pinkvilla', name: 'Pinkvilla Bollywood', category: 'Bollywood', enabled: true },
        { id: 'gulte', name: 'Gulte Cinema', category: 'Exclusive Gossip', enabled: true },
        { id: 'mirchi9', name: 'Mirchi9', category: 'Tollywood', enabled: true },
        { id: 'variety', name: 'Variety Film News', category: 'Hollywood', enabled: true },
        { id: 'bollywoodhungama', name: 'Bollywood Hungama', category: 'Bollywood', enabled: true }
      ]
    };
  }
}

export async function fetchSettings() {
  try {
    const response = await axios.get(`${API_BASE}/settings`);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    return { success: true, settings: getLocalSettings() };
  }
}

export async function updateSettings(newSettings) {
  try {
    const response = await axios.post(`${API_BASE}/settings`, newSettings);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    saveLocalSettings(newSettings);
    return { success: true, settings: newSettings };
  }
}
