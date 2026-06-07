import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchClient from '@/components/SearchClient';

export const metadata: Metadata = {
  title: 'Kuran-ı Kerim Arama - Arapça Metin ve Türkçe Meal Arama',
  description: 'Kuran-ı Kerim ayetleri, Arapça lafızlar ve Türkçe mealler içinde arama yapın. Eşleşen ayetlerin geçtiği surelere kolayca ulaşın.',
  keywords: ['kuran arama', 'ayet arama', 'meal arama', 'kuran kelime arama', 'kuran mealinde ara'],
};

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="w-full text-center py-12 text-slate-500 dark:text-slate-400 font-sans">
            Arama motoru yükleniyor...
          </div>
        }>
          <SearchClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
