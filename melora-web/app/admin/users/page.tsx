import React from "react";

export default function AdminUsersPage() {
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <input 
        type="text" 
        placeholder="Tìm kiếm người dùng..."
        className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 w-1/3 text-sm focus:outline-none focus:border-purple-500" 
      />
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm transition">
        Thêm người dùng mới
      </button>
    </div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto min-w-200">
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] bg-zinc-950/50 text-zinc-400 font-medium rounded-t-lg">
        <div className="px-4 py-3">Tên</div>
        <div className="px-4 py-3">Email</div>
        <div className="px-4 py-3">Vai trò</div>
        <div className="px-4 py-3">Trạng thái</div>
        <div className="px-4 py-3">Hành động</div>
      </div>
      
      {/* Dữ liệu mẫu */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
        <div className="px-4 py-4 font-medium text-white">Người dùng A</div>
        <div className="px-4 py-4 truncate">nguoidunga@gmail.com</div>
        <div className="px-4 py-4"><span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs border border-zinc-700">USER</span></div>
        <div className="px-4 py-4"><span className="text-green-500 font-medium">ACTIVE</span></div>
        <div className="px-4 py-4">
          <button className="text-zinc-400 hover:text-white transition"><i className="fa-solid fa-pen-to-square"></i></button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
      
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        {renderHeader()}
        {renderTable()}
      </div>
    </div>
  );
}
