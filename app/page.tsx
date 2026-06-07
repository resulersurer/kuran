import React from 'react';
import { Sparkles } from 'lucide-react';
import { getSurahs } from '@/lib/quran';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContinueReadingCard from '@/components/ContinueReadingCard';
import SurahList from '@/components/SurahList';

export default async function HomePage() {
  const surahs = await getSurahs();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Spiritual Greeting Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-10 md:mb-12 animate-fade-in flex flex-col items-center">
          {/* Beautiful geometric star/emblem SVG */}
          <div className="w-16 h-16 mb-5 text-brand-emerald-600 dark:text-brand-emerald-500 hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_8px_rgba(44,165,141,0.15)]">
              <path d="M32 2C15.43 2 2 15.43 2 32c0 16.57 13.43 30 30 30 16.57 0 30-13.43 30-30C62 15.43 48.57 2 32 2zm0 54c-13.25 0-24-10.75-24-24S18.75 8 32 8s24 10.75 24 24-10.75 24-24 24z" fill="currentColor" />
              <path d="M32 12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z" fill="currentColor" opacity="0.3" />
              <path d="M32 18l3.5 6.5h7.5l-5.5 5 2 7.5-7.5-4.5-7.5 4.5 2-7.5-5.5-5h7.5L32 18z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-700 dark:text-brand-emerald-400 text-xs font-semibold tracking-wide border border-brand-emerald-600/10 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Huzurlu ve Sade Kuran Deneyimi</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
            Kuran-ı Kerim Meali
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-500 dark:text-slate-400 font-sans leading-relaxed max-w-lg">
            Kuran-ı Kerim’i Arapça metni, Türkçe açıklaması ve sesli tilavetiyle dikkat dağıtmayan, sade bir arayüzde okuyun ve dinleyin.
          </p>
        </section>

        {/* Continue Reading Section */}
        <div className="max-w-4xl mx-auto">
          <ContinueReadingCard />
        </div>

        {/* Main Surahs Directory */}
        <section className="animate-fade-in animate-delay-200 mt-6">
          <div className="border-t border-slate-200/40 dark:border-slate-800/40 pt-8">
            <SurahList surahs={surahs} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
