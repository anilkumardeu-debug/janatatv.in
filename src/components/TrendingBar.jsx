import React from 'react';
import { Hash, Sparkles } from 'lucide-react';

export default function TrendingBar({ tags = [], activeTag = '', onSelectTag }) {
  const defaultTags = [
    '#Pushpa2TheRule',
    '#Prabhas',
    '#DeepVeer',
    '#SSMB29',
    '#AlluArjun',
    '#BoxOfficeTsunami',
    '#SpiritMovie',
    '#BollywoodGossip'
  ];

  const displayTags = tags.length > 0 ? tags : defaultTags;

  return (
    <div className="bg-[#0e1320] border-b border-slate-800/60 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center text-amber-400 font-bold text-xs uppercase tracking-wider shrink-0 mr-1">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Trending:
        </div>
        {displayTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(activeTag === tag ? '' : tag)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold flex items-center transition-all ${
              activeTag === tag
                ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
            }`}
          >
            <Hash className="w-3 h-3 mr-0.5 opacity-70" />
            {tag.replace(/^#/, '')}
          </button>
        ))}
      </div>
    </div>
  );
}
