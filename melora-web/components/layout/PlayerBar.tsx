"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";

export default function PlayerBar() {
  const { currentSong, isPlaying, progress, duration, togglePlayPause, seek, volume, setVolume } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <footer className="h-24 w-full bg-[#181818] border-t border-neutral-900 flex items-center justify-between px-4 z-50">
      {/* 1. Now Playing Info (Left) */}
      <div className="flex items-center w-1/3 min-w-0">
        <div className="relative h-14 w-14 rounded overflow-hidden mr-4 shadow bg-neutral-800 shrink-0">
          <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">{currentSong.title}</h4>
            <span className="bg-green-900/50 text-green-400 border border-green-700/50 text-[10px] font-bold px-1 rounded tracking-wide shrink-0">LOSSLESS</span>
          </div>
          <p className="text-xs text-neutral-400 truncate hover:underline cursor-pointer">{currentSong.artist}</p>
        </div>
        <button className="cursor-pointer text-green-500 hover:text-green-400 transition w-8 h-8 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-heart"></i>
        </button>
      </div>

      {/* 2. Player Controls (Center) */}
      <div className="flex flex-col items-center justify-center w-1/3 max-w-3xl">
        <div className="flex items-center gap-5 mb-2">
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center relative">
            <i className="fa-solid fa-shuffle text-sm"></i>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button onClick={togglePlayPause} className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition">
            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} ml-[1px]`}></i>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
            <i className="fa-solid fa-forward-step"></i>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center">
            <i className="fa-solid fa-repeat text-sm"></i>
          </button>
        </div>

        <div className="flex items-center w-full gap-2">
          <span className="text-xs font-medium text-neutral-400 w-10 text-right">{formatTime(progress)}</span>
          <div
            className="flex-1 group flex items-center h-4 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seek(percent * duration);
            }}
          >
            <div className="w-full h-1 bg-neutral-600 rounded-full flex relative overflow-hidden group-hover:bg-neutral-500">
              <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full bg-white group-hover:bg-green-500 rounded-full transition-all"></div>
            </div>
          </div>
          <span className="text-xs font-medium text-neutral-400 w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Extra Controls (Right) */}
      <div className="flex items-center justify-end w-1/3 gap-3 shrink-0">
        <div className="flex items-center gap-2 w-24 group">
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center">
            <i className={`fa-solid ${volume === 0 ? "fa-volume-mute" : "fa-volume-high"} text-sm`}></i>
          </button>
          <div
            className="flex-1 flex items-center h-4 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              setVolume(Math.max(0, Math.min(1, percent)));
            }}
          >
            <div className="w-full h-1 bg-neutral-600 rounded-full flex relative overflow-hidden group-hover:bg-neutral-500">
              <div style={{ width: `${volume * 100}%` }} className="h-full bg-white group-hover:bg-green-500 rounded-full transition-all"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
