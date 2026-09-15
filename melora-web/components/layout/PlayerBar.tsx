"use client";

import React, { useState, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";
import WishlistButton from "@/components/ui/WishlistButton";
import { useRouter } from "next/navigation";

export default function PlayerBar() {
  const { currentSong, isPlaying, progress, duration, togglePlayPause, seek, volume, setVolume, playNext, playPrev, toggleShuffle, isShuffle, toggleRepeat, repeatMode } = usePlayer();

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (progress > 10) {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        if (isPlaying) {
          togglePlayPause(); // Pause the music
        }
        router.push("/auth/login");
      }
    }
  }, [progress, isPlaying, togglePlayPause, router]);

  if (!currentSong) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const renderNowPlayingInfo = () => (
    <div className="flex items-center w-1/3 min-w-0">
      <div className="relative h-14 w-14 rounded overflow-hidden mr-4 shadow bg-neutral-800 shrink-0">
        <img src={currentSong.cover_url} alt="Cover" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">{currentSong.title}</h4>
          <span className="bg-green-900/50 text-green-400 border border-green-700/50 text-xs font-bold px-1 rounded tracking-wide shrink-0">LOSSLESS</span>
        </div>
        <p className="text-xs text-neutral-400 truncate hover:underline cursor-pointer">{currentSong.artist}</p>
      </div>
      <WishlistButton id={currentSong.id} type="song" />
    </div>
  );

  const renderPlayerControls = () => (
    <div className="flex flex-col items-center justify-center w-1/3 max-w-3xl">
      <div className="flex items-center gap-5 mb-2">
        <button
          onClick={toggleShuffle}
          className={`cursor-pointer transition flex items-center justify-center relative ${isShuffle ? "text-green-500 hover:text-green-400" : "text-neutral-400 hover:text-white"}`}
        >
          <i className="fa-solid fa-shuffle text-sm"></i>
          {isShuffle && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>}
        </button>
        <button onClick={playPrev} className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
          <i className="fa-solid fa-backward-step"></i>
        </button>
        <button onClick={togglePlayPause} className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition">
          <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} ml-px`}></i>
        </button>
        <button onClick={playNext} className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
          <i className="fa-solid fa-forward-step"></i>
        </button>
        <button
          onClick={toggleRepeat}
          className={`cursor-pointer transition flex items-center justify-center relative ${repeatMode !== "off" ? "text-green-500 hover:text-green-400" : "text-neutral-400 hover:text-white"}`}
        >
          {repeatMode === "one" ? (
            <span className="text-sm font-black relative">
              <i className="fa-solid fa-repeat"></i>
              <span className="absolute -top-0.5 -right-1.25 text-xs scale-75 bg-[#181818] rounded-full w-3 h-3 flex items-center justify-center">1</span>
            </span>
          ) : (
            <i className="fa-solid fa-repeat text-sm"></i>
          )}
          {repeatMode !== "off" && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>}
        </button>
      </div>

      <div className="flex items-center w-full gap-2">
        <span className="text-xs font-medium text-neutral-400 w-10 text-right">
          {formatTime(isDragging ? dragProgress : progress)}
        </span>
        <div 
          className="flex-1 relative group flex items-center h-4 cursor-pointer"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            
            const calcProgress = (clientX: number) => {
              let percent = (clientX - rect.left) / rect.width;
              percent = Math.max(0, Math.min(1, percent));
              return percent * (duration || 1);
            };

            setIsDragging(true);
            const startVal = calcProgress(e.clientX);
            setDragProgress(startVal);
            seek(startVal);

            const handlePointerMove = (moveEvent: PointerEvent) => {
              setDragProgress(calcProgress(moveEvent.clientX));
            };

            const handlePointerUp = (upEvent: PointerEvent) => {
              const finalVal = calcProgress(upEvent.clientX);
              seek(finalVal);
              setIsDragging(false);
              window.removeEventListener("pointermove", handlePointerMove);
              window.removeEventListener("pointerup", handlePointerUp);
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
          }}
        >
          <div className="w-full h-1 bg-neutral-600 rounded-full flex relative overflow-hidden group-hover:bg-neutral-500 pointer-events-none">
            <div 
              style={{ width: `${((isDragging ? dragProgress : progress) / (duration || 1)) * 100}%` }} 
              className="h-full bg-white group-hover:bg-green-500 rounded-full transition-all"
            ></div>
          </div>
        </div>
        <span className="text-xs font-medium text-neutral-400 w-10 text-left">{formatTime(duration)}</span>
      </div>
    </div>
  );

  const renderExtraControls = () => (
    <div className="flex items-center justify-end w-1/3 gap-3 shrink-0">
      <div className="flex items-center gap-2 w-24 group">
        <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center">
          <i className={`fa-solid ${volume === 0 ? "fa-volume-mute" : "fa-volume-high"} text-sm`}></i>
        </button>
        <div 
          className="flex-1 relative group flex items-center h-4 cursor-pointer"
          onPointerDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            
            const calcVolume = (clientX: number) => {
              let percent = (clientX - rect.left) / rect.width;
              return Math.max(0, Math.min(1, percent));
            };

            setVolume(calcVolume(e.clientX));

            const handlePointerMove = (moveEvent: PointerEvent) => {
              setVolume(calcVolume(moveEvent.clientX));
            };

            const handlePointerUp = () => {
              window.removeEventListener("pointermove", handlePointerMove);
              window.removeEventListener("pointerup", handlePointerUp);
            };

            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
          }}
        >
          <div className="w-full h-1 bg-neutral-600 rounded-full flex relative overflow-hidden group-hover:bg-neutral-500 pointer-events-none">
            <div 
              style={{ width: `${volume * 100}%` }} 
              className="h-full bg-white group-hover:bg-green-500 rounded-full transition-all"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <footer className="h-24 w-full bg-[#181818] border-t border-neutral-900 flex items-center justify-between px-4 z-50">
      {renderNowPlayingInfo()}
      {renderPlayerControls()}
      {renderExtraControls()}
    </footer>
  );
}
