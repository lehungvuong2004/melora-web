import React from "react";

export default function HeroBanner() {
  return (
    <section className="mb-12 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-green-500 tracking-wider">ACOUSTIC SPACE HI-RES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Chào buổi tối, Vương</h1>
          <p className="text-neutral-400 text-sm mt-1">Khám phá âm nhạc tuyển chọn dành riêng cho gu thưởng thức của bạn.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/50">
            <i className="fa-solid fa-chart-simple text-green-500 text-xs"></i>
            <span className="text-xs font-semibold text-neutral-300">FLAC Studio Master</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/50">
            <i className="fa-solid fa-headphones text-neutral-400 text-xs"></i>
            <span className="text-xs font-semibold text-neutral-300">96kHz / 24-bit</span>
          </div>
        </div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden flex flex-col justify-end pt-48 pb-8 px-8 shadow-2xl group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-emerald-900/40 to-black z-0">
          <img
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000"
            alt="Banner"
            className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-black/40 to-transparent z-0"></div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1.5 rounded-full bg-green-500 text-black text-xs font-bold uppercase tracking-wider">Album Độc Quyền Trên Melora</span>
            <span className="px-2.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">Dolby Atmos • M-TP Entertainment</span>
          </div>

          <h4 className="text-green-400 font-bold text-xs tracking-widest uppercase mb-1">Sơn Tùng M-TP • Tuyển tập mới nhất</h4>
          <h2 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg">Chúng Ta Của Tương Lai</h2>
          <p className="text-neutral-300 text-sm max-w-lg mb-6 line-clamp-2 leading-relaxed">
            Bản phối Acoustic thuần khiết đan xen nhịp điệu R&B điện tử đương đại mang bản sắc âm nhạc Việt đột phá.
          </p>

          <div className="flex items-center gap-6 mb-6 text-sm font-semibold text-neutral-300">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-play text-green-500"></i> 48.2M Lượt nghe
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-music text-neutral-400"></i> 12 Bài hát
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-compact-disc text-cyan-400"></i> 24-bit/96kHz Lossless
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-full font-bold transition hover:scale-105">
              <i className="fa-solid fa-play"></i> Phát ngay
            </button>
            <button className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-600 px-6 py-3 rounded-full font-bold transition hover:scale-105 backdrop-blur-md">
              <i className="fa-regular fa-heart"></i> Thêm vào thư viện
            </button>
            <button className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-600 text-white transition backdrop-blur-md">
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            <button className="h-12 w-12 flex items-center justify-center rounded-full bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-600 text-white transition backdrop-blur-md">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
