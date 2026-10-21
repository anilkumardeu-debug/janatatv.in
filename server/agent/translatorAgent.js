import axios from 'axios';
import { calculateViralityScore, extractCelebrityTags } from './viralityEngine.js';

// Comprehensive Transliteration & Entity Map for Indian Cinema
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
  'kalki 2898 ad': { te: 'కల్కి 2898 AD', hi: 'कल्कि 2898 एडी', ta: 'கல்கி 2898 AD' },
  'pushpa 2': { te: 'పుష్ప 2: ది రూల్', hi: 'पुष्पा 2: द रूल', ta: 'புஷ்பா 2: தி ரூல்' },
  'devara': { te: 'దేవర', hi: 'देवरा', ta: 'தேவரா' },
  'game changer': { te: 'గేమ్ ఛేంజర్', hi: 'गेम चेंजर', ta: 'கேம் சேஞ்சர்' },
  'spirit': { te: 'స్పిరిట్', hi: 'स्पिरिट', ta: 'ஸ்பிரிட்' },
  'ssmb29': { te: 'SSMB29', hi: 'एसएसएमबी29', ta: 'SSMB29' }
};

/**
 * Main AI Agent function: Localizes raw news into Telugu, Hindi, Tamil, and English
 */
export async function processAndLocalizeArticle(rawItem) {
  const apiKey = process.env.GEMINI_API_KEY;
  const viralityScore = calculateViralityScore(rawItem.title, rawItem.rawContent || rawItem.summary);
  const tags = extractCelebrityTags(rawItem.title, rawItem.rawContent || rawItem.summary);

  // If Gemini API Key exists, use LLM
  if (apiKey) {
    try {
      const llmResult = await callGeminiAgent(rawItem, apiKey);
      if (llmResult) {
        return {
          id: 'art-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          originalTitle: rawItem.title,
          originalUrl: rawItem.link,
          sourceName: rawItem.sourceName || 'Web Wire',
          category: rawItem.category || 'Tollywood',
          imageUrl: rawItem.imageUrl,
          publishedAt: rawItem.pubDate || new Date().toISOString(),
          viralityScore,
          tags,
          reactions: { fire: 142, shock: 89, laugh: 34, sad: 5, popcorn: 78 },
          localized: llmResult,
          status: 'published'
        };
      }
    } catch (e) {
      console.warn('[AI Agent] Gemini call failed, falling back to autonomous transcreation engine:', e.message);
    }
  }

  // Built-in Intelligent Transcreation Engine (Deterministic, instant & culturally attuned)
  const localized = generateIntelligentTranscreation(rawItem);

  return {
    id: 'art-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    originalTitle: rawItem.title,
    originalUrl: rawItem.link,
    sourceName: rawItem.sourceName || 'Web Wire',
    category: rawItem.category || 'Tollywood',
    imageUrl: rawItem.imageUrl,
    publishedAt: rawItem.pubDate || new Date().toISOString(),
    viralityScore,
    tags,
    reactions: {
      fire: Math.floor(Math.random() * 200) + 50,
      shock: Math.floor(Math.random() * 120) + 20,
      laugh: Math.floor(Math.random() * 60) + 10,
      sad: Math.floor(Math.random() * 15) + 2,
      popcorn: Math.floor(Math.random() * 150) + 40,
    },
    localized,
    status: 'published'
  };
}

/**
 * Built-in Cultural Transcreation & Localization Engine
 */
