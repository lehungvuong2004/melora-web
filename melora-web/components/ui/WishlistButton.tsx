"use client";

import React, { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { useRouter } from "next/navigation";

type WishlistButtonProps = {
  id: number;
  type?: "song" | "album" | "artist" | "playlist";
  variant?: "icon" | "button";
  initialLiked?: boolean;
};

export default function WishlistButton({ id, type = "song", variant = "icon", initialLiked = false }: WishlistButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
    }

    if (loading) return;

    setLoading(true);
    try {
      const resp = await axiosClient.post("/me/wishlists", { type, id });
      const res = resp as { added?: boolean };

      setIsLiked(res.added === true);
      alert(res.added ? "Đã thêm vào thư viện!" : "Đã xóa khỏi thư viện!");
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      } else {
        alert("Đã xảy ra lỗi, vui lòng kiểm tra kết nối!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white border border-neutral-600 px-6 py-3 rounded-full font-bold transition hover:scale-105 backdrop-blur-md cursor-pointer disabled:opacity-50"
      >
        <i className={isLiked ? "fa-solid fa-heart text-green-500" : "fa-regular fa-heart"}></i>
        {isLiked ? "Đã thêm vào thư viện" : "Thêm vào thư viện"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`cursor-pointer transition w-8 h-8 flex items-center justify-center shrink-0 disabled:opacity-50 ${
        isLiked ? "text-green-500 hover:text-green-400" : "text-neutral-400 hover:text-white"
      }`}
    >
      <i className={isLiked ? "fa-solid fa-heart text-lg" : "fa-regular fa-heart text-lg"}></i>
    </button>
  );
}
