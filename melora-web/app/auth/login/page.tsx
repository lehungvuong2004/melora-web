"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { authApi } from "../../../api/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");
      try {
        const data: any = await authApi.googleAuth(tokenResponse.access_token);
        localStorage.setItem("auth_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        router.push("/");
      } catch (err: any) {
        setError(err.message || "Google Login failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Login was cancelled or failed");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data: any = await authApi.login({ email, password });
      
      localStorage.setItem("auth_token", data.access_token);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-zinc-400">Log in to your Melora account to continue listening.</p>
    </div>
  );

  const renderError = () => {
    if (!error) return null;
    return <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>;
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
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-zinc-300" htmlFor="password">
            Password
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transform transition hover:-translate-y-0.5 mt-2 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? <i className="fa-solid fa-spinner fa-spin -ml-1 mr-3 h-5 w-5 text-white flex items-center justify-center text-lg"></i> : "Log In"}
      </button>
    </form>
  );

  const renderSocialLogin = () => (
    <>
      <div className="mt-6 flex items-center">
        <div className="flex-1 border-t border-zinc-800"></div>
        <div className="px-4 text-xs text-zinc-500 uppercase tracking-wider">Or continue with</div>
        <div className="flex-1 border-t border-zinc-800"></div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => googleLogin()}
          disabled={isLoading}
          className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-base shadow-sm transform transition hover:-translate-y-0.5 flex justify-center items-center gap-3 cursor-pointer border border-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <i className="fa-brands fa-google text-xl text-white"></i>
          Google
        </button>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div className="mt-8 text-center text-zinc-400 text-sm">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-white font-bold hover:text-purple-400 transition-colors">
          Sign up for Melora
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center md:hidden">
        <div className="border-t border-zinc-800"></div>
        <div className="px-4 text-xs text-zinc-600 uppercase tracking-wider">Secure Access</div>
        <div className="border-t border-zinc-800"></div>
      </div>
    </>
  );

  return (
    <div className="w-full grid grid-cols-1 gap-0">
      {renderHeader()}
      {renderError()}
      {renderForm()}
      {renderSocialLogin()}
      {renderFooter()}
    </div>
  );
}