function generateIntelligentTranscreation(item) {
  const title = item.title;
  const desc = item.rawContent || item.summary || item.title;
  const category = item.category || 'Tollywood';

  // Identify prominent celebrity in title/desc
  let celebFound = null;
  const lower = `${title} ${desc}`.toLowerCase();
  for (const [key, trans] of Object.entries(CELEB_TRANSLITERATIONS)) {
    if (lower.includes(key)) {
      celebFound = { key, trans };
      break;
    }
  }

  const celebTe = celebFound ? celebFound.trans.te : 'టాలీవుడ్ స్టార్';
  const celebHi = celebFound ? celebFound.trans.hi : 'सिनेमा स्टार';
  const celebTa = celebFound ? celebFound.trans.ta : 'சினிமா நட்சத்திரம்';

  // Telugu Localization
  const teTitle = generateTeluguHeadline(title, celebTe);
  const teTldr = [
    `${celebTe} తాజా ప్రాజెక్ట్ లేదా వైరల్ అప్‌డేట్ సోషల్ మీడియాలో విపరీతంగా ట్రెండ్ అవుతోంది.`,
    `ఇండస్ట్రీ వర్గాల ప్రకారం ఈ వార్త అభిమానుల్లో భారీ అంచనాలను, ఆసక్తిని పెంచేసింది.`,
    `అధికారిక ప్రకటన త్వరలోనే వెలువడే అవకాశం ఉందని సినీ వర్గాలు భావిస్తున్నాయి.`
  ];
  const teContent = `సినిమా ఇండస్ట్రీలో మరియు సోషల్ మీడియాలో ఇప్పుడు ఒకటే హాట్ టాపిక్! ${celebTe} కి సంబంధించిన తాజా సమాచారం సినీ అభిమానులను ఉర్రూతలూగిస్తోంది.

ఇటీవలి నివేదికల ప్రకారం, ${desc.slice(0, 220)}... అనే వార్త వైరల్ అవుతోంది. ఈ విషయంలో అభిమానులు సోషల్ మీడియా వేదికగా విపరీతమైన చర్చలు మొదలుపెట్టారు. ముఖ్యంగా యూత్ మరియు ఫ్యాన్ క్లబ్‌లు దీనిపై విపరీతంగా రియాక్ట్ అవుతున్నారు.

బాక్సాఫీస్ ట్రెండ్స్ మరియు సినిమా మార్కెట్ విశ్లేషకులు చెబుతున్న దాని ప్రకారం, ఈ ప్రాజెక్ట్ లేదా పరిణామం రాబోయే రోజుల్లో రికార్డులను సృష్టించే అవకాశం ఉంది. ఈ విషయంపై అధికారిక క్లారిటీ కోసం సినీ వర్గాలు ఆసక్తిగా ఎదురుచూస్తున్నాయి!`;

  // Hindi Localization
  const hiTitle = generateHindiHeadline(title, celebHi);
  const hiTldr = [
    `${celebHi} को लेकर बड़ी खबर सामने आई है जो इंटरनेट पर तेजी से वायरल हो रही है।`,
    `सोशल मीडिया पर फैंस के बीच इस अपडेट को लेकर जबरदस्त उत्साह देखा जा रहा है।`,
    `इंडस्ट्री के गलियारों में चर्चा है कि जल्द ही इस पर मुहर लग सकती है।`
  ];
  const hiContent = `सिनेमा जगत और सोशल मीडिया पर इस समय सबसे ज्यादा चर्चा ${celebHi} की इस वायरल खबर की हो रही है। फैंस इस खुलासे के बाद से बेहद उत्साहित नजर आ रहे हैं।

हालिया रिपोर्ट्स के अनुसार, ${desc.slice(0, 220)}... यह खबर तेजी से सुर्खियां बटोर रही है। सोशल मीडिया प्लेटफॉर्म्स जैसे X (ट्विटर) और इंस्टाग्राम पर फैंस लगातार अपनी प्रतिक्रियाएं दे रहे हैं।

बॉलीवुड और साउथ फिल्म इंडस्ट्री के विश्लेषकों का मानना है कि इस खबर का असर आने वाले बॉक्स ऑफिस और प्रोजेक्ट्स पर साफ दिखाई देगा। अब देखना होगा कि मेकर्स और स्टार्स की तरफ से इस पर कब आधिकारिक बयान आता है!`;

  // Tamil Localization
  const taTitle = `${celebTa} பற்றிய பரபரப்பு தகவல்: வைரலாகும் சினிமா அப்டேட்!`;
  const taTldr = [
    `${celebTa} தொடர்பான இந்த தகவல் சமூக வலைதளங்களில் காட்டுத்தீ போல பரவி வருகிறது.`,
    `ரசிகர்கள் மத்தியில் இந்த செய்தி பெரும் எதிர்பார்ப்பையும் உற்சாகத்தையும் ஏற்படுத்தியுள்ளது.`,
    `விரைவில் இது குறித்த அதிகாரப்பூர்வ அறிவிப்பு வெளியாகும் என எதிர்பார்க்கப்படுகிறது.`
  ];
  const taContent = `திரையுலகில் தற்போது மிகவும் பரபரப்பாக பேசப்படும் விஷயமாக ${celebTa} குறித்த இந்த தகவல் மாறியுள்ளது. 

சமீபத்திய தகவல்களின்படி, ${desc.slice(0, 220)}... என்ற செய்தி இணையத்தில் வைரலாகி வருகிறது. ரசிகர்கள் இதனை ட்ரெண்ட் செய்து வருகின்றனர். வரும் நாட்களில் இந்த அப்டேட் மேலும் பெரிய அளவில் பேசப்படும் என்பதில் சந்தேகமில்லை!`;

  // English Localized (Punchy Entertainment Journalism)
  const enTitle = `EXCLUSIVE: ${title.replace(/\|.*$/, '').trim()} - What Really Happened!`;
  const enTldr = [
    `The entertainment circuit is buzzing with this latest breaking story.`,
    `Fans have flooded social media with reactions, making it the #1 trending topic.`,
    `Industry insiders hint that an official statement could drop very soon.`
  ];
  const enContent = `The rumor mills in tinsel town are working overtime today! In what is quickly becoming the biggest talking point of the week, new details have emerged around this explosive story.

According to trusted industry insiders: "${desc.slice(0, 240)}..." This has sparked massive speculation among cinephiles and fan clubs across all platforms.

With fan excitement hitting peak fever pitch, all eyes are on the upcoming official announcements. Stay tuned to JanataTV Cinema for the fastest real-time updates on this unfolding scoop!`;

  return {
    te: {
      title: teTitle,
      subtitle: `${celebTe} తాజా సెన్సేషనల్ సమాచారం వైరల్!`,
      tldr: teTldr,
      content: teContent,
      whatsappShareText: `🔥 *జనతా టీవీ సినిమా న్యూస్:* ${teTitle}\n\n👉 పూర్తి వివరాలు: ${item.link || 'https://janatatv.in'}\n\n#JanataTV #CinemaGossip`,
      headlineVariants: [
        `షాకింగ్: ${teTitle}`,
        `${celebTe} ఫ్యాన్స్‌కు బిగ్ సర్ప్రైజ్.. నెట్టింట రచ్చ!`,
        `బాక్సాఫీస్ వద్ద ప్రకంపనలు: పూర్తి డీటెయిల్స్ ఇవే!`
      ]
    },
    hi: {
      title: hiTitle,
      subtitle: `${celebHi} को लेकर आई बड़ी खबर, फैंस हुए क्रेजी!`,
      tldr: hiTldr,
      content: hiContent,
      whatsappShareText: `🔥 *जनता टीवी सिनेमा अपडेट:* ${hiTitle}\n\n👉 पूरी खबर पढ़ें: ${item.link || 'https://janatatv.in'}\n\n#JanataTV #BollywoodGossip`,
      headlineVariants: [
        `बड़ा धमाका: ${hiTitle}`,
        `${celebHi} की इस खबर से इंटरनेट पर मची हलचल!`,
        `बॉक्स ऑफिस का नया रिकॉर्ड या चौंकाने वाला खुलासा? जानें यहां!`
      ]
    },
    ta: {
      title: taTitle,
      subtitle: `${celebTa} தொடர்பான பரபரப்பு தகவல் வைரல்!`,
      tldr: taTldr,
      content: taContent,
      whatsappShareText: `🔥 *ஜனதா டிவி சினிமா:* ${taTitle}\n\n👉 படிக்கவும்: ${item.link || 'https://janatatv.in'}\n\n#JanataTV`,
      headlineVariants: [
        `அதிர்ச்சி தகவல்: ${taTitle}`,
        `${celebTa} ரசிகர்களுக்கு மாஸ் அப்டேட்!`,
        `சினிமா வட்டாரத்தில் சூடான விவாதம்!`
      ]
    },
    en: {
      title: enTitle,
      subtitle: `Breaking scoop from the industry circles leaves fans thrilled!`,
      tldr: enTldr,
      content: enContent,
      whatsappShareText: `🔥 *JanataTV Gossip Scoop:* ${enTitle}\n\n👉 Read full story: ${item.link || 'https://janatatv.in'}\n\n#JanataTV #MovieNews`,
      headlineVariants: [
        `SCOOP: ${enTitle}`,
        `Inside The Viral Buzz: What Everyone Is Whispering About`,
        `Box Office Alert & Insider Scoop You Can't Miss`
      ]
    }
  };
}

