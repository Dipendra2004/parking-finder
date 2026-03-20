"use client";

import { useState } from "react";
import { MapView } from "@/components/map/MapView";
import { SpotMarker } from "@/components/map/SpotMarker";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbySpots } from "@/hooks/useNearbySpots";
import { ParkingSpot } from "@/types";

export default function Home() {
  const { coords, loading: locLoading } = useGeolocation();
  const { spots, loading: spotsLoading } = useNearbySpots(coords);
  const [selected, setSelected] = useState<ParkingSpot | null>(null);

  if (locLoading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Detecting location...</p>
    </div>
  );

  return (
    <main className="w-screen h-screen relative">
      <MapView center={coords!}>
        {spots.map(spot => (
          <SpotMarker
            key={spot.id}
            spot={spot}
            onClick={setSelected}
          />
        ))}
      </MapView>

      {spotsLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background px-4 py-2 rounded-full shadow text-sm">
          Finding spots...
        </div>
      )}

      {selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background p-4 rounded-xl shadow-lg w-80">
          <p className="font-medium">{selected.name}</p>
          <p className="text-sm text-muted-foreground">{selected.address}</p>
          <p className="text-sm mt-1">{selected.isFree ? "Free" : `₹${selected.pricePerHour}/hr`}</p>
        </div>
      )}
    </main>
  );
}