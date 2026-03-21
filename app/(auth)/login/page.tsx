"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen flex flex-col selection:bg-[#85adff]/30">
      
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/60 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_40px_rgba(133,173,255,0.05)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-br from-[#85adff] to-[#ac8aff] bg-clip-text text-transparent">
              ParkFinder
            </Link>
            <div className="hidden md:flex gap-8">
              <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors font-medium tracking-tight border-b-2 border-transparent hover:border-[#85adff] pb-1">Map</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-200 transition-colors font-medium tracking-tight">My Bookings</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-200 transition-colors font-medium tracking-tight">Profile</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/register" className="text-gray-400 hover:text-gray-200 transition-colors font-semibold active:scale-95">Sign Up</Link>
            <Link href="/" className="bg-gradient-to-br from-[#85adff] to-[#ac8aff] px-6 py-2 rounded-xl text-black font-semibold active:scale-95 transition-transform shadow-lg shadow-[#85adff]/20">Find Parking</Link>
          </div>
        </div>
      </nav>

      {/* Main Content: Login Canvas */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
        
        {/* Environmental Glow Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#85adff]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ac8aff]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Login Card */}
        <div className="w-full max-w-lg rounded-xl border border-[#494847]/15 p-10 relative z-10 shadow-2xl bg-[#262626]/60 backdrop-blur-[20px]">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-white" style={{ textShadow: "0 0 20px rgba(133,173,255,0.3)" }}>Welcome back</h1>
            <p className="text-[#adaaaa] text-sm">Sign in to find your perfect parking spot.</p>
          </div>
          
          {/* Social Login */}
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 bg-[#262626] hover:bg-[#2c2c2c] transition-all duration-300 py-4 px-6 rounded-lg border border-[#494847]/20 mb-8 active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span className="font-semibold text-white tracking-tight">Sign in with Google</span>
          </button>
          
          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-grow bg-[#494847]/20"></div>
            <span className="text-xs font-bold text-[#777575] uppercase tracking-widest">or email</span>
            <div className="h-[1px] flex-grow bg-[#494847]/20"></div>
          </div>
          
          {/* Email Login Form */}
          <form className="space-y-6" onSubmit={handleCredentialsLogin}>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#777575] uppercase tracking-wider block ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777575] w-5 h-5" />
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full bg-[#262626] border border-[#494847]/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-[#777575] focus:ring-1 focus:ring-[#85adff] focus:border-[#85adff] transition-all outline-none" placeholder="alex@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#777575] uppercase tracking-wider block ml-1" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777575] w-5 h-5" />
                <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="w-full bg-[#262626] border border-[#494847]/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-[#777575] focus:ring-1 focus:ring-[#85adff] focus:border-[#85adff] transition-all outline-none" placeholder="••••••••" />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-br from-[#85adff] to-[#ac8aff] py-4 rounded-xl font-bold text-black shadow-[0_10px_20px_rgba(133,173,255,0.2)] hover:shadow-[0_10px_20px_rgba(133,173,255,0.3)] transition-all duration-300 active:scale-[0.97] mt-4 flex items-center justify-center gap-2">
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[#adaaaa] text-sm">
              Don't have an account? 
              <Link href="/register" className="text-[#85adff] font-semibold hover:underline decoration-[#85adff] ml-1">Create Account</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] w-full py-12 px-8 border-t border-white/5 font-['Inter'] text-sm z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-[1920px] mx-auto">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-gray-100">ParkFinder</span>
            <p className="text-gray-500 font-normal">© 2024 Kinetic Horizon ParkFinder. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors hover:underline decoration-[#ac8aff]">Terms of Service</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors hover:underline decoration-[#ac8aff]">Privacy Policy</Link>
            <Link href="/support" className="text-gray-500 hover:text-gray-300 transition-colors hover:underline decoration-[#ac8aff]">Support</Link>
            <Link href="/api-docs" className="text-gray-500 hover:text-gray-300 transition-colors hover:underline decoration-[#ac8aff]">API Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}