import { PrismaClient, SpotType, SpotStatus } from "@prisma/client";

const prisma = new PrismaClient();

const spots = [
  { name: "Panvel Station Parking", address: "Near Panvel Railway Station", latitude: 18.9894, longitude: 73.1175, type: SpotType.OPEN, totalSlots: 50, isFree: false, pricePerHour: 20 },
  { name: "CBD Belapur Lot", address: "Sector 11, CBD Belapur", latitude: 19.0219, longitude: 73.0397, type: SpotType.COVERED, totalSlots: 120, isFree: false, pricePerHour: 40, hasEVCharging: true },
  { name: "Kharghar Central", address: "Sector 7, Kharghar", latitude: 19.0477, longitude: 73.0693, type: SpotType.MULTI_STOREY, totalSlots: 200, isFree: false, pricePerHour: 30 },
  { name: "Kamothe Free Lot", address: "Kamothe, Navi Mumbai", latitude: 19.0157, longitude: 73.0927, type: SpotType.OPEN, totalSlots: 30, isFree: true, pricePerHour: null },
  { name: "Vashi Plaza Parking", address: "Vashi, Navi Mumbai", latitude: 19.0771, longitude: 73.0071, type: SpotType.UNDERGROUND, totalSlots: 80, isFree: false, pricePerHour: 50, hasEVCharging: true },
];

async function main() {
  console.log("seeding...");

  await prisma.parkingSpot.deleteMany();

  for (const spot of spots) {
    const created = await prisma.parkingSpot.create({
      data: {
        ...spot,
        hasEVCharging: spot.hasEVCharging ?? false,
        status: SpotStatus.AVAILABLE,
      },
    });

    await prisma.availability.create({
      data: {
        spotId: created.id,
        availableSlots: Math.floor(created.totalSlots * 0.6),
      },
    });
  }

  console.log("done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
