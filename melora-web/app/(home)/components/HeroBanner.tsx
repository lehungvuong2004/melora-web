"use client";

import React, { useEffect, useState } from "react";
import { songApi } from "@/api/songApi";
import { usePlayer } from "@/context/PlayerContext";

export default function HeroBanner() {
  const [song, setSong] = useState<any>(null);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    songApi.getTopSong()
      .then((data) => {
        setSong(data);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!song) return null;

  const artistName = song.artists && song.artists.length > 0 ? song.artists[0].name : "Unknown Artist";
  // Format numbers nicely, e.g. 48.2M
  const formatPlays = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count;
  };

  return (
    <section className="mb-12 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-green-500 tracking-wider">TOP TRENDING 🔥</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Chào buổi tối, Vương</h1>
          <p className="text-neutral-400 text-sm mt-1">Khám phá âm nhạc tuyển chọn dành riêng cho gu thưởng thức của bạn.</p>
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-end pt-48 pb-8 px-8 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-emerald-900/40 to-black z-0">
          <img src={song.cover_url} alt="Banner" className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-700" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/40 to-transparent z-0"></div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1.5 rounded-full bg-green-500 text-black text-xs font-bold uppercase tracking-wider">BÀI HÁT HOT NHẤT HỆ THỐNG</span>
          </div>

          <h4 className="text-green-400 font-bold text-xs tracking-widest uppercase mb-1">{artistName}</h4>
          <h2 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg">{song.title}</h2>
          <p className="text-neutral-300 text-sm max-w-lg mb-6 line-clamp-2 leading-relaxed">
            {song.description || "Một tuyệt tác âm nhạc không thể bỏ lỡ, đang dẫn đầu bảng xếp hạng lượt nghe toàn cầu lúc này."}
          </p>

          <div className="flex items-center gap-6 mb-6 text-sm font-semibold text-neutral-300">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-play text-green-500"></i> {formatPlays(song.play_count)} Lượt nghe
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-clock text-neutral-400"></i> {Math.floor(song.duration_seconds / 60)}:{(song.duration_seconds % 60).toString().padStart(2, "0")} phút
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-compact-disc text-cyan-400"></i> 24-bit/96kHz Lossless
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => playSong({ id: song.id, title: song.title, audio_url: song.audio_url, cover_url: song.cover_url, artist: artistName })}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-bold transition hover:scale-105 cursor-pointer"
            >
              <i className={`fa-solid ${currentSong?.id === song.id && isPlaying ? "fa-pause" : "fa-play"}`}></i> Phát ngay
            </button>
            <button className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-600 px-6 py-3 rounded-full font-bold transition hover:scale-105 backdrop-blur-md cursor-pointer">
              <i className="fa-regular fa-heart"></i> Thêm vào thư viện
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
