import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BreakingTicker from './components/BreakingTicker';
import TrendingBar from './components/TrendingBar';
import HeroFeatured from './components/HeroFeatured';
import ArticleCard from './components/ArticleCard';
import ArticleDetailModal from './components/ArticleDetailModal';
import AdminLayout from './components/Admin/AdminLayout';
import DashboardOverview from './components/Admin/DashboardOverview';
import ContentManager from './components/Admin/ContentManager';
import ArticleEditor from './components/Admin/ArticleEditor';
import GoogleAdsManager from './components/Admin/GoogleAdsManager';
import AdminStudio from './components/AdminStudio';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import WebStoriesReel from './components/WebStoriesReel';
import AdBanner from './components/AdBanner';
import { fetchArticles, fetchConfig, fetchStats, runCrawler } from './services/api';
import { Flame, Film, Tv, Radio, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation / View State
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'portal';
  });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [editingArticle, setEditingArticle] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showCrawlerModal, setShowCrawlerModal] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);

  // Portal State
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('janatatv_lang') || 'te';
  });
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [categories, setCategories] = useState([
    'All',
    'Tollywood',
    'Bollywood',
    'Kollywood',
    'Hollywood',
    'OTT Releases',
    'Box Office',
    'Exclusive Gossip',
    'Paparazzi & Style'
  ]);
  const [showMobileAnchor, setShowMobileAnchor] = useState(true);

  // Save selected language
  const handleSelectLang = (code) => {
    setCurrentLang(code);
    localStorage.setItem('janatatv_lang', code);
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const [res, s] = await Promise.all([
        fetchArticles({
          category: activeCategory,
          search: searchQuery || activeTag,
          language: currentLang,
          limit: 50
        }),
        fetchStats().catch(() => null)
      ]);

      if (res.success) {
        setArticles(res.articles || []);
      }
      if (s?.success) {
        setStats(s.stats);
      }
    } catch (e) {
      console.error('Failed to load articles:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig().then(c => {
      if (c?.categories) setCategories(c.categories);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    loadArticles();
  }, [activeCategory, searchQuery, activeTag, currentLang]);

  // Handle URL change for admin
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('portal');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAdmin = () => {
    window.history.pushState({}, '', '?admin=true');
    setCurrentView('admin');
  };

  const handleExitAdmin = () => {
    window.history.pushState({}, '', window.location.pathname);
    setCurrentView('portal');
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setAdminTab('new-article');
  };

  const handleCreateNewArticle = () => {
    setEditingArticle(null);
    setAdminTab('new-article');
  };

  const handleTriggerCrawl = async () => {
    setIsCrawling(true);
    try {
      await runCrawler({ limitPerSource: 2 });
      await loadArticles();
      alert('AI Crawler successfully finished! New viral stories added to database.');
    } catch (err) {
      alert('Crawler failed: ' + err.message);
    } finally {
      setIsCrawling(false);
    }
  };

  const allTags = Array.from(new Set(articles.flatMap(a => a.tags || []))).slice(0, 8);

  const handleArticleUpdated = (updated) => {
    setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedArticle(updated);
  };

  const handleSelectTag = (tag) => {
    setActiveTag(tag);
    if (tag) setSearchQuery('');
  };

  // RENDER DEDICATED ADMIN DASHBOARD VIEW
  if (currentView === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={(tab) => {
          if (tab === 'new-article' && adminTab !== 'new-article') {
            setEditingArticle(null);
          }
          setAdminTab(tab);
        }}
        onExitToSite={handleExitAdmin}
        stats={stats}
      >
        {adminTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            articles={articles}
            onNavigate={(tab) => {
              if (tab === 'new-article') setEditingArticle(null);
              setAdminTab(tab);
            }}
            onEditArticle={handleEditArticle}
            onTriggerCrawl={handleTriggerCrawl}
            isCrawling={isCrawling}
          />
        )}

        {adminTab === 'content' && (
          <ContentManager
            articles={articles}
            onEditArticle={handleEditArticle}
            onCreateArticle={handleCreateNewArticle}
            onRefreshData={loadArticles}
            onPreviewArticle={(art) => {
              setSelectedArticle(art);
              handleExitAdmin();
            }}
          />
        )}

        {adminTab === 'new-article' && (
          <ArticleEditor
            articleToEdit={editingArticle}
            onSaveSuccess={() => {
              setEditingArticle(null);
              setAdminTab('content');
              loadArticles();
            }}
            onCancel={() => {
              setEditingArticle(null);
              setAdminTab('content');
            }}
          />
        )}

        {adminTab === 'crawler' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">AI Crawler Radar &amp; Source Feeds</h1>
                <p className="text-xs text-slate-400">
                  Monitor live RSS feeds and run autonomous transcreations across Tollywood &amp; Bollywood.
                </p>
              </div>
              <button
                onClick={handleTriggerCrawl}
                disabled={isCrawling}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg disabled:opacity-50"
              >
                {isCrawling ? 'Crawling...' : 'Run Live Ingestion Now'}
              </button>
            </div>

            <AdminStudio
              onClose={() => setAdminTab('dashboard')}
              onDataRefresh={loadArticles}
              currentLang={currentLang}
            />
          </div>
        )}

        {adminTab === 'ads' && (
          <GoogleAdsManager />
        )}
      </AdminLayout>
    );
  }

  // RENDER MAIN CONSUMER ENTERTAINMENT PORTAL
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
      {/* Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setActiveTag(''); }}
        onOpenAdmin={handleOpenAdmin}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={categories}
      />

      {/* Breaking Ticker */}
      <BreakingTicker
        articles={articles}
        currentLang={currentLang}
        onSelectArticle={setSelectedArticle}
      />

      {/* Trending Hashtags Bar */}
      <TrendingBar
        tags={allTags}
        activeTag={activeTag}
        onSelectTag={handleSelectTag}
      />

      {/* Visual Web Stories Reel (Google Discover & Story Ad Monetization) */}
      <WebStoriesReel 
        currentLang={currentLang}
        onSelectStory={(story) => {
          if (articles.length > 0) setSelectedArticle(articles[0]);
        }}
      />

      {/* Top High-Impact 728x90 Leaderboard Ad */}
      <AdBanner type="leaderboard" />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Hero Featured Section */}
        {!searchQuery && !activeTag && activeCategory === 'All' && articles.length > 0 && (
          <HeroFeatured
            articles={articles}
            currentLang={currentLang}
            onSelectArticle={setSelectedArticle}
          />
        )}

        {/* Section Heading & Grid */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-6 rounded bg-rose-600 inline-block"></span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                {activeTag ? `Tagged: ${activeTag}` :
                 searchQuery ? `Search: "${searchQuery}"` :
                 activeCategory === 'All' 
                   ? (currentLang === 'te' ? 'తాజా సినిమా విశేషాలు & గాసిప్స్' :
                      currentLang === 'hi' ? 'ताजा सिनेमा और वायरल गॉसिप्स' :
                      currentLang === 'ta' ? 'சமீபத்திய சினிமா செய்திகள்' : 'Latest Cinema Scoops & Gossips')
                   : `${activeCategory}`}
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-rose-400">{articles.length}</span> Stories
              <button 
                onClick={loadArticles} 
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1"
                title="Refresh Feed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[16/9] bg-slate-800 rounded-xl"></div>
                  <div className="h-5 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-800 rounded w-full"></div>
                  <div className="h-3 bg-slate-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm">No stories found for the selected criteria.</p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); setActiveTag(''); }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {articles.map((article, idx) => (
                <React.Fragment key={article.id}>
                  <ArticleCard
                    article={article}
                    currentLang={currentLang}
                    onSelectArticle={setSelectedArticle}
                  />
                  {/* High-conversion In-Feed Native Ad Unit */}
                  {idx === 2 && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <AdBanner type="leaderboard" sponsorName="JioCinema & Aha Video Partner" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#070a11] border-t border-slate-800/80 py-10 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-sm">
                JTV
              </div>
              <span className="text-lg font-black text-white tracking-wider">JANATA<span className="text-rose-500">TV</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              India's premier AI-powered movie news and celebrity gossip radar. Delivering breaking news in Telugu, Hindi, Tamil, and English.
            </p>
            <div className="pt-1">
              <button
                onClick={handleOpenAdmin}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-300 hover:text-white font-bold text-[11px]"
              >
                🔑 Open Admin CMS &amp; Editor
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5">Languages</h4>
            <div className="flex flex-col space-y-1.5">
              <button onClick={() => handleSelectLang('te')} className="text-left hover:text-rose-400">తెలుగు (Telugu Cinema)</button>
              <button onClick={() => handleSelectLang('hi')} className="text-left hover:text-rose-400">हिन्दी (Bollywood & Hindi)</button>
              <button onClick={() => handleSelectLang('ta')} className="text-left hover:text-rose-400">தமிழ் (Kollywood & Tamil)</button>
              <button onClick={() => handleSelectLang('en')} className="text-left hover:text-rose-400">English (Global Edition)</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5">Monetization &amp; Links</h4>
            <div className="flex flex-col space-y-1.5">
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-amber-400">Google News Sitemap (/sitemap.xml)</a>
              <a href="/ads.txt" target="_blank" rel="noreferrer" className="hover:text-amber-400">Authorized Sellers (/ads.txt)</a>
              <a href="/feed.xml?lang=te" target="_blank" rel="noreferrer" className="hover:text-amber-400">Multilingual RSS Feed</a>
              <button onClick={() => setShowPrivacyPolicy(true)} className="text-left hover:text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy &amp; Cookie Policy (AdSense)</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2.5">Legal &amp; Attribution</h4>
            <p className="text-slate-500 leading-relaxed">
              © {new Date().getFullYear()} JanataTV Media Network. All trademarks and celebrity images belong to their respective copyright holders.
            </p>
          </div>
        </div>
      </footer>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          initialLang={currentLang}
          onArticleUpdated={handleArticleUpdated}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* Sticky Mobile Bottom Anchor Banner (100% Viewability & Guaranteed High CPM) */}
      {showMobileAnchor && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-rose-900/50 p-2 sm:hidden backdrop-blur-md shadow-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-[9px] font-black text-white">AD</span>
            <div className="text-xs text-white font-bold truncate max-w-[210px]">
              Pushpa 2 Theatrical Advance Tickets Live!
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href="https://in.bookmyshow.com" 
              target="_blank" 
              rel="noreferrer" 
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-extrabold"
            >
              Book
            </a>
            <button 
              onClick={() => setShowMobileAnchor(false)} 
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
