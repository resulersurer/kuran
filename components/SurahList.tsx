'use client';

import React, { useState, useMemo } from 'react';
import { Search, Compass } from 'lucide-react';
import { Surah } from '@/types/quran';
import { SurahCard } from './SurahCard';

interface SurahListProps {
  surahs: Surah[];
}

type TabType = 'all' | 'meccan' | 'medinan';

export const SurahList: React.FC<SurahListProps> = ({ surahs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredSurahs = useMemo(() => {
    return surahs.filter(surah => {
      // 1. Search Query Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        surah.turkishName.toLowerCase().includes(q) ||
        surah.englishName.toLowerCase().includes(q) ||
        surah.englishNameTranslation.toLowerCase().includes(q) ||
        surah.number.toString() === q;

      // 2. Tab Filter
      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'meccan') return matchesSearch && surah.revelationType === 'Meccan';
      if (activeTab === 'medinan') return matchesSearch && surah.revelationType === 'Medinan';
      
      return matchesSearch;
    });
  }, [surahs, searchQuery, activeTab]);

  return (
    <div className="w-full">
      {/* Search & Tabs Controls */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Sure adı veya numarası ile ara... (Örn: Fatiha, 36)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 focus:border-brand-emerald-600/60 dark:focus:border-brand-emerald-500/50 shadow-sm transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/40 dark:bg-slate-900/60 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-800 dark:text-brand-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tüm Sureler
          </button>
          <button
            onClick={() => setActiveTab('meccan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'meccan'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-800 dark:text-brand-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Mekki
          </button>
          <button
            onClick={() => setActiveTab('medinan')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'medinan'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-800 dark:text-brand-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Medeni
          </button>
        </div>
      </div>

      {/* Grid List */}
      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
          <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
            Sure bulunamadı
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
            Arama kriterlerine uygun sure bulunamadı. Lütfen yazımı kontrol edin veya başka bir anahtar kelime deneyin.
          </p>
        </div>
      )}
    </div>
  );
};
export default SurahList;
