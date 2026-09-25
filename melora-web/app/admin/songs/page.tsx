"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

export default function AdminSongsPage() {
  const [activeTab, setActiveTab] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "" });

  const [searchQuery, setSearchQuery] = useState("");

  const fetchSongs = async (status: string, search = "") => {
    try {
      setIsLoading(true);
      const res: any = await axiosClient.get("/admin/songs", { params: { status, search } });
      setSongs(res?.data?.data || res?.data || []);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải danh sách bài hát");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSongs(activeTab, searchQuery);
    }, 400);
    return () => clearTimeout(delay);
  }, [activeTab, searchQuery]);

  const handleApprove = async (id: number, status: "PUBLISHED" | "REJECTED") => {
    try {
      await axiosClient.put(`/admin/songs/${id}/approve`, { status });
      alert(status === "PUBLISHED" ? "Đã duyệt bài hát" : "Đã từ chối bài hát");
      fetchSongs(activeTab, searchQuery);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thực hiện duyệt/từ chối");
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài hát này?")) return;
    try {
      await axiosClient.delete(`/admin/songs/${id}`);
      alert("Đã xóa bài hát");
      fetchSongs(activeTab, searchQuery);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa bài hát");
    }
  };

  const handleOpenEdit = (song: any) => {
    setEditingSong(song);
    setFormData({ title: song.title });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/admin/songs/${editingSong.id}`, formData);
      alert("Cập nhật tên bài hát thành công!");
      setIsModalOpen(false);
      fetchSongs(activeTab, searchQuery);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật bài hát");
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 relative">
      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab("DRAFT")}
          className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === "DRAFT" ? "border-b-2 border-purple-500 text-purple-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Chờ duyệt
        </button>
        <button 
          onClick={() => setActiveTab("PUBLISHED")}
          className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === "PUBLISHED" ? "border-b-2 border-purple-500 text-purple-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Đã đăng
        </button>
      </div>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm bài hát, nghệ sĩ..."
        className="bg-zinc-950 border border-zinc-800 rounded px-4 py-2 w-1/3 text-sm focus:outline-none focus:border-purple-500" 
      />
    </div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto min-w-200">
      <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] bg-zinc-950/50 text-zinc-400 font-medium rounded-t-lg">
        <div className="px-4 py-3">Bài hát</div>
        <div className="px-4 py-3">Nghệ sĩ</div>
        <div className="px-4 py-3">Ngày Tải Lên</div>
        <div className="px-4 py-3">Trạng thái</div>
        <div className="px-4 py-3">Hành động</div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">Đang tải dữ liệu...</div>
      ) : songs.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">Chưa có bài hát nào</div>
      ) : (
        songs.map((song) => (
          <div key={song.id} className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
            <div className="px-4 py-4 font-medium text-white flex items-center gap-3">
              <img src={song.cover_url || "https://placehold.co/100x100"} alt="Cover" className="h-10 w-10 bg-zinc-800 rounded object-cover" />
              <div className="flex flex-col overflow-hidden">
                <span className="truncate" title={song.title}>{song.title}</span>
                {song.album && <span className="text-xs text-zinc-500 truncate" title={song.album.title}>{song.album.title}</span>}
              </div>
            </div>
            <div className="px-4 py-4 truncate">
              {song.artists?.length ? song.artists.map((a: any) => a.name).join(', ') : "Không rõ"}
            </div>
            <div className="px-4 py-4 text-sm">
              {new Date(song.created_at).toLocaleDateString("vi-VN")}
            </div>
            <div className="px-4 py-4">
              <span className={`font-medium ${song.status === "DRAFT" ? "text-yellow-500" : song.status === "PUBLISHED" ? "text-green-500" : "text-red-500"}`}>
                {song.status}
              </span>
            </div>
            <div className="px-4 py-4 flex gap-2 flex-wrap">
              <button 
                onClick={() => handleOpenEdit(song)}
                className="text-zinc-400 hover:text-white transition cursor-pointer px-2"
                title="Sửa bài hát"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>

              {song.status === "DRAFT" ? (
                <>
                  <button 
                    onClick={() => handleApprove(song.id, "PUBLISHED")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium cursor-pointer transition"
                  >
                    Duyệt
                  </button>
                  <button 
                    onClick={() => handleApprove(song.id, "REJECTED")}
                    className="bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded text-xs font-medium cursor-pointer transition"
                  >
                    Từ chối
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleDelete(song.id)}
                  className="bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded text-xs font-medium cursor-pointer transition"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderEditModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Sửa tên bài hát</h3>
          <form onSubmit={handleSaveEdit} className="grid gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Tên bài hát</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({ title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="py-2 rounded text-zinc-300 hover:bg-zinc-800 transition text-sm font-medium cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="py-2 rounded bg-purple-600 hover:bg-purple-700 text-white transition text-sm font-medium cursor-pointer"
              >
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
      <h2 className="text-2xl font-bold">Quản lý Bài hát & Nội dung</h2>
      
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 relative grid gap-2">
        {renderHeader()}
        {renderTable()}
      </div>

      {renderEditModal()}
    </div>
  );
}
