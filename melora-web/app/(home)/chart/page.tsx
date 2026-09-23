"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { usePlayer } from "@/context/PlayerContext";

export default function ChartPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { playSong, addToQueue } = usePlayer();

  useEffect(() => {
    axiosClient
      .get("/songs")
      .then((res: any) => {
        let items = res?.data?.data?.data || res?.data?.data || res?.data || res || [];
        if (!Array.isArray(items) && items.data && Array.isArray(items.data)) items = items.data;
        if (Array.isArray(items)) {
          items.sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
          setSongs(items.slice(0, 50));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return { className: "text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600" };
    if (index === 1) return { className: "text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600" };
    if (index === 2) return { className: "text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600" };
    return {
      className: "text-transparent",
      style: { WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.4)" },
    };
  };

  const renderHeader = () => (
    <h1 className="text-5xl font-black mb-8 px-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-500">
      #zingchart
    </h1>
  );

  const renderGrid = () => (
    <div className="flex flex-col gap-2">
      {songs.map((song, i) => {
        const artistName = song.artists && song.artists.length > 0 ? song.artists[0].name : "Nghệ sĩ chưa rõ";
        const formattedSong = {
          id: song.id,
          title: song.title,
          audio_url: song.audio_url,
          cover_url: song.cover_url,
          artist: artistName,
        };

        const rankProps = getRankStyle(i);

        return (
          <div
            key={song.id}
            className="group flex items-center justify-between p-3 px-4 rounded-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer border-b border-white/5 last:border-0"
            onClick={() =>
              playSong(
                formattedSong,
                songs.map((s) => ({
                  id: s.id,
                  title: s.title,
                  audio_url: s.audio_url,
                  cover_url: s.cover_url,
                  artist: s.artists?.[0]?.name || "Nghệ sĩ chưa rõ",
                })),
              )
            }
          >
            <div className="flex items-center gap-4 w-full">
              <div className={`w-14 text-center text-4xl leading-none font-black ${rankProps.className}`} style={rankProps.style}>
                {i + 1}
              </div>

              <div className="w-4 flex justify-center text-xs text-neutral-500 font-bold">
                {i % 4 === 0 ? <i className="fa-solid fa-caret-up text-green-500"></i> : i % 7 === 0 ? <i className="fa-solid fa-caret-down text-red-500"></i> : <span>-</span>}
              </div>

              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-neutral-800 shrink-0">
                <img
                  src={song.cover_url || `https://picsum.photos/120/120?random=${song.id}`}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <i className="fa-solid fa-play text-white text-lg"></i>
                </div>
              </div>

              <div className="flex flex-col ml-2 flex-1">
                <span className="text-base font-bold text-white group-hover:text-purple-400 transition truncate max-w-48 md:max-w-md">{song.title}</span>
                <span className="text-xs font-semibold text-neutral-400 truncate mt-0.5">{artistName}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="cursor-pointer text-neutral-500 hover:text-white transition p-2" onClick={(e) => e.stopPropagation()}>
                <i className="fa-solid fa-microphone-lines"></i>
              </button>
              <button className="cursor-pointer text-neutral-500 hover:text-pink-500 transition p-2" onClick={(e) => e.stopPropagation()}>
                <i className="fa-regular fa-heart"></i>
              </button>
              <span className="text-xs font-bold text-neutral-500 w-12 text-right">{formatDuration(song.duration_seconds || (song.id % 60) + 180)}</span>
              <div className={`relative ${openDropdown === song.id ? "z-50" : ""}`}>
                <button 
                  className={`cursor-pointer text-neutral-500 hover:text-white transition p-2 ${openDropdown === song.id ? "text-white" : ""}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === song.id ? null : song.id);
                  }}
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                
                {/* Dropdown Menu */}
                {openDropdown === song.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} 
                    />
                    <div 
                      className="absolute right-0 top-full mt-2 w-56 bg-neutral-800 rounded-md shadow-2xl overflow-hidden z-50 text-sm font-medium border border-neutral-700/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        className="cursor-pointer w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition flex items-center gap-3"
                        onClick={() => { alert('Tính năng Thêm vào danh sách phát đang phát triển!'); setOpenDropdown(null); }}
                      >
                        <i className="fa-solid fa-list text-neutral-400 w-4"></i> Thêm vào danh sách phát
                      </button>
                      <button 
                        className="cursor-pointer w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition flex items-center gap-3"
                        onClick={() => { addToQueue(formattedSong); alert(`Đã thêm "${song.title}" vào danh sách chờ!`); setOpenDropdown(null); }}
                      >
                        <i className="fa-solid fa-indent text-neutral-400 w-4"></i> Thêm vào cuối danh sách chờ
                      </button>
                      <button 
                        className="cursor-pointer w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition flex items-center gap-3"
                        onClick={() => { window.open(song.audio_url, '_blank'); setOpenDropdown(null); }}
                      >
                        <i className="fa-solid fa-download text-neutral-400 w-4"></i> Tải xuống
                      </button>
                      <button 
                        className="cursor-pointer w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition flex items-center gap-3"
                        onClick={() => { alert(`Đang chuyển đến trang nghệ sĩ ${artistName}...`); setOpenDropdown(null); }}
                      >
                        <i className="fa-solid fa-user text-neutral-400 w-4"></i> Đi tới Trang Nghệ sĩ
                      </button>
                      <button 
                        className="cursor-pointer w-full text-left px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition flex items-center gap-3"
                        onClick={() => { 
                          navigator.clipboard.writeText(`${window.location.origin}/song/${song.id}`); 
                          alert('Đã sao chép liên kết chia sẻ!'); 
                          setOpenDropdown(null); 
                        }}
                      >
                        <i className="fa-solid fa-share-nodes text-neutral-400 w-4"></i> Chia sẻ
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-8 pb-32">
      {renderHeader()}
      {loading ? (
        <div className="flex justify-center py-20 text-neutral-400 font-medium">Đang tải bảng xếp hạng...</div>
      ) : (
        renderGrid()
      )}
    </div>
  );
}
