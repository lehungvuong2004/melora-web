"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

export default function FeaturedArtists() {
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    axiosClient.get("/artists")
      .then((res: any) => {
        let items = res?.data?.data || res?.data || res || [];
        if (Array.isArray(items)) {
          items = items.sort(() => 0.5 - Math.random());
          setArtists(items.slice(0, 6));
        }
      })
      .catch((err) => console.error("Failed to fetch artists:", err));
  }, []);

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6 px-1">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <div className="w-1 h-5 bg-green-500 rounded-full"></div> Nghệ Sĩ Nổi Bật
      </h3>
      <Link href="/search" className="text-sm font-semibold text-green-500 hover:text-green-400 transition group border border-green-500/30 px-3 py-1 rounded-full hover:bg-green-500/10">
        Khám phá thêm <i className="fa-solid fa-chevron-right text-xs ml-1 transition-transform group-hover:translate-x-1"></i>
      </Link>
    </div>
  );

  const renderArtistGrid = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
      {artists.length === 0 ? (
        <div className="col-span-full text-neutral-500 text-sm py-4">Đang tải danh sách nghệ sĩ...</div>
      ) : (
        artists.map((artist) => {
          const avatarUrl = artist.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random`;
          const listeners = artist.monthly_listeners > 0 ? (artist.monthly_listeners / 1000000).toFixed(1) + "M" : (Math.random() * 5 + 1).toFixed(1) + "M";

          return (
            <div key={artist.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 shadow-xl relative border-2 border-transparent group-hover:border-green-500 transition-all duration-300">
                <img src={avatarUrl} className="w-full h-full object-cover" alt={artist.name} />
              </div>
              <h4 className="text-white font-bold text-sm mb-1 flex items-center justify-center gap-1 hover:underline truncate w-full px-2">
                {artist.name} {artist.is_verified || true ? <i className="fa-solid fa-circle-check text-blue-500 text-xs shrink-0"></i> : null}
              </h4>
              <p className="text-neutral-500 text-xs mb-2">{listeners} Người nghe</p>
              <button className="px-4 py-1 rounded-full border border-neutral-600 text-xs font-bold text-white hover:border-white transition">Theo dõi</button>
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <section className="mb-12">
      {renderHeader()}
      {renderArtistGrid()}
    </section>
  );
}
