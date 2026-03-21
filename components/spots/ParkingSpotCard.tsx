import { ParkingSpot } from "@/types";

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onClick: (spot: ParkingSpot) => void;
  selected?: boolean;
}

export function ParkingSpotCard({ spot, onClick, selected }: ParkingSpotCardProps) {
  const availableSlots = spot.availability?.availableSlots ?? spot.availableSlots;
  const isFull = String(spot.status).toUpperCase() === "FULL" || availableSlots <= 0;
  
  // Choose theme based on properties
  let colorTheme = {
    borderColor: "border-[#85adff]", // Primary (Paid)
    textColor: "text-[#85adff]",
    badgeText: "OPEN NOW",
    hoverArrow: "group-hover:text-[#85adff]",
    opacity: "",
    disabledBg: ""
  };

  if (isFull) {
    colorTheme = {
      borderColor: "border-[#ff716c]/50", // Error
      textColor: "text-[#ff716c]",
      badgeText: "CURRENTLY FULL",
      hoverArrow: "",
      opacity: "opacity-80",
      disabledBg: "bg-[#1a1919]"
    };
  } else if (spot.isFree) {
    colorTheme = {
      borderColor: "border-[#69f6b8]", // Tertiary
      textColor: "text-[#69f6b8]",
      badgeText: "AVAILABLE",
      hoverArrow: "group-hover:text-[#69f6b8]",
      opacity: "",
      disabledBg: ""
    };
  }

  return (
    <div 
      onClick={() => { if(!isFull) onClick(spot); }}
      className={`group bg-[#1a1919] border-l-4 p-5 rounded-xl transition-all duration-300 shadow-lg border-y border-r border-y-white/5 border-r-white/5 
        ${colorTheme.borderColor} ${colorTheme.opacity} 
        ${selected ? 'bg-[#262626] shadow-2xl scale-[1.02] border-l-8' : ''}
        ${isFull ? 'cursor-not-allowed cursor-default' : 'hover:bg-[#201f1f] cursor-pointer'} 
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
             <span className={`uppercase tracking-widest font-bold text-[10px] ${colorTheme.textColor}`}>{colorTheme.badgeText}</span>
             {!isFull && spot.isFree && <div className="w-2 h-2 rounded-full bg-[#69f6b8] animate-pulse"></div>}
          </div>
          <h3 className="text-lg font-semibold text-white mt-1 leading-tight line-clamp-1 break-all">{spot.name}</h3>
        </div>
        <div className="text-right shrink-0 ml-2">
          {spot.isFree ? (
            <span className="text-xl font-bold text-[#69f6b8]">FREE</span>
          ) : (
            <span className={`text-xl font-bold ${isFull ? 'text-[#adaaaa]' : 'text-white'}`}>
              ₹{spot.pricePerHour}<span className="text-xs font-normal text-[#adaaaa]">/hr</span>
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-[#adaaaa] mb-4 line-clamp-1">{spot.address}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-xs ${isFull ? 'text-[#ff716c]' : 'text-[#adaaaa]'}`}>
            {isFull ? (
              <><span className="material-symbols-outlined text-[14px]">block</span> No vacancy</>
            ) : (
              <><span className="material-symbols-outlined text-[14px]">directions_car</span> {availableSlots} spots left</>
            )}
          </span>
          {!isFull && spot.hasEVCharging && (
            <span className="flex items-center gap-1 text-xs text-[#adaaaa]">
              <span className="material-symbols-outlined text-[14px]">bolt</span> EV
            </span>
          )}
        </div>
        {isFull ? (
           <span className="material-symbols-outlined text-[#adaaaa] text-[18px]">lock</span>
        ) : (
           <span className={`material-symbols-outlined text-[#adaaaa] text-[18px] transition-colors ${colorTheme.hoverArrow}`}>arrow_forward_ios</span>
        )}
      </div>
    </div>
  );
}
