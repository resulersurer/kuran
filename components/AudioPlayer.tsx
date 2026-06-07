'use client';

import React from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, X, Volume2 } from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerContext';

export const AudioPlayer: React.FC = () => {
  const {
    currentAyah,
    currentSurahTurkishName,
    isPlaying,
    speed,
    pauseAudio,
    resumeAudio,
    stopAudio,
    setSpeed,
    playNext,
    playPrevious,
    progress,
    currentTime,
    duration,
  } = useAudioPlayer();

  if (!currentAyah) return null;

  // Format time (seconds to mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSpeedCycle = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 animate-slide-up select-none">
      <div className="max-w-4xl mx-auto bg-white/95 dark:bg-[#101524]/95 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl shadow-brand-emerald-950/[0.04] dark:shadow-brand-navy-950/40 p-4 transition-all duration-300 relative overflow-hidden">
        {/* Compact Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
          <div
            className="h-full bg-brand-emerald-600 dark:bg-brand-emerald-500 transition-all duration-150 ease-linear rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1">
          {/* Info Details */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-brand-emerald-50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-450 flex items-center justify-center flex-shrink-0 border border-brand-emerald-600/10">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                {currentSurahTurkishName} Suresi
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium font-sans mt-0.5">
                {currentAyah.numberInSurah}. Ayet • {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Central Controls */}
          <div className="flex items-center gap-3">
            {/* Previous */}
            <button
              onClick={playPrevious}
              className="p-2.5 text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-150 focus:outline-none"
              title="Önceki Ayet"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={isPlaying ? pauseAudio : resumeAudio}
              className="w-11 h-11 rounded-full bg-brand-emerald-600 hover:bg-brand-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-brand-emerald-600/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-emerald-600/40"
              title={isPlaying ? 'Duraklat' : 'Devam Et'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              className="p-2.5 text-slate-455 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-150 focus:outline-none"
              title="Sonraki Ayet"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Stop/Square */}
            <button
              onClick={stopAudio}
              className="p-2.5 text-slate-450 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-455 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-150 focus:outline-none"
              title="Durdur"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Right Speed & Close controls */}
          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            {/* Speed Control */}
            <button
              onClick={handleSpeedCycle}
              className="px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-450 font-mono transition-all duration-150 focus:outline-none"
              title="Oynatma Hızı"
            >
              {speed}x
            </button>

            {/* Close Bar */}
            <button
              onClick={stopAudio}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all duration-150 focus:outline-none"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayer;
