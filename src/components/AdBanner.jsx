import React from 'react';
import { Sparkles, ExternalLink, Info } from 'lucide-react';

/**
 * Standard High-Yield Ad Placements for Entertainment & Gossip Media
 * Types:
 * - 'leaderboard': 728x90 desktop, 320x50 mobile (Top of page / Below header)
 * - 'in-article': 300x250 or responsive native card (High CTR inside story content)
 * - 'sticky-footer': 320x50 mobile anchor banner (100% viewability)
 * - 'native-grid': Taboola / Outbrain style sponsored recommendations grid
 */
export default function AdBanner({ 
  type = 'leaderboard', 
  slotId = 'demo-slot', 
  sponsorName = '',
  sponsorUrl = '',
  sponsorImage = ''
}) {
  if (type === 'leaderboard') {
    return (
      <div className="max-w-7xl mx-auto px-4 my-4">
        <div className="relative w-full h-[90px] rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-between px-6 overflow-hidden shadow-lg group">
          <div className="absolute top-1 right-2 text-[9px] font-mono tracking-widest text-slate-500 uppercase flex items-center">
            <Info className="w-2.5 h-2.5 mr-0.5" /> Sponsored • 728x90 Leaderboard Slot
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-black text-sm">
              AD
            </div>
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {sponsorName || 'BookMyShow & Movie Premiere Sponsor'}
              </div>
              <div className="text-sm font-extrabold text-white">
                Book Pushpa 2 & Game Changer Theatrical Advance Tickets
              </div>
              <div className="text-[11px] text-slate-400">
                Get up to 50% cashback on JanataTV exclusive cinema coupon codes!
              </div>
            </div>
          </div>

          <a
            href={sponsorUrl || 'https://in.bookmyshow.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
          >
            <span>Book Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (type === 'in-article') {
    return (
      <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-2 right-3 text-[9px] text-amber-400/80 font-mono uppercase flex items-center">
          <Info className="w-2.5 h-2.5 mr-0.5" /> Native In-Article Ad (Highest CTR 3.8%)
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <img
            src={sponsorImage || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop"}
            alt="Sponsor"
            className="w-full sm:w-36 h-24 object-cover rounded-xl"
          />
          <div className="space-y-1.5 flex-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase">
              OTT Streaming Partner
            </span>
            <h4 className="text-sm font-bold text-white">
              Watch Unlimited South Indian Blockbusters in 4K HDR
            </h4>
            <p className="text-xs text-slate-400">
              Stream the latest Tollywood & Bollywood gossip exclusives on your TV screen.
            </p>
            <div className="pt-1">
              <a
                href={sponsorUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-bold text-rose-400 hover:text-rose-300"
              >
                Watch Trailer / Subscribe Now →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'native-grid') {
    return (
      <div className="my-8 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Recommended Stories Around The Web (Taboola / MGID Grid)
          </h4>
          <span className="text-[10px] text-slate-500 font-mono">Ads by Network</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              title: "You Won't Believe What This 90s Telugu Actress Looks Like Today!",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
              sponsor: "CinemaFlash"
            },
            {
              title: "Top 10 Most Expensive Celebrity Cars Spotted in Hyderabad This Month",
              img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=300&auto=format&fit=crop",
              sponsor: "AutoBuzz"
            },
            {
              title: "The Shocking Secret Behind This Star's Sudden Weight Loss",
              img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
              sponsor: "HealthDigest"
            },
            {
              title: "Upcoming Pan-India Blockbuster Budget Crosses ₹500 Crores",
              img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop",
              sponsor: "FilmRadar"
            }
          ].map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group block rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-2.5 transition-all shadow-md"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 mb-2">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h5 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-2 leading-tight">
                {item.title}
              </h5>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                Sponsored • {item.sponsor}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
