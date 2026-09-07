import React from "react";
import { Inter } from "next/font/google";
import GoogleWrapper from "../../components/auth/GoogleWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen grid grid-cols-1 md:grid-cols-2 bg-black text-white ${inter.className}`}>
      {/* Left Column: Branding / Showcase */}
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-zinc-900 border-r border-zinc-800 p-10">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg">M</div>
          <span className="text-2xl font-bold tracking-tight">Melora</span>
        </div>

        <div className="relative z-10 mb-10">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Dive into the <br />
            world of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Music</span>.
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">Join the Melora platform to stream millions of tracks, connect with artists, and discover your new favorite sounds.</p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500 font-medium tracking-wide">© 2026 Melora Music Streaming Platform.</div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto w-full">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">M</div>
            <span className="text-xl font-bold tracking-tight">Melora</span>
          </div>

          <GoogleWrapper>
            {children}
          </GoogleWrapper>
        </div>
      </div>
    </div>
  );
}
