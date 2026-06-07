'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Ayah } from '@/types/quran';

interface AudioPlayerContextType {
  currentAyah: Ayah | null;
  currentSurahId: number | null;
  currentSurahName: string | null;
  currentSurahTurkishName: string | null;
  isPlaying: boolean;
  speed: number;
  playAyah: (ayah: Ayah, surahId: number, surahName: string, surahTurkishName: string, playlist: Ayah[]) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setSpeed: (speed: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  progress: number;
  duration: number;
  currentTime: number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);
  const [currentSurahName, setCurrentSurahName] = useState<string | null>(null);
  const [currentSurahTurkishName, setCurrentSurahTurkishName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeedState] = useState<number>(1);
  const [playlist, setPlaylist] = useState<Ayah[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playNextRef = useRef<() => void>(() => {});

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentAyah(null);
    setCurrentSurahId(null);
    setCurrentSurahName(null);
    setCurrentSurahTurkishName(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const playAyah = useCallback((
    ayah: Ayah,
    surahId: number,
    surahName: string,
    surahTurkishName: string,
    currentPlaylist: Ayah[]
  ) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const isSameAyah = currentAyah?.number === ayah.number;

    if (isSameAyah) {
      if (audio.paused) {
        audio.play().catch(err => console.error('Audio play error', err));
      } else {
        audio.pause();
      }
      return;
    }

    setCurrentAyah(ayah);
    setCurrentSurahId(surahId);
    setCurrentSurahName(surahName);
    setCurrentSurahTurkishName(surahTurkishName);
    setPlaylist(currentPlaylist);
    
    if (ayah.audio) {
      audio.src = ayah.audio;
      audio.playbackRate = speed;
      audio.load();
      audio.play().catch(err => console.error('Audio play error', err));
    } else {
      console.warn('No audio file found for this ayah');
      stopAudio();
    }
  }, [currentAyah, speed, stopAudio]);

  const playNext = useCallback(() => {
    if (!currentAyah || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(a => a.numberInSurah === currentAyah.numberInSurah);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      const nextAyah = playlist[currentIndex + 1];
      playAyah(nextAyah, currentSurahId!, currentSurahName!, currentSurahTurkishName!, playlist);
    } else {
      stopAudio();
    }
  }, [currentAyah, playlist, currentSurahId, currentSurahName, currentSurahTurkishName, playAyah, stopAudio]);

  // Keep playNextRef updated via useEffect to prevent render mutations
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Initialize Audio element and set up event listeners once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      playNextRef.current();
    };
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && currentAyah) {
      audioRef.current.play().catch(err => console.error('Audio play error', err));
    }
  };

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const playPrevious = () => {
    if (!currentAyah || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(a => a.numberInSurah === currentAyah.numberInSurah);
    if (currentIndex > 0) {
      const prevAyah = playlist[currentIndex - 1];
      playAyah(prevAyah, currentSurahId!, currentSurahName!, currentSurahTurkishName!, playlist);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAyah,
        currentSurahId,
        currentSurahName,
        currentSurahTurkishName,
        isPlaying,
        speed,
        playAyah,
        pauseAudio,
        resumeAudio,
        stopAudio,
        setSpeed,
        playNext: () => playNextRef.current(),
        playPrevious,
        progress,
        duration,
        currentTime,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
