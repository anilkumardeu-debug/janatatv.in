import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'articles.json');

// Initial seed articles representing real Indian cinema buzz across Tollywood & Bollywood
const SEED_ARTICLES = [
  {
    id: 'art-pushpa2-leak',
    originalTitle: "Pushpa 2: The Rule - Major Climax Details Leaked! Sukumar Plans Wild Action Sequence with Allu Arjun and Fahadh Faasil",
    originalUrl: "https://www.123telugu.com",
    sourceName: "123Telugu & Pinkvilla Wire",
    category: "Tollywood",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    viralityScore: 98,
    tags: ["#Pushpa2TheRule", "#AlluArjun", "#FahadhFaasil", "#Sukumar", "#BoxOfficeTsunami"],
    reactions: { fire: 489, shock: 215, laugh: 42, sad: 8, popcorn: 320 },
    status: "published",
    localized: {
      te: {
        title: "పుష్ప 2 క్లైమాక్స్ లీక్: అల్లు అర్జున్, ఫహద్ ఫాసిల్ మధ్య నెవర్ బిఫోర్ సీక్వెన్స్.. థియేటర్లలో పూనకాలే!",
        subtitle: "సుకుమార్ డైరెక్షన్‌లో హై-ఓల్టేజ్ యాక్షన్.. రికార్డుల వేట మొదలు!",
        tldr: [
          "పుష్ప 2 క్లైమాక్స్ ఫైట్ సీక్వెన్స్ గురించి ఇండస్ట్రీలో సంచలన లీక్ బయటకు వచ్చింది.",
          "అల్లు అర్జున్ మరియు ఫహద్ ఫాసిల్ మధ్య వచ్చే 20 నిమిషాల సన్నివేశం రోమాలు నిక్కబొడుచుకునేలా ఉంటుందట.",
          "దేవి శ్రీ ప్రసాద్ సమకూర్చిన బ్యాక్‌గ్రౌండ్ స్కోర్ ఈ సీన్‌ను నెక్స్ట్ లెవెల్‌కి తీసుకెళ్లినట్లు టాక్."
        ],
        content: `టాలీవుడ్ ఐకాన్ స్టార్ అల్లు అర్జున్ నటిస్తున్న మోస్ట్ అవేటెడ్ మూవీ 'పుష్ప 2: ది రూల్' గురించి రోజుకో ఆసక్తికరమైన సమాచారం వెలుగులోకి వస్తోంది. ప్రస్తుతం జరుగుతున్న పోస్ట్ ప్రొడక్షన్ పనుల్లో క్లైమాక్స్ ఎపిసోడ్ గురించిన ఒక షాకింగ్ అప్‌డేట్ ఫిలింనగర్ సర్కిల్స్‌లో వైరల్ అవుతోంది.

దర్శకుడు సుకుమార్ ఈసారి క్లైమాక్స్‌ను ఎవరూ ఊహించని రీతిలో ప్లాన్ చేశారట. అల్లు అర్జున్ మరియు ఫహద్ ఫాసిల్ (భన్వర్ సింగ్ షెకావత్) మధ్య సాగే ముఖాముఖి పోరు దాదాపు 20 నిమిషాల పాటు ప్రేక్షకులను సీట్ల అంచున కూర్చోబెడుతుందని తెలుస్తోంది. ఈ ఫైట్ కోసం భారీగా బడ్జెట్ వెచ్చించడమే కాకుండా, ప్రత్యేకమైన విజువల్ ఎఫెక్ట్స్ జోడించారట.

ఈ వార్తతో అల్లు అర్జున్ అభిమానులు నెట్టింట పండగ చేసుకుంటున్నారు. డిసెంబర్‌లో విడుదల కానున్న ఈ పాన్ ఇండియా చిత్రం భారతీయ బాక్సాఫీస్ వద్ద ఉన్న అన్ని రికార్డులను తిరగరాయడం ఖాయమని ట్రేడ్ నిపుణులు జోస్యం చెబుతున్నారు!`,
        whatsappShareText: `🔥 *జనతా టీవీ బ్రేకింగ్:* పుష్ప 2 క్లైమాక్స్ లీక్.. అల్లు అర్జున్ వర్సెస్ ఫహద్ ఫాసిల్!\n\n👉 పూర్తి వివరాలు: https://janatatv.in\n\n#JanataTV #Pushpa2 #AlluArjun`,
        headlineVariants: [
          "పుష్ప 2 క్లైమాక్స్ లీక్: నెవర్ బిఫోర్ సీక్వెన్స్!",
          "అల్లు అర్జున్, ఫహద్ ఫాసిల్ మధ్య రచ్చ రంబోలా.. థియేటర్లు దద్దరిల్లాల్సిందే!",
          "సుకుమార్ మాస్టర్ ప్లాన్ బయటపడింది: పుష్ప 2 లో ఊహించని ట్విస్ట్!"
        ]
      },
      hi: {
        title: "पुष्पा 2 का क्लाइमैक्स लीक: अल्लू अर्जुन और फहाद फासिल के बीच होगी खूनी जंग, रोंगटे खड़े कर देगा 20 मिनट का सीन!",
        subtitle: "सुकुमार ने तैयार किया सबसे खतरनाक एक्शन सीन, बॉक्स ऑफिस पर मचेगा तहलका!",
        tldr: [
          "पुष्पा 2 के क्लाइमैक्स सीन को लेकर फिल्म इंडस्ट्री से बेहद हैरान करने वाला खुलासा हुआ है।",
          "अल्लू अर्जुन और फहाद फासिल के बीच का फेस-ऑफ सीन सिनेमाघरों में दर्शकों के होश उड़ा देगा।",
          "ट्रेड एनालिस्ट्स का दावा है कि पहले ही दिन 200 करोड़ से ज्यादा की ओपनिंग पक्की है।"
        ],
        content: `अल्लू अर्जुन की मोस्ट अवेटेड फिल्म 'पुष्पा 2: द रूल' को लेकर हर दिन नई चर्चाएं देखने को मिल रही हैं। अब फिल्म के क्लाइमैक्स से जुड़ी एक ऐसी खबर सामने आई है, जिसने पूरे सोशल मीडिया पर आग लगा दी है।

फिल्म के निर्देशक सुकुमार ने क्लाइमैक्स को बेहद ग्रैंड और इंटेंस अंदाज में शूट किया है। सूत्रों के मुताबिक, अल्लू अर्जुन (पुष्पा राज) और फहाद फासिल (शेखावत) के बीच होने वाला यह 20 मिनट का टकराव भारतीय सिनेमा का अब तक का सबसे खतरनाक सीक्वेंस साबित होने वाला है।

इस खबर के आते ही फैंस का उत्साह सातवें आसमान पर पहुंच गया है। बॉक्स ऑफिस के जानकारों का मानना है कि 'पुष्पा 2' हिंदी बेल्ट में भी 'जवान' और 'गदर 2' के सारे रिकॉर्ड्स को चकनाचूर करने का दम रखती है!`,
        whatsappShareText: `🔥 *जनता टीवी एक्सक्लूसिव:* पुष्पा 2 का क्लाइमैक्स लीक.. अल्लू अर्जुन का खौफनाक अंदाज!\n\n👉 पूरी खबर पढ़ें: https://janatatv.in\n\n#JanataTV #Pushpa2`,
        headlineVariants: [
          "पुष्पा 2 क्लाइमैक्स: 20 मिनट का महासंग्राम!",
          "अल्लू अर्जुन और फहाद फासिल का फेस-ऑफ, सिनेमाघरों में मचेगा कोहराम!",
          "सुकुमार का मास्टरस्ट्रोक: पुष्पा 2 तोड़ेगी सभी रिकॉर्ड्स!"
        ]
      },
      ta: {
        title: "புஷ்பா 2 கிளைமாக்ஸ் தகவல் கசிவு: அல்லு அர்ஜுன் - பகத் பாசில் மோதல்.. இணையத்தில் வைரல்!",
        subtitle: "சினிமா வரலாற்றில் இதுவரை பார்த்திராத அதிரடி ஆக்ஷன் காட்சி!",
        tldr: [
          "புஷ்பா 2 படத்தின் இறுதிக்காட்சி குறித்த மாஸ் தகவல் தற்போது கசிந்துள்ளது.",
          "அல்லு அர்ஜுன் மற்றும் பகத் பாசில் மோதும் 20 நிமிட காட்சி ரசிகர்களை மிரள வைக்கும் என கூறப்படுகிறது.",
          "டிசம்பர் மாதம் வெளியாகவுள்ள இந்த திரைப்படம் மிகப்பெரிய சாதனைகளை படைக்கும் என எதிர்பார்க்கப்படுகிறது."
        ],
        content: `இயக்குநர் சுகுமார் இயக்கத்தில் உருவாகி வரும் 'புஷ்பா 2: தி ரூல்' திரைப்படம் இந்திய அளவில் பெரும் எதிர்பார்ப்பை ஏற்படுத்தியுள்ளது. இந்நிலையில் படத்தின் உச்சகட்ட காட்சி பற்றிய தகவல் வெளியாகி ரசிகர்களை பரவசப்படுத்தியுள்ளது.

அல்லு அர்ஜுன் மற்றும் பகத் பாசில் இடையேயான மோதல் காட்சி 20 நிமிடங்களுக்கும் மேலாக நீடிக்கும் வகையில் மிக பிரம்மாண்டமாக படமாக்கப்பட்டுள்ளதாம். இந்த காட்சி ரசிகர்களுக்கு பெரும் விருந்தாக அமையும் என கோலிவுட் வட்டாரங்கள் தெரிவிக்கின்றன!`,
        whatsappShareText: `🔥 *ஜனதா டிவி:* புஷ்பா 2 கிளைமாக்ஸ் ஆக்ஷன் காட்சி கசிந்தது!\n\n👉 படிக்கவும்: https://janatatv.in\n\n#Pushpa2`,
        headlineVariants: [
          "புஷ்பா 2: மிரட்டும் இறுதிக்காட்சி!",
          "அல்லு அர்ஜுன் மாஸ் காட்டும் காட்சி கசிவு!"
        ]
      },
      en: {
        title: "LEAKED: Pushpa 2 Climax Sequence Revealed! Sukumar Devises Ruthless 20-Minute Faceoff Between Allu Arjun and Fahadh Faasil",
        subtitle: "Sources claim the high-octane brawl will rewrite Indian cinematic action standards.",
        tldr: [
          "Sensational inside reports from Hyderabad reveal details of the high-stakes climax.",
          "Allu Arjun and Fahadh Faasil clash in an unsparing 20-minute physical battle sequence.",
          "Devi Sri Prasad's background score is touted to be the crowning jewel of the scene."
        ],
        content: `The buzz around 'Pushpa 2: The Rule' has reached boiling point, and the latest insider scoop from Ramoji Film City is bound to send fans into absolute frenzy. 

According to sources closely tied to the production unit, director Sukumar has designed a climax that pulls no punches. The confrontation between Pushpa Raj (Allu Arjun) and Bhanwar Singh Shekhawat (Fahadh Faasil) spans over twenty uninterrupted minutes of raw, unfiltered cinematic grit.

With pre-release business touching unprecedented heights across domestic and international territories, trade pundits are already billing this as the definitive box-office juggernaut of 2024. Stay glued to JanataTV for continuous ground zero updates!`,
        whatsappShareText: `🔥 *JanataTV Exclusive:* Pushpa 2 Climax Leaked! Allu Arjun vs Fahadh Faasil showdown!\n\n👉 Read story: https://janatatv.in\n\n#Pushpa2 #AlluArjun`,
        headlineVariants: [
          "Pushpa 2 Climax Spoilers: What To Expect!",
          "Allu Arjun vs Fahadh Faasil: Inside The 20-Minute Showdown",
          "Sukumar's Masterpiece: Why Pushpa 2 Climax Will Stun The World"
        ]
      }
    }
  },
  {
    id: 'art-kalki-spirit-prabhas',
    originalTitle: "Prabhas Salary Shock: Rebel Star Charges Record Remuneration for Sandeep Reddy Vanga's Spirit",
    originalUrl: "https://www.gulte.com",
    sourceName: "Gulte Gossip Radar",
    category: "Exclusive Gossip",
    imageUrl: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    viralityScore: 95,
    tags: ["#Prabhas", "#Spirit", "#SandeepReddyVanga", "#Kalki2898AD", "#RecordRemuneration"],
    reactions: { fire: 620, shock: 340, laugh: 12, sad: 4, popcorn: 410 },
    status: "published",
    localized: {
      te: {
        title: "ప్రభాస్ పారితోషికంపై సంచలన టాక్: సందీప్ రెడ్డి వంగా 'స్పిరిట్' కోసం మైండ్ బ్లోయింగ్ రెమ్యునరేషన్?",
        subtitle: "భారతీయ సినీ చరిత్రలోనే సరికొత్త రికార్డు.. కళ్లు చెదిరే ఫిగర్!",
        tldr: [
          "రెబల్ స్టార్ ప్రభాస్ తాజా సినిమా 'స్పిరిట్' రెమ్యునరేషన్ పై ఫిలింనగర్ లో హాట్ టాపిక్.",
          "సందీప్ రెడ్డి వంగా దర్శకత్వంలో రానున్న ఈ పోలీస్ డ్రామా కోసం ప్రభాస్ రూ.150 కోట్లకు పైగా తీసుకుంటున్నారట.",
          "లాభాల్లో వాటాతో కలిపితే ఇది భారతీయ నటుల్లోనే ఆల్-టైమ్ రికార్డుగా నిలవనుంది."
        ],
        content: `'కల్కి 2898 AD' మరియు 'సలార్' విజయాలతో గ్లోబల్ స్థాయిలో ప్రభంజనం సృష్టించిన రెబల్ స్టార్ ప్రభాస్ ఇప్పుడు 'యానిమల్' ఫేమ్ సందీప్ రెడ్డి వంగా తో కలిసి 'స్పిరిట్' చేయబోతున్న సంగతి తెలిసిందే. ఈ క్రేజీ ప్రాజెక్ట్ గురించి వినిపిస్తున్న తాజా రూమర్ నెట్టింట పెను ప్రకంపనలు సృష్టిస్తోంది.

తాజా సమాచారం ప్రకారం, ఈ చిత్రంలో పవర్‌ఫుల్ పోలీస్ ఆఫీసర్ పాత్రలో కనిపించనున్న ప్రభాస్ కోసం నిర్మాతలు రికార్డు స్థాయిలో పారితోషికం ఆఫర్ చేశారట. దాదాపు రూ. 150 కోట్ల ఫిక్స్‌డ్ ఫీజుతో పాటు థియేట్రికల్ అండ్ నాన్-థియేట్రికల్ లాభాల్లో భారీ పర్సంటేజ్ షేర్ ఇవ్వడానికి ఒప్పందం కుదిరినట్లు తెలుస్తోంది.

ఈ మొత్తం కలిపితే ప్రభాస్ దాదాపు రూ. 200 కోట్ల మార్కును అందుకోనున్నారు. ఇదే కనుక నిజమైతే, ఇండియన్ సినిమా హిస్టరీలోనే ఒక హీరో అందుకున్న అత్యధిక పారితోషికంగా చరిత్ర సృష్టించడం ఖాయం!`,
        whatsappShareText: `🔥 *జనతా టీవీ హాట్ గాసిప్:* ప్రభాస్ స్పిరిట్ సినిమా కోసం రూ.150 కోట్లకు పైగా రెమ్యునరేషన్?!\n\n👉 పూర్తి కథనం: https://janatatv.in\n\n#Prabhas #Spirit #SandeepVanga`,
        headlineVariants: [
          "ప్రభాస్ రెమ్యునరేషన్ రికార్డ్: స్పిరిట్ కోసం రూ.150 కోట్లు?",
          "సందీప్ వంగా - ప్రభాస్ కాంబో: కళ్లు చెదిరే పారితోషికం!",
          "బాక్సాఫీస్ బాహుబలి ప్రభాస్ ఖాతాలో మరో రికార్డు!"
        ]
      },
      hi: {
        title: "प्रभास की फीस जानकर उड़े होश: संदीप रेड्डी वांगा की 'स्पिरिट' के लिए ले रहे 150 करोड़ से ज्यादा!",
        subtitle: "भारतीय सिनेमा के इतिहास की सबसे महंगी डील, बॉलीवुड स्टार्स भी रह गए पीछे!",
        tldr: [
          "प्रभास की अपकमिंग फिल्म 'स्पिरिट' की फीस को लेकर इंडस्ट्री के गलियारों में हलचल।",
          "संदीप रेड्डी वांगा की फिल्म में पुलिस ऑफिसर बनने के लिए प्रभास को मिल रही ऐतिहासिक रकम।",
          "प्रॉफिट शेयरिंग मिलाकर यह आंकड़ा 200 करोड़ पार कर सकता है।"
        ],
        content: `'कल्कि 2898 एडी' की शानदार सफलता के बाद पैन-इंडिया सुपरस्टार प्रभास अब डायरेक्टर संदीप रेड्डी वांगा की फिल्म 'स्पिरिट' की तैयारियों में जुटे हैं। इस फिल्म के लिए प्रभास की फीस की खबर ने बॉलीवुड और साउथ दोनों इंडस्ट्री को चौंका दिया है।

रिपोर्ट्स के अनुसार, 'स्पिरिट' में एक सख्त और बेबाक पुलिस अधिकारी की भूमिका निभाने के लिए प्रभास को करीब 150 करोड़ रुपये की भारी-भरकम फीस दी जा रही है। यही नहीं, फिल्म के प्रॉफिट शेयरिंग में भी उनका बड़ा हिस्सा तय हुआ है।

प्रभास इस समय भारत के सबसे बड़े क्राउड-पुलर स्टार बन चुके हैं। ऐसे में मेकर्स उनके नाम पर करोड़ों का दांव लगाने से बिल्कुल नहीं हिचकिचा रहे हैं!`,
        whatsappShareText: `🔥 *जनता टीवी एक्सक्लूसिव:* प्रभास की फीस बनी रिकॉर्ड! स्पिरिट के लिए 150 करोड़?!\n\n👉 पढ़ें पूरी खबर: https://janatatv.in\n\n#JanataTV #Prabhas #Spirit`,
        headlineVariants: [
          "प्रभास की फीस ने तोड़े सारे रिकॉर्ड!",
          "स्पिरिट के लिए 150 करोड़ चार्ज कर रहे प्रभास, बना नया कीर्तिमान!"
        ]
      },
      ta: {
        title: "பிரபாஸ் சம்பளத்தில் புதிய சாதனை: சந்தீப் ரெட்டி வாங்காவின் 'ஸ்பிரிட்' படத்திற்காக ரூ.150 கோடி?!",
        subtitle: "இந்திய திரையுலகையே அதிர வைத்த பிரம்மாண்ட சம்பள விவரம்!",
        tldr: [
          "பிரபாஸ் நடிக்கும் ஸ்பிரிட் படத்திற்கான சம்பளம் குறித்து இணையத்தில் பரபரப்பு தகவல்.",
          "சந்தீப் ரெட்டி வாங்கா இயக்கத்தில் உருவாகும் இப்படத்தில் பிரபாஸ் போலீஸ் அதிகாரியாக நடிக்கிறார்.",
          "லாபத்தில் பங்குடன் சேர்த்து இவரது வருமானம் ரூ.200 கோடியை எட்டும் என கூறப்படுகிறது."
        ],
        content: `'கல்கி 2898 ஏடி' திரைப்படத்தின் மாபெரும் வெற்றியைத் தொடர்ந்து பிரபாஸ் தற்போது 'ஸ்பிரிட்' திரைப்படத்தில் நடிக்கவுள்ளார். இப்படத்திற்காக பிரபாஸ் சுமார் 150 கோடி ரூபாய் சம்பளமாக பெறுவதாக சினிமா வட்டாரங்களில் கூறப்படுகிறது!`,
        whatsappShareText: `🔥 *ஜனதா டிவி:* பிரபாஸின் மெகா சம்பளம்.. ஸ்பிரிட் படத்திற்காக ரூ.150 கோடி!\n\n👉 படிக்கவும்: https://janatatv.in\n\n#Prabhas`,
        headlineVariants: [
          "பிரபாஸ் சம்பளம்: புதிய வரலாற்று சாதனை!",
          "ஸ்பிரிட் படத்திற்காக கொட்டப்படும் கோடி ரூபாய்!"
        ]
      },
      en: {
        title: "MEGA SCOOP: Prabhas Demands Mind-Boggling ₹150 Crore+ For Sandeep Reddy Vanga's 'Spirit'",
        subtitle: "The Rebel Star breaks all previous Indian cinema payroll benchmarks with a massive profit-sharing pact.",
        tldr: [
          "Fresh whispers out of Tinsel Town indicate unprecedented remuneration for Prabhas in 'Spirit'.",
          "The 'Animal' helmer is crafting an ultra-intense cop saga specifically tailored for the pan-India star.",
          "With backend equity, his total haul could cross an astronomical ₹200 Crores."
        ],
        content: `Riding high on the monumental global conquest of 'Kalki 2898 AD', Rebel Star Prabhas is rewriting every established benchmark of stardom. As he gears up to team with firebrand filmmaker Sandeep Reddy Vanga for 'Spirit', the financial particulars circulating in trade corridors are jaw-dropping.

Insiders assert that T-Series and the production banner have locked a baseline remuneration exceeding ₹150 Crores, alongside substantial backend theatrical and digital profit shares. 

With Prabhas consistently delivering four-digit crore worldwide grosses, industry gatekeepers regard this not as an expenditure, but as the safest gilt-edged investment in Indian entertainment today.`,
        whatsappShareText: `🔥 *JanataTV Gossip:* Prabhas commands ₹150 Cr for Sandeep Vanga's Spirit!\n\n👉 Read: https://janatatv.in\n\n#Prabhas #Spirit`,
        headlineVariants: [
          "Prabhas' Salary in Spirit Stuns The Industry",
          "India's Highest Paid Actor: Prabhas Reaches Untouchable Benchmark"
        ]
      }
    }
  },
  {
    id: 'art-deepika-ranveer-viral',
    originalTitle: "Deepika Padukone and Ranveer Singh Welcome Baby Girl: Bollywood Celebrates As Paps Capture Adorable First Look Outside Hospital",
    originalUrl: "https://www.pinkvilla.com",
    sourceName: "Pinkvilla Bollywood Radar",
    category: "Paparazzi & Style",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    viralityScore: 92,
    tags: ["#DeepikaPadukone", "#RanveerSingh", "#DeepVeer", "#BollywoodBaby", "#ViralPaparazzi"],
    reactions: { fire: 512, shock: 95, laugh: 15, sad: 1, popcorn: 380 },
    status: "published",
    localized: {
      te: {
        title: "దీపికా పదుకొణె - రణ్‌వీర్ సింగ్ దంపతుల ఇంటికి మహాలక్ష్మి: సోషల్ మీడియాలో సెలబ్రిటీల శుభాకాంక్షల వెల్లువ!",
        subtitle: "ముంబై ఆసుపత్రి వద్ద పాపరాజీల సందడి.. దీప్‌వీర్ ఫ్యాన్స్‌లో అంబరాన్నంటిన సంబరాలు!",
        tldr: [
          "బాలీవుడ్ పవర్ కపుల్ దీపికా పదుకొణె, రణ్‌వీర్ సింగ్ ఆడబిడ్డకు జన్మనిచ్చారు.",
          "ముంబైలోని హెచ్‌ఎన్ రిలయన్స్ ఆసుపత్రి నుంచి ఈ శుభవార్త అధికారికంగా విడుదలైంది.",
          "షారుఖ్ ఖాన్, ఆలియా భట్, ప్రియాంక చోప్రా సహా సినీ ప్రముఖులు శుభాకాంక్షలు తెలిపారు."
        ],
        content: `బాలీవుడ్ స్టార్ కపుల్ దీపికా పదుకొణె మరియు రణ్‌వీర్ సింగ్ ల జీవితంలో సరికొత్త వసంతం మొదలైంది. వినాయక చవితి పర్వదినం సందర్భంగా దీపికా ముంబైలోని ప్రసిద్ధ ఆసుపత్రిలో పండంటి ఆడబిడ్డకు జన్మనిచ్చారు.

ఈ వార్త తెలిసిన వెంటనే సోషల్ మీడియా వేదికగా అభిమానులు మరియు సినీ ప్రముఖులు శుభాకాంక్షల వర్షం కురిపిస్తున్నారు. ముంబై ఆసుపత్రి బయట పాపరాజీలు రణ్‌వీర్ సింగ్ కుటుంబాన్ని కెమెరాల్లో బంధించేందుకు పోటీ పడ్డారు. రణ్‌వీర్ సింగ్ తన ఆనందాన్ని వ్యక్తం చేస్తూ అందరికీ ధన్యవాదాలు తెలిపారు.

దీప్‌వీర్ చిన్నారి రాకతో వారి కుటుంబాల్లో మాత్రమే కాకుండా యావత్ భారతీయ సినీ రంగంలో పండుగ వాతావరణం నెలకొంది!`,
        whatsappShareText: `🔥 *జనతా టీవీ అప్‌డేట్:* దీపికా-రణ్‌వీర్ దంపతులకు ఆడబిడ్డ జననం.. బాలీవుడ్‌లో సంబరాలు!\n\n👉 వివరాలు: https://janatatv.in\n\n#Deepika #Ranveer #JanataTV`,
        headlineVariants: [
          "దీపికా - రణ్‌వీర్ కు ఆడబిడ్డ: సినీ లోకంలో పండగ వాతావరణం!",
          "దీప్‌వీర్ ఇంట మహాలక్ష్మి అడుగుపెట్టింది!"
        ]
      },
      hi: {
        title: "दीपिका पादुकोण और रणवीर सिंह के घर आई नन्हीं परी: बॉलीवुड सितारों ने दी ढेरों बधाइयां, वायरल हुईं तस्वीरें!",
        subtitle: "अस्पताल के बाहर पपराजी का जमावड़ा, दीपवीर के फैंस में जश्न का माहौल!",
        tldr: [
          "बॉलीवुड के मशहूर कपल दीपिका पादुकोण और रणवीर सिंह बेटी के माता-पिता बन गए हैं।",
          "गणेश चतुर्थी के शुभ अवसर पर मुंबई के एचएन रिलायंस अस्पताल में हुआ बच्ची का जन्म।",
          "शाहरुख खान, कटरीना कैफ और प्रियंका चोपड़ा ने सोशल मीडिया पर लुटाया प्यार।"
        ],
        content: `बॉलीवुड की पसंदीदा जोड़ी दीपिका पादुकोण और रणवीर सिंह के घर आखिरकार खुशियों की शहनाई बज चुकी है। दीपिका ने मुंबई के एचएन रिलायंस फाउंडेशन अस्पताल में एक खूबसूरत बेटी को जन्म दिया है।

जैसे ही यह खुशखबरी सोशल मीडिया पर आई, फैंस और बॉलीवुड हस्तियों ने कपल पर बधाइयों की बरसात कर दी। अस्पताल के बाहर पपराजी ने रणवीर सिंह और उनके परिवार की खुशियों को अपने कैमरों में कैद किया।

दीपिका और रणवीर ने अपनी इस नई जर्नी के लिए सभी फैंस और चाहने वालों को उनके असीम प्यार और दुआओं के लिए शुक्रिया अदा किया है!`,
        whatsappShareText: `🔥 *जनता टीवी बॉलीवुड:* दीपिका-रणवीर के घर आई नन्हीं परी.. फैंस में खुशी की लहर!\n\n👉 पढ़ें: https://janatatv.in\n\n#DeepVeer #DeepikaPadukone`,
        headlineVariants: [
          "दीपिका और रणवीर बने माता-पिता, बेटी ने लिया जन्म!",
          "दीपवीर के घर आई लक्ष्मी: बॉलीवुड में जश्न का माहौल!"
        ]
      },
      ta: {
        title: "தீபிகா படுகோன் - ரன்பீர் சிங் தம்பதிக்கு பெண் குழந்தை பிறந்தது: பாலிவுட்டில் கொண்டாட்டம்!",
        subtitle: "மும்பை மருத்துவமனையில் பிறந்த மழலை.. ரசிகர்கள் வாழ்த்து மழை!",
        tldr: [
          "பாலிவுட் நட்சத்திர ஜோடி தீபிகா படுகோன் மற்றும் ரன்பீர் சிங் பெற்றோர் ஆகியுள்ளனர்.",
          "மும்பையில் உள்ள தனியார் மருத்துவமனையில் தீபிகாவுக்கு அழகான பெண் குழந்தை பிறந்துள்ளது.",
          "திரையுலக பிரபலங்கள் பலரும் இந்த தம்பதிக்கு வாழ்த்துக்களை தெரிவித்து வருகின்றனர்."
        ],
        content: `பாலிவுட்டின் முன்னணி நட்சத்திர ஜோடியான தீபிகா படுகோன் மற்றும் ரன்பீர் சிங் தம்பதிக்கு அழகிய பெண் குழந்தை பிறந்துள்ளது. இந்த மகிழ்ச்சியான செய்தியை தொடர்ந்து ரசிகர்களும் திரை உலகினரும் வாழ்த்துக்களை தெரிவித்து வருகின்றனர்!`,
        whatsappShareText: `🔥 *ஜனதா டிவி:* தீபிகா படுகோனுக்கு பெண் குழந்தை பிறந்தது!\n\n👉 https://janatatv.in\n\n#Deepika`,
        headlineVariants: [
          "தீபிகா - ரன்பீர் சிங் குடும்பத்தில் புதிய வரவு!"
        ]
      },
      en: {
        title: "IT'S A GIRL! Deepika Padukone and Ranveer Singh Blessed With A Baby Girl: Tinsel Town Erupts In Celebration",
        subtitle: "Paparazzi mob HN Reliance Hospital as celebratory sweets are distributed by the proud father.",
        tldr: [
          "Deepika Padukone and Ranveer Singh have welcomed their first child, a baby daughter.",
          "The auspicious arrival coincided with festive Ganesh Chaturthi celebrations in Mumbai.",
          "Industry megastars including Shah Rukh Khan and Priyanka Chopra have flooded social channels with warmth."
        ],
        content: `The wait is over! Bollywood's reigning golden couple, Deepika Padukone and Ranveer Singh, have officially embarked upon their most rewarding journey yet—parenthood. The couple welcomed a healthy baby daughter at Mumbai's esteemed HN Reliance Foundation Hospital.

As news broke across digital wires, congratulatory messages poured in from Bollywood titans, sports icons, and millions of DeepVeer admirers worldwide. Hospital premises were lined with shutterbugs as Ranveer's ecstatic smile lit up cameras during family arrivals.

JanataTV Cinema extends our warmest felicitations to the proud parents on their radiant bundle of joy!`,
        whatsappShareText: `🔥 *JanataTV:* Deepika & Ranveer welcome a baby girl!\n\n👉 Read: https://janatatv.in\n\n#DeepVeer`,
        headlineVariants: [
          "Deepika & Ranveer Welcome Baby Girl",
          "Bollywood Celebrates DeepVeer's New Arrival"
        ]
      }
    }
  },
  {
    id: 'art-ssmb29-mahesh-rajamaouli',
    originalTitle: "SSMB29 Big Update: SS Rajamouli and Mahesh Babu Fly to Kenya For Forest Location Scouting, Hollywood Cast In Final Talks",
    originalUrl: "https://www.mirchi9.com",
    sourceName: "Mirchi9 Tollywood Wire",
    category: "Tollywood",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    viralityScore: 97,
    tags: ["#SSMB29", "#MaheshBabu", "#SSRajamouli", "#GlobetrottingAdventure", "#HollywoodCollab"],
    reactions: { fire: 750, shock: 190, laugh: 18, sad: 3, popcorn: 510 },
    status: "published",
    localized: {
      te: {
        title: "SSMB29 పై బిగ్గెస్ట్ అప్‌డేట్: కెన్యా అడవుల్లో మహేష్ బాబు, రాజమౌళి లొకేషన్ హంట్.. హాలీవుడ్ నటులతో కీలక చర్చలు!",
        subtitle: "ఇండియానా జోన్స్ తరహా గ్లోబల్ అడ్వెంచర్.. 1000 కోట్ల బడ్జెట్‌తో సరికొత్త చరిత్ర!",
        tldr: [
          "సూపర్‌స్టార్ మహేష్ బాబు మరియు దర్శకధీరుడు రాజమౌళి క్రేజీ ప్రాజెక్ట్ SSMB29 పనులు శరవేగంగా సాగుతున్నాయి.",
          "ఆఫ్రికన్ అడవుల్లో ప్రత్యేక లొకేషన్ల ఎంపిక కోసం చిత్ర బృందం కెన్యా వెళ్లినట్లు తాజా సమాచారం.",
          "ఒక ప్రముఖ హాలీవుడ్ స్టార్ ఈ సినిమాలో విలన్ పాత్రలో కనిపించే అవకాశం ఉందని టాక్."
        ],
        content: `'బాహుబలి', 'RRR' సినిమాలతో అంతర్జాతీయ స్థాయిలో తెలుగు సినిమా ఖ్యాతిని చాటిచెప్పిన దర్శకధీరుడు ఎస్.ఎస్.రాజమౌళి, సూపర్‌స్టార్ మహేష్ బాబు కలయికలో రానున్న చిత్రం #SSMB29 పై అంచనాలు ఆకాశాన్ని తాకుతున్నాయి. తాజాగా ఈ సినిమాకు సంబంధించి ఒక మెగా అప్‌డేట్ బయటకు వచ్చింది.

ఆఫ్రికన్ అడ్వెంచర్ బ్యాక్‌డ్రాప్‌లో సాగే ఈ కథ కోసం రాజమౌళి మరియు మహేష్ బాబు స్వయంగా కెన్యా మరియు టాంజానియా లోని దట్టమైన అటవీ ప్రాంతాల్లో లొకేషన్ స్కాటింగ్ నిర్వహిస్తున్నారు. ఈ చిత్రం కోసం మహేష్ సరికొత్త మేకోవర్ లో, పొడవాటి జుట్టు మరియు గడ్డంతో కండలు తిరిగిన శరీరంతో కనిపించనున్నారు.

ఈ ప్రాజెక్ట్‌ను హాలీవుడ్ నిర్మాణ సంస్థల భాగస్వామ్యంతో దాదాపు రూ. 1000 కోట్ల భారీ బడ్జెట్‌తో తెరకెక్కించనున్నట్లు సమాచారం. ఈ సినిమాతో మహేష్ బాబు గ్లోబల్ బాక్సాఫీస్ వద్ద రికార్డుల సునామీ సృష్టించడం ఖాయంగా కనిపిస్తోంది!`,
        whatsappShareText: `🔥 *జనతా టీవీ స్పెషల్:* SSMB29 కెన్యా లొకేషన్ హంట్.. మహేష్ బాబు - రాజమౌళి సంచలన ప్రాజెక్ట్!\n\n👉 చదవండి: https://janatatv.in\n\n#SSMB29 #MaheshBabu #Rajamouli`,
        headlineVariants: [
          "SSMB29: కెన్యా అడవుల్లో మహేష్ బాబు - రాజమౌళి లొకేషన్ హంట్!",
          "రూ.1000 కోట్ల బడ్జెట్.. హాలీవుడ్ లెవెల్ లో మహేష్ బాబు సినిమా!"
        ]
      },
      hi: {
        title: "SSMB29 का मेगा अपडेट: केन्या के जंगलों में पहुंचे महेश बाबू और एसएस राजामौली, हॉलीवुड सितारों की होगी एंट्री!",
        subtitle: "1000 करोड़ के बजट में बन रही भारत की सबसे बड़ी एडवेंचर फिल्म!",
        tldr: [
          "एसएस राजामौली और सुपरस्टार महेश बाबू की फिल्म SSMB29 की तैयारियां जोरों पर हैं।",
          "फिल्म की शूटिंग के लिए केन्या और तंजानिया के घने जंगलों में लोकेशन रेकी की जा रही है।",
          "हॉलीवुड के बड़े एक्टर्स के साथ मुख्य विलेन के रोल के लिए बातचीत अंतिम चरण में है।"
        ],
        content: `'बाहुबली' और 'आरआरआर' के डायरेक्टर एसएस राजामौली अब महेश बाबू के साथ मिलकर भारतीय सिनेमा का सबसे बड़ा प्रोजेक्ट 'SSMB29' लेकर आ रहे हैं। इस फिल्म का बजट करीब 1000 करोड़ रुपये आंका जा रहा है।

खबरों के मुताबिक, राजामौली अपनी टीम के साथ केन्या के जंगलों में लोकेशन की तलाश कर रहे हैं। फिल्म में महेश बाबू एक वर्ल्ड-ट्रैवलर और एडवेंचरर के किरदार में दिखाई देंगे, जिसके लिए उन्होंने स्पेशल फिजिकल ट्रांसफॉर्मेशन भी किया है।

यह फिल्म सीधे हॉलीवुड के सहयोग से अंतरराष्ट्रीय स्तर पर रिलीज की जाएगी, जो भारतीय सिनेमा को एक नए मुकाम पर पहुंचाएगी!`,
        whatsappShareText: `🔥 *जनता टीवी एक्सक्लूसिव:* SSMB29 केन्या लोकेशन हंट.. राजामौली और महेश बाबू का महा-प्रोजेक्ट!\n\n👉 पढ़ें: https://janatatv.in\n\n#SSMB29 #MaheshBabu`,
        headlineVariants: [
          "SSMB29: केन्या के जंगलों में राजामौली की तैयारी!",
          "1000 करोड़ की फिल्म में महेश बाबू का हॉलीवुड अवतार!"
        ]
      },
      ta: {
        title: "SSMB29 அப்டேட்: கென்யா காடுகளில் மகேஷ் பாபு மற்றும் எஸ்.எஸ். ராஜமௌலி லொகேஷன் வேட்டை!",
        subtitle: "ரூ.1000 கோடி பட்ஜெட்டில் உருவாகும் பிரம்மாண்ட ஹாலிவுட் தர படம்!",
        tldr: [
          "மகேஷ் பாபு - எஸ்.எஸ். ராஜமௌலி கூட்டணியின் SSMB29 பணிகள் தீவிரமாக நடைபெற்று வருகின்றன.",
          "படப்பிடிப்புக்காக ஆப்பிரிக்காவின் கென்யா காடுகளில் லொகேஷன் தேர்வு செய்யப்பட்டுள்ளது.",
          "ஹாலிவுட் நட்சத்திரங்கள் பலர் இந்த படத்தில் நடிக்க பேச்சுவார்த்தை நடைபெற்று வருகிறது."
        ],
        content: `இயக்குநர் ராஜமௌலி மகேஷ் பாபுவை வைத்து இயக்கவுள்ள புதிய திரைப்படத்தின் படப்பிடிப்பு ஆப்பிரிக்க காடுகளில் நடைபெற உள்ளது. இதற்காக லொகேஷன் தேர்வு செய்யும் பணி தற்போது தீவிரமாக நடைபெற்று வருகிறது!`,
        whatsappShareText: `🔥 *ஜனதா டிவி:* SSMB29 கென்யா லொகேஷன் ஹண்ட்!\n\n👉 https://janatatv.in\n\n#SSMB29`,
        headlineVariants: [
          "SSMB29: ராஜமௌலியின் அடுத்த பிரம்மாண்ட படைப்பு!"
        ]
      },
      en: {
        title: "SSMB29 EXPLOSIVE UPDATE: SS Rajamouli & Mahesh Babu Scout African Jungles In Kenya, Hollywood A-Lister Eyed For Antagonist",
        subtitle: "The ₹1,000 Crore globe-trotting adventure gears up for the grandest scale Indian cinema has ever witnessed.",
        tldr: [
          "Pre-production on Rajamouli and Mahesh Babu's colossal project has shifted to Kenya and Tanzania.",
          "The film is billed as an Indiana Jones-esque globe-trotting jungle exploration saga.",
          "Talks with high-profile Hollywood casting directors are nearing completion for the antagonist."
        ],
        content: `Following the historic Oscar-winning glory of 'RRR', master storyteller S.S. Rajamouli is pulling all stops for his upcoming safari opus with Superstar Mahesh Babu, tentatively christened 'SSMB29'.

Intelligence received from African ground teams confirms that Rajamouli and his core cinematography guild have been tracking pristine, untamed savannahs and rainforests across Kenya. Mahesh Babu, who has committed nearly two years exclusively to this venture, has undergone an imposing physical transformation featuring long locks and rugged aesthetics.

With backing from top American distribution majors, SSMB29 is poised to be India's biggest cinematic export in history.`,
        whatsappShareText: `🔥 *JanataTV Scoop:* SSMB29 Kenya location scouting underway!\n\n👉 Read: https://janatatv.in\n\n#SSMB29 #MaheshBabu`,
        headlineVariants: [
          "SSMB29: Rajamouli in Kenya For Mega Hunt",
          "Mahesh Babu's ₹1000 Crore Venture Takes Off"
        ]
      }
    }
  }
];

