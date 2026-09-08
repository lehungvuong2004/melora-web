"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

import { Song, PlayerContextType } from "@/types/player";

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    audioRef.current.addEventListener("timeupdate", () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    });

    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      if (currentSong?.id === song.id) {
        togglePlayPause();
        return;
      }

      setCurrentSong(song);
      audioRef.current.src = song.audio_url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const setVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolumeState(value);
    }
  };

  const seek = (value: number) => {
    if (audioRef.current && currentSong) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  return <PlayerContext.Provider value={{ currentSong, isPlaying, progress, duration, playSong, togglePlayPause, volume, setVolume, seek }}>{children}</PlayerContext.Provider>;
};
