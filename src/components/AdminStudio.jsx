import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bot, 
  RefreshCw, 
  Globe, 
  Sparkles, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle, 
  Layers, 
  Trash2, 
  ExternalLink,
  Flame,
  Radio,
  Cpu,
  DollarSign,
  Settings,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { runCrawler, localizeCustomArticle, fetchStats, fetchConfig, fetchSettings, updateSettings } from '../services/api';

export default function AdminStudio({ onClose, onDataRefresh, currentLang = 'te' }) {
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlMessage, setCrawlMessage] = useState('');
  
  // Custom Ingestion State
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [customCategory, setCustomCategory] = useState('Tollywood');
  const [isProcessingCustom, setIsProcessingCustom] = useState(false);
  // Settings State
  const [settings, setSettings] = useState(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, c, setts] = await Promise.all([fetchStats(), fetchConfig(), fetchSettings()]);
      if (s.success) setStats(s.stats);
      if (c) setConfig(c);
      if (setts.success) setSettings(setts.settings);
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await updateSettings(settings);
      if (res.success) {
        setSettings(res.settings);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (err) {
      alert('Failed to update settings: ' + err.message);
    }
  };

  const handleTriggerCrawl = async () => {
    setIsCrawling(true);
    setCrawlMessage('Autonomous Agent is crawling entertainment feeds & analyzing virality...');
    try {
      const res = await runCrawler({ limitPerSource: 3 });
      setCrawlMessage(res.message || 'Crawl and localization finished successfully!');
      await loadData();
      if (onDataRefresh) onDataRefresh();
    } catch (err) {
      setCrawlMessage(`Crawl failed: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleCustomLocalize = async (e) => {
    e.preventDefault();
    if (!customUrl && !customTitle) {
      alert('Please enter an Article URL or Title to process.');
      return;
    }

    setIsProcessingCustom(true);
    try {
      const res = await localizeCustomArticle({
        url: customUrl,
        title: customTitle,
        content: customContent,
        category: customCategory,
      });

      if (res.success && res.article) {
        setCustomResult(res.article);
        setCustomUrl('');
        setCustomTitle('');
        setCustomContent('');
        await loadData();
        if (onDataRefresh) onDataRefresh();
      }
    } catch (err) {
      alert(`Agent processing failed: ${err.message}`);
    } finally {
      setIsProcessingCustom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">JanataTV AI Agent Control Room</h2>
                <span className="flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                  AGENT ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Viral Ingestion, Gossip Synthesis & Multi-Language Transcreation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Stories</div>
              <div className="text-2xl font-black text-white mt-1">{stats?.totalArticles || 0}</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">● Real-time synced</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">Target Languages</div>
              <div className="text-2xl font-black text-rose-400 mt-1">4</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Telugu, Hindi, Tamil, Eng</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">Feed Sources</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{config?.feedSources?.length || 7}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tollywood & Bollywood</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold uppercase">Reader Reactions</div>
              <div className="text-2xl font-black text-sky-400 mt-1">{stats?.totalInteractions || 0}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">🔥 🍿 😱 Interactions</div>
            </div>
          </div>

          {/* Crawler Action Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  Live Web Ingestion & Viral Radar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fetch top entertainment wires, deduplicate stories, and run AI transcreation.
                </p>
              </div>

              <button
                onClick={handleTriggerCrawl}
                disabled={isCrawling}
                className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-rose-950/40 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
                <span>{isCrawling ? 'Agent Crawling...' : 'Trigger Full Web Crawl'}</span>
              </button>
            </div>

            {crawlMessage && (
              <div className="p-3 rounded-xl bg-slate-900 border border-rose-900/40 text-xs text-rose-200 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{crawlMessage}</span>
              </div>
            )}

            {/* Active Feed Sources Pills */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Crawler Feeds:
              </div>
              <div className="flex flex-wrap gap-2">
                {config?.feedSources?.map((feed) => (
                  <span
                    key={feed.id}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-700/80 text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                    <strong className="text-white mr-1">{feed.name}</strong>
                    <span className="text-[10px] text-slate-400">({feed.category})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Ingestion & Translation Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Custom Movie News URL / Gossip Ingestion Sandbox
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste any live article link or raw scoop to have the AI Agent crawl, rewrite, and localize it across Telugu, Hindi, Tamil, and English.
              </p>
            </div>

            <form onSubmit={handleCustomLocalize} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Article URL (Optional - agent scrapes full page automatically)
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://variety.com/... or https://www.pinkvilla.com/..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Tollywood">Tollywood</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Kollywood">Kollywood</option>
                    <option value="Hollywood">Hollywood</option>
                    <option value="Exclusive Gossip">Exclusive Gossip</option>
                    <option value="Box Office">Box Office</option>
                    <option value="Paparazzi & Style">Paparazzi & Style</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Scoop Title or Raw English Notes (If no URL provided)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Prabhas announces next project with Sandeep Vanga"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Additional Details / Body Text
                </label>
                <textarea
                  rows={2}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Paste press release or source rumors..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isProcessingCustom}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessingCustom ? 'Agent Localizing...' : 'Run Agent Transcreation'}</span>
                </button>
              </div>
            </form>

            {/* Custom Result Preview */}
            {customResult && (
              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Agent Transcreation Output (Instant Preview)
                  </span>
                  <span className="text-slate-400">{customResult.viralityScore}% Virality</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-rose-400 uppercase">Telugu Edition</div>
                    <div className="text-sm font-bold text-white mt-1 lang-te leading-snug">
                      {customResult.localized?.te?.title}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-rose-400 uppercase">Hindi Edition</div>
                    <div className="text-sm font-bold text-white mt-1 lang-hi leading-snug">
                      {customResult.localized?.hi?.title}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Monetization & Auto-Pilot Settings */}
          {settings && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Ad Monetization &amp; Auto-Pilot Crawler Settings
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure Google AdSense, native ad networks (Taboola/MGID), and custom film sponsors.
                  </p>
                </div>
                {settingsSaved && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> Saved Successfully!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google AdSense ID */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Google AdSense Publisher ID
                    </label>
                    <input
                      type="text"
                      value={settings.adSensePublisherId || ''}
                      onChange={(e) => setSettings({ ...settings, adSensePublisherId: e.target.value })}
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Replaces all ad units with your live Google AdSense tags.
                    </p>
                  </div>

                  {/* Auto-Pilot Toggle */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Auto-Pilot Ingestion Agent</div>
                      <div className="text-[10px] text-slate-400">Crawls &amp; translates new viral news every 30 mins</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoPilotCrawler || false}
                        onChange={(e) => setSettings({ ...settings, autoPilotCrawler: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                {/* Direct Sponsor Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Direct Sponsor Header Campaign Title
                    </label>
                    <input
                      type="text"
                      value={settings.sponsorLeaderboardText || ''}
                      onChange={(e) => setSettings({ ...settings, sponsorLeaderboardText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Direct Sponsor Clickout URL
                    </label>
                    <input
                      type="url"
                      value={settings.sponsorLeaderboardUrl || ''}
                      onChange={(e) => setSettings({ ...settings, sponsorLeaderboardUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>Google News Sitemap:</span>
                    <a 
                      href="/sitemap.xml" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-rose-400 hover:underline font-mono"
                    >
                      /sitemap.xml
                    </a>
                    <span>•</span>
                    <span>RSS:</span>
                    <a 
                      href="/feed.xml?lang=te" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-amber-400 hover:underline font-mono"
                    >
                      /feed.xml
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Save Monetization Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>JanataTV Cinema Agent Core v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
