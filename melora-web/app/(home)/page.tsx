import React from "react";
import HeroBanner from "./components/HeroBanner";
import RecentlyPlayed from "./components/RecentlyPlayed";
import TrendingChart from "./components/TrendingChart";
import MadeForYou from "./components/MadeForYou";
import FeaturedArtists from "./components/FeaturedArtists";
import NewReleases from "./components/NewReleases";

export default function Home() {
  return (
    <div className="p-6 pb-8">
      <HeroBanner />
      <RecentlyPlayed />
      <TrendingChart />
      <MadeForYou />
      <FeaturedArtists />
      <NewReleases />
      
      {/* App Engine Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-20 mb-8 pt-8 border-t border-neutral-800/60">
         <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold mb-4 md:mb-0">
            <i className="fa-solid fa-volume-high text-green-500"></i> MELORA Acoustic Engine 3.2 • Mã hóa âm thanh vòm Lossless thời gian thực
         </div>
         <div className="flex items-center gap-6 text-neutral-400 text-xs font-semibold">
            <a href="#" className="hover:text-white transition">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-white transition">Quyền riêng tư</a>
            <a href="#" className="hover:text-white transition">Hỗ trợ nghệ sĩ V-Pop</a>
         </div>
      </div>
    </div>
  );
}
