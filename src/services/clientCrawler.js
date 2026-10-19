import axios from 'axios';

export const CLIENT_FEEDS = [
  {
    id: 'ie-entertainment',
    name: 'Indian Express Cinema (South & Bollywood)',
    category: 'Tollywood',
    url: 'https://indianexpress.com/section/entertainment/feed/'
  },
  {
    id: 'toi-entertainment',
    name: 'Times of India Cinema Wire',
    category: 'Tollywood',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms'
  },
  {
    id: 'bh-bollywood',
    name: 'Bollywood Hungama News Wire',
    category: 'Bollywood',
    url: 'https://www.bollywoodhungama.com/rss/news.xml'
  },
  {
    id: 'ht-entertainment',
    name: 'Hindustan Times Gossips',
    category: 'Exclusive Gossip',
    url: 'https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml'
  },
  {
    id: 'variety-film',
    name: 'Variety Film News',
    category: 'Hollywood',
    url: 'https://variety.com/v/film/feed/'
  }
];

const CELEB_TRANSLITERATIONS = {
  'prabhas': { te: 'ప్రభాస్', hi: 'प्रभास', ta: 'பிரபாஸ்' },
  'allu arjun': { te: 'అల్లు అర్జున్', hi: 'अल्लू अर्जुन', ta: 'அல்லு அர்ஜுன்' },
  'ram charan': { te: 'రామ్ చరణ్', hi: 'राम चरण', ta: 'ராம் சரண்' },
  'jr ntr': { te: 'జూనియర్ ఎన్టీఆర్', hi: 'जूनियर एनटीआर', ta: 'ஜூனியர் என்டிஆர்' },
  'ntr': { te: 'ఎన్టీఆర్', hi: 'एनटीआर', ta: 'என்டிஆர்' },
  'mahesh babu': { te: 'మహేష్ బాబు', hi: 'महेश बाबू', ta: 'மகேஷ் பாபு' },
  'pawan kalyan': { te: 'పవన్ కళ్యాణ్', hi: 'पवन कल्याण', ta: 'பவன் கல்யாண்' },
  'chiranjeevi': { te: 'చిరంజీవి', hi: 'चिरंजीवी', ta: 'சிரஞ்சீவி' },
  'shah rukh khan': { te: 'షారుఖ్ ఖాన్', hi: 'शाहरुख खान', ta: 'ஷாருக்கான்' },
  'srk': { te: 'షారుఖ్ ఖాన్', hi: 'शाहरुख खान', ta: 'ஷாருக்கான்' },
  'salman khan': { te: 'సల్మాన్ ఖాన్', hi: 'सलमान खान', ta: 'சல்மான் கான்' },
  'ranbir kapoor': { te: 'రణబీర్ కపూర్', hi: 'रणबीर कपूर', ta: 'ரன்பீர் கபூர்' },
  'deepika padukone': { te: 'దీపికా పదుకొణె', hi: 'दीपिका पादुकोण', ta: 'தீபிகா படுகோன்' },
  'deepika': { te: 'దీపికా', hi: 'दीपिका', ta: 'தீபிகா' },
  'alia bhatt': { te: 'ఆలియా భట్', hi: 'आलिया भट्ट', ta: 'ஆலியா பட்' },
  'alia': { te: 'ఆలియా', hi: 'आलिया', ta: 'ஆலியா' },
  'samantha': { te: 'సమంత రూత్ ప్రభు', hi: 'सामंथा रुथ प्रभु', ta: 'சமந்தா ரூத் பிரபு' },
  'rashmika mandanna': { te: 'రష్మిక మందన్న', hi: 'रश्मिका मंदाना', ta: 'ராஷ்மிகா மந்தனா' },
  'rashmika': { te: 'రష్మిక', hi: 'रश्मिका', ta: 'ராஷ்மிகா' },
  'thalapathy vijay': { te: 'దళపతి విజయ్', hi: 'थलपति विजय', ta: 'தளபதி விஜய்' },
  'vijay': { te: 'విజయ్', hi: 'विजय', ta: 'விஜய்' },
  'rajinikanth': { te: 'రజనీకాంత్', hi: 'रजनीकांत', ta: 'ரஜினிகாந்த்' },
  'kamal haasan': { te: 'కమల్ హాసన్', hi: 'कमल हासन', ta: 'கமல் ஹாசன்' },
  'jailer': { te: 'జైలర్ 2', hi: 'जेलर 2', ta: 'ஜெயிலர் 2' },
  'kalki': { te: 'కల్కి 2898 AD', hi: 'कल्कि 2898 एडी', ta: 'கல்கி 2898 AD' },
  'pushpa': { te: 'పుష్ప 2', hi: 'पुष्पा 2', ta: 'புஷ்பா 2' },
  'devara': { te: 'దేవర', hi: 'देवरा', ta: 'தேவரா' },
  'game changer': { te: 'గేమ్ ఛేంజర్', hi: 'गेम चेंजर', ta: 'கேம் சேஞ்சர்' },
  'spirit': { te: 'స్పిరిట్', hi: 'स्पिरिट', ta: 'ஸ்பிரிட்' },
  'ssmb29': { te: 'SSMB29', hi: 'एसएसएमबी29', ta: 'SSMB29' }
};

