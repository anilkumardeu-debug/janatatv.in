import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Globe, 
  Radio, 
  Tv, 
  TrendingUp,
  X,
  Film,
  Sparkles,
  Lock
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
  const [showAdminBtn, setShowAdminBtn] = useState(false);

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

    // Only show Admin Desk button if ?admin=true or previously logged in
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('admin') === 'true' || localStorage.getItem('janatatv_admin_logged')) {
        setShowAdminBtn(true);
      }
    }

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
      {/* Top Professional Media Utility Bar */}
      <div className="bg-[#070a11] text-xs text-slate-400 border-b border-slate-800/80 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="inline-flex items-center text-rose-500 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1.5"></span>
              Live Wire
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 font-medium">{formattedDate}</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline-flex items-center text-slate-300">
              <Film className="w-3 h-3 mr-1 text-rose-500" />
              Hyderabad • Mumbai • Chennai • Box Office &amp; Industry Wire
            </span>
          </div>

          {/* Regional Language Switcher */}
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-400 mr-1 hidden sm:inline" />
            <span className="text-slate-400 mr-1 text-[11px] font-medium hidden sm:inline">Edition:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLang(l.code)}
                className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                  currentLang === l.code
                    ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={`Switch to ${l.label} Edition`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo - Sleek, Authoritative Media Brand */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => onSelectCategory('All')}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-950/50">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-sm font-sans">
                JANATA<span className="text-rose-500">TV</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[9px] font-extrabold text-rose-400 tracking-wider uppercase">
                ENTERTAINMENT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {currentLang === 'te' ? 'ఇండియన్ సినిమా తాజా వార్తలు & బాక్సాఫీస్ రిపోర్ట్స్' : 
               currentLang === 'hi' ? 'भारतीय सिनेमा, बॉक्स ऑफिस और मनोरंजन' :
               currentLang === 'ta' ? 'இந்திய சினிமா & பாக்ஸ் ஆபீஸ் செய்திகள்' :
               'Indian Cinema, Box Office & Entertainment News'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentLang === 'te' ? 'సినిమాలు, హీరోలు, బాక్సాఫీస్ కోసం వెతకండి...' :
              currentLang === 'hi' ? 'फिल्में, अभिनेता, बॉक्स ऑफिस खोजें...' :
              currentLang === 'ta' ? 'திரைப்படங்கள் மற்றும் செய்திகளைத் தேடுங்கள்...' :
              'Search films, stars, box office reports...'
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

        {/* Right Actions: Trending Tag or Admin Access (Only if admin query) */}
        <div className="flex items-center space-x-2">
          {showAdminBtn && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold shadow-sm"
              title="Open Editorial CMS & Crawler"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Desk</span>
            </button>
          )}

          <div className="hidden lg:flex items-center text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            <span>24/7 Cinema Wire</span>
          </div>
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
