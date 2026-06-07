import { Surah, SurahDetail, Ayah, SearchResult } from '@/types/quran';
import { STATIC_SURAHS, OFFLINE_SURAH_DETAILS } from './quranData';

export async function getSurahs(): Promise<Surah[]> {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah', {
      next: { revalidate: 86400 } // Cache list of surahs for 24 hours
    });
    if (!res.ok) throw new Error('Failed to fetch surahs');
    const json = await res.json();
    if (json.code === 200 && Array.isArray(json.data)) {
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
  } catch (error) {
    console.warn('Using static surah list as fallback', error);
    return STATIC_SURAHS;
  }
}

export async function getSurah(id: number): Promise<SurahDetail> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,tr.diyanet,ar.alafasy`,
      { next: { revalidate: 604800 } } // Cache surah content for 7 days
    );
    if (!res.ok) throw new Error('Failed to fetch surah editions');
    const json = await res.json();
    
    if (json.code !== 200 || !json.data || json.data.length < 3) {
      throw new Error('Invalid API response structure');
    }

    const arabicEdition = json.data[0];
    const turkishEdition = json.data[1];
    const audioEdition = json.data[2];

    const ayahs: Ayah[] = arabicEdition.ayahs.map((
      arabicAyah: {
        number: number;
        numberInSurah: number;
        text: string;
        juz: number;
        page: number;
      },
      index: number
    ) => {
      const turkishAyah = turkishEdition.ayahs[index] as { text: string };
      const audioAyah = audioEdition.ayahs[index] as { audio?: string } | undefined;
      return {
        number: arabicAyah.number,
        numberInSurah: arabicAyah.numberInSurah,
        text: arabicAyah.text,
        translation: turkishAyah.text,
        audio: audioAyah?.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${arabicAyah.number}.mp3`,
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
  } catch (error) {
    console.warn(`Fallback triggered for Surah ${id} due to fetch failure:`, error);
    if (OFFLINE_SURAH_DETAILS[id]) {
      return OFFLINE_SURAH_DETAILS[id];
    }
    
    // In case they ask for a surah we don't have offline, try to generate a basic error or empty shell
    const staticMatch = STATIC_SURAHS.find(s => s.number === id);
    if (staticMatch) {
      return {
        ...staticMatch,
        ayahs: [] // Return empty list rather than crashing, page handles loading/error gracefully
      };
    }
    throw new Error(`Sure verisi yüklenemedi: ${error instanceof Error ? error.message : 'Bilinmeyen Hata'}`);
  }
}

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  const trimmedQuery = query.trim();
  const isArabic = /[\u0600-\u06FF]/.test(trimmedQuery);
  const edition = isArabic ? 'quran-uthmani' : 'tr.diyanet';

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(trimmedQuery)}/all/${edition}`
    );
    if (!res.ok) throw new Error('Search request failed');
    const json = await res.json();

    if (json.code === 200 && json.data && Array.isArray(json.data.references)) {
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
    return [];
  } catch (error) {
    console.warn('Search API failed. Performing offline local search.', error);
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
}
