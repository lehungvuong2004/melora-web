"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/types/player";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"likes" | "wishlist">("likes");
  const [songs, setSongs] = useState<Song[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = usePlayer();

  useEffect(() => {
    setLoading(true);
    if (activeTab === "likes") {
      axiosClient.get("/me/likes")
        .then((res: any) => {
          setSongs(res?.data && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      axiosClient.get("/me/wishlists")
        .then((res: any) => {
          setWishlistItems(res?.data && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Thư viện của bạn</h1>
      
      <div className="mb-6 border-b border-neutral-800 flex gap-6 text-sm font-semibold">
        <span 
          onClick={() => setActiveTab("likes")}
          className={`pb-2 cursor-pointer transition ${activeTab === 'likes' ? 'text-white border-b-2 border-green-500' : 'text-neutral-400 hover:text-white'}`}>
          Bài hát đã thích
        </span>
        <span
          onClick={() => setActiveTab("wishlist")}
          className={`pb-2 cursor-pointer transition ${activeTab === 'wishlist' ? 'text-white border-b-2 border-green-500' : 'text-neutral-400 hover:text-white'}`}>
          Wishlist
        </span>
      </div>

      {loading ? (
        <p className="text-neutral-400">Đang tải...</p>
      ) : activeTab === "likes" ? (
        songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="fa-solid fa-heart text-4xl text-neutral-600 mb-4"></i>
            <h2 className="text-white font-bold text-xl mb-2">Chưa có bài hát nào</h2>
            <p className="text-neutral-400">Bài hát bạn thích sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {songs.map((song, i) => (
              <div 
                key={song.id} 
                onClick={() => playSong({ 
                  id: song.id, 
                  title: song.title, 
                  audio_url: song.audio_url, 
                  cover_url: song.cover_url, 
                  artist: song.artists?.[0]?.name || "Unknown" 
                })}
                className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-lg cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-neutral-500 w-4 text-right group-hover:hidden">{i + 1}</span>
                  <i className="fa-solid fa-play text-white w-4 text-right hidden group-hover:block"></i>
                  <div className="w-10 h-10 relative">
                    <img src={song.cover_url} alt="" className="object-cover w-full h-full rounded" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{song.title}</h4>
                    <p className="text-neutral-400 text-sm">{song.artists?.[0]?.name || "Unknown Artist"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <i className="fa-regular fa-star text-4xl text-neutral-600 mb-4"></i>
            <h2 className="text-white font-bold text-xl mb-2">Wishlist trống</h2>
            <p className="text-neutral-400">Bạn chưa thêm mục nào vào Wishlist của mình.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {wishlistItems.map((item, i) => {
              const entity = item.wishlistable || {};
              const title = entity.title || entity.name || "Unknown";
              const cover = entity.cover_url || entity.avatar_url || "https://i.pravatar.cc/150";
              const subText = item.wishlistable_type.includes("Song") ? "Bài hát" : "Khác";

              return (
                <div 
                  key={item.id} 
                  onClick={() => {
                    if (item.wishlistable_type.includes("Song")) {
                      playSong({ 
                        id: entity.id, 
                        title: title, 
                        audio_url: entity.audio_url, 
                        cover_url: cover, 
                        artist: entity.artists?.[0]?.name || "Unknown" 
                      });
                    }
                  }}
                  className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-lg cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-500 w-4 text-right group-hover:hidden">{i + 1}</span>
                    <i className="fa-solid fa-play text-white w-4 text-right hidden group-hover:block"></i>
                    <div className="w-10 h-10 relative">
                      <img src={cover} alt="" className="object-cover w-full h-full rounded" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{title}</h4>
                      <p className="text-neutral-400 text-sm">{subText}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
