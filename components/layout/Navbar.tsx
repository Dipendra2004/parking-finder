"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="h-14 w-full border-b bg-white flex items-center sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg hidden sm:block">ParkFinder</span>
          <span className="font-semibold text-lg sm:hidden">ParkFinder</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="h-[28px] w-[28px] rounded-full object-cover"
                  />
                ) : (
                  <div className="h-[28px] w-[28px] rounded-full bg-slate-200" />
                )}
                {session.user?.name && (
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {session.user.name}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
