"use client";
import React, { useEffect, useState } from "react";
import { songApi } from "@/api/songApi";
import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/types/player";

export default function HistoryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  useEffect(() => {
    setLoading(true);
    songApi
      .getSongs()
      .then((data: any) => {
        setSongs(data.reverse());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderLoading = () => <p className="text-neutral-400">Đang tải...</p>;

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <i className="fa-solid fa-clock-rotate-left text-4xl text-neutral-600 mb-4"></i>
      <h2 className="text-white font-bold text-xl mb-2">Chưa có lịch sử</h2>
      <p className="text-neutral-400">Những bài hát bạn nghe sẽ xuất hiện ở đây.</p>
    </div>
  );

  const renderHistoryList = () => (
    <div className="flex flex-col gap-2">
      {songs.map((song, i) => (
        <div
          key={song.id}
          onClick={() =>
            playSong(
              {
                id: song.id,
                title: song.title,
                audio_url: song.audio_url,
                cover_url: song.cover_url,
                artist: song.artists?.[0]?.name || "Unknown",
              },
              songs,
            )
          }
          className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-lg cursor-pointer group transition"
        >
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 w-6 text-right font-medium group-hover:hidden">{i + 1}</span>
            <i className="fa-solid fa-play text-white w-6 text-center hidden group-hover:block"></i>
            <div className="w-12 h-12 relative shadow">
              <img src={song.cover_url} alt="" className="object-cover w-full h-full rounded" />
            </div>
            <div>
              <h4 className="text-white font-bold group-hover:text-green-500 transition-colors">{song.title}</h4>
              <p className="text-neutral-400 text-sm">{song.artists?.[0]?.name || "Unknown Artist"}</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pr-4">
            <i className="fa-solid fa-bolt text-green-500 text-xs"></i>
            <span className="text-green-500 text-xs font-bold uppercase">Lossless</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Lịch sử nghe nhạc</h1>
      {loading && renderLoading()}
      {!loading && songs.length === 0 && renderEmptyState()}
      {!loading && songs.length > 0 && renderHistoryList()}
    </div>
  );
}
