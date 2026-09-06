import React from "react";

export default function NewReleases() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-1">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-green-500 rounded-full"></div> Album & Đĩa Đơn Mới
          </h3>
          <p className="text-neutral-400 text-xs">Tuyển tập các sản phẩm âm nhạc mới phát hành trong 24 giờ qua</p>
        </div>
        <a href="#" className="text-sm font-semibold text-neutral-400 border border-neutral-700 px-4 py-1.5 rounded-full hover:border-white hover:text-white transition">
          Tất cả định dạng
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-square w-full rounded-md shadow-lg overflow-hidden mb-3 bg-neutral-900">
              <img src={`https://picsum.photos/400/400?random=${i + 40}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"></div>

              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                <span className="bg-green-500 text-black text-xs font-bold px-1.5 py-0.5 rounded tracking-wide">MỚI</span>
                <span className="bg-neutral-900/80 text-cyan-400 border border-neutral-600 text-xs font-bold px-1.5 py-0.5 rounded tracking-wide backdrop-blur-sm">LOSSLESS 24-BIT</span>
              </div>

              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button className="w-10 h-10 rounded-full bg-green-500 shadow-xl flex items-center justify-center text-black hover:scale-105 hover:bg-green-400">
                  <i className="fa-solid fa-play ml-0.5 text-sm"></i>
                </button>
              </div>
            </div>

            <h4 className="text-white font-bold text-sm truncate mb-1 group-hover:underline">Album Đỉnh Cao Số {i}</h4>
            <p className="text-neutral-400 text-xs truncate mb-2">Ca sĩ Nghệ Thuật</p>
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Album • 2024</span>
              <span>{10 + i} bài hát</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
