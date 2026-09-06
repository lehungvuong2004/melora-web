import React from "react";

export default function TrendingChart() {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 px-1 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-green-500 rounded-full"></div> Bảng Xếp Hạng Thịnh Hành
          </h3>
          <p className="text-neutral-400 text-xs">MELORA Top 10 ca khúc V-Pop bùng nổ nhất tuần này theo thời gian thực</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-full bg-green-500 text-black text-xs font-bold transition">VIỆT NAM</button>
          <button className="px-4 py-1.5 rounded-full bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 transition">TOÀN CẦU</button>
          <button className="px-4 py-1.5 rounded-full bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 transition">INDIE</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <div key={num} className="flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-800/80 transition cursor-pointer group">
            <span className={`text-xl font-bold w-6 text-center ${num <= 3 ? "text-green-500" : "text-neutral-500"}`}>{num < 10 ? `0${num}` : num}</span>
            <div className="relative h-12 w-12 rounded overflow-hidden">
              <img src={`https://picsum.photos/400/400?random=${num + 10}`} alt="Song" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <i className="fa-solid fa-play text-white text-sm"></i>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm truncate">Bài hát nổi bật {num}</h4>
              <p className="text-neutral-400 text-xs truncate">Ca sĩ hạng {num}</p>
            </div>
            <div className="hidden sm:flex text-neutral-400 text-xs text-right w-20">1.2M lượt</div>
            <div className="text-neutral-400 text-xs w-10 text-right">03:45</div>
          </div>
        ))}
      </div>
    </section>
  );
}
