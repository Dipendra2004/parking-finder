import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return redirect("/login");
  }

  // Fetch true user record from Postgres to guarantee integrity beyond token cache
  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white selection:bg-[#5f28c8] selection:text-white">
      {/* Absolute floating Navbar instance matching the layout aesthetic */}
      <div className="absolute top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-32 lg:pt-40 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#adaaaa]">
              Account Overview
            </h1>
            <p className="text-[#adaaaa] font-medium text-lg leading-relaxed">
              Manage your personal details and security preferences.
            </p>
          </div>
          <Link href="/bookings" className="shrink-0 px-6 py-3 rounded-xl bg-[#262626] hover:bg-[#333] transition-colors border border-white/10 text-white font-bold tracking-tight inline-flex items-center gap-2">
            View My Bookings
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        {/* Profile Details Card */}
        <div className="bg-[#1a1919] rounded-3xl p-8 lg:p-12 border border-white/5 shadow-2xl space-y-8">
          
          <div className="flex items-center gap-6 pb-8 border-b border-white/10">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#85adff] to-[#ac8aff] flex items-center justify-center text-4xl shadow-[0_10px_30px_rgba(133,173,255,0.2)]">
              <span className="material-symbols-outlined text-[#0e0e0e]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">{user.name || "Anonymous User"}</h2>
              <span className="inline-block px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8] text-[10px] uppercase font-bold tracking-widest border border-[#69f6b8]/20">
                Verified Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-white/10">
            <div>
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-2">Registered Email</label>
              <div className="px-5 py-4 rounded-xl bg-[#131313] border border-white/5 text-white font-medium">
                {user.email}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-2">Account ID</label>
              <div className="px-5 py-4 rounded-xl bg-[#131313] border border-white/5 text-[#adaaaa] font-mono text-sm">
                {user.id}
              </div>
            </div>
          </div>

          {/* Action Zone */}
          <div className="pt-4">
             <LogoutButton />
          </div>

        </div>
      </div>
    </div>
  );
}
