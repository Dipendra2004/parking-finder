import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, message: "Unauthorized Request" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
    }

    const { spotId, durationHours, totalPrice } = await req.json();

    if (!spotId) {
      return NextResponse.json({ success: false, message: "Missing spot identity" }, { status: 400 });
    }

    // 1. Transactionally check availability and create booking
    const result = await db.$transaction(async (tx) => {
      // Find Spot
      const spot = await tx.parkingSpot.findUnique({
        where: { id: spotId },
        include: { availability: true }
      });

      if (!spot) {
        throw new Error("Spot does not exist.");
      }

      // Check Real-time Availability (Slots > 0)
      const currentAvail = spot.availability?.availableSlots ?? spot.totalSlots;
      
      if (currentAvail <= 0) {
        throw new Error("This parking lot is currently FULL.");
      }

      // Decrement Available Slots
      if (spot.availability) {
        await tx.availability.update({
          where: { spotId: spot.id },
          data: { availableSlots: { decrement: 1 } }
        });
      }

      const startTime = new Date();
      
      // Calculate endTime if duration is provided
      let endTime = null;
      if (durationHours) {
        endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
      }

      // Create Booking Record
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          spotId: spot.id,
          startTime: startTime,
          endTime: endTime,
          duration: durationHours,
          totalPrice: totalPrice || 0,
          status: "ACTIVE"
        }
      });

      return newBooking;
    });

    return NextResponse.json({ success: true, booking: result });

  } catch (error: any) {
    console.error("Booking failed:", error.message || error);
    return NextResponse.json({ success: false, message: error.message || "Failed to reserve spot" }, { status: 500 });
  }
}
