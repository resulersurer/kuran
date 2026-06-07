import React from 'react';
import Link from 'next/link';
import { Surah } from '@/types/quran';

interface SurahCardProps {
  surah: Surah;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah }) => {
  const isMekki = surah.revelationType === 'Meccan';
  const typeText = isMekki ? 'Mekki' : 'Medeni';

  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group block relative overflow-hidden bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 hover:border-brand-emerald-600/40 dark:hover:border-brand-emerald-500/30 hover:shadow-lg hover:shadow-brand-emerald-600/[0.02] dark:hover:shadow-brand-emerald-500/[0.01] hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald-50/0 via-transparent to-brand-emerald-50/15 dark:to-brand-emerald-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4">
        {/* Left Side: Index & Names */}
        <div className="flex items-center gap-4.5">
          {/* Geometric Islamic Star Badge */}
          <div className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center font-bold text-xs select-none">
            <div className="absolute inset-0.5 bg-slate-100 dark:bg-slate-800/60 rotate-45 rounded-md transition-all duration-300 group-hover:bg-brand-emerald-100/30 dark:group-hover:bg-brand-emerald-950/20 group-hover:rotate-90" />
            <div className="absolute inset-0.5 bg-slate-100 dark:bg-slate-800/60 rounded-md transition-all duration-300 group-hover:bg-brand-emerald-100/30 dark:group-hover:bg-brand-emerald-950/20 group-hover:rotate-45" />
            <span className="relative z-10 text-slate-500 dark:text-slate-400 group-hover:text-brand-emerald-700 dark:group-hover:text-brand-emerald-400 transition-colors duration-300 font-mono">
              {surah.number}
            </span>
          </div>
          
          <div>
            <h3 className="font-bold text-[16px] text-slate-800 dark:text-slate-100 group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors duration-200">
              {surah.turkishName}
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 tracking-wide block mt-0.5">
              {surah.englishNameTranslation}
            </span>
          </div>
        </div>

        {/* Right Side: Arabic Name & Details */}
        <div className="text-right flex flex-col items-end gap-1">
          <p className="font-arabic text-xl text-slate-800 dark:text-slate-200 font-bold tracking-normal group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-all duration-300">
            {surah.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] font-sans tracking-wide">
            <span className="text-slate-400 dark:text-slate-500">
              {surah.numberOfAyahs} Ayet
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isMekki 
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/5' 
                : 'bg-emerald-50 dark:bg-brand-emerald-950/20 text-brand-emerald-600 dark:text-brand-emerald-400 border border-brand-emerald-200/5'
            }`}>
              {typeText}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default SurahCard;
