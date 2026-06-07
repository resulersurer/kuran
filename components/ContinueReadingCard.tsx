'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import { useReading } from './ReadingContext';

export const ContinueReadingCard: React.FC = () => {
  const { lastRead, isLoaded } = useReading();

  if (!isLoaded || !lastRead) {
    return null; // Don't render anything if no history or loading
  }

  // Format date relative or simple
  const dateStr = new Date(lastRead.timestamp).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="w-full animate-fade-in mb-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-emerald-700 to-brand-emerald-800 dark:from-brand-emerald-800 dark:to-brand-emerald-950/60 rounded-2xl p-6 text-white border border-brand-emerald-600/30 shadow-lg shadow-brand-emerald-700/10">
        {/* Absolute Decorative Circles */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 dark:bg-white/5 rounded-xl flex-shrink-0 mt-0.5 border border-white/10">
              <History className="w-5 h-5 text-brand-emerald-100" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-emerald-200/90 font-sans block">
                Kaldığın Yerden Devam Et
              </span>
              <h2 className="text-xl font-bold mt-0.5 tracking-wide text-white">
                {lastRead.surahTurkishName} Suresi
              </h2>
              <p className="text-xs text-brand-emerald-100/80 mt-1 font-sans">
                En son {lastRead.ayahNumber}. ayette kaldınız • {dateStr}
              </p>
            </div>
          </div>

          <Link
            href={`/surah/${lastRead.surahId}?resume=true#ayah-${lastRead.ayahNumber}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-brand-emerald-800 font-semibold text-sm rounded-xl hover:bg-brand-emerald-50 active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span>Okumaya Başla</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ContinueReadingCard;
