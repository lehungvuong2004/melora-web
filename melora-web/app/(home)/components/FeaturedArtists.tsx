import React from "react";

export default function FeaturedArtists() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-1 h-5 bg-green-500 rounded-full"></div> Nghệ Sĩ Nổi Bật
        </h3>
        <a href="#" className="text-sm font-semibold text-green-500 hover:text-green-400 transition">
          Khám phá thêm <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center group cursor-pointer">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 shadow-xl relative border-2 border-transparent group-hover:border-green-500 transition-all duration-300">
              <img src={`https://picsum.photos/400/400?random=${i + 30}`} className="w-full h-full object-cover" alt="Artist" />
            </div>
            <h4 className="text-white font-bold text-sm mb-1 flex items-center justify-center gap-1 hover:underline">
              Nghệ sĩ {i} <i className="fa-solid fa-circle-check text-blue-500 text-xs"></i>
            </h4>
            <p className="text-neutral-500 text-xs mb-2">{1.2 + i}M Người nghe</p>
            <button className="px-4 py-1 rounded-full border border-neutral-600 text-xs font-bold text-white hover:border-white transition">Theo dõi</button>
          </div>
        ))}
      </div>
    </section>
  );
}
