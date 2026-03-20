import { useState, useEffect } from "react";
import { ParkingSpot, SpotFilters, Coordinates } from "@/types";

export function useNearbySpots(coords: Coordinates | null, filters?: SpotFilters) {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) return;

    const fetchSpots = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
          radius: (filters?.radius ?? 5).toString(),
          ...(filters?.isFree !== undefined && { isFree: filters.isFree.toString() }),
          ...(filters?.type && { type: filters.type }),
        });

        const res = await fetch(`/api/spots?${params}`);
        const json = await res.json();

        if (!json.success) throw new Error(json.message);
        setSpots(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [coords, filters?.isFree, filters?.type, filters?.radius]);

  return { spots, loading, error };
}