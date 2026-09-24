import React from "react";

export default function ArtistProfilePage() {
  const renderHeader = () => (
    <h2 className="text-3xl font-bold mb-8">Hồ sơ nghệ sĩ</h2>
  );

  const renderProfileInfo = () => (
    <div className="flex items-center gap-8 mb-8">
      <div className="relative h-32 w-32 rounded-full bg-zinc-800 overflow-hidden cursor-pointer group">
        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="object-cover h-full w-full" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <i className="fa-solid fa-camera text-white text-xl"></i>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-2">Tên Nghệ Sĩ</h3>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs border border-blue-500/30">Nghệ sĩ đã xác minh (Verified)</span>
      </div>
    </div>
  );

  const renderForm = () => (
    <form className="space-y-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-400">Tiểu sử (Bio)</label>
        <textarea 
          rows={4}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition"
          placeholder="Chia sẻ vài điều về bạn và âm nhạc của bạn..."
        ></textarea>
      </div>
      
      <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition">
        Lưu thay đổi
      </button>
    </form>
  );

  return (
    <div className="space-y-8 max-w-3xl">
      {renderHeader()}
      <div className="bg-zinc-900 rounded-xl p-8 shadow-sm border border-zinc-800/50">
        {renderProfileInfo()}
        {renderForm()}
      </div>
    </div>
  );
}
