import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 bg-brand-cream-100/30 dark:bg-brand-navy-950/40 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-sans tracking-wide">
          Kuran-ı Kerim Okuma Uygulaması
        </p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-sans">
          Veriler açık kaynaklı Al Quran Cloud API ve Diyanet İşleri Meali kullanılarak sunulmaktadır.
        </p>
        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <span>Huzurlu Okumalar Dileriz</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
