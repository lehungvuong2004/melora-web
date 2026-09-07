import React from "react";
import Link from "next/link";

export default function Header() {

  const renderNavButtons = () => (
    <div className="hidden md:flex items-center gap-2">
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-neutral-900 transition text-neutral-200">
        <i className="fa-solid fa-chevron-left text-sm"></i>
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-neutral-900 transition text-neutral-200 cursor-not-allowed opacity-50">
        <i className="fa-solid fa-chevron-right text-sm"></i>
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative group w-full max-w-sm md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i className="fa-solid fa-magnifying-glass text-neutral-400"></i>
      </div>
      <input
        type="text"
        placeholder= "Tìm kiếm bài hát, nghệ sĩ, album hoặc podcast..."
        className="w-full bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 text-neutral-100 text-sm rounded-full py-2.5 pl-10 pr-4 outline-none transition ring-1 ring-neutral-800 focus:ring-white/20 placeholder-neutral-400 font-medium truncate"
      />
    </div>
  );

  const renderProfileTools = () => (
    <div className="flex items-center gap-3 justify-end ml-2">
      <button className="hidden sm:flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-neutral-600 text-sm font-bold text-white hover:border-white hover:scale-105 transition">
        Nâng cấp Premium
      </button>

      <button className="relative flex h-8 w-8 items-center justify-center rounded-full group hover:bg-neutral-800 transition text-neutral-300 hover:text-white">
        <i className="fa-solid fa-bell text-lg"></i>
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-500 shadow-sm border border-neutral-950"></span>
      </button>

      <div className="relative group">
        <button className="flex items-center gap-2 rounded-full p-1 pr-3 bg-black group-hover:bg-neutral-800 transition border border-transparent text-neutral-300 group-hover:text-white cursor-pointer">
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="h-7 w-7 rounded-full object-cover" />
          <span className="text-sm font-bold tracking-wide">Vương</span>
          <i className="fa-solid fa-chevron-down text-xs ml-1 transition-transform group-hover:rotate-180"></i>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
          <ul className="text-sm text-neutral-300">
            <li>
              <Link href="/auth/login" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                <i className="fa-solid fa-arrow-right-to-bracket w-4 text-center"></i>
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                <i className="fa-solid fa-user-plus w-4 text-center"></i>
                Đăng ký
              </Link>
            </li>
            <li className="border-t border-neutral-800 my-1 mx-2"></li>
            <li>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                <i className="fa-solid fa-user w-4 text-center"></i>
                Hồ sơ
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                <i className="fa-solid fa-gear w-4 text-center"></i>
                Cài đặt
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <header className="grid grid-cols-[auto_1fr_auto] h-16 items-center gap-2 md:gap-4 px-6 sticky top-0 bg-neutral-950 z-50">
      {renderNavButtons()}
      {renderSearchBar()}
      {renderProfileTools()}
    </header>
  );
}
