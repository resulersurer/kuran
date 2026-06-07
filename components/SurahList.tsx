'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Compass } from 'lucide-react';
import { Surah } from '@/types/quran';
import { SurahCard } from './SurahCard';

const QUICK_LINKS = [
  { id: 1, name: 'Fatiha' },
  { id: 2, name: 'Bakara' },
  { id: 36, name: 'Yâsîn' },
  { id: 55, name: 'Rahmân' },
  { id: 67, name: 'Mülk' }
];

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
      <div className="flex flex-col items-center gap-6 mb-12 max-w-2xl mx-auto select-none">
        {/* Search Input */}
        <div className="relative w-full shadow-lg shadow-brand-emerald-950/[0.03] dark:shadow-brand-navy-950/40 rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-5.5 h-5.5" />
          </div>
          <input
            type="text"
            placeholder="Sure adı veya numarası ile ara... (Örn: Fatiha, 36)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-12 py-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/60 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 focus:border-brand-emerald-600/60 dark:focus:border-brand-emerald-500/50 text-base transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium font-sans">
            Hızlı Erişim:
          </span>
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.id}
              href={`/surah/${link.id}`}
              className="px-3 py-1.5 bg-slate-100 dark:bg-brand-navy-card border border-slate-200/30 dark:border-slate-800/80 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-emerald-700 dark:hover:text-brand-emerald-400 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20 hover:border-brand-emerald-600/20 dark:hover:border-brand-emerald-500/20 transition-all duration-150 font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/20 dark:border-slate-800/20 rounded-xl mt-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 text-xs font-bold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-700 dark:text-brand-emerald-400 shadow-sm border border-slate-200/10'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Tüm Sureler
          </button>
          <button
            onClick={() => setActiveTab('meccan')}
            className={`px-5 py-2.5 text-xs font-bold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'meccan'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-700 dark:text-brand-emerald-400 shadow-sm border border-slate-200/10'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Mekki
          </button>
          <button
            onClick={() => setActiveTab('medinan')}
            className={`px-5 py-2.5 text-xs font-bold rounded-lg tracking-wide transition-all duration-200 ${
              activeTab === 'medinan'
                ? 'bg-white dark:bg-brand-navy-card text-brand-emerald-700 dark:text-brand-emerald-400 shadow-sm border border-slate-200/10'
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
