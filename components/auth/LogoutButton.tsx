"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full flex justify-center items-center py-4 rounded-xl bg-[#ff716c]/10 text-[#ff716c] font-bold text-lg hover:bg-[#ff716c]/20 active:scale-[0.98] transition-all border border-[#ff716c]/20 shadow-[0_10px_30px_rgba(255,113,108,0.1)] gap-2"
    >
      <span className="material-symbols-outlined shrink-0 text-[20px]">logout</span>
      Sign Out of Account
    </button>
  );
}
