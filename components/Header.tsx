'use client';

import React from 'react';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-brand-cream-50/80 dark:bg-brand-navy-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-wide text-brand-emerald-800 dark:text-brand-emerald-500 font-sans">
            Kuran-ı Kerim
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/search"
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 transition-all duration-200"
            aria-label="Arama sayfasına git"
            title="Arama Yap"
          >
            <Search className="w-5 h-5 hover:scale-105 transition-transform duration-200" />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
export default Header;
