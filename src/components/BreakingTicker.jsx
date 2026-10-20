import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight, Zap } from 'lucide-react';

export default function BreakingTicker({ articles = [], currentLang = 'te', onSelectArticle }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!articles || articles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  const currentItem = articles[currentIndex];
  const localized = currentItem?.localized?.[currentLang] || currentItem?.localized?.['en'];
  const title = localized?.title || currentItem?.originalTitle;

  return (
    <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-[#0b0f19] border-y border-rose-900/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold uppercase tracking-wide shadow-sm animate-pulse-fast text-[11px]">
            <Zap className="w-3 h-3 mr-1 fill-white" />
            {currentLang === 'te' ? 'హాట్ బ్రేకింగ్' :
             currentLang === 'hi' ? 'ब्रेकिंग गॉसिप' :
             currentLang === 'ta' ? 'பரபரப்பு' : 'BREAKING'}
          </span>
          <span className="text-rose-400 font-bold hidden sm:inline">
            #{currentIndex + 1}/{articles.length}
          </span>
        </div>

        {/* Ticker Text */}
        <div 
          onClick={() => onSelectArticle(currentItem)}
          className="flex-1 overflow-hidden cursor-pointer group flex items-center"
        >
          <span className={`truncate text-slate-200 group-hover:text-amber-300 font-medium transition-colors ${
            currentLang === 'te' ? 'lang-te' : currentLang === 'hi' ? 'lang-hi' : currentLang === 'ta' ? 'lang-ta' : ''
          }`}>
            {title}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0" />
        </div>

        {/* Live Update Tag */}
        <div className="hidden md:flex items-center space-x-1.5 text-slate-300 font-medium text-[11px] shrink-0 bg-slate-900/80 px-2.5 py-0.5 rounded border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <span>Live Wire Update</span>
        </div>
      </div>
    </div>
  );
}
