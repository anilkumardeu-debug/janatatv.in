import React from 'react';
import { Flame, Clock, Share2, Sparkles, MessageCircle } from 'lucide-react';

export default function HeroFeatured({ articles = [], currentLang = 'te', onSelectArticle }) {
  if (!articles || articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  const mainLoc = mainArticle.localized?.[currentLang] || mainArticle.localized?.['en'];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Mega Hero Card (8 Cols) */}
        <div 
          onClick={() => onSelectArticle(mainArticle)}
          className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer shadow-2xl cinema-glow flex flex-col justify-end min-h-[420px] md:min-h-[480px]"
        >
          {/* Background Image & Overlay */}
          <img
            src={mainArticle.imageUrl}
            alt={mainLoc?.title || mainArticle.originalTitle}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

          {/* Content Over Image */}
          <div className="relative z-10 p-5 md:p-8 space-y-3">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                {mainArticle.category}
              </span>
              <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                <Flame className="w-3.5 h-3.5 mr-1 fill-current" />
                {mainArticle.viralityScore}% Viral Buzz
              </span>
              <span className="hidden sm:inline-flex items-center text-xs text-slate-300 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(mainArticle.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-xl md:text-3xl font-extrabold text-white leading-tight group-hover:text-rose-200 transition-colors drop-shadow-md ${
              currentLang === 'te' ? 'lang-te' : currentLang === 'hi' ? 'lang-hi' : currentLang === 'ta' ? 'lang-ta' : ''
            }`}>
              {mainLoc?.title || mainArticle.originalTitle}
            </h1>

            {/* Subtitle / Teaser */}
            <p className="text-sm md:text-base text-slate-300 line-clamp-2 drop-shadow font-medium">
              {mainLoc?.subtitle || mainLoc?.tldr?.[0] || mainArticle.originalTitle}
            </p>

            {/* Bottom Actions & Reactions */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-rose-400 font-semibold">
                  🔥 {mainArticle.reactions?.fire || 120}
                </span>
                <span className="flex items-center text-amber-300 font-semibold">
                  🍿 {mainArticle.reactions?.popcorn || 80}
                </span>
                <span className="flex items-center text-sky-400 font-semibold">
                  😱 {mainArticle.reactions?.shock || 45}
                </span>
              </div>
              <span className="text-rose-400 group-hover:translate-x-1 transition-transform font-bold inline-flex items-center text-xs">
                {currentLang === 'te' ? 'పూర్తి కథనం చదవండి →' :
                 currentLang === 'hi' ? 'पूरी खबर पढ़ें →' :
                 currentLang === 'ta' ? 'மேலும் படிக்க →' : 'Read Full Scoop →'}
              </span>
            </div>
          </div>
        </div>

        {/* Side Trending Cards (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center text-rose-400">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {currentLang === 'te' ? 'టాప్ ట్రెండింగ్ గాసిప్స్' :
               currentLang === 'hi' ? 'टॉप ट्रेंडिंग गॉसिप्स' :
               currentLang === 'ta' ? 'டிரெண்டிங் செய்திகள்' : 'Trending Scoops'}
            </span>
            <span className="text-slate-500">JanataTV Hot Radar</span>
          </div>

          {sideArticles.map((art) => {
            const loc = art.localized?.[currentLang] || art.localized?.['en'];
            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group relative flex-1 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer p-4 flex flex-col justify-between shadow-lg hover:shadow-rose-950/20"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={art.imageUrl}
                    alt={loc?.title || art.originalTitle}
                    className="w-24 h-24 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-rose-400 border border-rose-900/30">
                      {art.category}
                    </span>
                    <h3 className={`text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug ${
                      currentLang === 'te' ? 'lang-te' : currentLang === 'hi' ? 'lang-hi' : currentLang === 'ta' ? 'lang-ta' : ''
                    }`}>
                      {loc?.title || art.originalTitle}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center text-amber-400 font-semibold">
                    <Flame className="w-3 h-3 mr-1" />
                    {art.viralityScore}% Buzz
                  </span>
                  <span className="text-slate-500">
                    {new Date(art.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
