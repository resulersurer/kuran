export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  turkishName: string;
}

export interface Ayah {
  number: number; // absolute number (1-6236)
  numberInSurah: number; // number within the surah
  text: string; // Arabic text
  translation: string; // Turkish translation
  audio?: string; // Audio stream URL
  juz: number;
  page: number;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface SearchResult {
  ayahNumber: number; // absolute number
  numberInSurah: number;
  text: string; // matching text (arabic or turkish translation)
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    turkishName: string;
  };
}

export interface ReadingPreferences {
  showArabic: boolean;
  showTranslation: boolean;
  fontSizeArabic: number; // in pixels (e.g. 24, 28, 32, 40)
  fontSizeTranslation: number; // in pixels (e.g. 14, 16, 18, 20)
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

export interface Bookmark {
  id: string; // unique key e.g. "surah-ayah"
  surahId: number;
  ayahNumber: number; // numberInSurah
  surahName: string;
  surahTurkishName: string;
  arabicText: string;
  turkishText: string;
  timestamp: number;
}

export interface LastRead {
  surahId: number;
  ayahNumber: number; // numberInSurah
  surahName: string;
  surahTurkishName: string;
  timestamp: number;
}
