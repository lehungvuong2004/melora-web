"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });

  const fetchUsers = async (search = "") => {
    try {
      setIsLoading(true);
      const res: any = await axiosClient.get("/admin/users", { params: { search } });
      setUsers(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", status: "ACTIVE" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const data: any = { ...formData };
        if (!data.password) {
          delete data.password;
        }
        await axiosClient.put(`/admin/users/${editingUser.id}`, data);
        alert("Cập nhật thành công!");
      } else {
        await axiosClient.post("/admin/users", formData);
        alert("Thêm người dùng thành công!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi lưu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await axiosClient.delete(`/admin/users/${id}`);
      alert("Đã xóa người dùng");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa người dùng");
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm người dùng..."
        className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 w-1/3 text-sm focus:outline-none focus:border-purple-500"
      />
      <button onClick={() => handleOpenModal()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm transition cursor-pointer">
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

      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">Đang tải dữ liệu...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">Không có dữ liệu</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
            <div className="px-4 py-4 font-medium text-white">{user.name}</div>
            <div className="px-4 py-4 truncate">{user.email}</div>
            <div className="px-4 py-4">
              {user.roles?.map((r: any) => (
                <span key={r.id} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs border border-zinc-700 mr-1 uppercase">
                  {r.name}
                </span>
              ))}
            </div>
            <div className="px-4 py-4">
              <span className={`font-medium ${user.status === "ACTIVE" ? "text-green-500" : "text-red-500"}`}>{user.status}</span>
            </div>
            <div className="px-4 py-4 flex gap-3">
              <button onClick={() => handleOpenModal(user)} className="text-zinc-400 hover:text-white transition cursor-pointer" title="Sửa">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              {user.id > 3 && (
                <button onClick={() => handleDelete(user.id)} className="text-zinc-400 hover:text-red-500 transition cursor-pointer" title="Xóa">
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h3>
          <form onSubmit={handleSave} className="grid gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Tên</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled={!!editingUser}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Mật khẩu {editingUser && "(Để trống nếu không đổi)"}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                required={!editingUser}
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="BANNED">BANNED</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 rounded text-zinc-300 hover:bg-zinc-800 transition text-sm font-medium cursor-pointer">
                Hủy
              </button>
              <button type="submit" className="py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition text-sm font-medium cursor-pointer">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 relative grid gap-6">
        {renderHeader()}
        {renderTable()}
      </div>

      {renderModal()}
    </div>
  );
}
