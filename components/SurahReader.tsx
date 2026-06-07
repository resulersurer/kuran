'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronUp, BookOpen, Settings } from 'lucide-react';
import { SurahDetail } from '@/types/quran';
import { STATIC_SURAHS } from '@/lib/quranData';
import { useReading } from './ReadingContext';
import AyahCard from './AyahCard';

interface SurahReaderProps {
  surah: SurahDetail;
}

export const SurahReader: React.FC<SurahReaderProps> = ({ surah }) => {
  const { saveLastRead, preferences, isLoaded, setSettingsOpen } = useReading();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. Save last read surah on mount
  useEffect(() => {
    saveLastRead(surah.number, 1, surah.englishName, surah.turkishName);
    
    // Smooth scroll to target ayah if hashed
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
    }
  }, [surah, saveLastRead]);

  // 2. Track scrolling for "Scroll to Top" button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous and Next surah helpers
  const prevSurah = surah.number > 1 ? STATIC_SURAHS.find(s => s.number === surah.number - 1) : null;
  const nextSurah = surah.number < 114 ? STATIC_SURAHS.find(s => s.number === surah.number + 1) : null;

  // Render Bismillah logic
  const shouldShowBismillahHeader = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="w-full relative pb-24 select-none">
      {/* Surah Header Card */}
      <div className="bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/85 rounded-3xl p-6 md:p-8 mb-8 text-center shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-emerald-600 to-brand-emerald-700 dark:from-brand-emerald-700 dark:to-brand-emerald-900" />
        
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-emerald-700 dark:text-brand-emerald-400 uppercase tracking-widest font-sans mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{surah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'} • {surah.numberOfAyahs} Ayet</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wide font-sans">
          {surah.turkishName} Suresi
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm tracking-wide mt-1 font-sans">
          {surah.englishNameTranslation} ({surah.englishName})
        </p>

        <p className="font-arabic text-3xl md:text-4xl text-brand-emerald-600 dark:text-brand-emerald-500 font-bold mt-5 tracking-wide">
          {surah.name}
        </p>
      </div>

      {/* Bismillah Header */}
      {shouldShowBismillahHeader && preferences.showArabic && (
        <div className="text-center my-8 md:my-10 animate-fade-in">
          <p className="font-arabic text-2xl md:text-3xl text-slate-850 dark:text-slate-100 leading-normal tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          {preferences.showTranslation && (
            <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-medium font-sans mt-2">
              Rahmân ve Rahîm olan Allah&apos;ın ismiyle.
            </p>
          )}
          <div className="w-16 h-0.5 bg-slate-200/50 dark:bg-slate-800/80 mx-auto mt-6 rounded-full" />
        </div>
      )}

      {/* Verses Container */}
      <div className="flex flex-col gap-0 border-y border-slate-200/40 dark:border-slate-800/40 mt-6 bg-white dark:bg-brand-navy-card rounded-3xl overflow-hidden shadow-sm">
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number}
            ayah={ayah}
            surahId={surah.number}
            surahName={surah.englishName}
            surahTurkishName={surah.turkishName}
            playlist={surah.ayahs}
          />
        ))}
        {isLoaded && surah.ayahs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Bu surenin ayetleri yüklenemedi. Lütfen internet bağlantınızı kontrol edin.</p>
          </div>
        )}
      </div>

      {/* Bottom Previous / Next Navigation */}
      <div className="mt-10 pt-8 flex items-center justify-between gap-4 font-sans">
        {prevSurah ? (
          <Link
            href={`/surah/${prevSurah.number}`}
            className="flex-1 flex items-center gap-3 p-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl hover:border-brand-emerald-600/30 dark:hover:border-brand-emerald-500/20 hover:shadow-sm transition-all duration-200 text-left focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5 text-brand-emerald-600 flex-shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Önceki Sure</span>
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 truncate mt-0.5">{prevSurah.turkishName}</span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextSurah ? (
          <Link
            href={`/surah/${nextSurah.number}`}
            className="flex-1 flex items-center justify-between gap-3 p-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl hover:border-brand-emerald-600/30 dark:hover:border-brand-emerald-500/20 hover:shadow-sm transition-all duration-200 text-right focus:outline-none"
          >
            <div className="min-w-0 flex-grow">
              <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Sonraki Sure</span>
              <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 truncate mt-0.5">{nextSurah.turkishName}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-brand-emerald-600 flex-shrink-0" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Floating Settings Gear Button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-24 right-6 sm:right-8 z-45 p-3 rounded-xl bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-lg hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40"
        title="Okuma Ayarları"
        aria-label="Okuma ayarlarını aç"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-38 right-6 sm:right-8 z-45 p-3 rounded-xl bg-brand-emerald-600 hover:bg-brand-emerald-700 text-white shadow-lg shadow-brand-emerald-600/25 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 animate-fade-in"
          title="Yukarı Çık"
          aria-label="Sayfa başına dön"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
export default SurahReader;
