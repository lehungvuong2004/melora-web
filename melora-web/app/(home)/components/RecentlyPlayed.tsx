"use client";

import React, { useEffect, useState } from "react";
import { songApi } from "@/api/songApi";
import { usePlayer } from "@/context/PlayerContext";

export default function RecentlyPlayed() {
  const [songs, setSongs] = useState<any[]>([]);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    songApi.getSongs()
      .then((data: any) => {
        setSongs(data.reverse().slice(0, 6));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full"></div> Nghe Gần Đây
        </h3>
        <a href="#" className="text-sm font-semibold text-neutral-400 hover:text-white transition">
          Xem toàn bộ lịch sử <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {songs.map((song) => {
          const artistName = song.artists && song.artists.length > 0 ? song.artists[0].name : "Unknown Artist";
          return (
            <div
              key={song.id}
              onClick={() => playSong({ id: song.id, title: song.title, audio_url: song.audio_url, cover_url: song.cover_url, artist: artistName })}
              className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition cursor-pointer group"
            >
              <div className="relative aspect-square w-full mb-3 rounded-md overflow-hidden shadow-lg">
                <img src={song.cover_url} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 shadow-xl transition translate-y-2 group-hover:translate-y-0">
                    <i className={`fa-solid ${currentSong?.id === song.id && isPlaying ? "fa-pause" : "fa-play"} text-lg ml-1`}></i>
                  </button>
                </div>
              </div>
              <h4 className="text-white font-bold text-sm truncate mb-1">{song.title}</h4>
              <p className="text-neutral-400 text-xs truncate mb-2">{artistName}</p>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-bolt text-green-500 text-xs"></i>
                <span className="text-green-500 text-xs font-bold uppercase">Lossless</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
