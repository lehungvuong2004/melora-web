"use client";

import React, { useEffect, useState } from "react";
import { songApi } from "@/api/songApi";
import { usePlayer } from "@/context/PlayerContext";

export default function TrendingChart() {
  const [songs, setSongs] = useState<any[]>([]);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    songApi.getSongs()
      .then((data: any) => {
        setSongs(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 px-1 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-green-500 rounded-full"></div> Bảng Xếp Hạng Bài Hát
          </h3>
          <p className="text-neutral-400 text-xs">Các bài hát mới nhất từ hệ thống</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
        {songs.map((song, i) => {
          const num = i + 1;
          const artistName = song.artists && song.artists.length > 0 ? song.artists[0].name : "Unknown Artist";
          return (
            <div
              key={song.id}
              onClick={() => playSong({ id: song.id, title: song.title, audio_url: song.audio_url, cover_url: song.cover_url, artist: artistName })}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/80 transition cursor-pointer group"
            >
              <span className={`text-xl font-bold w-6 text-center ${num <= 3 ? "text-green-500" : "text-neutral-500"}`}>{num < 10 ? `0${num}` : num}</span>
              <div className="relative h-12 w-12 rounded overflow-hidden">
                <img src={song.cover_url} alt="Song" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <i className={`fa-solid ${currentSong?.id === song.id && isPlaying ? "fa-pause" : "fa-play"} text-white text-sm`}></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm truncate">{song.title}</h4>
                <p className="text-neutral-400 text-xs truncate">{artistName}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
