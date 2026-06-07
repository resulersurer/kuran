import { Surah, SurahDetail, Ayah, SearchResult } from '@/types/quran';
import { STATIC_SURAHS, OFFLINE_SURAH_DETAILS } from './quranData';

const BISMILLAH_REGEX =
  /^[\uFEFF\s]*(بِسْمِ|بسم)\s*[ٱا]للَّهِ?\s*[ٱا]لرَّحْمَٰنِ?\s*[ٱا]لرَّحِيمِ?/u;

// Helper to clean Bismillah repetition from the first verse of any Surah (except Fatiha)
export function cleanAyahText(text: string, surahNumber: number, ayahNumber: number): string {
  if (!text) return text;

  if (surahNumber === 1) return text.trim();

  if (surahNumber !== 9 && ayahNumber === 1) {
    return text.replace(BISMILLAH_REGEX, "").trim();
  }

  return text.trim();
}

// SSR-safe, error-resilient fetch wrapper
async function safeFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      console.error(`Fetch failed for URL: ${url}. Status: ${res.status}`);
      return null;
    }
    return await res.json() as T;
  } catch (error) {
    console.error(`Network or parsing error for URL: ${url}`, error);
    return null;
  }
}

export async function getSurahs(): Promise<Surah[]> {
  const url = 'https://api.alquran.cloud/v1/surah';
  const json = await safeFetch<{
    code: number;
    data: Array<{
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: 'Meccan' | 'Medinan';
    }>;
  }>(url, {
    next: { revalidate: 86400 } // Cache list of surahs for 24 hours
  });

  if (json && json.code === 200 && Array.isArray(json.data)) {
    return json.data.map((item: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: 'Meccan' | 'Medinan';
    }) => {
      const staticMatch = STATIC_SURAHS.find(s => s.number === item.number);
      return {
        number: item.number,
        name: item.name,
        englishName: item.englishName,
        englishNameTranslation: item.englishNameTranslation,
        numberOfAyahs: item.numberOfAyahs,
        revelationType: item.revelationType,
        turkishName: staticMatch ? staticMatch.turkishName : item.englishName
      };
    });
  }
  return STATIC_SURAHS;
}

export async function getSurah(id: number): Promise<SurahDetail> {
  // Use tr.vakfi (Diyanet Vakfı) to avoid repeating grouped translation texts
  const url = `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,tr.vakfi,ar.alafasy`;
  const json = await safeFetch<{
    code: number;
    data: Array<{
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: 'Meccan' | 'Medinan';
      edition?: {
        identifier: string;
        language: string;
        format: string;
      };
      ayahs: Array<{
        number: number;
        numberInSurah: number;
        text: string;
        audio?: string;
        juz: number;
        page: number;
      }>;
    }>;
  }>(url, {
    next: { revalidate: 604800 } // Cache surah content for 7 days
  });

  if (json && json.code === 200 && json.data && json.data.length >= 3) {
    const arabicEdition = json.data.find(d => d.edition?.identifier === 'quran-uthmani') || json.data[0];
    const turkishEdition = json.data.find(d => d.edition?.identifier === 'tr.vakfi') || json.data[1];
    const audioEdition = json.data.find(d => d.edition?.identifier === 'ar.alafasy') || json.data[2];

    // Build a map of Turkish translations by their numberInSurah (verse number)
    const translationsMap = new Map<number, string>(
      turkishEdition.ayahs.map((ayah: { numberInSurah: number; text: string }) => [
        ayah.numberInSurah,
        ayah.text
      ])
    );

    // Build a map of Audios by their numberInSurah
    const audiosMap = new Map<number, string>(
      audioEdition.ayahs
        .filter(ayah => !!ayah.audio)
        .map(ayah => [
          ayah.numberInSurah,
          ayah.audio!
        ])
    );

    const ayahs: Ayah[] = arabicEdition.ayahs.map((
      arabicAyah: {
        number: number;
        numberInSurah: number;
        text: string;
        juz: number;
        page: number;
      }
    ) => {
      const translation = translationsMap.get(arabicAyah.numberInSurah) ?? null;
      const audio = audiosMap.get(arabicAyah.numberInSurah) ?? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabicAyah.number}.mp3`;
      
      return {
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        text: cleanAyahText(arabicAyah.text, id, arabicAyah.numberInSurah),
        translation: translation || "Meal bulunamadı",
        audio,
        juz: arabicAyah.juz,
        page: arabicAyah.page
      };
    });

    const staticMatch = STATIC_SURAHS.find(s => s.number === arabicEdition.number);

    return {
      number: arabicEdition.number,
      name: arabicEdition.name,
      englishName: arabicEdition.englishName,
      englishNameTranslation: arabicEdition.englishNameTranslation,
      numberOfAyahs: arabicEdition.numberOfAyahs,
      revelationType: arabicEdition.revelationType,
      turkishName: staticMatch ? staticMatch.turkishName : arabicEdition.englishName,
      ayahs
    };
  }

  console.warn(`Fallback triggered for Surah ${id} due to fetch or parse failure.`);
  if (OFFLINE_SURAH_DETAILS[id]) {
    return OFFLINE_SURAH_DETAILS[id];
  }
  
  const staticMatch = STATIC_SURAHS.find(s => s.number === id);
  if (staticMatch) {
    return {
      ...staticMatch,
      ayahs: []
    };
  }
  throw new Error(`Sure verisi yüklenemedi: Surah ${id}`);
}

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  const trimmedQuery = query.trim();
  const isArabic = /[\u0600-\u06FF]/.test(trimmedQuery);
  const edition = isArabic ? 'quran-uthmani' : 'tr.vakfi';

  const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmedQuery)}/all/${edition}`;
  const json = await safeFetch<{
    code: number;
    data?: {
      count: number;
      references: Array<{
        number: number;
        numberInSurah: number;
        text: string;
        surah: {
          number: number;
          name: string;
          englishName: string;
          englishNameTranslation: string;
        };
      }>;
    };
  }>(url);

  if (json && json.code === 200 && json.data && Array.isArray(json.data.references)) {
    return json.data.references.slice(0, 30).map((ref: {
      number: number;
      numberInSurah: number;
      text: string;
      surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
      };
    }) => {
      const staticMatch = STATIC_SURAHS.find(s => s.number === ref.surah.number);
      return {
        ayahNumber: ref.number,
        numberInSurah: ref.numberInSurah,
        text: ref.text,
        surah: {
          number: ref.surah.number,
          name: ref.surah.name,
          englishName: ref.surah.englishName,
          englishNameTranslation: ref.surah.englishNameTranslation,
          turkishName: staticMatch ? staticMatch.turkishName : ref.surah.englishName
        }
      };
    });
  }

  console.warn('Search API failed or returned empty. Performing offline local search.');
  // Offline local search fallback inside available offline surahs
  const results: SearchResult[] = [];
  const queryLower = trimmedQuery.toLowerCase();
  
  Object.values(OFFLINE_SURAH_DETAILS).forEach(surah => {
    surah.ayahs.forEach(ayah => {
      const matchArabic = isArabic && ayah.text.includes(trimmedQuery);
      const matchTurkish = !isArabic && ayah.translation.toLowerCase().includes(queryLower);
      
      if (matchArabic || matchTurkish) {
        results.push({
          ayahNumber: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: isArabic ? ayah.text : ayah.translation,
          surah: {
            number: surah.number,
            name: surah.name,
            englishName: surah.englishName,
            englishNameTranslation: surah.englishNameTranslation,
            turkishName: surah.turkishName
          }
        });
      }
    });
  });
  
  return results;
}
