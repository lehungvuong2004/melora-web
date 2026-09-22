"use client";

import React, { useRef, useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { usePlayer } from "@/context/PlayerContext";

export default function MadeForYou() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    axiosClient.get("/songs")
      .then((res: any) => {
        let items = res?.data?.data || res?.data || res || [];
        if (Array.isArray(items)) {
          items = items.sort(() => 0.5 - Math.random());
          setSongs(items.slice(0, 8)); 
        } else {
          setSongs([]);
        }
      })
      .catch((err) => console.error("Failed to load songs:", err))
      .finally(() => setLoading(false));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };
  
  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4 px-1">
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
          <div className="w-1 h-5 bg-green-500 rounded-full"></div> Dành Riêng Cho Bạn
        </h3>
        <p className="text-neutral-400 text-xs">Thưởng thức những ca khúc được gợi ý theo gu nhạc của bạn</p>
      </div>
      <div className="flex gap-2">
        <button onClick={scrollLeft} className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95">
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <button onClick={scrollRight} className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white transition flex items-center justify-center cursor-pointer active:scale-95">
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );

  const renderCarousel = () => {
    if (loading) {
      return <div className="text-neutral-500 text-sm p-4">Đang tải gợi ý...</div>;
    }

    if (songs.length === 0) {
      return <div className="text-neutral-500 text-sm p-4">Chưa có bài hát gợi ý nào.</div>;
    }

    return (
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {songs.map((song) => {
          const artistName = song.artists?.[0]?.name || "Nhiều nghệ sĩ";
          const coverUrl = song.cover_url || `https://i.pravatar.cc/400?u=${song.id}`;
          
          return (
            <div 
              key={song.id} 
              onClick={() => playSong({
                id: song.id,
                title: song.title,
                audio_url: song.audio_url,
                cover_url: coverUrl,
                artist: artistName
              })}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start bg-neutral-900/50 hover:bg-neutral-800 p-4 rounded-xl flex flex-col transition duration-300 cursor-pointer group"
            >
              <div className="relative aspect-square w-full rounded-md shadow-lg overflow-hidden mb-4">
                <img src={coverUrl} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt={song.title} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>

                <div className="absolute bottom-1/4 left-3 text-green-400 text-xs font-bold uppercase tracking-wider">Tuyển Chọn AI</div>
                <div className="absolute bottom-4 left-3 text-white font-extrabold text-2xl tracking-tight drop-shadow-md truncate w-[90%]">{song.title}</div>

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button className="w-12 h-12 rounded-full bg-green-500 shadow-2xl flex items-center justify-center text-black hover:scale-105 hover:bg-green-400 cursor-pointer">
                    <i className="fa-solid fa-play ml-1 text-lg"></i>
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-4 min-h-10">
                  Gợi ý từ • {artistName} và những bài hát tương tự.
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-green-500 text-xs font-bold">Cập nhật hôm nay</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mb-12">
      {renderHeader()}
      {renderCarousel()}
    </section>
  );
}
