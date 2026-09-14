"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { songApi } from "@/api/songApi";
import { usePlayer } from "@/context/PlayerContext";

export default function Sidebar() {
  const [songs, setSongs] = useState<any[]>([]);
  const { playSong } = usePlayer();

  useEffect(() => {
    songApi.getSongs()
      .then((data: any) => {
        setSongs(data.reverse().slice(0, 6)); 
      })
      .catch((err) => console.log(err));
  }, []);

  const renderLogo = () => (
    <div className="flex items-center gap-2 mb-8 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500 text-black font-extrabold text-lg">
        M
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-white uppercase">
          Melora
        </span>
        <span className="text-xs font-bold text-green-500 tracking-wider">
          ● ACOUSTIC
        </span>
      </div>
    </div>
  );

  const renderPrimaryNav = () => (
    <nav className="flex flex-col gap-2 mb-8">
      <Link
        href="/"
        className="flex items-center gap-4 px-4 py-3 rounded-full border border-green-500/50 bg-neutral-900/50 text-green-400 font-semibold transition hover:text-green-300"
      >
        <i className="fa-solid fa-house text-lg w-5 text-center"></i>
        <span>Trang chủ</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-magnifying-glass text-lg w-5 text-center"></i>
        <span>Tìm kiếm</span>
      </Link>

      <Link
        href="/library"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-book-open text-lg w-5 text-center"></i>
        <span>Thư viện của bạn</span>
      </Link>

      <Link
        href="/chart"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-arrow-trend-up text-lg w-5 text-center"></i>
        <span>Bảng Xếp Hạng V-Pop</span>
      </Link>
    </nav>
  );

  const renderPlaylists = () => (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
          Danh Sách Phát
        </h3>
        <button className="text-neutral-400 hover:text-white transition">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 overflow-y-auto pb-4 scrollbar-hide">
        {songs.map((song) => {
          const formattedSong = {
            id: song.id,
            title: song.title,
            audio_url: song.audio_url,
            cover_url: song.cover_url,
            artist: song.artists && song.artists.length > 0 ? song.artists[0].name : "Unknown Artist",
          };
          
          return (
            <button
              key={song.id}
              onClick={() => playSong(formattedSong, songs.map(s => ({...s, artist: s.artists?.[0]?.name || "Unknown Artist"})))}
              className="text-left text-sm font-medium text-neutral-400 hover:text-white transition whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2 group"
            >
              <i className="fa-solid fa-music text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
              <span className="truncate">{song.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-neutral-950 p-4 border-r border-neutral-900/50">
      {renderLogo()}
      {renderPrimaryNav()}
      {renderPlaylists()}
    </aside>
  );
}
