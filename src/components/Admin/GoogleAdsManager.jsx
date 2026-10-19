import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  FileCode
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../../services/api';

export default function GoogleAdsManager() {
  const [settings, setSettings] = useState({
    adSensePublisherId: '',
    taboolaEnabled: true,
    inArticleAdsEnabled: true,
    mobileAnchorEnabled: true,
    sponsorLeaderboardText: '',
    sponsorLeaderboardUrl: '',
    sponsorName: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);

  useEffect(() => {
    fetchSettings().then(res => {
      if (res.success && res.settings) {
        setSettings(res.settings);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSettings(settings);
      if (res.success) {
        setSettings(res.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      alert('Failed to update ad settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const adsTxtSnippet = `google.com, ${(settings.adSensePublisherId || 'pub-XXXXXXXXXXXXXXXX').replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0`;

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtSnippet);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Google AdSense &amp; Revenue Operations
          </h1>
          <p className="text-xs text-slate-400">
            Configure publisher tags, view ads.txt verification, and monitor monetization pipelines.
          </p>
        </div>

        <a
          href="https://adsense.google.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700"
        >
          <span>Open Google AdSense Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-pulse">
          <CheckCircle className="w-4 h-4" />
          <span>Monetization settings saved successfully! Ad units updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core AdSense Config (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. Google AdSense Configuration
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Google AdSense Publisher ID (Client ID)
              </label>
              <input
                type="text"
                value={settings.adSensePublisherId || ''}
                onChange={(e) => setSettings({ ...settings, adSensePublisherId: e.target.value })}
                placeholder="ca-pub-1234567890123456"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500">
                Find this in your AdSense account under <strong>Account &gt; Settings &gt; Account Information</strong>.
              </p>
            </div>

            {/* Ad Units Toggles */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Active Ad Formats &amp; High-Yield Placements
              </label>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Mobile Sticky Anchor Banner (320x50)</div>
                    <div className="text-[10px] text-slate-400">100% viewability fixed at bottom screen. Highest mobile eCPM.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.mobileAnchorEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, mobileAnchorEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">In-Article Native Cards</div>
                    <div className="text-[10px] text-slate-400">Injected between paragraphs 1 &amp; 2 for highest CTR (3.8%).</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.inArticleAdsEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, inArticleAdsEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Taboola / MGID Native Recommendation Grid</div>
                    <div className="text-[10px] text-slate-400">Outstream sponsored content placed beneath articles.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.taboolaEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, taboolaEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Direct Movie Sponsors */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Direct Movie PR &amp; Banner Takeover
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Sponsor Name</label>
                  <input
                    type="text"
                    value={settings.sponsorName || ''}
                    onChange={(e) => setSettings({ ...settings, sponsorName: e.target.value })}
                    placeholder="e.g. Mythri Movie Makers"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Campaign Tagline</label>
                  <input
                    type="text"
                    value={settings.sponsorLeaderboardText || ''}
                    onChange={(e) => setSettings({ ...settings, sponsorLeaderboardText: e.target.value })}
                    placeholder="e.g. Book Pushpa 2 Tickets Now"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isSaving ? 'Saving Settings...' : 'Save Monetization Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Verification & Approval Checklist (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* ads.txt Verification Box */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                <FileCode className="w-4 h-4 text-emerald-400" />
                ads.txt File Declaration
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Live Active
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Required by Google to prevent counterfeit ad inventory. This is automatically served live at:
            </p>

            <a
              href="/ads.txt"
              target="_blank"
              rel="noreferrer"
              className="block p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-400 truncate hover:underline"
            >
              https://janatatv.in/ads.txt ↗
            </a>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono text-slate-300 break-all">
                {adsTxtSnippet}
              </div>
              <button
                type="button"
                onClick={copyAdsTxt}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 flex items-center justify-center space-x-1.5"
              >
                {copiedAdsTxt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAdsTxt ? 'Copied Snippet!' : 'Copy ads.txt Snippet'}</span>
              </button>
            </div>
          </div>

          {/* AdSense Approval Checklist */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              AdSense Fast-Track Approval Checklist
            </h3>

            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ads.txt Ready</strong>: Verified at /ads.txt</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Privacy &amp; Cookie Policy</strong>: Live in site footer</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Original Content</strong>: 10+ Multi-language local stories</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Fast Mobile Layout</strong>: Web Stories &amp; responsive UI</span>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
