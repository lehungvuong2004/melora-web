import React from "react";

export default function RecentlyPlayed() {
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
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition cursor-pointer group">
            <div className="relative aspect-square w-full mb-3 rounded-md overflow-hidden shadow-lg">
              <img src={`https://picsum.photos/400/400?random=${i}`} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 shadow-xl transition translate-y-2 group-hover:translate-y-0">
                  <i className="fa-solid fa-play text-lg ml-1"></i>
                </button>
              </div>
            </div>
            <h4 className="text-white font-bold text-sm truncate mb-1">Vũ Trụ Có Anh</h4>
            <p className="text-neutral-400 text-xs truncate mb-2">Phương Mỹ Chi, Pháo</p>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-green-500 text-xs"></i>
              <span className="text-green-500 text-xs font-bold uppercase">24-bit Lossless</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
