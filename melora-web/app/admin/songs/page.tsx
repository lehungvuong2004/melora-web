import React from "react";

export default function AdminSongsPage() {
  const renderTabs = () => (
    <div className="flex gap-4 mb-6">
      <button className="px-4 py-2 border-b-2 border-purple-500 text-purple-500 font-medium">Chờ duyệt (DRAFT)</button>
      <button className="px-4 py-2 text-zinc-400 hover:text-zinc-200">Đã đăng (PUBLISHED)</button>
    </div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto min-w-200">
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] bg-zinc-950/50 text-zinc-400 font-medium rounded-t-lg">
        <div className="px-4 py-3">Bài hát</div>
        <div className="px-4 py-3">Nghệ sĩ</div>
        <div className="px-4 py-3">Ngày gửi</div>
        <div className="px-4 py-3">Trạng thái</div>
        <div className="px-4 py-3">Phê duyệt</div>
      </div>
      
      {/* Dữ liệu mẫu */}
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
        <div className="px-4 py-4 font-medium text-white flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-800 rounded"></div>
          Bài hát Mới
        </div>
        <div className="px-4 py-4">Nghệ Sĩ B</div>
        <div className="px-4 py-4">Hôm nay</div>
        <div className="px-4 py-4"><span className="text-yellow-500">DRAFT</span></div>
        <div className="px-4 py-4 flex gap-2">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-medium">Duyệt</button>
          <button className="bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1 rounded text-xs font-medium">Từ chối</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản lý Bài hát & Nội dung</h2>
      
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        {renderTabs()}
        {renderTable()}
      </div>
    </div>
  );
}
