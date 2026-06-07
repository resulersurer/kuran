'use client';

import React, { useState } from 'react';
import { Search, X, MessageSquareQuote } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const POPULAR_SEARCHES = ['iman', 'namaz', 'cennet', 'rahmet', 'dua', 'sabır'];

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      onSearch(query.trim());
    }
  };

  const handleQuickSearch = (tag: string) => {
    setQuery(tag);
    onSearch(tag);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Arapça metin veya Türkçe meal içinde ara... (En az 2 harf)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 focus:border-brand-emerald-600/60 dark:focus:border-brand-emerald-500/50 disabled:opacity-70 transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || query.trim().length < 2}
          className="px-6 py-3.5 bg-brand-emerald-600 hover:bg-brand-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 font-semibold text-sm rounded-xl transition-all duration-200 shadow-md shadow-brand-emerald-600/10 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40"
        >
          {isLoading ? 'Aranıyor...' : 'Arama Yap'}
        </button>
      </form>

      {/* Popular searches tag bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-sans">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Hızlı Aramalar:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickSearch(tag)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-brand-emerald-700 dark:hover:text-brand-emerald-400 border border-slate-200/10 dark:border-slate-800/20 text-[11px] font-medium transition-all duration-150"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchBox;
