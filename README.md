# 🅿️ ParkFinder

> **Real-time parking discovery for the modern city.**

ParkFinder is a full-stack web application that helps drivers find, filter, and reserve nearby parking spots in real time. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, it combines a live Google Maps view with an intelligent sidebar to surface the best available spots instantly.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Live Map View** | Dark-themed Google Maps canvas with colour-coded spot markers |
| 🔍 **Smart Search** | Debounced geocoding — search any address and the map re-centres automatically |
| ⚡ **Real-time Availability** | Socket.IO keeps slot counts fresh without a page reload |
| 🎛️ **Flexible Filters** | Filter by Free / Paid / EV Charging or use the advanced filter sheet |
| 📋 **Spot Detail Page** | Hero image, live occupancy gauge, amenity overview, and a booking form |
| 🔒 **Auth & Bookings** | NextAuth.js sign-in, plus a personal bookings dashboard |
| 📱 **Responsive Design** | Fluid layout that works across mobile, tablet, and desktop |

---

## 🛠 Tech Stack

- **Framework** – [Next.js 14](https://nextjs.org/) (App Router)
- **Language** – [TypeScript](https://www.typescriptlang.org/)
- **Styling** – [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Maps** – [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) via `@react-google-maps/api`
- **Database** – [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Auth** – [NextAuth.js v4](https://next-auth.js.org/)
- **Real-time** – [Socket.IO](https://socket.io/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- [Google Maps API key](https://console.cloud.google.com/)

### 1 · Clone & install

```bash
git clone https://github.com/Dipendra2004/parking-finder.git
cd parking-finder
npm install
```

### 2 · Configure environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/parking_finder"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-google-maps-api-key"
```

### 3 · Set up the database

```bash
npx prisma migrate dev --name init
npm run seed
```

### 4 · Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
parking-finder/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── api/             # REST API routes (spots, bookings, auth)
│   ├── bookings/        # My Bookings page
│   ├── profile/         # User Profile page
│   ├── spots/[id]/      # Spot Detail page
│   └── page.tsx         # Main Map page
├── components/
│   ├── layout/          # Navbar & Footer
│   ├── map/             # MapView, SpotMarker
│   ├── spots/           # ParkingSpotCard, ExpandedSpotCard, SpotFilters, LiveAvailability
│   └── ui/              # shadcn/ui primitives + custom components
├── hooks/               # useGeolocation, useNearbySpots, useRealtime
├── lib/                 # Prisma client, NextAuth config, utilities
├── prisma/              # Schema & seed script
└── types/               # Shared TypeScript interfaces
```

---

## 🔌 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/spots` | List nearby spots (accepts `lat`, `lng`, `radius` query params) |
| `GET` | `/api/spots/:id` | Get a single spot by ID |
| `POST` | `/api/bookings` | Create a new booking (auth required) |
| `GET` | `/api/bookings` | List the current user's bookings (auth required) |

---

## 🗄️ Database Schema (key models)

```
ParkingSpot   – id, name, address, lat/lng, totalSlots, availableSlots, pricePerHour, isFree, hasEVCharging, status
Booking       – id, userId, spotId, durationHours, totalPrice, createdAt
User          – id, name, email, passwordHash (NextAuth compatible)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License

[MIT](LICENSE) © 2026 ParkFinder
