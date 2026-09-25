"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "RESOLVED" | "NOTIFICATIONS">("PENDING");
  const [reports, setReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notification Modals State
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<any>(null);
  const [notifForm, setNotifForm] = useState({ title: "", message: "", type: "system", user_id: "" });

  const [userQuery, setUserQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isNotifModalOpen) return;
      if (userQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res: any = await axiosClient.get("/admin/users", { params: { search: userQuery } });
        setSearchResults(res?.data?.data || res?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [userQuery, isNotifModalOpen]);

  const fetchData = async (tab: string) => {
    try {
      setIsLoading(true);
      if (tab === "NOTIFICATIONS") {
        const res: any = await axiosClient.get("/admin/notifications");
        setNotifications(res?.data?.data || res?.data || []);
      } else {
        const res: any = await axiosClient.get("/admin/reports", { params: { status: tab } });
        setReports(res?.data?.data || res?.data || []);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleUpdateStatus = async (id: number, status: "RESOLVED" | "REJECTED") => {
    try {
      await axiosClient.put(`/admin/reports/${id}`, { status });
      alert(status === "RESOLVED" ? "Đã duyệt/giải quyết báo cáo" : "Đã từ chối báo cáo");
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thực hiện xử lý");
    }
  };

  const handleDeleteNotif = async (id: number) => {
    if (!confirm("Xóa thông báo này khỏi hệ thống?")) return;
    try {
      await axiosClient.delete(`/admin/notifications/${id}`);
      alert("Đã xóa thông báo");
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa");
    }
  };

  const handleSaveNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: notifForm.title,
        message: notifForm.message,
        type: notifForm.type,
        user_id: notifForm.user_id && notifForm.user_id !== "ALL" ? parseInt(notifForm.user_id) : null,
      };

      if (editingNotif) {
        await axiosClient.put(`/admin/notifications/${editingNotif.id}`, payload);
      } else {
        await axiosClient.post("/admin/notifications", payload);
      }

      alert("Đã lưu thông báo thành công!");
      setIsNotifModalOpen(false);
      fetchData(activeTab);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu thông báo");
    }
  };

  const openNotifModal = (notif: any = null) => {
    if (notif) {
      setEditingNotif(notif);
      setNotifForm({ title: notif.title, message: notif.message, type: notif.type, user_id: notif.user_id?.toString() || "ALL" });
      setUserQuery("");
    } else {
      setEditingNotif(null);
      setNotifForm({ title: "", message: "", type: "system", user_id: "ALL" });
      setUserQuery("");
    }
    setSearchResults([]);
    setIsNotifModalOpen(true);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 relative">
      <div className="flex gap-4 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === "PENDING" ? "border-b-2 border-purple-500 text-purple-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Chờ xử lý (PENDING)
        </button>
        <button
          onClick={() => setActiveTab("RESOLVED")}
          className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === "RESOLVED" ? "border-b-2 border-purple-500 text-purple-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Đã xử lý (RESOLVED)
        </button>
        <button
          onClick={() => setActiveTab("NOTIFICATIONS")}
          className={`px-4 py-2 font-medium cursor-pointer transition ${activeTab === "NOTIFICATIONS" ? "border-b-2 border-purple-500 text-purple-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          Thông báo hệ thống
        </button>
      </div>
      {activeTab === "NOTIFICATIONS" && (
        <button onClick={() => openNotifModal()} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium cursor-pointer transition">
          + Gửi thông báo
        </button>
      )}
    </div>
  );

  const renderReportsTable = () => (
    <div className="overflow-x-auto min-w-200">
      <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] bg-zinc-950/50 text-zinc-400 font-medium rounded-t-lg">
        <div className="px-4 py-3">Người báo cáo</div>
        <div className="px-4 py-3">Lý do & Nội dung</div>
        <div className="px-4 py-3">Đối tượng vi phạm</div>
        <div className="px-4 py-3">Ngày gửi</div>
        <div className="px-4 py-3">Hành động</div>
      </div>
      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">Đang tải...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">Trống</div>
      ) : (
        reports.map((report) => {
          let reportedType = "Không rõ";
          let reportedName = "";
          if (report.song) {
            reportedType = "Bài hát";
            reportedName = report.song.title;
          } else if (report.artist) {
            reportedType = "Nghệ sĩ";
            reportedName = report.artist.name;
          } else if (report.playlist) {
            reportedType = "Playlist";
            reportedName = report.playlist.name;
          }
          return (
            <div key={report.id} className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
              <div className="px-4 py-4 truncate text-white">{report.user?.name || "Unknown"}</div>
              <div className="px-4 py-4">
                <div className="text-white mb-1">{report.reason}</div>
                {report.description && <div className="text-xs text-zinc-400 italic line-clamp-2">{report.description}</div>}
              </div>
              <div className="px-4 py-4 flex flex-col">
                <span className="text-xs text-zinc-500 uppercase">{reportedType}</span>
                <span className="truncate text-white" title={reportedName}>
                  {reportedName}
                </span>
              </div>
              <div className="px-4 py-4 text-sm">{new Date(report.created_at).toLocaleDateString("vi-VN")}</div>
              <div className="px-4 py-4 flex gap-2">
                {report.status === "PENDING" ? (
                  <>
                    <button onClick={() => handleUpdateStatus(report.id, "RESOLVED")} className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs cursor-pointer">
                      Xử lý
                    </button>
                    <button onClick={() => handleUpdateStatus(report.id, "REJECTED")} className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-xs cursor-pointer">
                      Bỏ qua
                    </button>
                  </>
                ) : (
                  <span className="text-green-500">{report.status}</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderNotifsTable = () => (
    <div className="overflow-x-auto min-w-200">
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] bg-zinc-950/50 text-zinc-400 font-medium rounded-t-lg">
        <div className="px-4 py-3">Người nhận</div>
        <div className="px-4 py-3">Nội dung</div>
        <div className="px-4 py-3">Loại</div>
        <div className="px-4 py-3">Ngày gửi</div>
        <div className="px-4 py-3">Hành động</div>
      </div>
      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">Đang tải...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">Chưa có thông báo nào</div>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] border-b border-zinc-800/50 hover:bg-zinc-800/20 items-center">
            <div className="px-4 py-4 font-medium text-white truncate">{notif.user_id ? notif.user?.name || `User ID: ${notif.user_id}` : "Tất cả người dùng"}</div>
            <div className="px-4 py-4">
              <div className="font-bold text-white mb-1">{notif.title}</div>
              <div className="text-xs text-zinc-400 line-clamp-2">{notif.message}</div>
            </div>
            <div className="px-4 py-4 text-sm text-yellow-400 uppercase">{notif.type}</div>
            <div className="px-4 py-4 text-sm">{new Date(notif.created_at).toLocaleDateString("vi-VN")}</div>
            <div className="px-4 py-4 flex gap-2">
              <button onClick={() => openNotifModal(notif)} className="text-zinc-400 hover:text-white transition cursor-pointer px-2">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button onClick={() => handleDeleteNotif(notif.id)} className="bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded text-xs font-medium cursor-pointer transition">
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderNotifModal = () => {
    if (!isNotifModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-4">{editingNotif ? "Sửa thông báo" : "Tạo thông báo mới"}</h3>
          <form onSubmit={handleSaveNotif} className="grid gap-4">
            {!editingNotif && (
              <div className="relative">
                <label className="block text-sm text-zinc-400 mb-1">Người nhận</label>

                {notifForm.user_id !== "ALL" ? (
                  <div className="flex items-center justify-between w-full bg-purple-900/30 border border-purple-500 rounded px-3 py-2 text-sm text-white">
                    <span>Đã chọn User ID: {notifForm.user_id}</span>
                    <button type="button" onClick={() => setNotifForm({ ...notifForm, user_id: "ALL" })} className="text-zinc-400 hover:text-white cursor-pointer">
                      <i className="fa-solid fa-xmark"></i> Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Tìm kiếm Email hoặc Tên... (Bỏ trống = Gửi TẤT CẢ)"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    />
                    {userQuery.trim().length > 0 && (
                      <div className="absolute top-16 left-0 right-0 bg-zinc-950 border border-zinc-800 rounded-b mt-1 max-h-40 overflow-y-auto z-10">
                        {isSearching ? (
                          <div className="p-3 text-sm text-zinc-500 text-center">Đang tìm kiếm...</div>
                        ) : searchResults.length === 0 ? (
                          <div className="p-3 text-sm text-zinc-500 text-center">Không tìm thấy ai</div>
                        ) : (
                          searchResults.map((u) => (
                            <div
                              key={u.id}
                              onClick={() => {
                                setNotifForm({ ...notifForm, user_id: u.id.toString() });
                                setUserQuery("");
                                setSearchResults([]);
                              }}
                              className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer transition border-b border-zinc-800/50 last:border-0"
                            >
                              {u.name} <span className="text-zinc-500">({u.email})</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Loại thông báo</label>
                <select
                  value={notifForm.type}
                  onChange={(e) => setNotifForm({ ...notifForm, type: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  disabled={!!editingNotif}
                >
                  <option value="system">Hệ thống (System)</option>
                  <option value="warning">Cảnh báo (Warning)</option>
                  <option value="promo">Khuyến mãi (Promo)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={notifForm.title}
                  onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nội dung</label>
              <textarea
                value={notifForm.message}
                onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none min-h-[100px]"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button type="button" onClick={() => setIsNotifModalOpen(false)} className="py-2 rounded text-zinc-300 hover:bg-zinc-800 cursor-pointer">
                Hủy
              </button>
              <button type="submit" className="py-2 rounded bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
                Lưu & Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Quản lý Báo cáo & Cảnh báo</h2>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 relative grid gap-6">
        {renderHeader()}
        {activeTab === "NOTIFICATIONS" ? renderNotifsTable() : renderReportsTable()}
      </div>

      {renderNotifModal()}
    </div>
  );
}
