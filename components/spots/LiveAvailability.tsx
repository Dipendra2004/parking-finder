"use client";

import { useRealtime } from "@/hooks/useRealtime";

interface Props {
  spotId: string;
  initialSlots: number;
  totalSlots: number;
}

export function LiveAvailability({ spotId, initialSlots, totalSlots }: Props) {
  const { availableSlots } = useRealtime(spotId);
  const slots = availableSlots ?? initialSlots;
  const occupancy = totalSlots > 0
    ? Math.min(100, Math.max(0, Math.round(((totalSlots - slots) / totalSlots) * 100)))
    : 0;

  return (
    <div className="border rounded-xl p-4">
      <p className="text-sm text-muted-foreground">Available slots</p>
      <p className="text-xl font-semibold mt-1">
        {slots}
        <span className="text-sm font-normal text-muted-foreground"> / {totalSlots}</span>
      </p>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Occupancy</span>
          <span>{occupancy}% full</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <p className="text-xs text-muted-foreground">Live updates</p>
      </div>
    </div>
  );
}