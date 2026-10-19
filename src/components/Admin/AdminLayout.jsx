import React from 'react';
import { 
  Tv, 
  LayoutDashboard, 
  FileText, 
  PenSquare, 
  Bot, 
  DollarSign, 
  ExternalLink, 
  LogOut,
  Radio,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ 
  currentTab = 'dashboard', 
  onSelectTab, 
  onExitToSite,
  stats,
  children 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content Manager', icon: FileText, badge: stats?.totalArticles || 0 },
    { id: 'new-article', label: 'Write New Scoop', icon: PenSquare, highlight: true },
    { id: 'crawler', label: 'AI Crawler Radar', icon: Bot },
    { id: 'ads', label: 'Google Ads & Revenue', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-[#0b0f19] border-b border-slate-800 px-6 py-3 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-wider text-white">JANATA<span className="text-rose-500">TV</span></span>
              <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-black text-rose-300 uppercase">
                CMS CONTROL ROOM
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Editorial Studio &amp; Multi-Language Localization Engine
            </div>
          </div>
        </div>

        {/* Live Status & Exit */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-emerald-400">API Live</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{stats?.totalArticles || 0} Stories</span>
          </div>

          <button
            onClick={onExitToSite}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition-all text-xs font-bold border border-slate-700 shadow-sm"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#090d16] border-r border-slate-800/80 p-4 shrink-0 flex md:flex-col justify-between overflow-x-auto md:overflow-visible">
          <div className="space-y-1.5 w-full">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 hidden md:block">
              Editorial Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                      : item.highlight
                      ? 'bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box in Sidebar */}
          <div className="hidden md:block p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Domain:</span>
              <span className="text-rose-400 font-mono">janatatv.in</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Firebase:</span>
              <span className="text-emerald-400 font-mono">Connected</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
              <span>v1.2 Production</span>
              <span className="text-amber-400 font-semibold">Ready</span>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
