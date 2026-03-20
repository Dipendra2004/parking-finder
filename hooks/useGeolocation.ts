import { useState, useEffect } from "react";
import { Coordinates } from "@/types";

interface GeolocationState {
  coords: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Geolocation not supported", loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      (err) => {
        // fallback to Panvel if user denies location
        setState({
          coords: { lat: 18.9894, lng: 73.1175 },
          error: err.message,
          loading: false,
        });
      }
    );
  }, []);

  return state;
}