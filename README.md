# 🅿️ ParkFinder

> A modern, real-time parking spot finder web application that helps users locate, filter, and reserve parking spaces near them.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## ✨ Features

- 🗺️ **Interactive Google Map** — Browse parking spots on a live, dark-themed map with custom markers
- 📍 **Geolocation** — Automatically centers the map on the user's current location
- 🔍 **Smart Search** — Search by neighbourhood or street name with geocoding support
- 🎛️ **Advanced Filters** — Filter by spot type (open/covered/underground/multi-storey), price, EV charging availability, and search radius
- ⚡ **Real-time Availability** — Socket.IO-powered live slot counts so users always see up-to-date occupancy
- 📅 **Instant Reservations** — Book a spot for a chosen duration directly from the app
- 📋 **Booking History** — View and manage all active and past reservations
- 👤 **User Profiles** — Account overview with role-based access (User / Owner / Admin)
- 🔐 **Dual Authentication** — Email/password login and Google OAuth via NextAuth v4
- 🔋 **EV Charging Indicators** — At-a-glance visibility of EV-friendly spots
- 💰 **Dynamic Pricing** — Per-hour pricing shown for each spot

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Authentication | NextAuth v4 (JWT + PrismaAdapter) |
| Real-time | Socket.IO 4 |
| Maps | Google Maps JavaScript API (`@react-google-maps/api`) |
| Icons | Lucide React |
| Password Hashing | bcryptjs |

---

## 📁 Project Structure

```
parking-finder/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page (email + Google OAuth)
│   │   └── register/       # Registration page
│   ├── api/
│   │   ├── auth/           # NextAuth handler
│   │   ├── bookings/       # Create bookings
│   │   ├── register/       # User registration endpoint
│   │   └── spots/          # Fetch spots list & spot details
│   ├── bookings/           # Booking history (protected)
│   ├── profile/            # User profile (protected)
│   ├── spots/[id]/         # Individual spot detail page
│   └── page.tsx            # Home page with map + spot list
├── components/
│   ├── auth/               # LogoutButton
│   ├── layout/             # Navbar, Footer
│   ├── map/                # MapView, SpotMarker
│   ├── spots/              # ParkingSpotCard, ExpandedSpotCard, SpotFilters, LiveAvailability
│   └── ui/                 # shadcn + custom UI components
├── hooks/
│   ├── useGeolocation.ts   # GPS coordinates with fallback
│   ├── useNearbySpots.ts   # Fetches spots from API with filters
│   └── useRealtime.ts      # Socket.IO real-time availability
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # Prisma client singleton
│   └── utils.ts            # cn() class-merging utility
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeder
├── types/
│   ├── index.ts            # Shared TypeScript interfaces
│   └── next-auth.d.ts      # Extended NextAuth session types
├── middleware.ts            # Route protection (/profile, /bookings)
└── server.ts               # Custom Node server with Socket.IO
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [PostgreSQL](https://www.postgresql.org) database
- [Google Cloud](https://console.cloud.google.com) project with:
  - Maps JavaScript API enabled
  - Places API enabled
  - Geocoding API enabled
  - OAuth 2.0 credentials (for Google login)

### 1. Clone the repository

```bash
git clone https://github.com/Dipendra2004/parking-finder.git
cd parking-finder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/parking_finder"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"   # generate with: openssl rand -base64 32

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Maps (exposed to the browser)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Set up the database

```bash
# Apply migrations
npx prisma migrate dev --name init

# (Optional) Seed sample parking spots
npm run seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Next.js + Socket.IO) |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run seed` | Seed the database with sample parking spots |

---

## 🗃️ Database Schema

The application uses **PostgreSQL** managed through **Prisma**. Key models:

| Model | Description |
|---|---|
| `User` | Registered users with role (`USER`, `ADMIN`, `OWNER`) |
| `ParkingSpot` | Parking locations with type, price, EV charging flag, and coordinates |
| `Availability` | Real-time available slot count per spot (1-to-1 with `ParkingSpot`) |
| `Booking` | Reservations linking a user to a spot with duration and total price |
| `Review` | Star ratings (1–5) and comments on spots |
| `Bookmark` | User-saved (favourited) spots |
| `Account / Session` | NextAuth OAuth account and session records |

---

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/spots` | List nearby parking spots (supports `lat`, `lng`, `radius`, `isFree`, `hasEVCharging`, `type` query params) |
| `GET` | `/api/spots/[id]` | Get detailed info for a specific spot |
| `POST` | `/api/bookings` | Create a new booking (requires auth) |
| `POST` | `/api/register` | Register a new user account |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth authentication handler |

---

## 🔐 Authentication

Authentication is handled by **NextAuth v4** with two providers:

- **Google OAuth** — One-click sign-in with a Google account
- **Credentials** — Traditional email + password (passwords hashed with bcryptjs)

Protected routes (`/profile`, `/bookings`) are enforced by `middleware.ts`. Unauthenticated users are redirected to `/login`.

---

## ⚡ Real-time Updates

The custom `server.ts` integrates **Socket.IO** alongside Next.js. When a booking is made or slot availability changes, the server emits `availability:update` events. The `useRealtime` hook subscribes to these events per spot ID, keeping the UI in sync without requiring page refreshes.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
