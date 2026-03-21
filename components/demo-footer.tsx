import { MapPin, Github, Twitter } from "lucide-react"
import { Footer } from "@/components/ui/footer"

function DemoFooter() {
  return (
    <div className="w-full bg-[#0e0e0e] text-white overflow-hidden mt-20">
      <Footer
        logo={<MapPin className="h-8 w-8 text-[#7aafff]" />}
        brandName="ParkFinder"
        mainLinks={[
          { href: "/", label: "Map" },
          { href: "/search", label: "Search" },
          { href: "/profile", label: "Profile" },
          { href: "/support", label: "Support" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
        ]}
        copyright={{
          text: "© 2026 ParkFinder",
          license: "All rights reserved.",
        }}
      />
    </div>
  )
}

export { DemoFooter }
