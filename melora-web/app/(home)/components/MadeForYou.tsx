"use client";

import React, { useRef } from "react";

export default function MadeForYou() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        <p className="text-neutral-400 text-xs">Thưởng thức những playlist thuật toán theo gu nhạc điểm cao dành cho bạn</p>
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

  const renderCarousel = () => (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div 
          key={i} 
          className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start bg-neutral-900/50 hover:bg-neutral-800 p-4 rounded-xl flex flex-col transition duration-300 cursor-pointer group"
        >
          <div className="relative aspect-square w-full rounded-md shadow-lg overflow-hidden mb-4">
            <img src={`https://picsum.photos/400/400?random=${i + 20}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Mix" />
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-1/4 left-3 text-green-400 text-xs font-bold uppercase tracking-wider">Tuyển Chọn AI</div>
            <div className="absolute bottom-4 left-3 text-white font-extrabold text-2xl tracking-tight drop-shadow-md">Mix Hàng Ngày 0{i}</div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button className="w-12 h-12 rounded-full bg-green-500 shadow-2xl flex items-center justify-center text-black hover:scale-105 hover:bg-green-400">
                <i className="fa-solid fa-play ml-1 text-lg"></i>
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed mb-4 min-h-10">V-Indie Chill • Vũ., Trang, Ngọt, Chillies và nhiều nghệ sĩ khác mà bạn yêu thích.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-green-500 text-xs font-bold">Cập nhật hôm nay</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="mb-12">
      {renderHeader()}
      {renderCarousel()}
    </section>
  );
}
