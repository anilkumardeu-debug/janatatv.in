import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function WebStoriesReel({ onSelectStory, currentLang = 'te' }) {
  const stories = [
    {
      id: 'ws-1',
      title: currentLang === 'te' ? 'అల్లు అర్జున్ పుష్ప 2 లుక్స్' : 'Allu Arjun Pushpa 2 Looks',
      category: 'Tollywood',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
      views: '1.2M'
    },
    {
      id: 'ws-2',
      title: currentLang === 'te' ? 'దీపికా పదుకొణె బేబీ అప్‌డేట్' : 'Deepika Baby First Glimpse',
      category: 'Bollywood',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop',
      views: '950K'
    },
    {
      id: 'ws-3',
      title: currentLang === 'te' ? 'ప్రభాస్ స్పిరిట్ పోలీస్ లుక్' : 'Prabhas Spirit Fierce Look',
      category: 'Exclusive',
      image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop',
      views: '2.1M'
    },
    {
      id: 'ws-4',
      title: currentLang === 'te' ? 'మహేష్ బాబు SSMB29 మేకోవర్' : 'Mahesh Babu SSMB29 Makeover',
      category: 'Tollywood',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      views: '840K'
    },
    {
      id: 'ws-5',
      title: currentLang === 'te' ? 'సమంత తాజా ఫోటోషూట్' : 'Samantha Viral Glam Shoot',
      category: 'Paparazzi',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      views: '1.5M'
    },
    {
      id: 'ws-6',
      title: currentLang === 'te' ? 'రామ్ చరణ్ గేమ్ చేంజర్ టీజర్' : 'Ram Charan Game Changer Teaser',
      category: 'Tollywood',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
      views: '1.8M'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-1">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {currentLang === 'te' ? 'వెబ్ స్టోరీస్ & రీల్స్' :
             currentLang === 'hi' ? 'वेब स्टोरीज और रील्स' :
             currentLang === 'ta' ? 'வலை கதைகள்' : 'Visual Web Stories'}
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          Tap to view • Google Discover Ready
        </span>
      </div>

      <div className="flex items-center space-x-3.5 overflow-x-auto no-scrollbar pb-2">
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="group shrink-0 cursor-pointer flex flex-col items-center w-20 sm:w-24 text-center"
          >
            {/* Story Circle with Gradient Ring */}
            <div className="relative p-[2.5px] rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-600 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-rose-950/40">
              <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-[14px] overflow-hidden bg-slate-900 relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <span className="absolute bottom-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-rose-600 text-white shadow">
                  <Play className="w-2 h-2 fill-white ml-0.5" />
                </span>

                <span className="absolute top-1 left-1 px-1 rounded bg-black/60 backdrop-blur-xs text-[8px] font-bold text-amber-300">
                  {story.views}
                </span>
              </div>
            </div>

            {/* Story Caption */}
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-amber-300 transition-colors mt-1.5 line-clamp-1 leading-tight">
              {story.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