class Database {
  constructor() {
    this.articles = [];
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.articles = JSON.parse(raw);
        if (!Array.isArray(this.articles) || this.articles.length === 0) {
          this.articles = SEED_ARTICLES;
          this.persist();
        }
      } else {
        this.articles = SEED_ARTICLES;
        this.persist();
      }
    } catch (e) {
      console.warn('[DB] Using memory seed:', e.message);
      this.articles = SEED_ARTICLES;
    }
  }

  persist() {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.articles, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Persist error:', e.message);
    }
  }

  getAllArticles({ category = 'All', search = '', language = 'te', limit = 50 } = {}) {
    let result = [...this.articles];

    if (category && category !== 'All') {
      result = result.filter(a => a.category?.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a => {
        const title = a.localized?.[language]?.title || a.originalTitle || '';
        const tags = (a.tags || []).join(' ');
        return title.toLowerCase().includes(q) || tags.toLowerCase().includes(q);
      });
    }

    // Sort by publishedAt desc
    result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return result.slice(0, limit);
  }

  getArticleById(id) {
    return this.articles.find(a => a.id === id) || null;
  }

  saveArticle(article) {
    const existingIndex = this.articles.findIndex(a => a.id === article.id);
    if (existingIndex >= 0) {
      this.articles[existingIndex] = { ...this.articles[existingIndex], ...article };
    } else {
      this.articles.unshift(article);
    }
    this.persist();
    return article;
  }

  updateReaction(id, reactionType) {
    const article = this.getArticleById(id);
    if (!article) return null;
    if (!article.reactions) {
      article.reactions = { fire: 0, shock: 0, laugh: 0, sad: 0, popcorn: 0 };
    }
    article.reactions[reactionType] = (article.reactions[reactionType] || 0) + 1;
    this.persist();
    return article.reactions;
  }

  deleteArticle(id) {
    const prevLen = this.articles.length;
    this.articles = this.articles.filter(a => a.id !== id);
    if (this.articles.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  getStats() {
    const total = this.articles.length;
    const published = this.articles.filter(a => a.status === 'published').length;
    const drafts = this.articles.filter(a => a.status === 'draft').length;
    const totalReactions = this.articles.reduce((acc, curr) => {
      const r = curr.reactions || {};
      return acc + (r.fire || 0) + (r.shock || 0) + (r.popcorn || 0);
    }, 0);

    return {
      totalArticles: total,
      publishedArticles: published,
      pendingDrafts: drafts,
      totalInteractions: totalReactions,
      categoriesCount: 8,
      supportedLanguages: ['Telugu', 'Hindi', 'Tamil', 'English']
    };
  }

  getSettings() {
    const settingsFile = path.join(__dirname, 'settings.json');
    const defaultSettings = {
      adSensePublisherId: 'ca-pub-DEMO1234567890',
      taboolaEnabled: true,
      inArticleAdsEnabled: true,
      mobileAnchorEnabled: true,
      autoPilotCrawler: true,
      autoPilotIntervalMinutes: 30,
      sponsorLeaderboardText: 'Book Pushpa 2 & Game Changer Advance Theatrical Tickets',
      sponsorLeaderboardUrl: 'https://in.bookmyshow.com',
      sponsorName: 'BookMyShow & Movie Premiere Sponsor',
      whatsappChannelUrl: 'https://whatsapp.com/channel/demo'
    };

    try {
      if (fs.existsSync(settingsFile)) {
        return { ...defaultSettings, ...JSON.parse(fs.readFileSync(settingsFile, 'utf-8')) };
      }
    } catch (e) {
      console.warn('[DB] Settings read error:', e.message);
    }
    return defaultSettings;
  }

  updateSettings(newSettings) {
    const settingsFile = path.join(__dirname, 'settings.json');
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    try {
      fs.writeFileSync(settingsFile, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Settings write error:', e.message);
    }
    return updated;
  }
}

export const db = new Database();
