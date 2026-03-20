"use client";

import { Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import { ParkingSpot } from "@/types";

interface SpotMarkerProps {
  spot: ParkingSpot;
  onClick?: (spot: ParkingSpot) => void;
}

export function SpotMarker({ spot, onClick }: SpotMarkerProps) {
  const [showInfo, setShowInfo] = useState(false);

  const pinColor = spot.availability?.availableSlots === 0
    ? "red"
    : spot.isFree
    ? "green"
    : "blue";

  return (
    <Marker
      position={{ lat: spot.latitude, lng: spot.longitude }}
      onClick={() => {
        setShowInfo(true);
        onClick?.(spot);
      }}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: pinColor,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
      }}
    >
      {showInfo && (
        <InfoWindow onCloseClick={() => setShowInfo(false)}>
          <div className="text-sm p-1">
            <p className="font-medium">{spot.name}</p>
            <p className="text-muted-foreground">{spot.isFree ? "Free" : `₹${spot.pricePerHour}/hr`}</p>
            <p>{spot.availability?.availableSlots ?? 0} slots available</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}