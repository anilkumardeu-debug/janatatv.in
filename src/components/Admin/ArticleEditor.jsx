import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Globe, 
  Image as ImageIcon, 
  Flame, 
  CheckCircle, 
  Eye, 
  Layers,
  MessageCircle,
  Clock
} from 'lucide-react';
import { updateArticle, createArticle, localizeCustomArticle } from '../../services/api';

export default function ArticleEditor({ 
  articleToEdit = null, 
  onSaveSuccess, 
  onCancel 
}) {
  const isEditing = Boolean(articleToEdit && articleToEdit.id);

  // Form State
  const [formData, setFormData] = useState({
    id: articleToEdit?.id || '',
    originalTitle: articleToEdit?.originalTitle || '',
    category: articleToEdit?.category || 'Tollywood',
    imageUrl: articleToEdit?.imageUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    sourceName: articleToEdit?.sourceName || 'JanataTV Editorial Desk',
    originalUrl: articleToEdit?.originalUrl || 'https://janatatv.in',
    viralityScore: articleToEdit?.viralityScore || 85,
    tagsString: (articleToEdit?.tags || ['#CinemaBuzz', '#JanataTV']).join(', '),
    status: articleToEdit?.status || 'published',
    localized: articleToEdit?.localized || {
      te: { title: '', subtitle: '', tldr: ['', '', ''], content: '', whatsappShareText: '' },
      hi: { title: '', subtitle: '', tldr: ['', '', ''], content: '', whatsappShareText: '' },
      ta: { title: '', subtitle: '', tldr: ['', '', ''], content: '', whatsappShareText: '' },
      en: { title: '', subtitle: '', tldr: ['', '', ''], content: '', whatsappShareText: '' }
    }
  });

  const [activeLangTab, setActiveLangTab] = useState('te');
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const languages = [
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'en', label: 'English' }
  ];

  const categories = [
    'Tollywood', 'Bollywood', 'Kollywood', 'Hollywood', 
    'Exclusive Gossip', 'Box Office', 'Paparazzi & Style', 'OTT Releases'
  ];

  // Helper to update localized fields
  const handleLocalizedChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      localized: {
        ...prev.localized,
        [lang]: {
          ...prev.localized[lang],
          [field]: value
        }
      }
    }));
  };

  const handleTldrChange = (lang, index, value) => {
    const currentTldr = [...(formData.localized[lang]?.tldr || ['', '', ''])];
    currentTldr[index] = value;
    handleLocalizedChange(lang, 'tldr', currentTldr);
  };

  // AI Auto-Transcreation Trigger
  const handleAutoTranslateWithAI = async () => {
    const baseTitle = formData.originalTitle || formData.localized.en?.title;
    const baseContent = formData.localized.en?.content || formData.originalTitle;
    
    if (!baseTitle) {
      alert('Please enter a Master Title or English content first to run AI translation.');
      return;
    }

    setIsTranslating(true);
    try {
      const res = await localizeCustomArticle({
        title: baseTitle,
        content: baseContent,
        category: formData.category,
        url: formData.originalUrl
      });

      if (res.success && res.article?.localized) {
        setFormData(prev => ({
          ...prev,
          localized: res.article.localized,
          viralityScore: res.article.viralityScore || prev.viralityScore,
          tagsString: (res.article.tags || []).join(', ')
        }));
        alert('AI successfully generated translations and headlines for Telugu, Hindi, Tamil, and English!');
      }
    } catch (e) {
      alert('AI translation error: ' + e.message);
    } finally {
      setIsTranslating(false);
    }
  };

  // Submit Save
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      const tags = formData.tagsString
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`);

      const payload = {
        ...formData,
        tags,
        publishedAt: formData.publishedAt || new Date().toISOString()
      };

      if (isEditing) {
        await updateArticle(formData.id, payload);
        setSaveMessage('Story successfully updated!');
      } else {
        await createArticle(payload);
        setSaveMessage('New article created and published!');
      }

      setTimeout(() => {
        if (onSaveSuccess) onSaveSuccess();
      }, 1000);
    } catch (err) {
      alert('Failed to save article: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const currentLoc = formData.localized[activeLangTab] || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isEditing ? 'Edit Entertainment Story' : 'Write & Publish New Story'}
            </h1>
            <p className="text-xs text-slate-400">
              Multi-Language Editorial Workspace (Telugu, Hindi, Tamil, English)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAutoTranslateWithAI}
            disabled={isTranslating}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
            <span>{isTranslating ? 'Translating...' : 'Auto-Translate with AI'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: Settings & Multi-Language Editor */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata & Media (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Story Configuration
            </h3>

            {/* Master English Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Master Story Title (Internal / Reference)
              </label>
              <textarea
                rows={2}
                value={formData.originalTitle}
                onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
                placeholder="e.g. Pushpa 2 Climax Leaked Sequence..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Cover Image URL & Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Cover Image URL</span>
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>

            {/* Virality Score Slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Virality Index</span>
                <span className="font-extrabold text-amber-400">{formData.viralityScore}% Buzz</span>
              </div>
              <input
                type="range"
                min="40"
                max="99"
                value={formData.viralityScore}
                onChange={(e) => setFormData({ ...formData, viralityScore: parseInt(e.target.value, 10) })}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Tags / Hashtags */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tags / Hashtags</label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="#Pushpa2, #AlluArjun, #Tollywood"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Status Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Publication Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'published' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.status === 'published'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  ● Published
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 'draft' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.status === 'draft'
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Language Content Studio (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            {/* Language Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-1.5">
                <Globe className="w-4 h-4 text-rose-400 mr-1" />
                <span className="text-xs font-bold text-slate-400 mr-2">Target Language:</span>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLangTab(l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeLangTab === l.code
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Editing: {activeLangTab.toUpperCase()}
              </span>
            </div>

            {/* Localized Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Headline ({languages.find(l => l.code === activeLangTab)?.label})
              </label>
              <textarea
                rows={2}
                value={currentLoc.title || ''}
                onChange={(e) => handleLocalizedChange(activeLangTab, 'title', e.target.value)}
                placeholder="Click-worthy headline in target language script..."
                className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-rose-500 leading-snug ${
                  activeLangTab === 'te' ? 'lang-te' : activeLangTab === 'hi' ? 'lang-hi' : ''
                }`}
              />
            </div>

            {/* Localized Subtitle / Hook */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Subtitle / Engaging Hook
              </label>
              <input
                type="text"
                value={currentLoc.subtitle || ''}
                onChange={(e) => handleLocalizedChange(activeLangTab, 'subtitle', e.target.value)}
                placeholder="One-line sensational hook..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* 30-Second Gossip Highlights (TL;DR) */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                30-Second Gossip Highlights (TL;DR Bullets)
              </label>
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-xs text-amber-400 font-bold shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={currentLoc.tldr?.[idx] || ''}
                    onChange={(e) => handleTldrChange(activeLangTab, idx, e.target.value)}
                    placeholder={`Key scoop bullet point #${idx + 1}...`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>

            {/* Full Story Content Paragraphs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Article Body Content (Multi-Paragraph)
              </label>
              <textarea
                rows={8}
                value={currentLoc.content || ''}
                onChange={(e) => handleLocalizedChange(activeLangTab, 'content', e.target.value)}
                placeholder="Detailed localized entertainment journalism..."
                className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-rose-500 ${
                  activeLangTab === 'te' ? 'lang-te' : activeLangTab === 'hi' ? 'lang-hi' : ''
                }`}
              />
              <p className="text-[10px] text-slate-500">
                Tip: Separate paragraphs with a blank line for clean mobile readability and native ad injection.
              </p>
            </div>

            {/* WhatsApp Blast Snippet */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Share Snippet (With Emojis)
              </label>
              <input
                type="text"
                value={currentLoc.whatsappShareText || ''}
                onChange={(e) => handleLocalizedChange(activeLangTab, 'whatsappShareText', e.target.value)}
                placeholder="🔥 *JanataTV:* Headline..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/50"
              >
                {isSaving ? 'Saving Article...' : 'Save & Publish Story'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
