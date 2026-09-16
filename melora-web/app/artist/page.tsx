import React from "react";

export default function ArtistDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black mb-2">Chào mừng trở lại!</h2>
        <p className="text-zinc-400">Xem khán giả đang tương tác với âm nhạc của bạn như thế nào nhé.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Người nghe tháng này</h3>
          <p className="text-3xl font-bold text-white">45,120</p>
          <p className="text-green-400 text-sm mt-2"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+12%</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Lượt streams</h3>
          <p className="text-3xl font-bold text-white">128,940</p>
          <p className="text-green-400 text-sm mt-2"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+8.4%</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Lượt theo dõi (Followers)</h3>
          <p className="text-3xl font-bold text-white">8,450</p>
        </div>
        <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900 transition border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-1 text-sm uppercase tracking-wider">Lượt thêm vào Playlist</h3>
          <p className="text-3xl font-bold text-white">1,200</p>
        </div>
      </div>
      
      {/* Upload button area */}
      <div className="p-8 bg-gradient-to-br from-blue-900/40 to-black border border-blue-900/50 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Phát hành đĩa đơn tiếp theo?</h3>
          <p className="text-zinc-300">Tải nhạc của bạn lên Melora và kết nối với hàng triệu người nghe đam mê âm nhạc.</p>
        </div>
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition">
          Tạo bản phát hành mới
        </button>
      </div>
    </div>
  );
}
