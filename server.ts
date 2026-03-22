import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { db } from "./lib/db";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("client connected:", socket.id);

    socket.on("join:spot", (spotId: string) => {
      socket.join(`spot:${spotId}`);
      console.log(`${socket.id} joined spot:${spotId}`);
    });

    socket.on("leave:spot", (spotId: string) => {
      socket.leave(`spot:${spotId}`);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected:", socket.id);
    });
  });

  // broadcast availability updates every 10 seconds
  setInterval(async () => {
    try {
      const spots = await db.parkingSpot.findMany({
        include: { availability: true },
      });

      for (const spot of spots) {
        if (!spot.availability) continue;

        // simulate random availability change for dev
        const change = Math.floor(Math.random() * 5) - 2;
        const newSlots = Math.min(
          spot.totalSlots,
          Math.max(0, spot.availability.availableSlots + change)
        );

        await db.availability.update({
          where: { spotId: spot.id },
          data: { availableSlots: newSlots },
        });

        io.to(`spot:${spot.id}`).emit("availability:update", {
          spotId: spot.id,
          availableSlots: newSlots,
          totalSlots: spot.totalSlots,
        });
      }
    } catch (err) {
      console.error("availability update error:", err);
    }
  }, 10000);

  httpServer.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});