import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Bot, 
  Globe, 
  Radio, 
  Tv, 
  TrendingUp,
  X,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  currentLang, 
  onSelectLang, 
  searchQuery, 
  onSearchChange, 
  onOpenAdmin,
  activeCategory,
  onSelectCategory,
  categories = []
}) {
  const [formattedDate, setFormattedDate] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setFormattedDate(now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const languages = [
    { code: 'te', label: 'తెలుగు', badge: 'AP/TS' },
    { code: 'hi', label: 'हिन्दी', badge: 'National' },
    { code: 'ta', label: 'தமிழ்', badge: 'TN' },
    { code: 'en', label: 'English', badge: 'Global' }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? 'bg-[#090d16]/95 backdrop-blur-md shadow-xl border-b border-rose-950/40' : 'bg-[#0b0f19] border-b border-slate-800'
    }`}>
      {/* Top Utility Bar */}
      <div className="bg-[#070a11] text-xs text-slate-400 border-b border-slate-800/80 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-rose-500 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1.5"></span>
              Live Wire
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">{formattedDate}</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center text-amber-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              100% Verified Indian Cinema & Gossip Radar
            </span>
          </div>

          {/* Regional Language Switcher */}
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-400 mr-1 hidden sm:inline" />
            <span className="text-slate-400 mr-1 text-[11px] font-medium hidden sm:inline">Language:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLang(l.code)}
                className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                  currentLang === l.code
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm ring-1 ring-rose-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => onSelectCategory('All')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-rose-950/50">
            <Tv className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black">
              ★
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-sm font-sans">
                JANATA<span className="text-rose-500">TV</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-[10px] font-extrabold text-rose-400 tracking-wider uppercase">
                CINEMA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {currentLang === 'te' ? 'సినిమా వార్తలు & సెలబ్రిటీ గాసిప్స్' : 
               currentLang === 'hi' ? 'मूवी न्यूज़ और सेलिब्रिटी गॉसिप' :
               currentLang === 'ta' ? 'சினிமா செய்திகள் & கிசுகிசு' :
               'Movie News & Celebrity Gossip'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentLang === 'te' ? 'స్టార్స్, సినిమాలు, గాసిప్స్ కోసం వెతకండి...' :
              currentLang === 'hi' ? 'सितारे, फिल्में, गॉसिप खोजें...' :
              currentLang === 'ta' ? 'திரைப்படங்கள் மற்றும் செய்திகளைத் தேடுங்கள்...' :
              'Search stars, movies, viral gossip...'
            }
            className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-rose-500 text-sm text-slate-100 placeholder-slate-500 rounded-full pl-10 pr-9 py-2 outline-none transition-all shadow-inner focus:ring-2 focus:ring-rose-500/20"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* AI Agent Control Room Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAdmin}
            className="group relative flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-rose-900/40 hover:to-slate-800 border border-slate-700/80 hover:border-rose-500/50 text-slate-200 hover:text-white transition-all shadow-md"
            title="Open Autonomous AI Crawler & Localization Control Room"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                AI Agent Studio
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 group-hover:text-rose-300">
                Crawler & Localizer
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-slate-800/80 bg-[#090d16] px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat === 'All' ? (currentLang === 'te' ? 'అన్నీ' : currentLang === 'hi' ? 'सभी' : currentLang === 'ta' ? 'அனைத்தும்' : 'All') : cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
