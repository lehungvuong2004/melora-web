"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("auth_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      router.push("/");
    } else {
      router.push("/auth/login?error=auth_callback_failed");
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-purple-500 mb-4"></i>
        <h2 className="text-white text-xl font-semibold">Đang xác thực thông tin...</h2>
        <p className="text-zinc-400 mt-2">Vui lòng chờ trong khi Melora kết nối với hệ thống.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <AuthCallback />
    </Suspense>
  );
}
