import React from "react";

export default function ArtistMusicPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Kho nhạc của tôi</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-bold text-sm transition">
          <i className="fa-solid fa-plus mr-2"></i> Tải nhạc lên
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition cursor-pointer group">
          <div className="aspect-square bg-zinc-800 rounded-lg mb-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
               <i className="fa-solid fa-pen text-white text-xl"></i>
             </div>
          </div>
          <h3 className="font-bold text-white truncate">Single 1</h3>
          <p className="text-sm text-zinc-400 mt-1">Single • Đã phát hành</p>
        </div>
      </div>
    </div>
  );
}
