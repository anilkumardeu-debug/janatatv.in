import React from 'react';
import { 
  FileText, 
  Flame, 
  TrendingUp, 
  DollarSign, 
  Bot, 
  PenSquare, 
  Clock, 
  CheckCircle, 
  Globe,
  Radio,
  ArrowRight
} from 'lucide-react';

export default function DashboardOverview({ 
  stats, 
  articles = [], 
  onNavigate, 
  onEditArticle,
  onTriggerCrawl,
  isCrawling 
}) {
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const totalReactions = articles.reduce((acc, a) => {
    const r = a.reactions || {};
    return acc + (r.fire || 0) + (r.shock || 0) + (r.popcorn || 0);
  }, 0);

  // Simulated ad revenue estimation based on impressions & eCPM
  const estimatedRevenue = (articles.length * 12.5).toFixed(2);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            JanataTV Editorial Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time viral movie news monitoring, automated Indic translation &amp; ad monetization.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('new-article')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write New Scoop</span>
          </button>

          <button
            onClick={onTriggerCrawl}
            disabled={isCrawling}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Bot className={`w-4 h-4 text-rose-400 ${isCrawling ? 'animate-spin' : ''}`} />
            <span>{isCrawling ? 'Crawling...' : 'Trigger Radar'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Live Stories</span>
            <FileText className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-white">{articles.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {publishedCount} Published • {draftCount} Drafts
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Reader Interactions</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-400">{totalReactions}</div>
          <div className="text-[11px] text-slate-400 font-medium">
            🔥 🍿 😱 Spicy votes cast
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Languages Active</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-sky-400">4</div>
          <div className="text-[11px] text-slate-400 font-medium">
            Telugu, Hindi, Tamil, English
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Est. Ad Revenue (Mtd)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">${estimatedRevenue}</div>
          <div className="text-[11px] text-emerald-500 font-medium">
            eCPM: $2.40 (Google AdSense Ready)
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Articles & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Articles Table Preview (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Entertainment Scoops</h2>
              <p className="text-xs text-slate-400">Latest content crawled and published across languages.</p>
            </div>
            <button
              onClick={() => onNavigate('content')}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {articles.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center space-x-3 truncate">
                  <img
                    src={article.imageUrl}
                    alt={article.originalTitle}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-rose-400">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">
                        {article.viralityScore}% Buzz
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate mt-1">
                      {article.localized?.te?.title || article.originalTitle}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onEditArticle(article)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold shrink-0 transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations & Ad Revenue Setup (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Ad Revenue Quick Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Google ads.txt:</span>
                <span className="text-emerald-400 font-bold">Verified (/ads.txt)</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">High-CTR In-Article Ad:</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Mobile Sticky Anchor:</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ads')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all text-center"
            >
              Configure AdSense Settings →
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              Crawler Auto-Pilot
            </h3>
            <p className="text-xs text-slate-400">
              Scrapes 7 entertainment feeds across Tollywood &amp; Bollywood every 30 minutes.
            </p>
            <button
              onClick={() => onNavigate('crawler')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white text-xs font-bold transition-all text-center"
            >
              Open AI Crawler Radar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
