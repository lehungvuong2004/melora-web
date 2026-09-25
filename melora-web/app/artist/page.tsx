"use client";

import React, { useEffect, useState } from "react";
import { artistApi } from "@/api/artistApi";
import Link from "next/link";

export default function ArtistDashboardPage() {
  const [stats, setStats] = useState({
    followers: 0,
    streams: 0,
    songsCount: 0,
    monthlyListeners: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res: any = await artistApi.getStats();
        if (res.data) {
          setStats({
            followers: res.data.followers || 0,
            streams: res.data.streams || 0,
            songsCount: res.data.songsCount || 0,
            monthlyListeners: res.data.monthlyListeners || 0
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải thông kê:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="text-zinc-400 py-10 text-center">Đang tải bảng điều khiển...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black mb-2">Chào mừng trở lại!</h2>
        <p className="text-zinc-400">Xem khán giả đang tương tác với âm nhạc của bạn như thế nào nhé.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Người nghe tháng này</h3>
          <p className="text-3xl font-bold text-white">{stats.monthlyListeners.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Lượt streams (Tổng)</h3>
          <p className="text-3xl font-bold text-white">{stats.streams.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Lượt theo dõi (Followers)</h3>
          <p className="text-3xl font-bold text-white">{stats.followers.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Số bài hát đã Tải lên</h3>
          <p className="text-3xl font-bold text-white">{stats.songsCount.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Upload button area */}
      <div className="p-8 bg-gradient-to-br from-blue-900/40 to-black border border-blue-900/50 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Phát hành đĩa đơn tiếp theo?</h3>
          <p className="text-zinc-300">Tải nhạc của bạn lên Melora và kết nối với hàng triệu người nghe đam mê âm nhạc.</p>
        </div>
        <Link href="/artist/music">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition cursor-pointer">
            Tạo bản phát hành mới
          </button>
        </Link>
      </div>
    </div>
  );
}
