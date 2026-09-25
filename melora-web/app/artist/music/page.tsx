"use client";

import React, { useState, useEffect } from "react";
import { artistApi } from "@/api/artistApi";

export default function ArtistMusicPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    lyrics: "",
    is_explicit: false,
    audio: null as File | null,
    cover: null as File | null,
  });

  const fetchMySongs = async () => {
    try {
      setIsLoading(true);
      const res: any = await artistApi.getMySongs();
      const songList = Array.isArray(res) ? res : (res?.data ?? res ?? []);
      setSongs(songList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMySongs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "cover") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [type]: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return; 
    if (!formData.title || !formData.audio) {
      alert("Vui lòng điền đủ tên bài hát và file MP3!");
      return;
    }

    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("audio", formData.audio);
      if (formData.cover) payload.append("cover", formData.cover);
      if (formData.lyrics) payload.append("lyrics", formData.lyrics);
      payload.append("is_explicit", formData.is_explicit ? "1" : "0");

      await artistApi.uploadSong(payload);
      alert("Tải lên thành công! Bài hát đang chờ duyệt.");
      setIsModalOpen(false);
      setFormData({ title: "", lyrics: "", is_explicit: false, audio: null, cover: null });
      fetchMySongs();
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message || error?.message || "Lỗi không xác định";
      const serverErrors = error?.response?.data?.errors;
      console.error("Upload error:", error?.response?.data || error);
      alert("Lỗi khi tải bài hát lên.\n" + serverMsg + (serverErrors ? "\n" + JSON.stringify(serverErrors) : ""));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bản phát hành này?")) return;
    try {
      await artistApi.deleteSong(id);
      fetchMySongs();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa bài hát");
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold mb-2">Kho nhạc của tôi</h2>
        <p className="text-zinc-400">Quản lý các đĩa đơn, hiển thị trạng thái phát hành.</p>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-2 rounded-full transition cursor-pointer">
        <i className="fa-solid fa-cloud-arrow-up mr-2"></i> Tải nhạc lên
      </button>
    </div>
  );

  const renderTable = () => (
    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-4 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-800">
        <div>Bài hát</div>
        <div>Ngày tải lên</div>
        <div>Lượt stream</div>
        <div>Trạng thái</div>
        <div className="text-right">Hành động</div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-zinc-500">Đang tải thư viện nhạc...</div>
      ) : songs.length === 0 ? (
        <div className="p-10 text-center text-zinc-500">
          <p className="mb-4">Bạn chưa phát hành bài hát nào.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer">
            Bắt đầu ngay
          </button>
        </div>
      ) : (
        songs.map((song) => (
          <div key={song.id} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] items-center p-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition">
            <div className="flex items-center gap-3">
              <img src={song.cover_url || "/assets/default_cover.jpg"} alt={song.title} className="w-12 h-12 rounded object-cover" />
              <div>
                <h4 className="font-bold text-white line-clamp-1">{song.title}</h4>
                {song.is_explicit && <span className="text-[10px] bg-zinc-700 px-1 rounded text-zinc-300">E</span>}
              </div>
            </div>
            <div className="text-sm text-zinc-400">{new Date(song.created_at).toLocaleDateString("vi-VN")}</div>
            <div className="text-sm font-medium">{song.play_count?.toLocaleString() || 0}</div>
            <div>
              <span className={`text-xs px-2 py-1 rounded-full ${song.status === "PUBLISHED" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-500"}`}>
                {song.status === "PUBLISHED" ? "Đã duyệt" : "Đang chờ"}
              </span>
            </div>
            <div className="text-right">
              <button onClick={() => handleDelete(song.id)} className="text-zinc-500 hover:text-red-400 p-2 cursor-pointer transition">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl w-full max-w-xl">
          <h3 className="text-2xl font-bold mb-6">Tải lên bài hát mới</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Tên bài hát</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded px-4 py-3 outline-none focus:border-purple-500 text-white"
                placeholder="Ví dụ: Nơi Này Có Anh..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">File âm thanh (.mp3, .wav)</label>
              <input required type="file" accept="audio/*" onChange={(e) => handleFileChange(e, "audio")} className="w-full bg-zinc-950 border border-zinc-700 rounded px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Ảnh bìa (Cover Art)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "cover")} className="w-full bg-zinc-950 border border-zinc-700 rounded px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_explicit} onChange={(e) => setFormData({ ...formData, is_explicit: e.target.checked })} className="w-4 h-4 accent-purple-500" />
                <span className="text-sm text-zinc-300">Bài hát có chứa ngôn từ nhạy cảm (18+)</span>
              </label>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold cursor-pointer transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full font-bold cursor-pointer transition flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Đang tải lên...
                  </>
                ) : (
                  "Tải lên"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      {renderHeader()}
      {renderTable()}
      {renderModal()}
    </div>
  );
}
