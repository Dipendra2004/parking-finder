import { ParkingSpot } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Navigation2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LiveIndicator } from "@/components/ui/LiveIndicator";

interface ExpandedSpotCardProps {
  spot: ParkingSpot;
  onClose?: () => void;
}

export function ExpandedSpotCard({ spot, onClose }: ExpandedSpotCardProps) {
  const router = useRouter();
  const availableSlots = spot.availability?.availableSlots ?? spot.availableSlots;
  const isFull = String(spot.status).toUpperCase() === "FULL" || availableSlots <= 0;

  return (
    <div className="w-[300px] bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-5 overflow-hidden relative">
       {/* Ambient glow top right */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#8b5cf6] rounded-full blur-[50px] opacity-20 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="pr-4">
          <h3 className="text-lg font-bold text-white leading-tight mb-1">{spot.name}</h3>
          <p className="text-xs text-gray-400 line-clamp-1">{spot.address}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Badge variant={isFull ? "destructive" : "secondary"} className={isFull ? "bg-[#ff716c]/10 text-[#ff716c] hover:bg-[#ff716c]/20 border-0" : "bg-[#9bffce]/10 text-[#69f6b8] hover:bg-[#9bffce]/20 border-0"}>
          {isFull ? "Full" : "Available"}
        </Badge>
        {spot.hasEVCharging && (
          <Badge variant="outline" className="border-white/10 text-gray-300 bg-[#1a1a1a]">EV</Badge>
        )}
      </div>

      <div className="bg-[#0e0e0e] rounded-xl p-3.5 mb-5 flex items-center justify-between border border-white/5 relative z-10">
        <div className="text-sm font-semibold text-white">
          {spot.isFree ? "Free Parking" : `₹${spot.pricePerHour}/hr`}
        </div>
        <div className="flex flex-col items-end">
           <LiveIndicator />
           <div className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-wider">{availableSlots} slots left</div>
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
            window.open(url, "_blank");
          }}
          className="shrink-0 bg-[#1a1a1a] border-white/10 text-white hover:bg-[#222]"
        >
          <Navigation2 className="h-4 w-4" />
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white border-0 hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.3)] gap-2"
          onClick={() => router.push(`/spots/${spot.id}`)}
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
