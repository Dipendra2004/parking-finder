import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get("lat") ?? "0");
  const lng = parseFloat(searchParams.get("lng") ?? "0");
  const radius = parseFloat(searchParams.get("radius") ?? "5");
  const isFree = searchParams.get("isFree");
  const type = searchParams.get("type");

  try {
    const spots = await db.parkingSpot.findMany({
      where: {
        isActive: true,
        ...(isFree !== null && { isFree: isFree === "true" }),
        ...(type && { type: type as any }),
      },
      include: {
        availability: true,
      },
    });

    // filter by radius using haversine formula
    const filtered = spots.filter((spot) => {
      const R = 6371;
      const dLat = ((spot.latitude - lat) * Math.PI) / 180;
      const dLng = ((spot.longitude - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((spot.latitude * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return distance <= radius;
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to fetch spots" }, { status: 500 });
  }
}