function extractImage(item) {
  if (item.thumbnail && item.thumbnail.startsWith('http')) return item.thumbnail;
  if (item.enclosure?.link && item.enclosure.link.startsWith('http')) return item.enclosure.link;
  const rawHtml = `${item.description || ''} ${item.content || ''}`;
  const match = rawHtml.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (match && match[1]) return match[1];
  const defaults = [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
}

function transcreateItem(title, snippet, link, category, imageUrl) {
  const cleanTitle = cleanText(title);
  const cleanDesc = cleanText(snippet) || cleanTitle;

  let celebFound = null;
  const lower = `${cleanTitle} ${cleanDesc}`.toLowerCase();
  for (const [key, trans] of Object.entries(CELEB_TRANSLITERATIONS)) {
    if (lower.includes(key)) {
      celebFound = { key, trans };
      break;
    }
  }

  const celebTe = celebFound ? celebFound.trans.te : (category === 'Bollywood' ? 'బాలీవుడ్ స్టార్' : 'టాలీవుడ్ స్టార్');
  const celebHi = celebFound ? celebFound.trans.hi : 'सिनेमा स्टार';
  const celebTa = celebFound ? celebFound.trans.ta : 'சினிமா நட்சத்திரம்';

  // Telugu
  let teTitle = `${celebTe} పై ఇండస్ట్రీలో తాజా హాట్ బజ్.. నెట్టింట వైరల్!`;
  const tLow = cleanTitle.toLowerCase();
  if (tLow.includes('box office') || tLow.includes('collection') || tLow.includes('crore')) {
    teTitle = `${celebTe} బాక్సాఫీస్ రికార్డుల వేట.. తాజా కలెక్షన్ల లెక్కలు ఇవే!`;
  } else if (tLow.includes('trailer') || tLow.includes('teaser') || tLow.includes('release')) {
    teTitle = `${celebTe} తాజా సినిమా సెన్సేషన్.. థియేటర్లలో రచ్చ ఖాయం!`;
  } else if (tLow.includes('climax') || tLow.includes('leak') || tLow.includes('shoot')) {
    teTitle = `${celebTe} మూవీ షూటింగ్ నుండి షాకింగ్ లీక్.. ఫ్యాన్స్ కు పూనకాలే!`;
  } else if (cleanTitle.length < 60) {
    teTitle = `${celebTe}: ${cleanTitle}`;
  }

  // Hindi
  let hiTitle = `${celebHi} को लेकर बड़ी खबर, इंटरनेट पर मची हलचल!`;
  if (tLow.includes('box office') || tLow.includes('collection')) {
    hiTitle = `${celebHi} की फिल्म का बॉक्स ऑफिस पर बंपर कलेक्शन!`;
  } else if (tLow.includes('trailer') || tLow.includes('teaser')) {
    hiTitle = `${celebHi} का धमाकेदार टीजर आउट, फैंस हुए क्रेजी!`;
  }

  // Tamil
  const taTitle = `${celebTa} பற்றிய பரபரப்பு தகவல்: வைரலாகும் சினிமா அப்டேட்!`;

  // English
  const enTitle = `EXCLUSIVE: ${cleanTitle.replace(/\|.*$/, '').trim()}`;

  const viralityScore = Math.floor(Math.random() * 25) + 75;

  return {
    id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    originalTitle: cleanTitle,
    originalUrl: link || 'https://janatatv.in',
    sourceName: category === 'Bollywood' ? 'Bollywood Hungama & TOI' : 'Indian Express Cinema Wire',
    category: category || 'Tollywood',
    imageUrl,
    publishedAt: new Date().toISOString(),
    viralityScore,
    tags: [
      `#${celebFound ? celebFound.key.replace(/\s+/g, '') : 'CinemaBuzz'}`,
      '#ViralScoop',
      `#${category}`,
      '#JanataTV'
    ],
    reactions: {
      fire: Math.floor(Math.random() * 300) + 120,
      shock: Math.floor(Math.random() * 150) + 40,
      laugh: Math.floor(Math.random() * 80) + 10,
      sad: Math.floor(Math.random() * 20) + 1,
      popcorn: Math.floor(Math.random() * 250) + 90
    },
    status: 'published',
    localized: {
      te: {
        title: teTitle,
        subtitle: `${celebTe} తాజా సెన్సేషనల్ సమాచారం వైరల్!`,
        tldr: [
          `${cleanTitle.slice(0, 100)}...`,
          `ఇండస్ట్రీ వర్గాల ప్రకారం ఈ వార్త అభిమానుల్లో భారీ అంచనాలను పెంచేసింది.`,
          `పూర్తి వివరాలు సోషల్ మీడియాలో విపరీతంగా ట్రెండ్ అవుతున్నాయి.`
        ],
        content: `సినిమా ఇండస్ట్రీలో మరియు సోషల్ మీడియాలో ఇప్పుడు ఒకటే హాట్ టాపిక్! ${celebTe} కి సంబంధించిన తాజా సమాచారం సినీ అభిమానులను ఉర్రూతలూగిస్తోంది.\n\nతాజా నివేదికల ప్రకారం: "${cleanDesc.slice(0, 260)}..."\n\nఈ పరిణామం రాబోయే రోజుల్లో బాక్సాఫీస్ వద్ద సరికొత్త ప్రకంపనలు సృష్టించే అవకాశం ఉందని విశ్లేషకులు భావిస్తున్నారు.`,
        whatsappShareText: `🔥 *జనతా టీవీ సినిమా న్యూస్:* ${teTitle}\n\n👉 పూర్తి వివరాలు: https://janatatv.in\n\n#JanataTV #CinemaGossip`
      },
      hi: {
        title: hiTitle,
        subtitle: `${celebHi} को लेकर आई बड़ी खबर, फैंस हुए क्रेजी!`,
        tldr: [
          `${cleanTitle.slice(0, 100)}...`,
          `सोशल मीडिया पर फैंस के बीच जबरदस्त उत्साह देखा जा रहा है।`,
          `इंडस्ट्री के गलियारों में चर्चाएं जोरों पर हैं।`
        ],
        content: `सिनेमा जगत और सोशल मीडिया पर इस समय सबसे ज्यादा चर्चा ${celebHi} की इस वायरल खबर की हो रही है।\n\nहालिया रिपोर्ट्स के अनुसार: "${cleanDesc.slice(0, 260)}..."\n\nफैंस लगातार अपनी प्रतिक्रियाएं दे रहे हैं और यह खबर लगातार ट्रेंड कर रही है!`,
        whatsappShareText: `🔥 *जनता टीवी सिनेमा अपडेट:* ${hiTitle}\n\n👉 पढ़ें: https://janatatv.in\n\n#JanataTV`
      },
      ta: {
        title: taTitle,
        subtitle: `${celebTa} தொடர்பான பரபரப்பு தகவல் வைரல்!`,
        tldr: [
          `${cleanTitle.slice(0, 100)}...`,
          `ரசிகர்கள் மத்தியில் இந்த செய்தி பெரும் எதிர்பார்ப்பை ஏற்படுத்தியுள்ளது.`
        ],
        content: `திரையுலகில் தற்போது மிகவும் பரபரப்பாக பேசப்படும் விஷயமாக ${celebTa} குறித்த இந்த தகவல் மாறியுள்ளது.\n\nசமீபத்திய தகவல்களின்படி: "${cleanDesc.slice(0, 260)}..."\n\nரசிகர்கள் இதனை இணையத்தில் கொண்டாடி வருகின்றனர்!`,
        whatsappShareText: `🔥 *ஜனதா டிவி:* ${taTitle}\n\n👉 https://janatatv.in`
      },
      en: {
        title: enTitle,
        subtitle: `Breaking scoop from trusted industry circles stirs up fan excitement!`,
        tldr: [
          `${cleanTitle.slice(0, 100)}...`,
          `Trending across major digital entertainment networks.`,
          `Fans flood social timelines with immediate reactions.`
        ],
        content: `The rumor mills in tinsel town are working overtime today! New details have emerged around this explosive scoop.\n\nAccording to trusted wires: "${cleanDesc.slice(0, 260)}..."\n\nWith fan excitement hitting fever pitch, all eyes are on the upcoming developments. Stay tuned to JanataTV Cinema for continuous updates!`,
        whatsappShareText: `🔥 *JanataTV Gossip:* ${enTitle}\n\n👉 Read story: https://janatatv.in\n\n#JanataTV`
      }
    }
  };
}

export async function crawlLiveWebFeeds(existingArticles = []) {
  console.log('[Live Client Crawler] Ingesting real-time entertainment feeds from internet wires...');
  const newArticles = [];
  const existingTitles = new Set(existingArticles.map(a => (a.originalTitle || '').toLowerCase().trim()));

  for (const feed of CLIENT_FEEDS) {
    try {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await axios.get(apiUrl, { timeout: 7000 });
      if (res.data?.status === 'ok' && Array.isArray(res.data.items)) {
        for (const item of res.data.items.slice(0, 3)) {
          const title = cleanText(item.title);
          if (!title || title.length < 10 || existingTitles.has(title.toLowerCase())) continue;

          const imageUrl = extractImage(item);
          const article = transcreateItem(title, item.description || item.content, item.link, feed.category, imageUrl);
          newArticles.push(article);
          existingTitles.add(title.toLowerCase());
        }
      }
    } catch (err) {
      console.warn(`[Client Crawler] Feed failed (${feed.name}):`, err.message);
    }
  }

  return newArticles;
}
