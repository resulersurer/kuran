import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSurah } from '@/lib/quran';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SurahReader from '@/components/SurahReader';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const surahId = parseInt(id, 10);
  
  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return {
      title: 'Sure Bulunamadı - Kuran-ı Kerim',
    };
  }

  try {
    const surah = await getSurah(surahId);
    return {
      title: `${surah.turkishName} Suresi Oku - Arapça ve Türkçe Meal`,
      description: `${surah.turkishName} Suresi Arapça metni, Türkçe meali ve Mishary Alafasy sesli okuma deneyimi.`,
      keywords: [
        `${surah.turkishName} suresi`,
        `${surah.turkishName} suresi oku`,
        `${surah.turkishName} meali`,
        `${surah.turkishName} arapça`,
        'kuran oku'
      ],
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Sure Oku - Kuran-ı Kerim',
    };
  }
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound();
  }

  let surah;
  try {
    surah = await getSurah(surahId);
  } catch (error) {
    console.error(`Error loading surah page ${surahId}:`, error);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SurahReader surah={surah} />
      </main>

      <Footer />
    </div>
  );
}
