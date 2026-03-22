"use client";

import { Marker } from "@react-google-maps/api";
import { ParkingSpot } from "@/types";

interface SpotMarkerProps {
  spot: ParkingSpot;
  onClick?: (spot: ParkingSpot) => void;
}

export function SpotMarker({ spot, onClick }: SpotMarkerProps) {
  const status = String(spot.status ?? "").toUpperCase();
  const available = spot.availability?.availableSlots ?? spot.availableSlots;

  const pinColor =
    status === "FULL" || available <= 0
      ? "#ef4444"
      : spot.isFree
        ? "#22c55e"
        : "#3b82f6";

  return (
    <Marker
      position={{ lat: spot.latitude, lng: spot.longitude }}
      onClick={() => onClick?.(spot)}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: pinColor,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
      }}
    />
  );
}