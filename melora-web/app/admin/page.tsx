import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tổng quan hệ thống</h2>
        <p className="text-zinc-400">Theo dõi thông tin và hoạt động của nền tảng Melora.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-2">Tổng người dùng</h3>
          <p className="text-3xl font-bold text-white">12,450</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-2">Tài khoản Premium</h3>
          <p className="text-3xl font-bold text-purple-400">3,200</p>
        </div>
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <h3 className="text-zinc-400 font-medium mb-2">Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-green-400">160M VNĐ</p>
        </div>
      </div>
      
      {/* Tương lai có thể thêm biểu đồ vào đây */}
    </div>
  );
}
