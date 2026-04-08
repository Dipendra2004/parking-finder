"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ParkingSpot } from "@/types";
import { LiveAvailability } from "@/components/spots/LiveAvailability";

const fetchSpotDetails = async (id: string): Promise<ParkingSpot | null> => {
  try {
    const res = await fetch(`/api/spots/${id}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Failed to fetch spot details:", error);
    return null;
  }
};

export default function SpotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = use(params);
  const [spot, setSpot] = useState<ParkingSpot | null>(null);
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(4);
  const [checkIn, setCheckIn] = useState<string>("now");

  const handleReserve = async () => {
    if (!spot) return;
    setBookingLoading(true);
    setBookingError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: spot.id,
          durationHours: duration,
          totalPrice: spot.isFree ? 0 : (spot.pricePerHour || 0) * duration
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Reservation failed");
      }
      
      setBookingSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchSpotDetails(id).then(setSpot);
  }, [id]);

  if (!spot) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#85adff] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const availableSlots = spot.availability?.availableSlots ?? spot.availableSlots;
  const totalSlots = spot.availability?.totalSlots ?? spot.totalSlots;
  const isFull = String(spot.status).toUpperCase() === "FULL" || availableSlots <= 0;
  const occupancyPercent = Math.round(((totalSlots - availableSlots) / totalSlots) * 100);

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen font-sans selection:bg-[#85adff]/30 pb-20">
      <main className="pt-24 px-4 sm:px-8 max-w-[1440px] mx-auto">
        
        {/* Navigation Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[#adaaaa] hover:text-white mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="font-semibold text-sm tracking-tight">Back to Map</span>
        </button>

        {/* Hero Section */}
        <section className="mb-12 relative group">
          <div className="h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
            <img 
              alt={spot.name} 
              className="w-full h-full object-cover opacity-80" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo6cSUbaMyjQ-k6Ej6neZRH-SDR4TIrI4vuJL-m9iry0jKGR7A754i373t9qDLFH693RhKiYdJsRDJpsMPgCOIUMM9npWf0bIksBVHy20QmXl4MRyB1WG_Pceb0iJoX_ukGOZKJ4jiS-wcV6PjcRLn_GOkhMpUZsgmfE0n_oI8xcv32lauOW8U_pzyx2k4Kqm-mEzbSBjmCfpzFgz_SQE6cyqdDgvGGkK7P0QH0JaVxv8yDXFyOkIoqZTwVSedTgyCcxihrkfC_6g"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
            
            {/* Floating Header Content */}
            <div className="absolute bottom-6 sm:bottom-8 left-4 right-4 sm:left-8 sm:right-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {isFull ? (
                    <span className="px-4 py-1.5 bg-[#ff716c]/20 text-[#ff716c] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#ff716c]/30 shadow-[0_0_15px_rgba(255,113,108,0.2)]">Currently Full</span>
                  ) : (
                    <span className="px-4 py-1.5 bg-[#9bffce]/20 text-[#69f6b8] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#9bffce]/30 shadow-[0_0_15px_rgba(105,246,184,0.2)]">Live Now</span>
                  )}
                  {spot.hasEVCharging && (
                    <span className="px-4 py-1.5 bg-[#1a1919]/80 backdrop-blur-md text-[#adaaaa] text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/10">EV Charging</span>
                  )}
                  <span className="flex items-center gap-1 text-[#85adff] bg-[#1a1919]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-xs">4.8</span>
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-3" style={{ textShadow: "0 0 40px rgba(0,0,0,0.8)" }}>{spot.name}</h1>
                <p className="text-[#adaaaa] flex items-center gap-2 text-sm sm:text-base font-medium">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {spot.address}
                </p>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`, "_blank")}
                className="bg-[#262626]/80 backdrop-blur-xl px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-white/10 flex items-center justify-center w-full md:w-auto gap-3 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] shadow-2xl"
              >
                <span className="material-symbols-outlined text-[#85adff]">directions</span>
                <span className="font-bold tracking-tight text-white drop-shadow-md">Get Directions</span>
              </button>
            </div>
          </div>
        </section>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Details & Feedback */}
          <div className="col-span-1 lg:col-span-8 space-y-8">
            
            {/* Availability Bento Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LiveAvailability 
                spotId={spot.id}
                initialSlots={availableSlots}
                totalSlots={totalSlots}
              />

              <div className="bg-[#1a1919] rounded-2xl p-6 sm:p-8 border-l-[6px] border-[#9bffce] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[#adaaaa] font-bold text-[10px] uppercase tracking-widest">Base Rate</span>
                  <span className="material-symbols-outlined text-[#9bffce]">payments</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold tracking-tighter text-white">{spot.isFree ? "Free" : `₹${spot.pricePerHour}`}</span>
                  {!spot.isFree && <span className="text-[#adaaaa] font-medium">/ hr</span>}
                </div>
                <p className="mt-8 text-sm font-medium text-[#adaaaa] leading-relaxed">
                  {spot.isFree ? "No daily max cap." : "Standard metropolitan rates apply."}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Booking & Stats */}
          <div className="col-span-1 lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              
              {/* Quick Reserve Card */}
              <div className="bg-[#1a1919] rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl">
                <h4 className="text-xl font-extrabold mb-8 text-white tracking-tight">Reserve a Spot</h4>
                
                {!session ? (
                  /* Unauthenticated: Login Prompt */
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#262626] flex items-center justify-center border border-white/5">
                      <span className="material-symbols-outlined text-3xl text-[#adaaaa]">lock</span>
                    </div>
                    <p className="text-[#adaaaa] text-sm leading-relaxed">Sign in to reserve a parking spot and manage your bookings.</p>
                    <button
                      onClick={() => router.push("/login")}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#85adff] to-[#ac8aff] text-[#0e0e0e] font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(133,173,255,0.2)] flex justify-center items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">login</span>
                      Sign in to Reserve
                    </button>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#adaaaa] opacity-60">
                      Don&apos;t have an account? <a href="/register" className="text-[#85adff] hover:underline">Create one</a>
                    </p>
                  </div>
                ) : (
                  /* Authenticated: Full Booking Form */
                  <>
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-2">Check-in</label>
                        <div className="w-full bg-[#262626] rounded-xl border border-white/5 text-white shadow-inner flex overflow-hidden">
                          <select 
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full bg-transparent p-4 text-sm font-semibold tracking-tight outline-none border-none cursor-pointer appearance-none"
                          >
                             <option className="bg-[#1a1919]" value="now">Right Now</option>
                             <option className="bg-[#1a1919]" value="later" disabled>Later (Coming Soon)</option>
                          </select>
                          <div className="flex items-center pr-4 pointer-events-none">
                            <span className="material-symbols-outlined text-sm text-[#85adff]">calendar_today</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest block mb-2">Duration</label>
                        <div className="w-full bg-[#262626] rounded-xl border border-white/5 text-white shadow-inner flex overflow-hidden">
                          <select 
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full bg-transparent p-4 text-sm font-semibold tracking-tight outline-none border-none cursor-pointer appearance-none"
                          >
                             {[1, 2, 3, 4, 6, 8, 12, 24].map(hours => (
                                <option key={hours} className="bg-[#1a1919]" value={hours}>{hours} Hour{hours > 1 && 's'}</option>
                             ))}
                          </select>
                          <div className="flex items-center pr-4 pointer-events-none">
                            <span className="material-symbols-outlined text-sm text-[#85adff]">schedule</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-8 py-4 border-t border-white/5">
                      <span className="text-[#adaaaa] text-sm font-bold tracking-tight">Estimated Total</span>
                      <span className="text-3xl font-extrabold text-white tracking-tighter">{spot.isFree ? "Free" : `₹${(spot.pricePerHour || 0) * duration}`}</span>
                    </div>
                    {bookingError && (
                      <div className="mb-4 text-center text-[#ff716c] text-xs font-bold uppercase tracking-widest p-2 bg-[#ff716c]/10 rounded-lg border border-[#ff716c]/20">
                        {bookingError}
                      </div>
                    )}
                    {bookingSuccess && (
                      <div className="mb-4 text-center text-[#69f6b8] text-xs font-bold uppercase tracking-widest p-2 bg-[#69f6b8]/10 rounded-lg border border-[#69f6b8]/20 animate-pulse">
                        Spot Reserved Successfully!
                      </div>
                    )}
                    <button 
                      disabled={isFull || bookingLoading || bookingSuccess}
                      onClick={handleReserve}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#85adff] to-[#ac8aff] text-[#0e0e0e] font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(133,173,255,0.2)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {bookingLoading ? (
                         <div className="w-5 h-5 rounded-full border-2 border-[#0e0e0e] border-t-transparent animate-spin"></div>
                      ) : isFull ? "Lot Full" : bookingSuccess ? "Reserved!" : "Confirm Reservation"}
                    </button>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-center text-[#adaaaa] mt-6 px-2 leading-relaxed opacity-60">
                      Cancel up to 30 mins before arrival. Includes secure pass.
                    </p>
                  </>
                )}
              </div>

              {/* Features Card */}
              <div className="bg-[#1a1919] rounded-2xl p-8 border border-white/5 shadow-xl">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#adaaaa] mb-6">Amenity Overview</h4>
                <div className="flex flex-col gap-5">
                  {spot.hasEVCharging && (
                    <div className="flex items-center gap-4 text-white">
                      <div className="bg-[#262626] p-2 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[#9bffce] block">ev_station</span></div>
                      <span className="font-semibold text-sm tracking-tight text-[#adaaaa]">EV Charging</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-white">
                    <div className="bg-[#262626] p-2 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[#9bffce] block">camera_outdoor</span></div>
                    <span className="font-semibold text-sm tracking-tight text-[#adaaaa]">24/7 Security</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="bg-[#262626] p-2 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[#9bffce] block">accessibility_new</span></div>
                    <span className="font-semibold text-sm tracking-tight text-[#adaaaa]">Accessible Access</span>
                  </div>
                  {!spot.isFree && (
                    <div className="flex items-center gap-4 text-white">
                      <div className="bg-[#262626] p-2 rounded-lg border border-white/5"><span className="material-symbols-outlined text-[#9bffce] block">payments</span></div>
                      <span className="font-semibold text-sm tracking-tight text-[#adaaaa]">Digital Payments Accepted</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}