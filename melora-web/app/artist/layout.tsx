import React from "react";
import Link from "next/link";

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Artist */}
      <aside className="w-64 bg-zinc-950 flex flex-col border-r border-zinc-900">
        <div className="h-20 flex items-center px-6">
          <Link href="/artist" className="text-2xl font-bold tracking-tighter text-white flex gap-2 items-center">
            <i className="fa-brands fa-spotify text-blue-500"></i>
            Melora <span className="text-sm font-medium text-blue-400">for Artists</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/artist" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-house w-5"></i> Trang chủ
          </Link>
          <Link href="/artist/music" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-music w-5"></i> Kho nhạc của tôi
          </Link>
          <Link href="/artist/audience" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-chart-line w-5"></i> Người nghe
          </Link>
          <Link href="/artist/profile" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-user-pen w-5"></i> Hồ sơ nghệ sĩ
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-900">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium text-sm">
            <i className="fa-solid fa-arrow-left w-5"></i> Về trang nghe nhạc
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#121212] overflow-y-auto">
        <header className="h-20 border-b border-zinc-900 flex items-center justify-end px-8 bg-[#121212]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">Nghệ sĩ Melora</div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Artist Profile" className="h-9 w-9 rounded-full border-2 border-zinc-800" />
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
