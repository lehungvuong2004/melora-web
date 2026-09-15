"use client";

import React, { useState, useEffect, useRef } from "react";
import axiosClient from "@/api/axiosClient";
import { usePlayer } from "@/context/PlayerContext";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ songs: any[]; artists: any[]; albums: any[]; playlists: any[] }>({
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        axiosClient
          .get(`/search?q=${query}`)
          .then((res: any) => {
            setResults(res || { songs: [], artists: [], albums: [], playlists: [] });
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        setResults({ songs: [], artists: [], albums: [], playlists: [] });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  const handlePlay = (song: any) => {
    playSong({
      id: song.id,
      title: song.title,
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      artist: song.artists?.[0]?.name || "Unknown", // Handle possibly different schema
    });
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <i className="fa-solid fa-circle-notch fa-spin text-3xl text-green-500"></i>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 px-4">
      <h3 className="text-white text-xl font-bold mb-2">Tìm kiếm Gần Đây</h3>
      <p className="text-neutral-400 text-sm">Nhập từ khoá để tìm bài hát, nghệ sĩ hoặc podcast yêu thích của bạn.</p>
    </div>
  );

  const renderNoResults = () => (
    <div className="text-center py-16 px-4">
      <h3 className="text-white font-bold text-lg mb-2">Không tìm thấy kết quả</h3>
      <p className="text-neutral-400 text-sm">Vui lòng kiểm tra lại chính tả hoặc thử một từ khoá khác.</p>
    </div>
  );

  const renderSongs = () => (
    <div className="mb-6">
      <h3 className="text-white font-bold text-lg mb-3 px-2">Bài hát</h3>
      <div className="flex flex-col gap-1">
        {results.songs.slice(0, 5).map((song) => (
          <button
            key={song.id}
            onClick={() => handlePlay(song)}
            className="flex items-center gap-3 p-2 hover:bg-neutral-800/80 rounded-lg group text-left transition cursor-pointer active:opacity-50"
          >
            <div className="w-12 h-12 relative shrink-0 rounded overflow-hidden shadow">
              <img src={song.cover_url} alt="" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <i className="fa-solid fa-play text-white text-sm"></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-base truncate group-hover:text-green-500 transition-colors">{song.title}</h4>
              <p className="text-neutral-400 text-sm truncate">{song.artists?.[0]?.name || "Unknown Artist"}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderArtists = () => (
    <div>
      <h3 className="text-white font-bold text-lg mb-3 px-2">Nghệ sĩ</h3>
      <div className="flex flex-col gap-1">
        {results.artists.slice(0, 3).map((artist) => (
          <button
            key={artist.id}
            onClick={onClose}
            className="flex items-center gap-4 p-2 hover:bg-neutral-800/80 rounded-lg group text-left transition cursor-pointer active:opacity-50"
          >
            <img src={artist.avatar_url || "https://i.pravatar.cc/150"} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 shadow" />
            <div>
              <h4 className="text-white font-medium text-base">{artist.name}</h4>
              <p className="text-neutral-400 text-sm">Nghệ sĩ</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-neutral-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[75vh] border border-neutral-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
          <i className="fa-solid fa-magnifying-glass text-neutral-400 mr-3 text-lg"></i>
          <form className="flex-1" onSubmit={handleSearchSubmit}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Bạn muốn nghe gì?"
              className="w-full bg-transparent text-white focus:outline-none placeholder-neutral-500 font-medium text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          {query && (
            <button onClick={() => setQuery("")} className="text-neutral-400 hover:text-white transition px-2 cursor-pointer">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          )}
          <button onClick={onClose} className="ml-2 py-1 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-full transition font-bold cursor-pointer">
            Đóng
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide min-h-80">
          {loading && renderLoading()}
          {!loading && !query && renderEmptyState()}
          {!loading && query && results.songs.length === 0 && results.artists.length === 0 && renderNoResults()}
          {!loading && results.songs.length > 0 && renderSongs()}
          {!loading && results.artists.length > 0 && renderArtists()}
        </div>
      </div>
    </div>
  );
}
