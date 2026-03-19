// ─── User 

export type UserRole = "user" | "admin" | "owner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// ─── Parking Spot ────────────────────────────────────────────────────────────

export type SpotType = "open" | "covered" | "underground" | "multi-storey";
export type SpotStatus = "available" | "full" | "closed";

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: SpotType;
  status: SpotStatus;
  pricePerHour: number | null;   // null = free
  isFree: boolean;
  totalSlots: number;
  availableSlots: number;
  hasEVCharging: boolean;
  isActive: boolean;
  distance?: number;             // km from user — added at query time
  createdAt: string;
}

// ─── Availability ────────────────────────────────────────────────────────────

export interface Availability {
  spotId: string;
  availableSlots: number;
  totalSlots: number;
  updatedAt: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  userId: string;
  spotId: string;
  rating: number;               // 1–5
  comment: string;
  createdAt: string;
  user?: Pick<User, "id" | "name">;
}

// ─── Bookmark ────────────────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  userId: string;
  spotId: string;
  createdAt: string;
  spot?: ParkingSpot;
}

// ─── API Response wrapper ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

export interface SpotFilters {
  type?: SpotType;
  isFree?: boolean;
  hasEVCharging?: boolean;
  maxPrice?: number;
  radius?: number;              // km
}

export interface SearchParams {
  lat: number;
  lng: number;
  filters?: SpotFilters;
}

// ─── Map ─────────────────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}