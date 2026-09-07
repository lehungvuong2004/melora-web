"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { authApi } from "../../../api/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    date_of_birth: "",
  });
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
        setError(err.message || "Google Authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Login was cancelled or failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data: any = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        date_of_birth: formData.date_of_birth,
      });

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
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
      <p className="text-zinc-400">Join Melora and start your musical journey today.</p>
    </div>
  );

  const renderError = () => {
    if (!error) return null;
    return <div className="mb-6 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>;
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="name">
          What should we call you?
        </label>
        <input
          id="name"
          type="text"
          required
          placeholder="Your name or nickname"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
          What's your email address?
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="country">
            Country
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={handleChange}
            className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 appearance-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem top 50%",
              backgroundSize: "0.65rem auto",
            }}
          >
            <option value="">Select country</option>
            <option value="VN">Vietnam</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="JP">Japan</option>
            <option value="KR">South Korea</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm font-medium text-zinc-300" htmlFor="date_of_birth">
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
          Create a password
        </label>
        <input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transform transition hover:-translate-y-0.5 mt-4 flex justify-center items-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? <i className="fa-solid fa-spinner fa-spin -ml-1 mr-3 h-5 w-5 text-white flex items-center justify-center text-lg"></i> : "Sign Up"}
      </button>
    </form>
  );

  const renderSocialLogin = () => (
    <>
      <div className="mt-6 flex items-center">
        <div className="flex-1 border-t border-zinc-800"></div>
        <div className="px-4 text-xs text-zinc-500 uppercase tracking-wider">Or register with</div>
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
    <div className="mt-8 text-center text-zinc-400 text-sm pb-6">
      Already have an account?{" "}
      <Link href="/auth/login" className="text-white font-bold hover:text-purple-400 transition-colors">
        Log in here
      </Link>
    </div>
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