function generateTeluguHeadline(englishTitle, celebTelugu) {
  const t = englishTitle.toLowerCase();
  const clean = englishTitle.replace(/\|.*$/, '').replace(/ - .*$/, '').trim();
  if (t.includes('box office') || t.includes('collection') || t.includes('crore')) {
    return `${celebTelugu} బాక్సాఫీస్ రిపోర్ట్: కలెక్షన్లపై తాజా ట్రేడ్ వివరాలు!`;
  }
  if (t.includes('trailer') || t.includes('teaser') || t.includes('first look')) {
    return `${celebTelugu} టీజర్/ట్రైలర్ సెన్సేషన్: సోషల్ మీడియాలో భారీ స్పందన!`;
  }
  if (t.includes('shooting') || t.includes('shoot') || t.includes('schedule')) {
    return `${celebTelugu} కొత్త సినిమా షూటింగ్ అప్‌డేట్: స్పెషల్ షెడ్యూల్ ప్లాన్!`;
  }
  if (t.includes('incident') || t.includes('police') || t.includes('fir')) {
    return `${celebTelugu} విషయంలో సంచలన పరిణామం: పోలీసుల ముమ్మర దర్యాప్తు!`;
  }
  if (t.includes('release date') || t.includes('postponed')) {
    return `${celebTelugu} సినిమా రిలీజ్ డేట్ అప్‌డేట్: సరికొత్త ప్రకటన!`;
  }
  if (clean.length < 75) {
    return `${celebTelugu}: ${clean}`;
  }
  return `${celebTelugu} తాజా అప్‌డేట్: ఇండస్ట్రీ వర్గాల్లో ప్రత్యేక చర్చ!`;
}

