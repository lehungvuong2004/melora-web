"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { authApi } from "@/api/authApi";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    axiosClient
      .get("/auth/me")
      .then((res: any) => {
        if (!isMounted) return;

        let userData = res;
        if (res?.data?.data) {
          userData = res.data.data;
        } else if (res?.data) {
          userData = res.data;
        } else if (res?.user) {
          userData = res.user;
        }

        setUser(userData);
        setNameInput(userData?.name || "");
      })
      .catch((err) => {
        console.warn("Lấy thông tin thất bại:", err.message);
        if (err?.response?.status === 401 || !localStorage.getItem("auth_token")) {
          router.push("/auth/login");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsUpdatingProfile(true);
    try {
      const res: any = await authApi.updateProfile({ name: nameInput });
      const updatedUser = res?.data || res;
      setUser(updatedUser);
      alert("Cập nhật hồ sơ thành công!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authApi.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      alert("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-cols-[auto_1fr] gap-6 items-center mb-10 pb-10 border-b border-neutral-800">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-800 relative shadow-xl">
          <img src={user?.avatar_url || "https://i.pravatar.cc/300"} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="grid gap-1">
          <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">Hồ sơ</p>
          <h2 className="text-5xl font-bold text-white mb-2">{user?.name || "Người dùng"}</h2>
          <p className="text-neutral-400">{user?.email}</p>
        </div>
      </div>
    );
  };

  const renderPersonalInfo = () => {
    return (
      <form onSubmit={handleUpdateProfile} className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800 h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">Thông tin cá nhân</h3>
        <div className="grid gap-4 flex-1">
          <div className="grid gap-1">
            <label className="text-sm text-neutral-400">Tên hiển thị</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nhập tên hiển thị"
              required
              className="w-full bg-neutral-800 border-none rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-neutral-400">Email</label>
            <input type="email" value={user?.email || ""} readOnly className="w-full bg-neutral-800/50 border-none rounded-lg p-3 text-neutral-400 cursor-not-allowed focus:outline-none text-white" />
          </div>
          <div className="grid grid-cols-1 mt-auto pt-4">
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="justify-self-start flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUpdatingProfile ? <i className="fa-solid fa-spinner fa-spin"></i> : null}
              Cập nhật hồ sơ
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderSubscription = () => {
    return (
      <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800 h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-4">Gói cước</h3>
        <div className="grid grid-rows-[1fr_auto] gap-4 flex-1">
          <div className="bg-gradient-to-br from-purple-900/80 to-neutral-900 p-5 rounded-lg border border-purple-500/30 shadow-inner block items-start">
            <h4 className="text-lg font-bold text-white mb-1">Melora {user?.roles?.some((r: any) => r.name === "PREMIUM") ? "Premium" : "Free"}</h4>
            <p className="text-sm text-neutral-300 leading-relaxed">Nghe nhạc có quảng cáo. Nâng cấp để tận hưởng âm nhạc chất lượng cao không giới hạn.</p>
          </div>
          <button
            type="button"
            className="w-full mt-auto px-6 py-2.5 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Nâng cấp Premium
          </button>
        </div>
      </div>
    );
  };

  const renderSecurity = () => {
    return (
      <form onSubmit={handleUpdatePassword} className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800 h-full flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">Bảo mật</h3>
        <p className="text-neutral-400 text-sm mb-4">Cập nhật mật khẩu để bảo vệ tài khoản khỏi rủi ro.</p>

        <div className="grid gap-3 flex-1">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-shadow"
          />
        </div>

        <div className="grid grid-cols-1 mt-4">
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="justify-self-start flex items-center gap-2 px-6 py-2.5 bg-transparent border border-neutral-600 text-white font-bold rounded-full hover:border-white transition-colors transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUpdatingPassword ? <i className="fa-solid fa-spinner fa-spin"></i> : null}
            Đổi mật khẩu
          </button>
        </div>
      </form>
    );
  };

  const renderSettings = () => {
    return (
      <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800 h-full">
        <h3 className="text-xl font-bold text-white mb-4">Cài đặt khác</h3>
        <div className="grid gap-6">
          <label className="grid grid-cols-[1fr_auto] items-center gap-4 cursor-pointer group hover:bg-neutral-800/40 p-2 -mx-2 rounded-lg transition-colors">
            <span className="text-neutral-300 group-hover:text-white transition-colors">Nhận thông báo qua Email</span>
            <input type="checkbox" className="w-5 h-5 rounded bg-neutral-800 border-neutral-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-neutral-900 cursor-pointer" />
          </label>
          <label className="grid grid-cols-[1fr_auto] items-center gap-4 cursor-pointer group hover:bg-neutral-800/40 p-2 -mx-2 rounded-lg transition-colors">
            <span className="text-neutral-300 group-hover:text-white transition-colors">Lưu lịch sử nghe nhạc</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-neutral-800 border-neutral-600 text-purple-600 focus:ring-purple-600 focus:ring-offset-neutral-900 cursor-pointer" />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full grid grid-cols-1 gap-2">
      {loading && !user ? (
        <div className="grid place-items-center py-20">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {renderHeader()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 items-stretch">
            {renderPersonalInfo()}
            {renderSubscription()}
            {renderSecurity()}
            {renderSettings()}
          </div>
        </>
      )}
    </div>
  );
}
