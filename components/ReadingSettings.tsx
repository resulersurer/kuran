'use client';

import React from 'react';
import { X, Eye, Type, AlignJustify, Sun, Moon } from 'lucide-react';
import { useReading } from './ReadingContext';

export const ReadingSettings: React.FC = () => {
  const {
    preferences,
    updatePreference,
    isLoaded,
    isSettingsOpen,
    setSettingsOpen,
    theme,
    toggleTheme,
  } = useReading();

  if (!isLoaded) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${
          isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSettingsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white dark:bg-[#101524] border-l border-slate-200/50 dark:border-slate-800/80 shadow-2xl p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out select-none transform ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex-grow overflow-y-auto pr-1">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
              Okuma Ayarları
            </h3>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {/* Section: Theme */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>Arayüz Teması</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                    theme === 'light'
                      ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/20 border-brand-emerald-600 text-brand-emerald-700 dark:text-brand-emerald-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Açık Tema</span>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/20 border-brand-emerald-600 text-brand-emerald-700 dark:text-brand-emerald-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Koyu Tema</span>
                </button>
              </div>
            </div>

            {/* Section: Visibility Toggles */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                <Eye className="w-3.5 h-3.5" />
                <span>Görünüm Seçenekleri</span>
              </h4>
              <div className="flex flex-col gap-3 mt-1">
                <label className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-800 dark:hover:text-white select-none">
                  <span>Arapça Metin Göster</span>
                  <input
                    type="checkbox"
                    checked={preferences.showArabic}
                    onChange={(e) => updatePreference('showArabic', e.target.checked)}
                    className="rounded text-brand-emerald-600 focus:ring-brand-emerald-600/40 w-4.5 h-4.5 border-slate-300 dark:border-slate-700"
                  />
                </label>
                
                <label className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300 cursor-pointer hover:text-slate-800 dark:hover:text-white select-none">
                  <span>Türkçe Meal Göster</span>
                  <input
                    type="checkbox"
                    checked={preferences.showTranslation}
                    onChange={(e) => {
                      if (!e.target.checked && !preferences.showArabic) {
                        updatePreference('showArabic', true);
                      }
                      updatePreference('showTranslation', e.target.checked);
                    }}
                    className="rounded text-brand-emerald-600 focus:ring-brand-emerald-600/40 w-4.5 h-4.5 border-slate-300 dark:border-slate-700"
                  />
                </label>
              </div>
            </div>

            {/* Section: Arabic Size */}
            {preferences.showArabic && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                  <Type className="w-3.5 h-3.5" />
                  <span>Arapça Yazı Boyutu</span>
                </h4>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Yazı Boyutu:</span>
                    <span className="font-mono text-[11px] font-semibold text-brand-emerald-600 dark:text-brand-emerald-400">{preferences.fontSizeArabic}px</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {[24, 28, 32, 36, 40, 44].map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreference('fontSizeArabic', size)}
                        className={`py-2 text-xs font-bold rounded-lg border font-mono transition-all duration-150 ${
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
              </div>
            )}

            {/* Section: Translation Size */}
            {preferences.showTranslation && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                  <Type className="w-3.5 h-3.5" />
                  <span>Meal Yazı Boyutu</span>
                </h4>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Yazı Boyutu:</span>
                    <span className="font-mono text-[11px] font-semibold text-brand-emerald-600 dark:text-brand-emerald-400">{preferences.fontSizeTranslation}px</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {[14, 16, 18, 20, 22, 24].map((size) => (
                      <button
                        key={size}
                        onClick={() => updatePreference('fontSizeTranslation', size)}
                        className={`py-2 text-xs font-bold rounded-lg border font-mono transition-all duration-150 ${
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
              </div>
            )}

            {/* Section: Line Spacing */}
            {preferences.showArabic && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>Satır Aralığı (Arapça)</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['normal', 'relaxed', 'loose'] as const).map((spacing) => {
                    const label = spacing === 'normal' ? 'Normal' : spacing === 'relaxed' ? 'Geniş' : 'Çok Geniş';
                    return (
                      <button
                        key={spacing}
                        onClick={() => updatePreference('lineSpacing', spacing)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/85 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Kuran-ı Kerim Meali © 2026. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </>
  );
};
export default ReadingSettings;
