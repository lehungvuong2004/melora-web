"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "../../../api/authApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevToken("");
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess("Nếu email hợp lệ, một mã xác minh đã được gửi đến bạn! Chuyển hướng...");
      
      // Auto redirect sau 3s
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Không thể yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra lại email.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
      <p className="text-zinc-400">Nhập email của bạn để nhận mã khôi phục mật khẩu.</p>
    </div>
  );

  const renderError = () => {
    if (!error) return null;
    return <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>;
  };

  const renderSuccess = () => {
    if (!success) return null;
    return (
      <div className="mb-6 space-y-4">
        <div className="p-3 bg-green-900/40 border border-green-500/50 rounded-lg text-green-200 text-sm">
          {success}
        </div>
        
        {devToken && (
          <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
            <p className="text-sm text-zinc-400 mb-2">Mã khôi phục (Chỉ hiển thị cho DEV):</p>
            <code className="text-purple-400 font-mono break-all">{devToken}</code>
            
            <button
              onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&token=${devToken}`)}
              className="mt-4 w-full py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition"
            >
              Đi tới trang Đặt lại mật khẩu
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
          disabled={isLoading || !!success}
        />
      </div>

      {!success && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transform transition hover:-translate-y-0.5 mt-2 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? <i className="fa-solid fa-spinner fa-spin h-5 w-5 text-white flex items-center justify-center text-lg"></i> : "Gửi yêu cầu"}
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
