# ParkFinder

A modern parking discovery and reservation platform built with Next.js, Prisma, PostgreSQL, and Socket.IO.

ParkFinder helps users discover nearby parking spots, filter by preferences (free/paid, EV, type, radius), monitor live availability, and reserve spots in real time.

## Highlights

- Real-time parking availability updates through Socket.IO room subscriptions.
- Location-based discovery with radius filtering (Haversine distance).
- Interactive map UI powered by Google Maps JavaScript API.
- Auth with NextAuth (Google OAuth + email/password credentials).
- Protected user areas for profile and booking history.
- Transactional booking API with slot decrement logic.
- Prisma-backed PostgreSQL data model with seed script.

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: Tailwind CSS 4 + shadcn/ui + Radix primitives
- Auth: NextAuth v4 + Prisma Adapter
- Database: PostgreSQL + Prisma ORM
- Realtime: Socket.IO (custom Node server)
- Maps: @react-google-maps/api

## Architecture

This project runs with a custom Node server (`server.ts`) instead of `next dev` directly.

- Next.js handles pages, API routes, and rendering.
- Socket.IO is attached to the same HTTP server.
- Clients join per-spot rooms (`join:spot`) and receive `availability:update` events.
- A timed server job simulates availability changes in development.

## Core Features

### Discovery and Filtering

- Search spots by name/address text.
- Filter by:
  - Radius
  - Free/Paid
  - EV charging
  - Spot type (`OPEN`, `COVERED`, `UNDERGROUND`, `MULTI_STOREY`)

### Booking Flow

- Users reserve a spot from the spot details screen.
- Booking API checks session auth and current availability.
- Database transaction creates booking and decrements available slots.

### User Experience

- Login/Register flows.
- Profile dashboard.
- Booking history page with active/expired booking display.

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/spots` | List active spots with optional filters (`lat`, `lng`, `radius`, `isFree`, `type`, `hasEVCharging`) |
| `GET` | `/api/spots/[id]` | Fetch single spot details, availability, and latest reviews |
| `POST` | `/api/bookings` | Create booking for authenticated user |
| `POST` | `/api/register` | Register user with hashed password |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handlers |

## Data Model (Prisma)

Main entities in `prisma/schema.prisma`:

- `User` (+ role: `USER`, `ADMIN`, `OWNER`)
- `ParkingSpot`
- `Availability` (1:1 with parking spot)
- `Booking`
- `Review`
- `Bookmark`
- NextAuth tables: `Account`, `Session`, `VerificationToken`

## Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL running locally or remotely
- Google Cloud project for:
  - Maps JavaScript API
  - Geocoding API
  - Places API
  - OAuth 2.0 credentials

### 2. Clone and install

```bash
git clone https://github.com/Dipendra2004/parking-finder.git
cd parking-finder
npm install
```

### 3. Configure environment

Create `.env.local` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/parking_finder"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-random-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. Setup database

```bash
npx prisma migrate dev --name init
npm run seed
```

### 5. Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev | `npm run dev` | Run custom server with Next.js + Socket.IO |
| Build | `npm run build` | Create production Next.js build |
| Start | `npm run start` | Run production custom server |
| Seed | `npm run seed` | Seed sample parking spots + availability |

## Screenshots

Save your UI screenshots as `.png` files in `public/screenshots`.

- **Map and search**  
  ![Map and search](./public/screenshots/map-view.png)

- **Spot details and booking**  
  ![Spot details and booking](./public/screenshots/spot-details.png)

- **Booking summary**  
  ![Booking summary](./public/screenshots/booking-summary.png)

- **Sign up**  
  ![Sign up screen](./public/screenshots/sign-up.png)

- **Sign in**  
  ![Sign in screen](./public/screenshots/sign-in.png)

## Project Structure

```text
app/
  (auth)/login, register
  api/
    auth/[...nextauth]
    bookings
    register
    spots
      [id]
  bookings
  profile
  spots/[id]
components/
  auth/
  layout/
  map/
  spots/
  ui/
hooks/
  useGeolocation.ts
  useNearbySpots.ts
  useRealtime.ts
lib/
  auth.ts
  db.ts
prisma/
  schema.prisma
  seed.ts
server.ts
middleware.ts
```

## Deployment Notes

Because this app uses a custom Node server (`server.ts`) and Socket.IO, deploy to a platform that supports long-running Node processes (for example VM, container, or Node host). Serverless-only environments may require architecture changes for WebSocket support.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Open a pull request

## License

No license file is currently present in this repository.
If you want this to be open-source friendly, add an MIT `LICENSE` file.
