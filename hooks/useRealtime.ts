import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket() {
  if (!socket) socket = io();
  return socket;
}

export function useRealtime(spotId: string) {
  const [availableSlots, setAvailableSlots] = useState<number | null>(null);

  useEffect(() => {
    const s = getSocket();
    s.emit("join:spot", spotId);

    s.on("availability:update", (data) => {
      if (data.spotId === spotId) {
        setAvailableSlots(data.availableSlots);
      }
    });

    return () => {
      s.emit("leave:spot", spotId);
      s.off("availability:update");
    };
  }, [spotId]);

  return { availableSlots };
}