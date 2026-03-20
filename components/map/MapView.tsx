"use client";

import { useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Coordinates } from "@/types";

interface MapViewProps {
  center: Coordinates;
  children?: React.ReactNode;
  onMapClick?: (coords: Coordinates) => void;
}

const mapStyles = {
  width: "100%",
  height: "100%",
};

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export function MapView({ center, children, onMapClick }: MapViewProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["places"],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!onMapClick || !e.latLng) return;
    onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  if (!isLoaded) return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-muted-foreground text-sm">Loading map...</p>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleClick}
      options={defaultOptions}
    >
      {children}
    </GoogleMap>
  );
}