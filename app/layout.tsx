import type { Metadata } from "next";
import { Amiri, Inter } from "next/font/google";
import { ReadingProvider } from "@/components/ReadingContext";
import { AudioPlayerProvider } from "@/components/AudioPlayerContext";
import { AudioPlayer } from "@/components/AudioPlayer";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kuran-ı Kerim Oku - Arapça Metin, Türkçe Meal ve Sesli Dinleme",
  description: "Kuran-ı Kerim'i Arapça metni, Diyanet Türkçe meali ve Mishary Alafasy sesli dinleme seçeneği ile modern, sade ve dikkat dağıtmayan bir arayüzde okuyun.",
  keywords: ["kuran", "kuran oku", "türkçe meal", "arapça kuran", "kuran dinle", "fatiha suresi", "yasin suresi", "sureler"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${amiri.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-brand-cream-50 text-slate-800 dark:bg-brand-navy-950 dark:text-slate-100 transition-colors duration-300">
        <ReadingProvider>
          <AudioPlayerProvider>
            {children}
            <AudioPlayer />
          </AudioPlayerProvider>
        </ReadingProvider>
      </body>
    </html>
  );
}
