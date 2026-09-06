import React from "react";
import Link from "next/link";

export default function Sidebar() {
  const playlists = [
    "Những Ngày Mưa Chill",
    "V-Pop Indie Tinh Tuyển",
    "Đêm Hà Nội Lofi",
    "Gym Hype Vietnamese Rap",
    "Acoustic Cafe Sài Gòn",
    "Top 50 Việt Nam Hôm Nay",
  ];

  const renderLogo = () => (
    <div className="flex items-center gap-2 mb-8 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500 text-black font-extrabold text-lg">
        M
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-tight text-white uppercase">
          Melora
        </span>
        <span className="text-xs font-bold text-green-500 tracking-wider">
          ● ACOUSTIC
        </span>
      </div>
    </div>
  );

  const renderPrimaryNav = () => (
    <nav className="flex flex-col gap-2 mb-8">
      <Link
        href="/"
        className="flex items-center gap-4 px-4 py-3 rounded-full border border-green-500/50 bg-neutral-900/50 text-green-400 font-semibold transition hover:text-green-300"
      >
        <i className="fa-solid fa-house text-lg w-5 text-center"></i>
        <span>Trang chủ</span>
      </Link>

      <Link
        href="/search"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-magnifying-glass text-lg w-5 text-center"></i>
        <span>Tìm kiếm</span>
      </Link>

      <Link
        href="/library"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-book-open text-lg w-5 text-center"></i>
        <span>Thư viện của bạn</span>
      </Link>

      <Link
        href="/chart"
        className="flex items-center gap-4 px-4 py-3 rounded-full text-neutral-400 font-semibold transition hover:text-white"
      >
        <i className="fa-solid fa-arrow-trend-up text-lg w-5 text-center"></i>
        <span>Bảng Xếp Hạng V-Pop</span>
      </Link>
    </nav>
  );

  const renderPlaylists = () => (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="text-xs font-bold text-neutral-400 tracking-widest uppercase">
          Danh Sách Phát
        </h3>
        <button className="text-neutral-400 hover:text-white transition">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 overflow-y-auto pb-4 scrollbar-hide">
        {playlists.map((playlist, index) => (
          <Link
            key={index}
            href={`/playlist/${index}`}
            className="text-sm font-medium text-neutral-400 hover:text-white transition whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {playlist}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-neutral-950 p-4 border-r border-neutral-900/50">
      {renderLogo()}
      {renderPrimaryNav()}
      {renderPlaylists()}
    </aside>
  );
}
