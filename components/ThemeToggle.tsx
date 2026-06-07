'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useReading } from './ReadingContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isLoaded } = useReading();

  if (!isLoaded) {
    return <div className="w-9 h-9 rounded-full bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40 transition-all duration-200"
      aria-label={theme === 'light' ? 'Koyu temaya geç' : 'Açık temaya geç'}
      title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-90" />
      )}
    </button>
  );
};
