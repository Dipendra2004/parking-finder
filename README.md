# 🅿️ ParkFinder

A full-stack real-time parking spot finder web application. Discover, filter, and book nearby parking spots on an interactive map — with live availability updates powered by WebSockets.

---

## ✨ Features

- **Interactive Map** — Explore parking spots on a Google Maps-powered map centered on your current location.
- **Real-Time Availability** — Live slot counts updated instantly via Socket.io WebSockets.
- **Smart Search** — Search by neighborhood or street name with built-in geocoding.
- **Filter & Sort** — Filter spots by type (Free, Paid, EV Charging) and advanced options such as radius and spot category.
- **Spot Details** — View address, price per hour, total/available slots, EV charging info, and user reviews.
- **Bookings** — Authenticated users can book a spot and track their booking history.
- **User Profiles** — View your booking history and saved/bookmarked spots.
- **Authentication** — Secure sign-up / sign-in with credentials or OAuth providers via NextAuth.js.
- **Responsive Design** — Works seamlessly on desktop and mobile.
- **Dark UI** — Sleek dark theme with Tailwind CSS and shadcn/ui components.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Maps | Google Maps JavaScript API (`@react-google-maps/api`) |
| Auth | NextAuth.js v4 with Prisma Adapter |
| Database | PostgreSQL via [Prisma](https://www.prisma.io/) ORM |
| Real-time | Socket.io (custom Node.js server) |
| Icons | Lucide React, Material Symbols |

---

## 📁 Project Structure

```
parking-finder/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── api/              # REST API routes (auth, bookings, spots, register)
│   ├── bookings/         # My Bookings page
│   ├── profile/          # User Profile page
│   ├── layout.tsx        # Root layout (Navbar, Footer, Providers)
│   └── page.tsx          # Home page (Map + Sidebar)
├── components/
│   ├── layout/           # Navbar, Footer
│   ├── map/              # MapView, SpotMarker
│   ├── spots/            # ParkingSpotCard, ExpandedSpotCard, SpotFilters, LiveAvailability
│   └── ui/               # Reusable shadcn/ui primitives
├── hooks/
│   ├── useGeolocation.ts # Browser geolocation hook
│   ├── useNearbySpots.ts # Fetches nearby spots from API
│   └── useRealtime.ts    # Socket.io real-time availability hook
├── lib/                  # Prisma client, auth config, utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
├── server.ts             # Custom Node.js + Socket.io server
└── types/                # Shared TypeScript types
```

---

## 🗄️ Database Schema

The app uses PostgreSQL with the following main models:

- **User** — Accounts with roles (`USER`, `ADMIN`, `OWNER`)
- **ParkingSpot** — Location, type (`OPEN`, `COVERED`, `UNDERGROUND`, `MULTI_STOREY`), pricing, EV charging
- **Availability** — Live available slot count per spot
- **Booking** — User bookings with status (`PENDING`, `ACTIVE`, `COMPLETED`, `CANCELLED`)
- **Review** — Star ratings and comments per spot
- **Bookmark** — Saved spots per user

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Maps API key

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

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Optional: OAuth providers (e.g., Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Set up the database

```bash
# Push schema to your database
npx prisma db push

# Seed with sample parking spots
npm run seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The development server starts a custom Node.js + Socket.io server alongside Next.js to handle real-time updates.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (Next.js + Socket.io) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed the database with sample data |

---

## 🌐 API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/spots` | Fetch nearby parking spots |
| GET | `/api/spots/[id]` | Get a single spot's details |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings` | Get user's bookings |
| POST | `/api/register` | Register a new user |
| `...` | `/api/auth/[...nextauth]` | NextAuth authentication |

---

## 🔒 Authentication & Authorization

Protected routes (`/profile`, `/bookings`) are guarded by NextAuth.js middleware. Users must be signed in to access them. The app supports:

- **Credentials** (email + password with bcryptjs hashing)
- **OAuth** providers configurable via NextAuth

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
