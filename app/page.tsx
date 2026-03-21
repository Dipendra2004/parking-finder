"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { InfoWindow } from "@react-google-maps/api";
import { MapView } from "@/components/map/MapView";
import { SpotMarker } from "@/components/map/SpotMarker";
import { SpotFilters } from "@/components/spots/SpotFilters";
import { SearchBar } from "@/components/ui/SearchBar";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbySpots } from "@/hooks/useNearbySpots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParkingSpot, SpotFilters as FilterType } from "@/types";

export default function Home() {
  const router = useRouter();
  const { coords, loading: locLoading } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<FilterType>({ radius: 5, hasEVCharging: undefined, isFree: undefined, type: undefined });
  const { spots, loading: spotsLoading } = useNearbySpots(coords, filters);
  const [selected, setSelected] = useState<ParkingSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const center = mapCenter ?? coords;

  const sortedSpots = useMemo(() => {
    return [...spots].sort((a, b) => {
      const aAvailable = a.availability?.availableSlots ?? a.availableSlots;
      const bAvailable = b.availability?.availableSlots ?? b.availableSlots;
      return bAvailable - aAvailable;
    });
  }, [spots]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      if (coords) {
        setMapCenter(coords);
      }
      return;
    }

    if (typeof google === "undefined" || !google.maps?.Geocoder) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry.location;
        setMapCenter({ lat: loc.lat(), lng: loc.lng() });
      }
    });
  };

  const handleSelectSpot = (spot: ParkingSpot) => {
    setSelected(spot);
    setMapCenter({ lat: spot.latitude, lng: spot.longitude });
  };

  if (locLoading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Detecting location...</p>
    </div>
  );

  if (!center) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Unable to load map center.</p>
      </div>
    );
  }

  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <MapView center={center} onMapClick={() => setSelected(null)}>
          {sortedSpots.map((spot) => (
            <SpotMarker key={spot.id} spot={spot} onClick={handleSelectSpot} />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="w-[250px] space-y-2 py-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-tight">{selected.name}</p>
                  <Badge variant={(String(selected.status).toUpperCase() === "FULL" || (selected.availability?.availableSlots ?? selected.availableSlots) <= 0) ? "destructive" : "secondary"}>
                    {(String(selected.status).toUpperCase() === "FULL" || (selected.availability?.availableSlots ?? selected.availableSlots) <= 0) ? "Full" : "Available"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">{selected.address}</p>

                <div className="flex items-center justify-between text-xs">
                  <span>{selected.isFree ? "Free" : `Rs. ${selected.pricePerHour ?? 0}/hr`}</span>
                  <span>{selected.availability?.availableSlots ?? selected.availableSlots}/{selected.availability?.totalSlots ?? selected.totalSlots} slots</span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/spots/${selected.id}`)}
                >
                  View details
                </Button>
              </div>
            </InfoWindow>
          )}
        </MapView>
      </div>

      <div className="absolute top-4 left-1/2 z-20 w-[min(40rem,calc(100%-1rem))] -translate-x-1/2 px-2">
        <div className="flex items-center gap-2 rounded-xl border bg-background/90 p-2 shadow-sm backdrop-blur">
          <SearchBar onSearch={handleSearch} value={searchQuery} />
          <SpotFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      <div className="absolute right-3 top-20 z-20 hidden rounded-lg border bg-background/90 px-3 py-2 text-xs shadow backdrop-blur sm:block">
        <span className="text-muted-foreground">Nearby spots: </span>
        <span className="font-semibold">{sortedSpots.length}</span>
      </div>

      {spotsLoading && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full bg-background/95 px-4 py-2 text-sm shadow">
          Updating map spots...
        </div>
      )}
    </main>
  );
}