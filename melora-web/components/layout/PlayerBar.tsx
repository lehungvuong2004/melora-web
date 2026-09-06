import React from "react";

export default function PlayerBar() {
  return (
    <footer className="h-24 w-full bg-black border-t border-neutral-900 flex items-center justify-between px-4 z-50">
      
      {/* 1. Now Playing Info (Left) */}
      <div className="flex items-center w-1/3 min-w-0">
        <div className="relative h-14 w-14 rounded overflow-hidden mr-4 shadow bg-neutral-800 shrink-0">
          <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200" alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">Chúng Ta Của Tương Lai</h4>
            <span className="bg-green-900/50 text-green-400 border border-green-700/50 text-xs font-bold px-1.5 py-0.5 rounded tracking-wide shrink-0">LOSSLESS</span>
          </div>
          <p className="text-xs text-neutral-400 truncate hover:underline cursor-pointer">Sơn Tùng M-TP</p>
        </div>
        <button className="cursor-pointer text-green-500 hover:text-green-400 transition w-8 h-8 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-heart"></i>
        </button>
        <button className="cursor-pointer text-neutral-400 hover:text-white transition w-8 h-8 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-microphone-lines"></i>
        </button>
      </div>

      {/* 2. Player Controls (Center) */}
      <div className="flex flex-col items-center justify-center w-1/3 max-w-3xl">
        <div className="flex items-center gap-4 mb-2">
          <button className="cursor-pointer text-green-500 hover:text-green-400 transition flex items-center justify-center relative">
            <i className="fa-solid fa-shuffle text-sm"></i>
            <span className="w-1 h-1 bg-green-500 rounded-full absolute -bottom-2"></span>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition">
             <i className="fa-solid fa-play ml-0.5"></i>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center text-lg">
            <i className="fa-solid fa-forward-step"></i>
          </button>
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center">
            <i className="fa-solid fa-repeat text-sm"></i>
          </button>
        </div>
        
        <div className="flex items-center w-full gap-2">
          <span className="text-xs font-medium text-neutral-400 w-10 text-right">02:41</span>
          <div className="flex-1 group flex items-center h-4 cursor-pointer">
             <div className="w-full h-1 bg-neutral-800 rounded-full flex">
                <div className="h-full bg-white group-hover:bg-green-500 rounded-full relative w-2/3">
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow hidden group-hover:block"></div>
                </div>
             </div>
          </div>
          <span className="text-xs font-medium text-neutral-400 w-10 text-left">04:12</span>
        </div>
      </div>

      {/* 3. Extra Controls (Right) */}
      <div className="flex items-center justify-end w-1/3 gap-2 shrink-0">
        <button className="cursor-pointer text-neutral-400 hover:text-white transition w-8 h-8 flex items-center justify-center">
          <i className="fa-solid fa-list-ul text-sm"></i>
        </button>
        <button className="cursor-pointer text-green-500 transition w-8 h-8 flex items-center justify-center">
          <i className="fa-solid fa-laptop text-sm"></i>
        </button>
        <div className="flex items-center gap-2 w-32 group">
          <button className="cursor-pointer text-neutral-400 hover:text-white transition flex items-center justify-center w-6">
            <i className="fa-solid fa-volume-high text-sm"></i>
          </button>
          <div className="flex-1 flex items-center h-4 cursor-pointer">
             <div className="w-full h-1 bg-neutral-800 rounded-full flex">
                <div className="h-full bg-white group-hover:bg-green-500 rounded-full relative w-4/5">
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow hidden group-hover:block"></div>
                </div>
             </div>
          </div>
        </div>
        <button className="cursor-pointer text-neutral-400 hover:text-white transition w-8 h-8 flex items-center justify-center ml-2">
          <i className="fa-solid fa-expand text-sm"></i>
        </button>
      </div>

    </footer>
  );
}
