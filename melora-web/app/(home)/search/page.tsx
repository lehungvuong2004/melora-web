"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/types/player";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ songs: Song[]; artists: any[]; albums: any[]; playlists: any[] }>({
    songs: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        axiosClient
          .get(`/search?q=${query}`)
          .then((res: any) => {
            // res is unwrapped by our interceptor
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nghệ sĩ, bài hát hoặc podcast..."
          className="w-full max-w-md px-4 py-3 rounded-full bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-white border border-transparent hover:border-neutral-700 transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p className="text-neutral-400">Đang tìm kiếm...</p>}

      {!loading && query && results.songs.length === 0 && results.artists.length === 0 && <p className="text-neutral-400">Không tìm thấy kết quả nào cho "{query}"</p>}

      {!loading && results.songs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Bài hát</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.songs.map((song) => (
              <div
                key={song.id}
                onClick={() =>
                  playSong({
                    id: song.id,
                    title: song.title,
                    audio_url: song.audio_url,
                    cover_url: song.cover_url,
                    artist: song.artists?.[0]?.name || "Unknown",
                  })
                }
                className="flex items-center gap-4 p-3 hover:bg-neutral-800 rounded-lg cursor-pointer group"
              >
                <div className="w-12 h-12 relative rounded overflow-hidden">
                  <img src={song.cover_url} alt="" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                    <i className="fa-solid fa-play text-white"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium">{song.title}</h4>
                  <p className="text-neutral-400 text-sm">{song.artists?.[0]?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Artists Section mock */}
      {!loading && results.artists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Nghệ sĩ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.artists.map((artist) => (
              <div key={artist.id} className="p-4 bg-neutral-900 hover:bg-neutral-800 rounded-xl cursor-pointer transition flex flex-col items-center text-center">
                <img src={artist.avatar_url || "https://i.pravatar.cc/150"} alt="" className="w-24 h-24 rounded-full object-cover mb-4" />
                <h4 className="text-white font-bold">{artist.name}</h4>
                <p className="text-neutral-400 text-sm">Nghệ sĩ</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
