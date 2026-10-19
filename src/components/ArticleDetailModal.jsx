import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Clock, 
  Globe, 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';
import { reactToArticle } from '../services/api';
import AdBanner from './AdBanner';

export default function ArticleDetailModal({ 
  article, 
  onClose, 
  initialLang = 'te',
  onArticleUpdated 
}) {
  const [activeLang, setActiveLang] = useState(initialLang);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState(article.reactions || { fire: 0, shock: 0, laugh: 0, sad: 0, popcorn: 0 });
  const [userReacted, setUserReacted] = useState({});
  const [showVariants, setShowVariants] = useState(false);

  if (!article) return null;

  const loc = article.localized?.[activeLang] || article.localized?.['en'];
  const title = loc?.title || article.originalTitle;
  const subtitle = loc?.subtitle || '';
  const tldr = loc?.tldr || [];
  const content = loc?.content || article.rawContent || '';
  const headlineVariants = loc?.headlineVariants || [];

  const languages = [
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'en', label: 'English' }
  ];

  const handleReact = async (type) => {
    if (userReacted[type]) return; // already reacted
    try {
      setUserReacted(prev => ({ ...prev, [type]: true }));
      setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
      const res = await reactToArticle(article.id, type);
      if (res.success && res.reactions) {
        setReactions(res.reactions);
        if (onArticleUpdated) {
          onArticleUpdated({ ...article, reactions: res.reactions });
        }
      }
    } catch (e) {
      console.error('Reaction error:', e);
    }
  };

  const handleCopyWhatsApp = () => {
    const text = loc?.whatsappShareText || `🔥 *JanataTV:* ${title}\n\n👉 Read more: https://janatatv.in`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const text = loc?.whatsappShareText || `🔥 *JanataTV:* ${title}\n\n👉 Read more: https://janatatv.in`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          {/* In-Article Language Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Globe className="w-4 h-4 text-rose-400 mr-1 hidden sm:inline" />
            <span className="text-xs text-slate-400 font-semibold mr-1 hidden md:inline">Read in:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setActiveLang(l.code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeLang === l.code
                    ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          {/* Cover Media */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
            <img
              src={article.imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>

            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-600 text-white shadow-lg">
                {article.category}
              </span>
              <span className="flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-lg">
                <Flame className="w-3.5 h-3.5 mr-1 fill-current" />
                {article.viralityScore}% Virality Index
              </span>
            </div>

            <div className="absolute bottom-3 left-4 text-xs text-slate-300 flex items-center space-x-3">
              <span>Source: <strong className="text-rose-400">{article.sourceName}</strong></span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Localized Article Headline & Hook */}
          <div className="space-y-3">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug ${
              activeLang === 'te' ? 'lang-te' : activeLang === 'hi' ? 'lang-hi' : activeLang === 'ta' ? 'lang-ta' : ''
            }`}>
              {title}
            </h1>

            {subtitle && (
              <p className="text-base sm:text-lg text-rose-300/90 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* 30-Second Gossip Highlights (TL;DR) */}
          {tldr.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 fill-amber-400" />
                <span>
                  {activeLang === 'te' ? '30-సెకన్ల గాసిప్ హైలైట్స్' :
                   activeLang === 'hi' ? '30-सेकंड गॉसिप हाइलाइट्स' :
                   activeLang === 'ta' ? 'முக்கிய சிறப்பம்சங்கள்' : '30-Second Gossip Highlights'}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-200">
                {tldr.map((bullet, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold shrink-0">✦</span>
                    <span className="leading-relaxed font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Story Content Paragraphs with In-Article High-CTR Ad */}
          <div className="prose prose-invert max-w-none space-y-4 text-slate-200 text-base sm:text-lg">
            {content.split('\n\n').map((paragraph, i) => (
              <React.Fragment key={i}>
                <p className={`leading-relaxed ${
                  activeLang === 'te' ? 'lang-te' : activeLang === 'hi' ? 'lang-hi' : activeLang === 'ta' ? 'lang-ta' : ''
                }`}>
                  {paragraph}
                </p>
                {/* Insert high-yield native ad after the first paragraph */}
                {i === 0 && <AdBanner type="in-article" />}
              </React.Fragment>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {article.tags.map(t => (
                <span key={t} className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-rose-300 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Interactive Spicy Reactions Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>
                {activeLang === 'te' ? 'మీ స్పందన తెలపండి:' :
                 activeLang === 'hi' ? 'आपकी क्या प्रतिक्रिया है?' :
                 activeLang === 'ta' ? 'உங்கள் கருத்து என்ன?' : 'How do you react to this scoop?'}
              </span>
              <span className="text-rose-400 text-[11px] font-semibold">Click to vote</span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              <button
                onClick={() => handleReact('fire')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  userReacted.fire 
                    ? 'bg-rose-950 border-rose-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
                }`}
              >
                <span className="text-2xl">🔥</span>
                <span className="text-[11px] font-bold text-slate-200 mt-1">Fire</span>
                <span className="text-[10px] text-rose-400 font-extrabold">{reactions.fire}</span>
              </button>

              <button
                onClick={() => handleReact('shock')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  userReacted.shock 
                    ? 'bg-sky-950 border-sky-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-sky-500/50'
                }`}
              >
                <span className="text-2xl">😱</span>
                <span className="text-[11px] font-bold text-slate-200 mt-1">Shocking</span>
                <span className="text-[10px] text-sky-400 font-extrabold">{reactions.shock}</span>
              </button>

              <button
                onClick={() => handleReact('popcorn')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  userReacted.popcorn 
                    ? 'bg-amber-950 border-amber-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <span className="text-2xl">🍿</span>
                <span className="text-[11px] font-bold text-slate-200 mt-1">Juicy</span>
                <span className="text-[10px] text-amber-400 font-extrabold">{reactions.popcorn}</span>
              </button>

              <button
                onClick={() => handleReact('laugh')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  userReacted.laugh 
                    ? 'bg-emerald-950 border-emerald-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <span className="text-2xl">😂</span>
                <span className="text-[11px] font-bold text-slate-200 mt-1">Hilarious</span>
                <span className="text-[10px] text-emerald-400 font-extrabold">{reactions.laugh}</span>
              </button>

              <button
                onClick={() => handleReact('sad')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  userReacted.sad 
                    ? 'bg-indigo-950 border-indigo-500 scale-105' 
                    : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <span className="text-2xl">💔</span>
                <span className="text-[11px] font-bold text-slate-200 mt-1">Heartbreak</span>
                <span className="text-[10px] text-indigo-400 font-extrabold">{reactions.sad}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Blast & Viral Sharing Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Share This Scoop On WhatsApp</h4>
                <p className="text-xs text-emerald-300">Formatted with fire emojis for group chats</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={handleCopyWhatsApp}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleOpenWhatsApp}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>

          {/* AI Headline Variants Inspector Toggle */}
          {headlineVariants.length > 0 && (
            <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60">
              <button
                onClick={() => setShowVariants(!showVariants)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  AI Agent Generated Headline Variants (A/B Test)
                </span>
                <span className="text-[10px] text-rose-400">{showVariants ? 'Hide' : 'Inspect'}</span>
              </button>

              {showVariants && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-800 text-xs">
                  {headlineVariants.map((variant, i) => (
                    <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-medium flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 font-mono text-[10px]">v{i+1}</span>
                      <span>{variant}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommended Stories Around the Web (Taboola / MGID Grid Ad) */}
          <AdBanner type="native-grid" />

          {/* Attribution & Legal Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 space-y-1">
            <p>
              <strong>JanataTV Cinema Disclaimer:</strong> Celebrity gossip and industry reports are aggregated from public news wires and translated by autonomous agent intelligence. Claims are attributed to industry reports and social trends.
            </p>
            {article.originalUrl && (
              <p>
                Original wire reference: <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:underline">{article.originalUrl}</a>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
