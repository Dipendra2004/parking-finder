"use client";

import { usePathname } from "next/navigation"
import { MapPin } from "lucide-react"
import { Footer as FooterUI } from "@/components/ui/footer"

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isMapPage = pathname === '/';
  
  if (isAuthPage || isMapPage) return null;

  return (
    <div className="w-full bg-[#0a0a0a] text-white">
      <FooterUI
        logo={<MapPin className="h-6 w-6 text-[#7aafff]" />}
        brandName="ParkFinder"
        mainLinks={[]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "/support", label: "Support" },
        ]}
        copyright={{
          text: "© 2026 ParkFinder",
          license: "All rights reserved.",
        }}
      />
    </div>
  )
}
