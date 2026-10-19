import React from 'react';
import { Flame, Clock, Share2, MessageCircle, Heart, Bookmark } from 'lucide-react';

export default function ArticleCard({ article, currentLang = 'te', onSelectArticle, onQuickReact }) {
  const loc = article.localized?.[currentLang] || article.localized?.['en'];
  const title = loc?.title || article.originalTitle;
  const subtitle = loc?.subtitle || article.originalTitle;
  const tldrBullet = loc?.tldr?.[0] || '';

  const handleShareWhatsApp = (e) => {
    e.stopPropagation();
    const shareText = loc?.whatsappShareText || `🔥 ${title} - Read more on JanataTV: https://janatatv.in`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-rose-950/20 hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
          <img
            src={article.imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-rose-600 text-white shadow-md">
              {article.category}
            </span>
          </div>

          {/* Virality Score */}
          <div className="absolute top-3 right-3">
            <span className="flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30">
              <Flame className="w-3 h-3 mr-1 fill-amber-400" />
              {article.viralityScore}%
            </span>
          </div>

          {/* Reading Time */}
          <div className="absolute bottom-2 left-3 text-[11px] text-slate-300 flex items-center bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2.5">
          {/* Article Title */}
          <h2 className={`text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors line-clamp-2 leading-snug ${
            currentLang === 'te' ? 'lang-te font-semibold' : currentLang === 'hi' ? 'lang-hi font-semibold' : currentLang === 'ta' ? 'lang-ta' : ''
          }`}>
            {title}
          </h2>

          {/* Subtitle / TLDR Hook */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {tldrBullet || subtitle}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Reactions & WhatsApp Action */}
      <div className="px-4 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
        {/* Reactions Counter */}
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="hover:text-rose-400 transition-colors flex items-center">
            🔥 <span className="ml-1 text-[11px] font-bold">{article.reactions?.fire || 0}</span>
          </span>
          <span className="hover:text-amber-400 transition-colors flex items-center">
            🍿 <span className="ml-1 text-[11px] font-bold">{article.reactions?.popcorn || 0}</span>
          </span>
        </div>

        {/* Quick WhatsApp Share Button */}
        <button
          onClick={handleShareWhatsApp}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 hover:text-emerald-200 transition-all font-semibold text-[11px]"
          title="Share to WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
