"use client";

import { useState } from "react";
import { MapView } from "@/components/map/MapView";
import { SpotMarker } from "@/components/map/SpotMarker";
import { SpotFilters } from "@/components/spots/SpotFilters";
import { SearchBar } from "@/components/ui/SearchBar";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbySpots } from "@/hooks/useNearbySpots";
import { ParkingSpot, SpotFilters as FilterType } from "@/types";

export default function Home() {
  const { coords, loading: locLoading } = useGeolocation();
  const [filters, setFilters] = useState<FilterType>({ radius: 5 });
  const { spots, loading: spotsLoading } = useNearbySpots(coords, filters);
  const [selected, setSelected] = useState<ParkingSpot | null>(null);

  const handleSearch = (query: string) => {
    if (!query) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry.location;
        console.log("searched:", loc.lat(), loc.lng());
      }
    });
  };

  if (locLoading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Detecting location...</p>
    </div>
  );

  return (
    <main className="w-screen h-screen relative">
      <MapView center={coords!}>
        {spots.map(spot => (
          <SpotMarker key={spot.id} spot={spot} onClick={setSelected} />
        ))}
      </MapView>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 flex gap-2 z-10">
        <SearchBar onSearch={handleSearch} />
        <SpotFilters filters={filters} onChange={setFilters} />
      </div>

      {spotsLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-background px-4 py-2 rounded-full shadow text-sm z-10">
          Finding spots...
        </div>
      )}

      {selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background p-4 rounded-xl shadow-lg w-80 z-10">
          <p className="font-medium">{selected.name}</p>
          <p className="text-sm text-muted-foreground">{selected.address}</p>
          <p className="text-sm mt-1">{selected.isFree ? "Free" : `₹${selected.pricePerHour}/hr`}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {selected.availability?.availableSlots ?? 0} / {selected.totalSlots} slots available
          </p>
        </div>
      )}
    </main>
  );
}