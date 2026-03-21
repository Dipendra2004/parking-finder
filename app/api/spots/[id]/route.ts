import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const spot = await db.parkingSpot.findUnique({
      where: { id },
      include: {
        availability: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!spot) {
      return NextResponse.json({ success: false, message: "Spot not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: spot });
  } catch (err) {
    console.error("spot detail error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch spot" }, { status: 500 });
  }
}