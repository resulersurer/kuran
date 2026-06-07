'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReadingPreferences, Bookmark, LastRead } from '@/types/quran';
import { getJsonStorageItem, setJsonStorageItem, safeLocalStorage } from '@/lib/storage';

interface ReadingContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  preferences: ReadingPreferences;
  updatePreference: <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => void;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  lastRead: LastRead | null;
  saveLastRead: (surahId: number, ayahNumber: number, surahName: string, surahTurkishName: string) => void;
  isLoaded: boolean; // Tells components when localStorage has been read
}

const defaultPreferences: ReadingPreferences = {
  showArabic: true,
  showTranslation: true,
  fontSizeArabic: 32,
  fontSizeTranslation: 16,
  lineSpacing: 'relaxed',
};

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const ReadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [preferences, setPreferences] = useState<ReadingPreferences>(defaultPreferences);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (prevents hydration mismatch)
  useEffect(() => {
    const init = () => {
      // 1. Theme
      const savedTheme = safeLocalStorage.getItem('quran-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme === 'dark' || (savedTheme === null && prefersDark) ? 'dark' : 'light';
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 2. Preferences
      const savedPrefs = getJsonStorageItem<ReadingPreferences>('quran-preferences', defaultPreferences);
      setPreferences(savedPrefs);

      // 3. Bookmarks
      const savedBookmarks = getJsonStorageItem<Bookmark[]>('quran-bookmarks', []);
      setBookmarks(savedBookmarks);

      // 4. Last Read
      const savedLastRead = getJsonStorageItem<LastRead | null>('quran-last-read', null);
      setLastRead(savedLastRead);

      setIsLoaded(true);
    };

    // Defer initialization to avoid synchronous state warnings during effect run
    const timerId = setTimeout(init, 0);
    return () => clearTimeout(timerId);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    safeLocalStorage.setItem('quran-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updatePreference = <K extends keyof ReadingPreferences>(key: K, value: ReadingPreferences[K]) => {
    const nextPrefs = { ...preferences, [key]: value };
    setPreferences(nextPrefs);
    setJsonStorageItem('quran-preferences', nextPrefs);
  };

  const addBookmark = (newBookmark: Omit<Bookmark, 'id' | 'timestamp'>) => {
    const id = `${newBookmark.surahId}-${newBookmark.ayahNumber}`;
    // Avoid duplicates
    if (bookmarks.some(b => b.id === id)) return;

    const bookmark: Bookmark = {
      ...newBookmark,
      id,
      timestamp: Date.now(),
    };
    const nextBookmarks = [bookmark, ...bookmarks];
    setBookmarks(nextBookmarks);
    setJsonStorageItem('quran-bookmarks', nextBookmarks);
  };

  const removeBookmark = (id: string) => {
    const nextBookmarks = bookmarks.filter(b => b.id !== id);
    setBookmarks(nextBookmarks);
    setJsonStorageItem('quran-bookmarks', nextBookmarks);
  };

  const isBookmarked = (surahId: number, ayahNumber: number): boolean => {
    return bookmarks.some(b => b.surahId === surahId && b.ayahNumber === ayahNumber);
  };

  const saveLastRead = (surahId: number, ayahNumber: number, surahName: string, surahTurkishName: string) => {
    const nextLastRead: LastRead = {
      surahId,
      ayahNumber,
      surahName,
      surahTurkishName,
      timestamp: Date.now(),
    };
    setLastRead(nextLastRead);
    setJsonStorageItem('quran-last-read', nextLastRead);
  };

  return (
    <ReadingContext.Provider
      value={{
        theme,
        toggleTheme,
        preferences,
        updatePreference,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        lastRead,
        saveLastRead,
        isLoaded,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
};
