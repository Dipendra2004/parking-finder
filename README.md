<div align="center">

# 🅿️ ParkFinder

**Real-time parking spot discovery, powered by maps.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Overview

ParkFinder is a full-stack web application that helps drivers find nearby parking spots in real time. It overlays live availability data on an interactive map, lets you filter by price, type, and EV charging support, and allows you to book a spot — all from a single, modern interface.

---

## 🚀 Features

- **🗺️ Interactive map** — Google Maps integration with custom parking-spot markers
- **📍 Auto-locate** — instantly centers the map on your current position
- **🔍 Smart search** — geocodes any address/neighbourhood and filters results in real time
- **⚡ Live availability** — slot counts update via real-time sync
- **🎛️ Advanced filters** — filter by radius, price (free / paid), parking type, and EV charging
- **🔖 Spot booking** — reserve a spot directly from the map card
- **👤 User accounts** — secure sign-up / sign-in with NextAuth.js (credentials + OAuth)
- **📋 My Bookings** — manage all your active and past reservations
- **📱 Responsive UI** — works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Database | [PostgreSQL](https://www.postgresql.org) via [Prisma ORM](https://www.prisma.io) |
| Auth | [NextAuth.js](https://next-auth.js.org) |
| Maps | [Google Maps JavaScript API](https://developers.google.com/maps) |
| Real-time | WebSocket / polling via custom hooks |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** / **yarn** / **pnpm**
- A **PostgreSQL** database (local or hosted)
- A **Google Maps API** key with the Maps JavaScript API enabled

### 1 — Clone & install

```bash
git clone https://github.com/Dipendra2004/parking-finder.git
cd parking-finder
npm install
```

### 2 — Configure environment variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/parking_finder"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 3 — Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed          # optional: seed sample parking spots
```

### 4 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
parking-finder/
├── app/                  # Next.js App Router pages & API routes
│   ├── (auth)/           # Login / Register pages
│   ├── api/              # REST API handlers
│   ├── bookings/         # Bookings page
│   ├── profile/          # User profile page
│   └── page.tsx          # Main map view
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── map/              # MapView, SpotMarker
│   ├── spots/            # ParkingSpotCard, SpotFilters, ExpandedSpotCard
│   └── ui/               # Shared UI primitives (shadcn/ui)
├── hooks/                # useGeolocation, useNearbySpots, useRealtime
├── lib/                  # Prisma client, auth config, utilities
├── prisma/               # Schema & migrations
└── types/                # Shared TypeScript types
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Dipendra2004">Dipendra2004</a>
</div>

