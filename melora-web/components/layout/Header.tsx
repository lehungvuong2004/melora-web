"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchModal from "@/components/ui/SearchModal";
import axiosClient from "@/api/axiosClient";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res: any = await axiosClient.get("/notifications");
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setNotifications(Array.isArray(list) ? list : []);
    } catch {
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setTimeout(() => setIsLoggedIn(true), 0);
      axiosClient
        .get("/auth/me")
        .then((res: any) => {
          let userData = res;
          if (res?.data?.data) userData = res.data.data;
          else if (res?.data) userData = res.data;
          else if (res?.user) userData = res.user;
          setUser(userData);
        })
        .catch(() => {});
        
      fetchNotifications();
    }
  }, []);

  const markAllAsRead = async () => {
    try {
      await axiosClient.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({...n, is_read: true})));
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axiosClient.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? {...n, is_read: true} : n));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  const handleUpgradePremium = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    setIsLoadingPayment(true);
    try {
      const response: any = await axiosClient.post("/payments", {
        amount: 50000,
        plan: "PREMIUM",
        provider: "VNPAY",
      });

      const paymentUrl = response?.payment_url || response?.url || response?.data?.payment_url;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Đã xảy ra lỗi khi kết nối với VNPay.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const renderNavButtons = () => (
    <div className="hidden md:flex items-center gap-2">
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-neutral-900 transition text-neutral-200">
        <i className="fa-solid fa-chevron-left text-sm"></i>
      </button>
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 hover:bg-neutral-900 transition text-neutral-200 cursor-not-allowed opacity-50">
        <i className="fa-solid fa-chevron-right text-sm"></i>
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative group w-full max-w-sm md:max-w-md cursor-pointer" onClick={() => setIsSearchModalOpen(true)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i className="fa-solid fa-magnifying-glass text-neutral-400 group-hover:text-white transition"></i>
      </div>
      <input
        type="text"
        readOnly
        placeholder="Tìm kiếm bài hát, nghệ sĩ, album hoặc podcast..."
        className="w-full bg-neutral-900 group-hover:bg-neutral-800 text-neutral-100 text-sm rounded-full py-2.5 pl-10 pr-4 outline-none transition ring-1 ring-neutral-800 group-hover:ring-white/20 placeholder-neutral-400 font-medium truncate cursor-pointer pointer-events-none"
      />
    </div>
  );

  const renderProfileTools = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center gap-4 justify-end ml-2 font-bold">
          <Link href="/auth/register" className="text-neutral-400 hover:text-white hover:scale-105 transition text-sm">
            Đăng ký
          </Link>
          <Link href="/auth/login" className="px-6 py-2.5 rounded-full bg-white text-black hover:scale-105 transition text-sm">
            Đăng nhập
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 justify-end ml-2">
        <button
          onClick={handleUpgradePremium}
          disabled={isLoadingPayment}
          className="hidden sm:flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-neutral-600 text-sm font-bold text-white hover:border-white hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoadingPayment ? <i className="fa-solid fa-spinner fa-spin"></i> : "Nâng cấp Premium"}
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            onBlur={() => setTimeout(() => setIsNotifDropdownOpen(false), 200)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full transition cursor-pointer ${isNotifDropdownOpen ? "bg-neutral-800 text-white" : "hover:bg-neutral-800 text-neutral-300 hover:text-white"}`}
          >
            <i className="fa-solid fa-bell text-lg"></i>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-500 shadow-sm border border-neutral-950"></span>
            )}
          </button>
          
          {isNotifDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="p-3 border-b border-neutral-800 flex justify-between items-center">
                <span className="font-bold text-white">Xóa cảnh báo</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-neutral-400 hover:text-white transition">
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-neutral-500">Chưa có thông báo nào</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.is_read && markAsRead(n.id)}
                      className={`p-3 border-b border-neutral-800/50 hover:bg-neutral-800 cursor-pointer transition ${!n.is_read ? "bg-neutral-800/30" : "opacity-70"}`}
                    >
                      <div className="flex gap-2 items-start">
                        {!n.is_read && <span className="h-2 w-2 mt-1.5 rounded-full bg-green-500 shrink-0"></span>}
                        <div>
                          <div className={`text-sm ${!n.is_read ? 'font-bold text-white' : 'font-medium text-neutral-300'}`}>{n.title}</div>
                          <div className="text-xs text-neutral-400 mt-1 line-clamp-2">{n.message}</div>
                          <div className="text-[10px] text-neutral-500 mt-1">{new Date(n.created_at).toLocaleString("vi-VN")}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative group">
          <button className="flex items-center gap-2 rounded-full p-1 pr-3 bg-black group-hover:bg-neutral-800 transition border border-transparent text-neutral-300 group-hover:text-white cursor-pointer">
            <img src={user?.avatar_url || "https://i.pravatar.cc/150?img=11"} alt="User Avatar" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-sm font-bold tracking-wide">{user?.name || "Người dùng"}</span>
            <i className="fa-solid fa-chevron-down text-xs ml-1 transition-transform group-hover:rotate-180"></i>
          </button>

          <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
            <ul className="text-sm text-neutral-300">
              {user?.roles?.some((r: any) => r.name === "ADMIN") && (
                <li>
                  <Link href="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                    <i className="fa-solid fa-chart-line w-4 text-center"></i>
                    Dashboard Admin
                  </Link>
                </li>
              )}
              {user?.roles?.some((r: any) => r.name === "ARTIST") && (
                <li>
                  <Link href="/artist" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                    <i className="fa-solid fa-music w-4 text-center"></i>
                    Dashboard Artist
                  </Link>
                </li>
              )}
              <li>
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                  <i className="fa-solid fa-user w-4 text-center"></i>
                  Hồ sơ
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors">
                  <i className="fa-solid fa-gear w-4 text-center"></i>
                  Cài đặt
                </Link>
              </li>
              <li className="border-t border-neutral-800 my-1 mx-2"></li>
              <li>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer">
                  <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="grid grid-cols-[auto_1fr_auto] py-4 items-center gap-2 md:gap-4 px-6 sticky top-0 bg-neutral-950 z-40">
        {renderNavButtons()}
        {renderSearchBar()}
        {renderProfileTools()}
      </header>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
}
