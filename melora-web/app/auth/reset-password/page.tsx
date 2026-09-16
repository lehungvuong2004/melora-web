"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "../../../api/authApi";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const passedEmail = searchParams.get("email");
    const passedToken = searchParams.get("token");
    if (passedEmail) setEmail(passedEmail);
    if (passedToken) setToken(passedToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Mật khẩu đã được đặt lại thành công. Đang chuyển hướng đến trang đăng nhập...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Mã khôi phục không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
      <p className="text-zinc-400">Thiết lập lại mật khẩu mới cho tài khoản của bạn.</p>
    </div>
  );

  const renderError = () => {
    if (!error) return null;
    return <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>;
  };

  const renderSuccess = () => {
    if (!success) return null;
    return (
      <div className="mb-6 p-3 bg-green-900/40 border border-green-500/50 rounded-lg text-green-200 text-sm">
        <i className="fa-solid fa-check-circle mr-2"></i> {success}
      </div>
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
          Email address
        </label>
        <input id="email" type="email" required readOnly value={email} className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-400 focus:outline-none opacity-70" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="token">
          Mã khôi phục (Reset Token)
        </label>
        <input
          id="token"
          type="text"
          required
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          required
          placeholder="Tối thiểu 6 ký tự"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="passwordConfirmation">
          Xác nhận mật khẩu
        </label>
        <input
          id="passwordConfirmation"
          type="password"
          required
          placeholder="Nhập lại mật khẩu mới"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      {!success && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transform transition hover:-translate-y-0.5 mt-2 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <i className="fa-solid fa-spinner fa-spin h-5 w-5 text-white flex items-center justify-center text-lg"></i> : "Đặt lại mật khẩu"}
        </button>
      )}
    </form>
  );

  return (
    <div className="w-full grid grid-cols-1 gap-0">
      {renderHeader()}
      {renderError()}
      {renderSuccess()}
      {renderForm()}

      <div className="mt-8 text-center">
        <Link href="/auth/login" className="text-zinc-400 font-medium hover:text-purple-400 transition-colors">
          <i className="fa-solid fa-arrow-left mr-2"></i> Trở về trang đăng nhập
        </Link>
      </div>
    </div>
  );
}
