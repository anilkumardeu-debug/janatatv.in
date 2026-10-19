/**
 * Virality, Gossip Buzz Scoring and Deduplication Engine
 */

const VIRAL_SENSATIONAL_KEYWORDS = [
  'shocking', 'breakup', 'leaked', 'remuneration', 'blockbuster', 'fight',
  'spotted', 'record', 'clash', 'trolled', 'viral', 'wedding', 'pregnant',
  'divorce', 'insider', 'exclusive', 'salary', 'scandal', 'teaser', 'trailer',
  'box office', 'first look', 'date night', 'rumors', 'confirms', 'drops out'
];

const TIER_1_CELEBS = [
  'prabhas', 'allu arjun', 'ram charan', 'jr ntr', 'mahesh babu', 'pawan kalyan',
  'shah rukh khan', 'srk', 'salman khan', 'aamir khan', 'ranbir kapoor',
  'deepika padukone', 'alia bhatt', 'katrina kaif', 'samantha', 'rashmika',
  'thalapathy vijay', 'ajith', 'rajinikanth', 'kamal haasan', 'yash', 'suriya',
  'nayanthara', 'trisha', 'kiara advani', 'shraddha kapoor'
];

/**
 * Calculate Virality Score (0-100)
 */
export function calculateViralityScore(title = '', text = '') {
  let score = 50; // baseline
  const combined = `${title} ${text}`.toLowerCase();

  // Keyword sensation check
  let keywordMatches = 0;
  for (const kw of VIRAL_SENSATIONAL_KEYWORDS) {
    if (combined.includes(kw)) {
      keywordMatches++;
    }
  }
  score += Math.min(keywordMatches * 8, 30);

  // Celebrity tier boost
  for (const celeb of TIER_1_CELEBS) {
    if (combined.includes(celeb)) {
      score += 15;
      break;
    }
  }

  // Cap between 40 and 99
  return Math.min(Math.max(score, 40), 99);
}

/**
 * Extract Celebrity Entities & Trending Tags
 */
export function extractCelebrityTags(title = '', text = '') {
  const combined = `${title} ${text}`.toLowerCase();
  const foundTags = new Set();

  const celebMap = {
    'prabhas': '#Prabhas',
    'kalki': '#Kalki2898AD',
    'spirit': '#SpiritMovie',
    'allu arjun': '#AlluArjun',
    'pushpa': '#Pushpa2TheRule',
    'ram charan': '#RamCharan',
    'game changer': '#GameChanger',
    'jr ntr': '#JrNTR',
    'devara': '#Devara',
    'mahesh babu': '#MaheshBabu',
    'ssmb29': '#SSMB29',
    'shah rukh': '#ShahRukhKhan',
    'srk': '#KingKhan',
    'salman': '#SalmanKhan',
    'deepika': '#DeepikaPadukone',
    'alia': '#AliaBhatt',
    'samantha': '#SamanthaRuthPrabhu',
    'rashmika': '#RashmikaMandanna',
    'vijay': '#ThalapathyVijay',
    'rajinikanth': '#Rajinikanth',
    'box office': '#BoxOfficeCollection',
    'ott': '#OTTRelease',
    'exclusive': '#ExclusiveGossip'
  };

  for (const [key, tag] of Object.entries(celebMap)) {
    if (combined.includes(key)) {
      foundTags.add(tag);
    }
  }

  if (foundTags.size === 0) {
    foundTags.add('#CinemaBuzz');
    foundTags.add('#ViralGossip');
  }

  return Array.from(foundTags).slice(0, 5);
}

/**
 * Deduplicate and cluster raw feed items by title token similarity
 */
export function clusterAndDeduplicate(items = []) {
  const clusters = [];
  
  for (const item of items) {
    const itemTokens = tokenize(item.title);
    let matchedCluster = null;

    for (const cluster of clusters) {
      const clusterTokens = tokenize(cluster.master.title);
      const similarity = jaccardSimilarity(itemTokens, clusterTokens);

      if (similarity > 0.45) {
        matchedCluster = cluster;
        break;
      }
    }

    if (matchedCluster) {
      matchedCluster.relatedSources.push({
        sourceName: item.sourceName,
        link: item.link,
      });
    } else {
      clusters.push({
        master: item,
        relatedSources: [{ sourceName: item.sourceName, link: item.link }]
      });
    }
  }

  return clusters.map(c => ({
    ...c.master,
    sourcesCount: c.relatedSources.length,
    relatedSources: c.relatedSources
  }));
}

function tokenize(text = '') {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
}

function jaccardSimilarity(setA, setB) {
  if (!setA.size || !setB.size) return 0;
  let intersection = 0;
  for (const elem of setA) {
    if (setB.has(elem)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
