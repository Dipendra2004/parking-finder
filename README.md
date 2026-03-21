<div align="center">

# 🅿️ ParkingFinder

**Find parking spots near you — instantly.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](#) · [Report a Bug](https://github.com/Dipendra2004/parking-finder/issues) · [Request a Feature](https://github.com/Dipendra2004/parking-finder/issues)

</div>

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## 🚗 About the Project

**ParkingFinder** is a full-stack web application that helps drivers locate available parking spots in real time. Built with **Next.js 14**, it combines an interactive Google Maps interface with live availability updates (powered by Socket.io), user authentication, bookings, reviews, and smart filtering — all in one polished, responsive UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Google Maps integration with custom markers for each parking spot |
| 🔍 **Smart Search** | Search by location with real-time suggestions |
| 📡 **Live Availability** | Real-time slot updates via Socket.io WebSockets |
| 🔐 **Authentication** | Secure sign-in / sign-up with NextAuth (credentials + OAuth ready) |
| 📅 **Bookings** | Reserve parking spots directly from the app |
| ⭐ **Reviews** | Leave and browse ratings for parking spots |
| 🔖 **Bookmarks** | Save favourite spots for quick access |
| ⚡ **EV Charging Filter** | Filter spots that offer electric vehicle charging |
| 🆓 **Free vs Paid Filter** | Easily distinguish free and paid parking |
| 📱 **Responsive Design** | Fully responsive layout for desktop and mobile |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — Accessible, composable UI components
- [Lucide React](https://lucide.dev/) — Icon library
- [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/) — Google Maps integration

**Backend**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — REST API endpoints
- [Socket.io](https://socket.io/) — Real-time WebSocket communication
- [NextAuth.js](https://next-auth.js.org/) — Authentication
- [Prisma ORM](https://www.prisma.io/) — Type-safe database access
- [PostgreSQL](https://www.postgresql.org/) — Relational database
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — Password hashing

---

## 📁 Project Structure

```
parking-finder/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication pages (login, register)
│   ├── api/                    # REST API route handlers
│   ├── bookings/               # Bookings page
│   ├── profile/                # User profile page
│   ├── spots/[id]/             # Individual parking spot page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (map view)
├── components/
│   ├── layout/                 # Navbar, Sidebar, layout wrappers
│   ├── map/                    # MapView, SpotMarker
│   ├── spots/                  # SpotFilters, ParkingSpotCard, LiveAvailability
│   └── ui/                     # Reusable UI components (SearchBar, buttons…)
├── hooks/
│   ├── useGeolocation.ts       # Browser geolocation hook
│   ├── useNearbySpots.ts       # Fetch nearby parking spots
│   └── useRealtime.ts          # Socket.io real-time hook
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── db.ts                   # Prisma client instance
│   └── utils.ts                # Shared utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
├── types/                      # Shared TypeScript types
├── middleware.ts               # Route protection middleware
└── server.ts                   # Custom Next.js + Socket.io server
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18+**
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/) database (local or hosted)
- A [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Dipendra2004/parking-finder.git
cd parking-finder

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root and populate it with the following:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

> **Tip:** Generate a secure `NEXTAUTH_SECRET` with:
> ```bash
> openssl rand -base64 32
> ```

### Database Setup

```bash
# Push the schema to your database
npx prisma db push

# (Optional) Seed the database with sample data
npm run seed
```

### Running the App

```bash
# Development mode (with Socket.io server)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Production build
npm run build
npm run start
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/spots` | List parking spots (supports filters & geo-search) |
| `GET` | `/api/spots/[id]` | Get a single parking spot |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings` | Get user bookings |
| `POST` | `/api/reviews` | Submit a review |
| `POST` | `/api/bookmarks` | Toggle a bookmark |
| `GET` | `/api/bookmarks` | Get user bookmarks |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Made with ❤️ by [Dipendra2004](https://github.com/Dipendra2004)

</div>
