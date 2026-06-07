'use client';

import React, { useState } from 'react';
import { Settings, Eye, Type, AlignJustify } from 'lucide-react';
import { useReading } from './ReadingContext';

export const ReadingSettings: React.FC = () => {
  const { preferences, updatePreference, isLoaded } = useReading();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <div className="w-full bg-white dark:bg-brand-navy-card border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4 mb-6 shadow-sm transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-semibold text-sm text-slate-700 dark:text-slate-200 hover:text-brand-emerald-800 dark:hover:text-brand-emerald-400 focus:outline-none transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-emerald-600" />
          <span>Okuma Ayarları</span>
        </div>
        <span className="text-xs text-slate-400 font-normal">
          {isOpen ? 'Paneli Kapat' : 'Düzenle (Yazı Boyutu, Görünüm)'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Column 1: Visibility Toggles */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
              <Eye className="w-3.5 h-3.5" />
              <span>Görünüm Seçenekleri</span>
            </h4>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-800 dark:hover:text-white select-none">
                <span>Arapça Metin Göster</span>
                <input
                  type="checkbox"
                  checked={preferences.showArabic}
                  onChange={(e) => updatePreference('showArabic', e.target.checked)}
                  className="rounded text-brand-emerald-600 focus:ring-brand-emerald-600/40 w-4 h-4 border-slate-300 dark:border-slate-700"
                />
              </label>
              
              <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-800 dark:hover:text-white select-none">
                <span>Türkçe Meal Göster</span>
                <input
                  type="checkbox"
                  checked={preferences.showTranslation}
                  onChange={(e) => {
                    // Prevent hiding both
                    if (!e.target.checked && !preferences.showArabic) {
                      updatePreference('showArabic', true);
                    }
                    updatePreference('showTranslation', e.target.checked);
                  }}
                  className="rounded text-brand-emerald-600 focus:ring-brand-emerald-600/40 w-4 h-4 border-slate-300 dark:border-slate-700"
                />
              </label>
            </div>
          </div>

          {/* Column 2: Font Sizes */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
              <Type className="w-3.5 h-3.5" />
              <span>Yazı Boyutları</span>
            </h4>
            <div className="flex flex-col gap-3 mt-1">
              {/* Arabic Font Size */}
              {preferences.showArabic && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Arapça Boyutu:</span>
                    <span className="font-mono text-[11px] font-semibold">{preferences.fontSizeArabic}px</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[24, 28, 32, 36, 40, 44].map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreference('fontSizeArabic', size)}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md border font-mono transition-all duration-150 ${
                          preferences.fontSizeArabic === size
                            ? 'bg-brand-emerald-600 border-brand-emerald-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Translation Font Size */}
              {preferences.showTranslation && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Meal Boyutu:</span>
                    <span className="font-mono text-[11px] font-semibold">{preferences.fontSizeTranslation}px</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[14, 16, 18, 20, 22, 24].map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreference('fontSizeTranslation', size)}
                        className={`flex-1 py-1 text-[11px] font-semibold rounded-md border font-mono transition-all duration-150 ${
                          preferences.fontSizeTranslation === size
                            ? 'bg-brand-emerald-600 border-brand-emerald-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Line Spacing */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Satır Aralığı (Arapça)</span>
            </h4>
            <div className="flex gap-1.5 mt-1">
              {(['normal', 'relaxed', 'loose'] as const).map((spacing) => {
                const label = spacing === 'normal' ? 'Normal' : spacing === 'relaxed' ? 'Geniş' : 'Çok Geniş';
                return (
                  <button
                    key={spacing}
                    onClick={() => updatePreference('lineSpacing', spacing)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                      preferences.lineSpacing === spacing
                        ? 'bg-brand-emerald-600 border-brand-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReadingSettings;
