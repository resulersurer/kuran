'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Compass, ArrowRight, FileText } from 'lucide-react';
import { SearchResult } from '@/types/quran';
import { searchAyahs } from '@/lib/quran';
import SearchBox from './SearchBox';

export const SearchClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState(queryParam);

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    setIsLoading(true);
    setSearchQuery(trimmed);
    setHasSearched(true);

    // Sync query parameter with URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('q', trimmed);
    router.replace(`/search?${urlParams.toString()}`);

    try {
      const searchResults = await searchAyahs(trimmed);
      setResults(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Run initial search on mount if url query is present
  useEffect(() => {
    if (queryParam && queryParam.trim().length >= 2) {
      const timerId = setTimeout(() => {
        handleSearch(queryParam.trim());
      }, 0);
      return () => clearTimeout(timerId);
    }
  }, [queryParam, handleSearch]);

  const isArabicSearch = /[\u0600-\u06FF]/.test(searchQuery);

  return (
    <div className="w-full pb-20 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wide font-sans">
          Ayet Arama
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans">
          Kuran-ı Kerim ayetleri ve Türkçe mealleri içinde arama yapın.
        </p>
      </div>

      {/* Search Bar & Tags */}
      <SearchBox onSearch={handleSearch} isLoading={isLoading} initialQuery={searchQuery} />

      {/* Results Header */}
      {hasSearched && !isLoading && (
        <div className="mt-8 mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans">
          Arama Sonuçları ({results.length} Eşleşme)
        </div>
      )}

      {/* Results / States */}
      <div className="mt-4 flex flex-col gap-4">
        {isLoading ? (
          // Search Loading Skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 animate-pulse"
            >
              <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md mb-4" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          ))
        ) : results.length > 0 ? (
          // Search Results list
          results.map((result, idx) => (
            <div
              key={`${result.ayahNumber}-${idx}`}
              className="bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col gap-3.5">
                {/* Result Info Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-brand-emerald-600" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {result.surah.turkishName} Suresi
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 font-normal">|</span>
                    <span>Ayet {result.numberInSurah}</span>
                  </div>

                  <span className="font-arabic text-sm text-brand-emerald-700 dark:text-brand-emerald-500 font-semibold">
                    {result.surah.name}
                  </span>
                </div>

                {/* Match Snippet */}
                <div className="mt-1">
                  <p
                    className={`${
                      isArabicSearch 
                        ? 'arabic-text text-right font-arabic text-2xl leading-loose select-all' 
                        : 'font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium select-all'
                    }`}
                  >
                    {result.text}
                  </p>
                </div>

                {/* Navigation Button */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/surah/${result.surah.number}?resume=true#ayah-${result.numberInSurah}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:text-brand-emerald-700 dark:hover:text-brand-emerald-300 transition-colors duration-150 focus:outline-none"
                  >
                    <span>Surede Göster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : hasSearched ? (
          // Empty State
          <div className="text-center py-16 px-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl">
            <Compass className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto stroke-1" />
            <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
              Eşleşme bulunamadı
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
              &quot;{searchQuery}&quot; araması için herhangi bir ayet veya meal metni eşleşmedi. Lütfen farklı anahtar kelimeler kullanarak tekrar arayın.
            </p>
          </div>
        ) : (
          // Landing State
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs font-sans">
            Arama yapmak için yukarıdaki kutucuğa bir arama terimi girin veya hızlı kelimelerden birini seçin.
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchClient;
