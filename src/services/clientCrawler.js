import axios from 'axios';

export const CLIENT_FEEDS = [
  {
    id: 'ie-entertainment',
    name: 'Indian Express Cinema Wire',
    category: 'Tollywood',
    url: 'https://indianexpress.com/section/entertainment/feed/'
  },
  {
    id: 'toi-entertainment',
    name: 'Times of India Cinema',
    category: 'Tollywood',
    url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms'
  },
  {
    id: 'bh-bollywood',
    name: 'Bollywood Hungama News',
    category: 'Bollywood',
    url: 'https://www.bollywoodhungama.com/rss/news.xml'
  },
  {
    id: 'ht-entertainment',
    name: 'Hindustan Times Entertainment',
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
  'nani': { te: 'నాని', hi: 'नानी', ta: 'நானி' },
  'ravi teja': { te: 'రవితేజ', hi: 'रवि तेजा', ta: 'ரவி தேஜா' },
  'vijay devarakonda': { te: 'విజయ్ దేవరకొండ', hi: 'विजय देवरकोंडा', ta: 'விஜய் தேவரகொண்டா' },
  'deverakonda': { te: 'విజయ్ దేవరకొండ', hi: 'विजय देवरकोंडा', ta: 'விஜய் தேவரகொண்டா' },
  'naga chaitanya': { te: 'నాగ చైతన్య', hi: 'नागा चैतन्य', ta: 'நாக சைதன்யா' },
  'rajamouli': { te: 'ఎస్.ఎస్. రాజమౌళి', hi: 'एस.एस. राजामौली', ta: 'எஸ்.எஸ். ராஜமௌலி' },
  'sukumar': { te: 'సుకుమార్', hi: 'सुकुमार', ta: 'சுகுமார்' },
  'sandeep vanga': { te: 'సందీప్ రెడ్డి వంగా', hi: 'संदीप रेड्डी वांगा', ta: 'சந்தீப் ரெட்டி வங்கா' },
  'shah rukh khan': { te: 'షారుఖ్ ఖాన్', hi: 'शाहरुख खान', ta: 'ஷாருக்கான்' },
  'srk': { te: 'షారుఖ్ ఖాన్', hi: 'शाहरुख खान', ta: 'ஷாருக்கான்' },
  'salman khan': { te: 'సల్మాన్ ఖాన్', hi: 'सलमान खान', ta: 'சல்மான் கான்' },
  'tiger shroff': { te: 'టైగర్ ష్రాఫ్', hi: 'टाइगर श्रॉफ', ta: 'டைகர் ஷெராப்' },
  'ranbir kapoor': { te: 'రణబీర్ కపూర్', hi: 'रणबीर कपूर', ta: 'ரன்பீர் கபூர்' },
  'ranveer singh': { te: 'రణ్‌వీర్ సింగ్', hi: 'रणवीर सिंह', ta: 'ரன்வீர் சிங்' },
  'kartik aaryan': { te: 'కార్తీక్ ఆర్యన్', hi: 'कार्तिक आर्यन', ta: 'கார்திக் ஆர்யன்' },
  'ayushmann': { te: 'ఆయుష్మాన్ ఖురానా', hi: 'आयुष्मान खुराना', ta: 'ஆயுஷ்மான் குரானா' },
  'deepika padukone': { te: 'దీపికా పదుకొణె', hi: 'दीपिका पादुकोण', ta: 'தீபிகா படுகோன்' },
  'deepika': { te: 'దీపికా', hi: 'दीपिका', ta: 'தீபிகா' },
  'alia bhatt': { te: 'ఆలియా భట్', hi: 'आलिया भट्ट', ta: 'ஆலியா பட்' },
  'alia': { te: 'ఆలియా', hi: 'आलिया', ta: 'ஆலியா' },
  'samantha': { te: 'సమంత రూత్ ప్రభు', hi: 'सामंथा रुथ प्रभु', ta: 'சமந்தா ரூத் பிரபு' },
  'rashmika mandanna': { te: 'రష్మిక మందన్న', hi: 'రష్మిక', ta: 'ராஷ்மிகா' },
  'rashmika': { te: 'రష్మిక', hi: 'रश्मिका', ta: 'ராஷ்மிகா' },
  'thalapathy vijay': { te: 'దళపతి విజయ్', hi: 'थलपति विजय', ta: 'தளபதி விஜய்' },
  'vijay': { te: 'విజయ్', hi: 'विजय', ta: 'விஜய்' },
  'rajinikanth': { te: 'రజనీకాంత్', hi: 'रजनीकांत', ta: 'ரஜினிகாந்த்' },
  'kamal haasan': { te: 'కమల్ హాసన్', hi: 'कमल हासन', ta: 'கமல் ஹாசன்' },
  'dhanush': { te: 'ధనుష్', hi: 'धनुष', ta: 'தனுஷ்' },
  'suriya': { te: 'సూర్య', hi: 'सूर्या', ta: 'சூர்யா' },
  'ajith': { te: 'అజిత్ కుమార్', hi: 'अजीत कुमार', ta: 'அஜித் குமார்' },
  'pushpa': { te: 'పుష్ప 2', hi: 'पुष्पा 2', ta: 'புஷ்பா 2' },
  'devara': { te: 'దేవర', hi: 'देवरा', ta: 'தேவரா' },
  'kalki': { te: 'కల్కి 2898 AD', hi: 'कल्कि 2898 एडी', ta: 'கல்கி 2898 AD' },
  'game changer': { te: 'గేమ్ ఛేంజర్', hi: 'गेम चेंजर', ta: 'கேம் சேஞ்சர்' },
  'spirit': { te: 'స్పిరిట్', hi: 'स्पिरिट', ta: 'ஸ்பிரிட்' }
};

function extractImage(item) {
  if (item.thumbnail && item.thumbnail.startsWith('http')) return item.thumbnail;
  if (item.enclosure?.link && item.enclosure.link.startsWith('http')) return item.enclosure.link;
  const rawHtml = `${item.description || ''} ${item.content || ''}`;
  const match = rawHtml.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+)["']/i);
  if (match && match[1]) return match[1];
  const defaults = [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function findCelebrity(title, desc) {
  const cleanTitle = (title || '').toLowerCase();
  
  // Check TITLE first with strict word boundaries
  for (const [key, trans] of Object.entries(CELEB_TRANSLITERATIONS)) {
    const escaped = key.replace(/\s+/g, '\\s+');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(cleanTitle)) {
      return { key, trans, source: 'title' };
    }
  }

  // Only check first 60 characters of description if title doesn't mention celebrity
  const shortDesc = (desc || '').slice(0, 60).toLowerCase();
  for (const [key, trans] of Object.entries(CELEB_TRANSLITERATIONS)) {
    const escaped = key.replace(/\s+/g, '\\s+');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(shortDesc)) {
      return { key, trans, source: 'desc' };
    }
  }

  return null;
}

function transcreateItem(title, snippet, link, category, imageUrl) {
  const cleanTitle = cleanText(title);
  const cleanDesc = cleanText(snippet) || cleanTitle;

  const celebFound = findCelebrity(cleanTitle, cleanDesc);

  // Category-based descriptors
  let defaultTe = 'టాలీవుడ్';
  let defaultHi = 'सिनेमा';
  let defaultTa = 'சினிமா';

  if (category === 'Bollywood') {
    defaultTe = 'బాలీవుడ్';
    defaultHi = 'बॉलीवुड';
    defaultTa = 'பாலிவுட்';
  } else if (category === 'Hollywood') {
    defaultTe = 'హాలీవుడ్';
    defaultHi = 'हॉलीवुड';
    defaultTa = 'ஹாலிவுட்';
  } else if (category === 'Kollywood') {
    defaultTe = 'కోలీవుడ్';
    defaultHi = 'कॉलीवुड';
    defaultTa = 'கோலிவுட்';
  } else if (category === 'OTT Releases' || category === 'OTT') {
    defaultTe = 'ఓటీటీ';
    defaultHi = 'ओटीटी';
    defaultTa = 'ஓடிடி';
  }

  const subjectTe = celebFound ? celebFound.trans.te : defaultTe;
  const subjectHi = celebFound ? celebFound.trans.hi : defaultHi;
  const subjectTa = celebFound ? celebFound.trans.ta : defaultTa;

  const tLow = cleanTitle.toLowerCase();

  // Telugu Headline: Context-aware and realistic
  let teTitle = '';
  if (tLow.includes('box office') || tLow.includes('collection') || tLow.includes('crore')) {
    teTitle = `${subjectTe} బాక్సాఫీస్ రిపోర్ట్: కలెక్షన్లపై తాజా ట్రేడ్ వివరాలు!`;
  } else if (tLow.includes('trailer') || tLow.includes('teaser')) {
    teTitle = `${subjectTe} టీజర్/ట్రైలర్ సెన్సేషన్: సోషల్ మీడియాలో భారీ స్పందన!`;
  } else if (tLow.includes('shooting') || tLow.includes('shoot') || tLow.includes('schedule')) {
    teTitle = `${subjectTe} కొత్త సినిమా షూటింగ్ అప్‌డేట్: స్పెషల్ షెడ్యూల్ ప్లాన్!`;
  } else if (tLow.includes('incident') || tLow.includes('police') || tLow.includes('fir')) {
    teTitle = `${subjectTe} విషయంలో సంచలన పరిణామం: పోలీసుల ముమ్మర దర్యాప్తు!`;
  } else if (tLow.includes('review') || tLow.includes('rating')) {
    teTitle = `${subjectTe} మూవీ రివ్యూ & రేటింగ్: ప్రేక్షకులను ఆకట్టుకుందా?`;
  } else if (tLow.includes('release date') || tLow.includes('postponed')) {
    teTitle = `${subjectTe} సినిమా రిలీజ్ డేట్ అప్‌డేట్: సరికొత్త ప్రకటన!`;
  } else {
    teTitle = `${subjectTe} తాజా అప్‌డేట్: ఇండస్ట్రీ వర్గాల్లో ప్రత్యేక చర్చ!`;
  }

  // Hindi Headline
  let hiTitle = '';
  if (tLow.includes('box office') || tLow.includes('collection')) {
    hiTitle = `${subjectHi} बॉक्स ऑफिस रिपोर्ट: जानें ताजा कलेक्शन और रिकॉर्ड्स!`;
  } else if (tLow.includes('trailer') || tLow.includes('teaser')) {
    hiTitle = `${subjectHi} का धमाकेदार टीजर आउट, फैंस में भारी उत्साह!`;
  } else {
    hiTitle = `${subjectHi} को लेकर बड़ी खबर, फिल्म इंडस्ट्री में चर्चा तेज!`;
  }

  // Tamil Headline
  let taTitle = `${subjectTa} முக்கிய சினிமா அப்டேட்: ரசிகர்கள் மத்தியில் வைரல்!`;

  // English Headline
  const enTitle = cleanTitle.replace(/\|.*$/, '').trim();

  return {
    id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    originalTitle: cleanTitle,
    originalUrl: link || 'https://janatatv.in',
    sourceName: category === 'Bollywood' ? 'Bollywood Hungama' : category === 'Hollywood' ? 'Variety' : 'Indian Express Cinema',
    category: category || 'Tollywood',
    imageUrl,
    publishedAt: new Date().toISOString(),
    viralityScore: 85,
    tags: [
      `#${celebFound ? celebFound.key.replace(/\s+/g, '') : category}`,
      '#IndianCinema',
      '#JanataTV'
    ],
    reactions: {
      fire: Math.floor(Math.random() * 200) + 80,
      shock: Math.floor(Math.random() * 100) + 20,
      laugh: Math.floor(Math.random() * 50) + 10,
      sad: 5,
      popcorn: Math.floor(Math.random() * 150) + 50
    },
    status: 'published',
    localized: {
      te: {
        title: teTitle,
        subtitle: `${subjectTe} తాజా అప్‌డేట్ పూర్తి వివరాలు.`,
        tldr: [
          `${cleanTitle.slice(0, 110)}...`,
          `ఈ వార్త సోషల్ మీడియాలో సినీ అభిమానుల్లో ఆసక్తిని రేకెత్తిస్తోంది.`,
          `మరిన్ని అధికారిక వివరాలు త్వరలో వెలువడనున్నాయి.`
        ],
        content: `భారతీయ చిత్ర పరిశ్రమలో ${subjectTe} కి సంబంధించిన తాజా సమాచారం ఆసక్తికరంగా మారింది.\n\nతాజా సమాచారం ప్రకారం: "${cleanDesc.slice(0, 260)}..."\n\nఈ పరిణామం రాబోయే రోజుల్లో ప్రేక్షకులను ఏ విధంగా ఆకట్టుకుంటుందో వేచి చూడాలి. పూర్తి వివరాల కోసం జనతా టీవీ ఎంటర్‌టైన్‌మెంట్‌ను ఫాలో అవ్వండి.`,
        whatsappShareText: `📰 *జనతా టీవీ సినిమా అప్‌డేట్:* ${teTitle}\n\n👉 పూర్తి వివరాలు: https://janatatv.in`
      },
      hi: {
        title: hiTitle,
        subtitle: `${subjectHi} से जुड़ी ताजा खबर`,
        tldr: [
          `${cleanTitle.slice(0, 110)}...`,
          `सोशल मीडिया पर प्रशंसकों के बीच इस खबर की खासी चर्चा है।`
        ],
        content: `सिनेमा जगत से ${subjectHi} को लेकर यह ताजा अपडेट सामने आया है।\n\nरिपोर्ट के मुताबिक: "${cleanDesc.slice(0, 260)}..."\n\nअधिक जानकारी के लिए जनता टीवी से जुड़े रहें।`,
        whatsappShareText: `📰 *जनता टीवी सिनेमा:* ${hiTitle}\n\n👉 पढ़ें: https://janatatv.in`
      },
      ta: {
        title: taTitle,
        subtitle: `${subjectTa} சினிமா செய்தி`,
        tldr: [
          `${cleanTitle.slice(0, 110)}...`
        ],
        content: `திரையுலகில் ${subjectTa} குறித்த இந்த தகவல் வெளியாகியுள்ளது.\n\nதகவல்: "${cleanDesc.slice(0, 260)}..."`,
        whatsappShareText: `📰 *ஜனதா டிவி:* ${taTitle}\n\n👉 https://janatatv.in`
      },
      en: {
        title: enTitle,
        subtitle: `Latest entertainment developments and industry trade updates`,
        tldr: [
          `${cleanTitle.slice(0, 110)}...`,
          `Trending across entertainment circles and digital networks.`
        ],
        content: `Major developments in the entertainment industry today:\n\n"${cleanDesc.slice(0, 260)}..."\n\nStay tuned to JanataTV Cinema for verified news updates and trade reports.`,
        whatsappShareText: `📰 *JanataTV News:* ${enTitle}\n\n👉 Read story: https://janatatv.in`
      }
    }
  };
}

export async function crawlLiveWebFeeds(existingArticles = []) {
  console.log('[Client Crawler] Ingesting verified entertainment feeds...');
  const newArticles = [];
  const existingUrls = new Set(existingArticles.map(a => (a.originalUrl || '').trim()));
  const existingTitles = new Set(existingArticles.map(a => (a.originalTitle || '').trim().toLowerCase()));

  for (const feed of CLIENT_FEEDS) {
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&api_key=&count=5`;
      const res = await axios.get(proxyUrl, { timeout: 7000 });

      if (res.data && res.data.status === 'ok' && Array.isArray(res.data.items)) {
        for (const item of res.data.items) {
          const itemLink = (item.link || '').trim();
          const itemTitle = cleanText(item.title || '');

          if (!itemTitle || itemTitle.length < 15) continue;
          if (existingUrls.has(itemLink) || existingTitles.has(itemTitle.toLowerCase())) continue;

          const imageUrl = extractImage(item);
          const article = transcreateItem(itemTitle, item.description || item.content, itemLink, feed.category, imageUrl);

          newArticles.push(article);
          existingUrls.add(itemLink);
          existingTitles.add(itemTitle.toLowerCase());

          if (newArticles.length >= 8) break;
        }
      }
    } catch (err) {
      console.warn(`[Client Crawler] Feed ${feed.name} skipped:`, err.message);
    }
    if (newArticles.length >= 8) break;
  }

  return newArticles;
}
