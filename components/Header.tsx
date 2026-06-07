'use client';

import React from 'react';
import Link from 'next/link';
import { Search, BookOpen, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useReading } from './ReadingContext';

export const Header: React.FC = () => {
  const { setSettingsOpen } = useReading();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/60 bg-white/80 dark:bg-[#080a12]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-emerald-600/15 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-wide text-slate-800 dark:text-slate-100 font-sans group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors duration-150">
            Kuran-ı Kerim
          </span>
        </Link>
 
        {/* Navigation Actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 transition-all duration-200"
            aria-label="Arama sayfasına git"
            title="Arama Yap"
          >
            <Search className="w-5 h-5" />
          </Link>
 
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 transition-all duration-200"
            aria-label="Okuma Ayarları"
            title="Okuma Ayarları"
          >
            <Settings className="w-5 h-5" />
          </button>
 
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
export default Header;
