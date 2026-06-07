'use client';

import React, { useState } from 'react';
import { Play, Pause, Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react';
import { Ayah } from '@/types/quran';
import { useReading } from './ReadingContext';
import { useAudioPlayer } from './AudioPlayerContext';

interface AyahCardProps {
  ayah: Ayah;
  surahId: number;
  surahName: string;
  surahTurkishName: string;
  playlist: Ayah[];
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahId,
  surahName,
  surahTurkishName,
  playlist,
}) => {
  const { preferences, isBookmarked, addBookmark, removeBookmark, saveLastRead } = useReading();
  const { currentAyah, isPlaying, playAyah } = useAudioPlayer();
  const [copied, setCopied] = useState(false);

  const isActive = currentAyah?.number === ayah.number;
  const isBookmarkedAyah = isBookmarked(surahId, ayah.numberInSurah);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAyah(ayah, surahId, surahName, surahTurkishName, playlist);
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const bookmarkId = `${surahId}-${ayah.numberInSurah}`;
    if (isBookmarkedAyah) {
      removeBookmark(bookmarkId);
    } else {
      addBookmark({
        surahId,
        ayahNumber: ayah.numberInSurah,
        surahName,
        surahTurkishName,
        arabicText: ayah.text,
        turkishText: ayah.translation,
      });
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${surahTurkishName} Suresi ${ayah.numberInSurah}. Ayet:\n\n${ayah.text}\n\nMeal: ${ayah.translation}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCardClick = () => {
    saveLastRead(surahId, ayah.numberInSurah, surahName, surahTurkishName);
  };

  const lineSpacingClass = 
    preferences.lineSpacing === 'normal' 
      ? 'leading-relaxed' 
      : preferences.lineSpacing === 'relaxed' 
        ? 'leading-[2.2]' 
        : 'leading-[2.8]';

  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      onClick={handleCardClick}
      className={`group relative py-8 px-5 md:px-8 border-b border-slate-100 dark:border-slate-800/60 transition-all duration-300 cursor-pointer select-none ${
        isActive
          ? 'bg-brand-emerald-500/[0.04] dark:bg-brand-emerald-500/[0.03] border-brand-emerald-500/30'
          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Actions Sidebar (Desktop: vertical, Mobile: horizontal top bar) */}
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-start gap-4 w-full md:w-auto md:min-w-[70px] md:pt-1">
          {/* Verse key badge: e.g. 2:5 */}
          <span className={`text-[12px] font-bold tracking-wide font-sans md:text-center block border border-slate-200/50 dark:border-slate-850 rounded-lg px-2.5 py-1 md:py-1.5 md:w-full select-none transition-colors duration-200 ${
            isActive
              ? 'bg-brand-emerald-600 border-brand-emerald-600 text-white shadow-sm'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/35 dark:border-slate-800/35 text-slate-500 dark:text-slate-400'
          }`}>
            {surahId}:{ayah.numberInSurah}
          </span>

          {/* Action triggers */}
          <div className="flex md:flex-col items-center gap-1">
            {/* Audio playback */}
            {ayah.audio && (
              <button
                onClick={handlePlayToggle}
                className={`p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 ${
                  isActive && isPlaying
                    ? 'text-white bg-brand-emerald-600 hover:bg-brand-emerald-700'
                    : 'text-brand-emerald-600 dark:text-brand-emerald-400 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20'
                }`}
                title={isActive && isPlaying ? 'Durdur' : 'Sesli Dinle'}
              >
                {isActive && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            )}

            {/* Bookmark */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 ${
                isBookmarkedAyah
                  ? 'text-brand-gold-600 bg-brand-gold-50 dark:bg-brand-gold-950/20 hover:bg-brand-gold-100/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
              title={isBookmarkedAyah ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              {isBookmarkedAyah ? <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Copy clip */}
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 ${
                copied
                  ? 'text-brand-emerald-600 bg-brand-emerald-50 dark:bg-brand-emerald-950/20'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
              title="Ayet Kopyala"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Side content */}
        <div className="flex-grow flex flex-col gap-6 w-full">
          {/* Arabic Text */}
          {preferences.showArabic && (
            <p
              className={`arabic-text font-arabic leading-loose tracking-wide text-right select-all text-slate-800 dark:text-slate-100 ${lineSpacingClass}`}
              style={{ fontSize: `${preferences.fontSizeArabic}px` }}
            >
              {ayah.text}
            </p>
          )}

          {/* Translation Text */}
          {preferences.showTranslation && (
            <div 
              className="font-sans leading-relaxed text-slate-600 dark:text-slate-350 select-all"
              style={{ fontSize: `${preferences.fontSizeTranslation}px` }}
            >
              <p className="leading-[1.7]">{ayah.translation}</p>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mt-2.5">DİYANET VAKFI MEALİ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AyahCard;
