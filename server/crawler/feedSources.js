// Entertainment & Celebrity Gossip RSS Feed Directory

export const FEED_SOURCES = [
  {
    id: 'pinkvilla',
    name: 'Pinkvilla Hindi & Bollywood',
    category: 'Bollywood',
    region: 'Hindi',
    url: 'https://www.pinkvilla.com/entertainment/bollywood/feed',
    enabled: true,
  },
  {
    id: 'bollywoodhungama',
    name: 'Bollywood Hungama News',
    category: 'Bollywood',
    region: 'Hindi',
    url: 'https://www.bollywoodhungama.com/rss/news.xml',
    enabled: true,
  },
  {
    id: '123telugu',
    name: '123Telugu Breaking News',
    category: 'Tollywood',
    region: 'Telugu',
    url: 'https://www.123telugu.com/mnews/feed',
    enabled: true,
  },
  {
    id: 'gulte',
    name: 'Gulte Cinema & Gossip',
    category: 'Tollywood',
    region: 'Telugu',
    url: 'https://www.gulte.com/category/movienews/feed',
    enabled: true,
  },
  {
    id: 'filmibeat-tamil',
    name: 'Filmibeat Kollywood Scoop',
    category: 'Kollywood',
    region: 'Tamil',
    url: 'https://tamil.filmibeat.com/rss/tamil-filmibeat-fb.xml',
    enabled: true,
  },
  {
    id: 'variety-film',
    name: 'Variety Film & Box Office',
    category: 'Hollywood',
    region: 'English',
    url: 'https://variety.com/v/film/feed/',
    enabled: true,
  },
  {
    id: 'tmz-entertainment',
    name: 'TMZ Celebrity Gossip',
    category: 'Exclusive Gossip',
    region: 'Global',
    url: 'https://www.tmz.com/rss.xml',
    enabled: true,
  }
];

export const CATEGORIES = [
  'All',
  'Tollywood',
  'Bollywood',
  'Kollywood',
  'Hollywood',
  'OTT Releases',
  'Box Office',
  'Exclusive Gossip',
  'Paparazzi & Style'
];

export const TARGET_LANGUAGES = [
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' }
];
