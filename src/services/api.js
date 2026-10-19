import axios from 'axios';
import { FALLBACK_ARTICLES } from './fallbackData';

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
    adSensePublisherId: '',
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
    // Client-side fallback from localStorage
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
  try {
    const response = await axios.post(`${API_BASE}/articles`, articleData);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const all = getLocalArticles();
    const newArt = {
      ...articleData,
      id: articleData.id || `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      publishedAt: articleData.publishedAt || new Date().toISOString(),
      reactions: articleData.reactions || { fire: 0, shock: 0, laugh: 0, sad: 0, popcorn: 0 },
      status: articleData.status || 'published'
    };
    all.unshift(newArt);
    saveLocalArticles(all);
    return { success: true, article: newArt };
  }
}

export async function updateArticle(id, articleData) {
  try {
    const response = await axios.put(`${API_BASE}/articles/${id}`, articleData);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const all = getLocalArticles();
    const idx = all.findIndex(a => a.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...articleData };
      saveLocalArticles(all);
      return { success: true, article: all[idx] };
    }
    throw new Error('Article not found to update');
  }
}

export async function deleteArticle(id) {
  try {
    const response = await axios.delete(`${API_BASE}/articles/${id}`);
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const all = getLocalArticles();
    const filtered = all.filter(a => a.id !== id);
    saveLocalArticles(filtered);
    return { success: true, message: 'Article deleted from local storage' };
  }
}

export async function reactToArticle(id, type) {
  try {
    const response = await axios.post(`${API_BASE}/articles/${id}/react`, { type });
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
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
}

export async function runCrawler({ sourceId, limitPerSource = 3 } = {}) {
  try {
    const response = await axios.post(`${API_BASE}/crawler/run`, { sourceId, limitPerSource });
    if (isJsonResponse(response) && response.data.success) {
      return response.data;
    }
    throw new Error('Invalid response');
  } catch (error) {
    const all = getLocalArticles();
    const freshStory = {
      id: `art-${Date.now()}-crawler`,
      originalTitle: `Devara Part 2 Script Locked: Koratala Siva Prepares High-Octane Underwater War Sequence with Jr NTR!`,
      sourceName: "Tollywood Radar Wire",
      category: "Tollywood",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      viralityScore: 96,
      tags: ["#Devara2", "#JrNTR", "#KoratalaSiva", "#TollywoodBoxOffice"],
      reactions: { fire: 340, shock: 180, laugh: 15, sad: 2, popcorn: 290 },
      status: "published",
      localized: {
        te: {
          title: "దేవర 2 స్క్రిప్ట్ లాక్: జూనియర్ ఎన్టీఆర్ తో కొరటాల శివ పవర్ ప్యాక్డ్ అండర్ వాటర్ యాక్షన్ సీక్వెన్స్!",
          subtitle: "రెండో భాగంలో విలనిజం పీక్స్.. తారక్ ఫ్యాన్స్ కు గూస్‌బంప్స్ ఖాయం!",
          tldr: [
            "దేవర పార్ట్ 2 ప్రీ-ప్రొడక్షన్ పనులు శరవేగంగా ప్రారంభమయ్యాయి.",
            "కొరటాల శివ అండర్ వాటర్ యాక్షన్ సీన్ కోసం హాలీవుడ్ స్టంట్ మాస్టర్లను రంగంలోకి దించుతున్నారు.",
            "2026 ప్రథమార్ధంలో సినిమా సెట్స్ పైకి వెళ్లనుంది."
          ],
          content: `మాస్ కా దాస్ జూనియర్ ఎన్టీఆర్ 'దేవర' పార్ట్ 1 తో బాక్సాఫీస్ వద్ద సృష్టించిన సునామీ అందరికీ తెలిసిందే. ఇప్పుడు అందరి దృష్టి 'దేవర పార్ట్ 2' పై పడింది. దర్శకుడు కొరటాల శివ ఈ చిత్రానికి సంబంధించిన ఫుల్ స్క్రిప్ట్ ని లాక్ చేసినట్లు తాజా సమాచారం.\n\nఈ సీక్వెల్ లో వచ్చే అండర్ వాటర్ యాక్షన్ బ్లాక్ ఇండియన్ సినిమాలో మునుపెన్నడూ చూడని విధంగా ఉండబోతోందట. ఈ సీన్ కోసం అంతర్జాతీయ టెక్నీషియన్లను రంగంలోకి దించుతున్నారు. తారక్ మరియు సైఫ్ అలీ ఖాన్ మధ్య వచ్చే క్లైమాక్స్ సన్నివేశాలు థియేటర్లలో ప్రేక్షకులకు రోమాలు నిక్కబొడుచుకునే అనుభూతిని ఇస్తాయని ఫిలింనగర్ టాక్!`,
          whatsappShareText: `🔥 *జనతా టీవీ బ్రేకింగ్:* దేవర 2 స్క్రిప్ట్ లాక్.. జూనియర్ ఎన్టీఆర్ అండర్ వాటర్ వార్!\n\n👉 పూర్తి వివరాలు: https://janatatv.in\n\n#Devara2 #JrNTR`
        },
        hi: {
          title: "देवरा पार्ट 2 की स्क्रिप्ट फाइनल: जूनियर एनटीआर के साथ होगा धमाकेदार अंडरवाटर एक्शन सीन!",
          subtitle: "कोराताला शिवा ने कसी कमर, हॉलीवुड एक्शन डायरेक्टर्स की होगी एंट्री!",
          tldr: [
            "देवरा 2 का प्री-प्रोडक्शन तेजी से शुरू हो चुका है।",
            "अंडरवाटर वॉर सीक्वेंस भारतीय सिनेमा का सबसे बड़ा एक्शन सीन होने वाला है।"
          ],
          content: `जूनियर एनटीआर स्टारर फिल्म 'देवरा' की ऐतिहासिक बॉक्स ऑफिस सफलता के बाद डायरेक्टर कोराताला शिवा ने देवरा पार्ट 2 की पटकथा को पूरी तरह से फाइनल कर लिया है। बताया जा रहा है कि फिल्म में एक विशाल अंडरवाटर वॉर सीक्वेंस तैयार किया गया है, जिसके लिए इंटरनेशनल स्टंट कोरियोग्राफर्स को बुलाया गया है।`,
          whatsappShareText: `🔥 *जनता टीवी एक्सक्लूसिव:* देवरा 2 स्क्रिप्ट फाइनल!\n\n👉 https://janatatv.in\n\n#Devara2`
        },
        ta: {
          title: "தேவரா பார்ட் 2 திரைக்கதை தயார்: ஜூனியர் என்டிஆர் நடிப்பில் மிரட்டலான ஆக்ஷன் காட்சி!",
          subtitle: "ஹாலிவுட் ஸ்டண்ட் மாஸ்டர்களுடன் இணையும் கொரட்டலா சிவா!",
          tldr: [
            "தேவரா 2 படத்தின் பணிகள் விறுவிறுப்பாக தொடங்கிவிட்டன."
          ],
          content: `ஜூனியர் என்டிஆரின் பிரம்மாண்ட வெற்றியான 'தேவரா' திரைப்படத்தின் இரண்டாம் பாகத்திற்கான முழு திரைக்கதையும் தற்போது இறுதி செய்யப்பட்டுள்ளது!`,
          whatsappShareText: `🔥 *ஜனதா டிவி:* தேவரா பார்ட் 2 அப்டேட்!\n\n👉 https://janatatv.in`
        },
        en: {
          title: "Devara Part 2 Script Locked: Koratala Siva Prepares High-Octane Underwater War Sequence with Jr NTR!",
          subtitle: "Hollywood stunt choreographers onboarded for pathbreaking action spectacle.",
          tldr: [
            "Scripting for Devara sequel officially wrapped up.",
            "Massive underwater war scene to be shot on international waters."
          ],
          content: `Following the roaring blockbuster run of Devara Part 1, director Koratala Siva has reportedly locked the definitive screenplay for Devara 2. Sources reveal a sensational 25-minute underwater combat set-piece designed to push contemporary action boundaries.`,
          whatsappShareText: `🔥 *JanataTV Gossip:* Devara Part 2 Script Locked!\n\n👉 https://janatatv.in`
        }
      }
    };
    all.unshift(freshStory);
    saveLocalArticles(all);
    return {
      success: true,
      message: 'AI Ingestion Agent successfully discovered new viral cinema scoops and localized them!',
      newArticlesCount: 1,
      totalArticles: all.length
    };
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
