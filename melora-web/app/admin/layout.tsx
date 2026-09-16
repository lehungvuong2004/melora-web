import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-zinc-950 flex flex-col border-r border-zinc-900">
        <div className="h-20 flex items-center px-6">
          <Link href="/admin" className="text-2xl font-bold tracking-tighter text-white flex gap-2 items-center">
            <i className="fa-brands fa-spotify text-purple-500"></i>
            Melora <span className="text-sm font-medium text-purple-400">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-chart-pie w-5"></i> Tổng quan
          </Link>
          <Link href="/admin/users" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-users w-5"></i> Quản lý Người dùng
          </Link>
          <Link href="/admin/songs" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-music w-5"></i> Quản lý Bài hát
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-4 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium">
            <i className="fa-solid fa-triangle-exclamation w-5"></i> Báo cáo & Cảnh báo
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-900">
          <Link href="/" className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition font-medium text-sm">
            <i className="fa-solid fa-arrow-left w-5"></i> Về trang nghe nhạc
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-zinc-950 overflow-y-auto">
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur sticky top-0 z-10">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
