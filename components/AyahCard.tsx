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

  // Line spacing class mappings
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
      className={`group relative overflow-hidden bg-white dark:bg-brand-navy-card border rounded-2xl p-5 md:p-6 transition-all duration-300 cursor-pointer select-none ${
        isActive
          ? 'border-brand-emerald-600 dark:border-brand-emerald-500 bg-brand-emerald-50/10 dark:bg-brand-emerald-950/10 shadow-lg shadow-brand-emerald-600/[0.04] ring-1 ring-brand-emerald-600/20 animate-glow'
          : 'border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Top bar: Ayah Number, Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          {/* Ayah Index Circle */}
          <div className={`w-8 h-8 rounded-lg font-mono text-[13px] font-bold flex items-center justify-center border transition-colors duration-200 ${
            isActive
              ? 'bg-brand-emerald-600 border-brand-emerald-600 text-white'
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700/60 text-slate-500 dark:text-slate-400'
          }`}>
            {ayah.numberInSurah}
          </div>

          {/* Quick Action Bar */}
          <div className="flex items-center gap-1">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/30 ${
                copied
                  ? 'text-brand-emerald-600 bg-brand-emerald-50 dark:bg-brand-emerald-950/20'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Ayet Kopyala"
            >
              {copied ? <Check className="w-4.5 h-4.5 animate-scale-up" /> : <Copy className="w-4.5 h-4.5" />}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkToggle}
              className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/30 ${
                isBookmarkedAyah
                  ? 'text-brand-gold-600 bg-brand-gold-50 dark:bg-brand-gold-950/20 hover:bg-brand-gold-100/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarkedAyah ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            >
              {isBookmarkedAyah ? <BookmarkCheck className="w-4.5 h-4.5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-4.5 h-4.5" />}
            </button>

            {/* Audio Play/Pause Button */}
            {ayah.audio && (
              <button
                onClick={handlePlayToggle}
                className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/30 ${
                  isActive && isPlaying
                    ? 'text-white bg-brand-emerald-600 hover:bg-brand-emerald-700'
                    : 'text-brand-emerald-600 dark:text-brand-emerald-400 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20'
                }`}
                title={isActive && isPlaying ? 'Durdur' : 'Sesli Dinle'}
              >
                {isActive && isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 fill-current" />}
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-4">
          {/* Arabic Verse */}
          {preferences.showArabic && (
            <p
              className={`arabic-text font-arabic leading-loose tracking-wide text-right select-all select-none text-slate-800 dark:text-slate-100 ${lineSpacingClass}`}
              style={{ fontSize: `${preferences.fontSizeArabic}px` }}
            >
              {ayah.text}
            </p>
          )}

          {/* Turkish translation */}
          {preferences.showTranslation && (
            <div 
              className="font-sans leading-relaxed text-slate-600 dark:text-slate-300 font-medium select-all"
              style={{ fontSize: `${preferences.fontSizeTranslation}px` }}
            >
              <p>{ayah.translation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AyahCard;
