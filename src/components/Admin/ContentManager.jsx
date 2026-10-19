import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PenSquare, 
  Trash2, 
  ExternalLink, 
  Flame, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Globe
} from 'lucide-react';
import { deleteArticle, updateArticle } from '../../services/api';

export default function ContentManager({ 
  articles = [], 
  onEditArticle, 
  onCreateArticle, 
  onRefreshData,
  onPreviewArticle 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [displayLang, setDisplayLang] = useState('te');
  const [deletingId, setDeletingId] = useState(null);

  const categories = [
    'All', 'Tollywood', 'Bollywood', 'Kollywood', 'Hollywood', 
    'Exclusive Gossip', 'Box Office', 'Paparazzi & Style', 'OTT Releases'
  ];

  // Filtering
  const filteredArticles = articles.filter((art) => {
    const loc = art.localized?.[displayLang] || art.localized?.['en'];
    const title = loc?.title || art.originalTitle || '';
    const tags = (art.tags || []).join(' ');

    const matchesSearch = !searchTerm || 
      title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tags.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || art.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete this story:\n"${title}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteArticle(id);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await updateArticle(article.id, { status: newStatus });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Content Inventory &amp; Articles</h1>
          <p className="text-xs text-slate-400">
            Manage, edit, or publish entertainment stories and celebrity gossip.
          </p>
        </div>

        <button
          onClick={onCreateArticle}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all shrink-0"
        >
          <PenSquare className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search titles, celebrities, tags..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Language display in table */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-700 p-1 rounded-xl">
            <span className="text-slate-400 text-[10px] px-1 font-semibold">View in:</span>
            {['te', 'hi', 'ta', 'en'].map((lang) => (
              <button
                key={lang}
                onClick={() => setDisplayLang(lang)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  displayLang === lang ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Cover &amp; Story</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Virality</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 text-sm">
                    No articles match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => {
                  const loc = article.localized?.[displayLang] || article.localized?.['en'];
                  const title = loc?.title || article.originalTitle;
                  const isPublished = article.status === 'published';

                  return (
                    <tr key={article.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="px-4 py-3 max-w-md">
                        <div className="flex items-center space-x-3">
                          <img
                            src={article.imageUrl}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover shrink-0 bg-slate-950"
                          />
                          <div className="truncate">
                            <div className={`font-bold text-white text-xs truncate leading-snug hover:text-rose-400 cursor-pointer ${
                              displayLang === 'te' ? 'lang-te' : displayLang === 'hi' ? 'lang-hi' : ''
                            }`} onClick={() => onEditArticle(article)}>
                              {title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              Source: {article.sourceName} • {article.tags?.slice(0, 2).join(' ')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-rose-400 border border-rose-900/40">
                          {article.category}
                        </span>
                      </td>

                      {/* Virality */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                          <Flame className="w-3 h-3 mr-1 fill-amber-400" />
                          {article.viralityScore}%
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(article.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(article)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            isPublished
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/40 hover:bg-amber-900'
                          }`}
                          title="Click to toggle status"
                        >
                          {article.status || 'published'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onEditArticle(article)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <PenSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(article.id, title)}
                            disabled={deletingId === article.id}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
