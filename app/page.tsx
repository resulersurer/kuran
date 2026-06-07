import React from 'react';
import Link from 'next/link';
import { BookMarked, Sparkles } from 'lucide-react';
import { getSurahs } from '@/lib/quran';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContinueReadingCard from '@/components/ContinueReadingCard';
import SurahList from '@/components/SurahList';

// Fast navigation quick links
const QUICK_LINKS = [
  { id: 1, name: 'Fatiha', length: '7 Ayet' },
  { id: 2, name: 'Bakara', length: '286 Ayet' },
  { id: 36, name: 'Yâsîn', length: '83 Ayet' },
  { id: 55, name: 'Rahmân', length: '78 Ayet' },
  { id: 67, name: 'Mülk', length: '30 Ayet' }
];

export default async function HomePage() {
  const surahs = await getSurahs();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Spiritual Greeting Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-700 dark:text-brand-emerald-400 text-xs font-semibold tracking-wide border border-brand-emerald-600/10 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Huzurlu ve Sade Kuran Deneyimi</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
            Kuran-ı Kerim Meali
          </h1>
          <p className="mt-3.5 text-base md:text-lg text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Kuran-ı Kerim’i Arapça metni, Türkçe açıklaması ve sesli tilavetiyle dikkat dağıtmayan, sade bir arayüzde okuyun ve dinleyin.
          </p>
        </section>

        {/* Continue Reading Section */}
        <ContinueReadingCard />

        {/* Quick Links Section */}
        <section className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2 mb-4 font-sans">
            <BookMarked className="w-4 h-4 text-brand-emerald-600" />
            <span>Hızlı Erişim</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.id}
                href={`/surah/${link.id}`}
                className="group p-4 bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl text-center hover:border-brand-emerald-600/40 dark:hover:border-brand-emerald-500/30 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40"
              >
                <span className="block font-semibold text-sm text-slate-800 dark:text-slate-100 group-hover:text-brand-emerald-700 dark:group-hover:text-brand-emerald-400 transition-colors duration-150">
                  {link.name}
                </span>
                <span className="block text-[11px] font-sans text-slate-400 dark:text-slate-500 mt-1">
                  {link.length}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Surahs Directory */}
        <section className="animate-fade-in animate-delay-200">
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-6 font-sans">
              Sure Listesi
            </h2>
            <SurahList surahs={surahs} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
