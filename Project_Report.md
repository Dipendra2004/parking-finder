# Project Report: ParkFinder

## 1. Project Overview
**ParkFinder** is a modern, full-stack web application designed to solve urban parking challenges. It serves as a real-time parking discovery and reservation platform, allowing users to find nearby parking spots, filter them based on specific preferences, view live availability, and reserve spots seamlessly.

## 2. Objectives
- Provide a location-based search mechanism for users to find nearby parking spots.
- Enable rich filtering options including price (free/paid), EV charging availability, and parking type (open, covered, underground, multi-storey).
- Offer real-time updates on parking spot availability to prevent overbooking.
- Facilitate a secure authentication system for users and spot owners.
- Implement a transactional booking system.

## 3. Technology Stack
The application is built using a modern JavaScript/TypeScript ecosystem:
- **Frontend Framework**: Next.js 16 (React, App Router)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI primitives
- **Authentication**: NextAuth.js v4 (Google OAuth & Email/Password Credentials)
- **Database**: PostgreSQL
- **ORM**: Prisma 
- **Real-Time Communication**: Socket.IO (Custom Node HTTP Server)
- **Mapping & Geolocation**: Google Maps JavaScript API, Geocoding API

## 4. System Architecture
Unlike standard Next.js applications that deploy via serverless functions, ParkFinder utilizes a **Custom Node.js Server (`server.ts`)**. 
- **Next.js Integration**: Handles page rendering, API routing, and SSR/SSG.
- **Socket.IO Attachment**: Binds to the same HTTP server to manage stateful WebSocket connections.
- **Real-time Engine**: Clients subscribe to specific parking spot rooms (e.g., `join:spot`) to receive `availability:update` events dynamically.

## 5. Core Features & Modules
### 5.1. Discovery and Mapping
- Incorporates `@react-google-maps/api` to render interactive maps.
- Implements custom `useGeolocation` and `useNearbySpots` hooks to calculate the Haversine distance and fetch relevant local data.
- Search queries handle both textual addresses and coordinate-based lookups.

### 5.2. Booking System & Concurrency
- Users can view detailed spot pages.
- The booking API (`/api/bookings`) processes requests using database transactions. It securely checks session authentication, verifies current availability, creates a `Booking` record, and decrements available slots atomically.

### 5.3. Authentication & User Management
- Supports distinct roles: `USER`, `ADMIN`, and `OWNER`.
- Features personalized dashboards for users to view active and past booking histories.

## 6. Database Schema (Prisma Data Model)
The PostgreSQL database consists of several interconnected entities:
- **User**: Stores credentials, roles, and profile information.
- **ParkingSpot**: Contains geographic coordinates, pricing, type, and descriptive metadata.
- **Availability**: A strict 1:1 relation with `ParkingSpot` to track total vs. currently available slots.
- **Booking**: Tracks start/end times, payment status, and links Users to ParkingSpots.
- **Review & Bookmark**: Enables users to save spots and leave post-booking feedback.

## 7. API Endpoints Structure
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/spots` | Fetches active spots. Accepts query params (`lat`, `lng`, `radius`, `type`). |
| `GET` | `/api/spots/[id]` | Retrieves detailed info, current availability, and reviews for a single spot. |
| `POST` | `/api/bookings` | Creates a secure booking for an authenticated user. |
| `POST` | `/api/register` | Handles secure user registration with hashed passwords. |
| `GET/POST` | `/api/auth/*` | NextAuth lifecycle endpoints (login, callback, session). |

## 8. Deployment Strategy
Because of the stateful WebSocket connections required by Socket.IO, the application is configured for deployment on long-running Node.js environments (like Render, Railway, or VPS hosting) rather than standard serverless platforms (like Vercel). The database is hosted remotely on Render PostgreSQL with strict SSL enforcement (`sslmode=require`).

## 9. Conclusion
ParkFinder represents a robust, highly-interactive web application. By blending a modern Next.js React frontend with a transactional PostgreSQL backend and real-time WebSockets, it provides a seamless and reliable user experience designed to scale in real-world urban environments.