function generateHindiHeadline(englishTitle, celebHindi) {
  const t = englishTitle.toLowerCase();
  const clean = englishTitle.replace(/\|.*$/, '').replace(/ - .*$/, '').trim();
  if (t.includes('box office') || t.includes('collection') || t.includes('crore')) {
    return `${celebHindi} बॉक्स ऑफिस रिपोर्ट: जानें ताजा कलेक्शन और रिकॉर्ड्स!`;
  }
  if (t.includes('trailer') || t.includes('teaser') || t.includes('first look')) {
    return `${celebHindi} का धमाकेदार टीजर आउट, फैंस में भारी उत्साह!`;
  }
  if (clean.length < 75) {
    return `${celebHindi}: ${clean}`;
  }
  return `${celebHindi} को लेकर बड़ी खबर, फिल्म इंडस्ट्री में चर्चा तेज!`;
}

/**
 * Optional Gemini LLM call if user configures GEMINI_API_KEY
 */
async function callGeminiAgent(rawItem, apiKey) {
  const prompt = `You are the chief entertainment editor and celebrity gossip journalist at JanataTV.
You rewrite movie news into viral, engaging entertainment journalism localized for Indian regional audiences.
Source Title: "${rawItem.title}"
Source Content: "${rawItem.rawContent || rawItem.summary}"

Output a JSON object with keys "te", "hi", "ta", "en".
Each language object must have:
- "title": catchy click-worthy headline in that language script
- "subtitle": intriguing hook in that language script
- "tldr": array of 3 concise punchy bullet points in that language script
- "content": 3-4 paragraphs of spicy, engaging entertainment editorial in that language script with correct phonetic transliterations of celebrity names.
- "whatsappShareText": whatsapp blast text with fire emojis and tags
- "headlineVariants": array of 3 catchy alternative headlines.

Respond with ONLY valid raw JSON without code fences.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  });

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}
