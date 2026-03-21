# 🅿️ Parking Finder

A real-time parking spot discovery and booking web application built with **Next.js**, **Prisma**, **PostgreSQL**, and **Google Maps**. Find nearby parking spots, filter by type (free, paid, EV charging), view live availability, and book a spot — all from an interactive map interface.

---

## ✨ Features

- 🗺️ **Interactive Map** — Browse parking spots on a Google Maps view centred on your current location
- 🔍 **Search & Filter** — Search by neighbourhood or street; filter by free/paid, EV charging availability, spot type, and radius
- 🔄 **Real-time Availability** — Live slot counts pushed via Socket.IO
- 📋 **Booking System** — Book a parking spot, track active and past bookings
- ⭐ **Reviews & Bookmarks** — Leave ratings/comments and save favourite spots
- 👤 **Authentication** — Email/password sign-up and OAuth via NextAuth.js
- 🛡️ **Role-based Access** — USER, OWNER, and ADMIN roles

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via [Prisma ORM](https://www.prisma.io) |
| Auth | [NextAuth.js v4](https://next-auth.js.org) |
| Real-time | [Socket.IO](https://socket.io) |
| Maps | [Google Maps JavaScript API](https://developers.google.com/maps) |
| UI | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |

---

## 📋 Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database
- **Google Maps API key** (with Maps JavaScript API + Geocoding API enabled)

---

## 🚀 Getting Started

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

Create a `.env` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Set up the database

```bash
# Apply migrations and generate Prisma client
npx prisma migrate dev

# (Optional) Seed sample parking spots
npm run seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
parking-finder/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── api/             # API route handlers
│   │   ├── auth/        # NextAuth endpoints
│   │   ├── spots/       # Parking spot CRUD & nearby search
│   │   ├── bookings/    # Booking management
│   │   └── register/    # User registration
│   ├── bookings/        # Bookings dashboard page
│   ├── profile/         # User profile page
│   ├── spots/[id]/      # Individual spot detail page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home / map view
├── components/
│   ├── map/             # MapView & SpotMarker components
│   └── spots/           # ParkingSpotCard, ExpandedSpotCard, SpotFilters
├── hooks/               # useGeolocation, useNearbySpots, etc.
├── lib/                 # Prisma client, auth config, utilities
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data seeder
├── types/               # Shared TypeScript types
└── server.ts            # Custom server (Next.js + Socket.IO)
```

---

## 📡 Key API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/spots` | List nearby parking spots |
| `GET` | `/api/spots/[id]` | Get a single spot |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings` | Get user bookings |
| `POST` | `/api/register` | Register a new user |

---

## 🏗️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Next.js + Socket.IO) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed the database with sample data |

---

## 📄 License

This project is open-source. Feel free to use and adapt it.
