"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-14 w-full bg-[#0e0e0e]/80 backdrop-blur-xl flex items-center sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MapPin className="h-5 w-5 text-[#7aafff]" />
          <span className="font-semibold text-lg text-white hidden sm:block">ParkFinder</span>
          <span className="font-semibold text-lg text-white sm:hidden">ParkFinder</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="h-[28px] w-[28px] rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-[28px] w-[28px] rounded-full bg-[#1a1a1a] border border-white/10" />
                )}
                {session.user?.name && (
                  <span className="hidden sm:block text-sm font-medium text-[#adaaaa]">
                    {session.user.name}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7aafff] hover:bg-[#7aafff]/10 hover:text-[#7aafff]"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="bg-gradient-to-br from-[#7aafff] to-[#5ea2ff] text-black hover:opacity-90 border-none font-medium">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
