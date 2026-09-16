"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import Link from "next/link";

export default function VNPayReturnPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xử lý kết quả thanh toán...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const vnpParams = Object.fromEntries(searchParams.entries());

    if (Object.keys(vnpParams).length === 0) {
      setStatus("error");
      setMessage("Không tìm thấy thông tin giao dịch VNPay hợp lệ.");
      return;
    }

    const processPayment = async () => {
      try {
        const response: any = await axiosClient.get("/payments/vnpay-callback", {
          params: vnpParams,
        });
        setStatus("success");
        setMessage("Giao dịch thành công! Tài khoản của bạn đã được nâng cấp Premium.");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error?.response?.data?.message || error.message || "Giao dịch không thành công hoặc xảy ra lỗi.");
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="bg-neutral-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-800">
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-neutral-700 border-t-white mx-auto animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-white mb-2">Đang xử lý...</h2>
            <p className="text-neutral-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-check text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thanh toán thành công!</h2>
            <p className="text-neutral-400 mb-6">{message}</p>
            <Link href="/" className="inline-block w-full py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition">
              Quay lại trang chủ
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-xmark text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thanh toán thất bại</h2>
            <p className="text-neutral-400 mb-6">{message}</p>
            <Link href="/" className="inline-block w-full py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition">
              Về trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
