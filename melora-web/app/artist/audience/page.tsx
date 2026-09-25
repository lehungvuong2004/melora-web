"use client";

import React, { useState, useEffect } from "react";
import { artistApi } from "@/api/artistApi";

interface SongPlay {
  id: number;
  title: string;
  cover_url: string | null;
  play_count: number;
  created_at: string;
}

interface AudienceData {
  total_plays: number;
  songs: SongPlay[];
}

export default function ArtistAudiencePage() {
  const [data, setData] = useState<AudienceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAudience = async () => {
      try {
        setIsLoading(true);
        const res: any = await artistApi.getAudience();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAudience();
  }, []);

  const maxPlays = data?.songs?.[0]?.play_count ?? 1;

  const renderSummary = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <p className="text-zinc-400 text-sm mb-1">Tổng lượt nghe hoàn thành</p>
        <p className="text-4xl font-bold text-white">{data?.total_plays?.toLocaleString() ?? 0}</p>
        <p className="text-xs text-zinc-500 mt-2">Tính khi người nghe phát hết bài</p>
      </div>
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <p className="text-zinc-400 text-sm mb-1">Số bài hát đã đăng</p>
        <p className="text-4xl font-bold text-white">{data?.songs?.length ?? 0}</p>
        <p className="text-xs text-zinc-500 mt-2">Chỉ tính bài đã được duyệt</p>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-zinc-800">
        <h3 className="text-lg font-bold">Lượt nghe theo bài hát</h3>
        <p className="text-zinc-400 text-sm mt-1">Xếp hạng theo số lượt nghe hoàn thành</p>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-zinc-500">Đang tải dữ liệu...</div>
      ) : !data?.songs?.length ? (
        <div className="p-10 text-center text-zinc-500">
          Chưa có bài hát nào được duyệt hoặc chưa có lượt nghe.
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {data.songs.map((song, index) => (
            <div key={song.id} className="flex items-center gap-4 p-4 hover:bg-zinc-800/20 transition">
              <span className="w-6 text-center text-zinc-500 font-bold text-sm">{index + 1}</span>
              <img
                src={song.cover_url || "/assets/default_cover.jpg"}
                alt={song.title}
                className="w-11 h-11 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{song.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${maxPlays > 0 ? (song.play_count / maxPlays) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400 whitespace-nowrap">
                    {song.play_count.toLocaleString()} lượt
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Khán giả của tôi</h2>
        <p className="text-zinc-400">Thống kê số lượt nghe hoàn thành — chỉ tính khi người dùng nghe hết bài hát.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-32 bg-zinc-800 rounded mb-3" />
              <div className="h-10 w-20 bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        renderSummary()
      )}

      {renderTable()}
    </div>
  );
}
