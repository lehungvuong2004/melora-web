"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

import { Song, PlayerContextType } from "@/types/player";

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Refs for current states to use inside event listeners
  const stateRef = useRef({
    currentSong,
    playlist,
    isShuffle,
    repeatMode,
  });

  useEffect(() => {
    stateRef.current = { currentSong, playlist, isShuffle, repeatMode };
  }, [currentSong, playlist, isShuffle, repeatMode]);

  const playSong = useCallback((song: Song, newPlaylist?: Song[], forcePlay?: boolean) => {
    if (audioRef.current) {
      const currentList = stateRef.current.playlist;
      if (newPlaylist) {
        setPlaylist(newPlaylist);
      } else if (currentList.length === 0) {
        setPlaylist([song]);
      }

      if (stateRef.current.currentSong?.id === song.id && !forcePlay) {
        if (audioRef.current.paused) {
          audioRef.current.play().catch((e) => {
            if (e.name !== "AbortError") console.error(e);
          });
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        return;
      }

      setCurrentSong(song);
      audioRef.current.src = song.audio_url;
      audioRef.current.play().catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      });
      setIsPlaying(true);
    }
  }, []);

  const handleEnded = useCallback(() => {
    const { currentSong: song, playlist: list, isShuffle: shuffle, repeatMode: repeat } = stateRef.current;

    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
      }
      return;
    }

    if (!song || list.length === 0) {
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    if (shuffle) {
      const MathRandomIndex = Math.floor(Math.random() * list.length);
      playSong(list[MathRandomIndex], list, true);
      return;
    }

    const currentIndex = list.findIndex((s) => s.id === song.id);
    if (currentIndex !== -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < list.length) {
        playSong(list[nextIndex], list, true);
      } else if (repeat === "all") {
        playSong(list[0], list, true);
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    }
  }, [playSong]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const updateTime = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [handleEnded]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) => {
          if (e.name !== "AbortError") console.error(e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentSong]);

  const setVolume = useCallback((value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolumeState(value);
    }
  }, []);

  const seek = useCallback(
    (value: number) => {
      if (audioRef.current && currentSong) {
        audioRef.current.currentTime = value;
        setProgress(value);
      }
    },
    [currentSong],
  );

  const playNext = useCallback(() => {
    const { currentSong: song, playlist: list, isShuffle: shuffle } = stateRef.current;
    if (!song || list.length === 0) return;

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * list.length);
      playSong(list[randomIndex], list, true);
      return;
    }

    const currentIndex = list.findIndex((s) => s.id === song.id);
    if (currentIndex !== -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < list.length) {
        playSong(list[nextIndex], list, true);
      } else {
        playSong(list[0], list, true);
      }
    }
  }, [playSong]);

  const playPrev = useCallback(() => {
    const { currentSong: song, playlist: list, isShuffle: shuffle } = stateRef.current;
    if (!song || list.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * list.length);
      playSong(list[randomIndex], list, true);
      return;
    }

    const currentIndex = list.findIndex((s) => s.id === song.id);
    if (currentIndex > 0) {
      playSong(list[currentIndex - 1], list, true);
    } else {
      playSong(list[list.length - 1], list, true);
    }
  }, [playSong]);

  const toggleShuffle = useCallback(() => setIsShuffle((prev) => !prev), []);
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        playlist,
        isPlaying,
        progress,
        duration,
        playSong,
        togglePlayPause,
        volume,
        setVolume,
        seek,
        playNext,
        playPrev,
        toggleShuffle,
        isShuffle,
        toggleRepeat,
        repeatMode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
