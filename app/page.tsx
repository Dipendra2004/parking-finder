"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapView } from "@/components/map/MapView";
import { SpotMarker } from "@/components/map/SpotMarker";
import { ParkingSpotCard } from "@/components/spots/ParkingSpotCard";
import { ExpandedSpotCard } from "@/components/spots/ExpandedSpotCard";
import { SpotFilters } from "@/components/spots/SpotFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbySpots } from "@/hooks/useNearbySpots";
import { ParkingSpot, SpotFilters as FilterType } from "@/types";

const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border
    ${active ? 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20 font-bold' : 'bg-[#262626] text-[#adaaaa] border-transparent hover:bg-[#2c2c2c]'}`}
  >
    {label}
  </button>
);

export default function Home() {
  const router = useRouter();
  const { coords, loading: locLoading } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<FilterType>({ radius: 5, hasEVCharging: undefined, isFree: undefined, type: undefined });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { spots, loading: spotsLoading } = useNearbySpots(coords, filters);
  const [selected, setSelected] = useState<ParkingSpot | null>(null);

  const [activeChip, setActiveChip] = useState<string>("All");

  const center = mapCenter ?? coords;

  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip === "All") setFilters({ ...filters, isFree: undefined, hasEVCharging: undefined });
    if (chip === "Free") setFilters({ ...filters, isFree: true, hasEVCharging: undefined });
    if (chip === "Paid") setFilters({ ...filters, isFree: false, hasEVCharging: undefined });
    if (chip === "EV") setFilters({ ...filters, isFree: undefined, hasEVCharging: true });
  };

  const sortedSpots = useMemo(() => {
    let filtered = [...spots];
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }
    return filtered.sort((a, b) => {
      const aAvailable = a.availability?.availableSlots ?? a.availableSlots;
      const bAvailable = b.availability?.availableSlots ?? b.availableSlots;
      return bAvailable - aAvailable;
    });
  }, [spots, searchQuery]);

  // Geocoding inside map search 
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() && typeof google !== "undefined" && google.maps?.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const loc = results[0].geometry.location;
            setMapCenter({ lat: loc.lat(), lng: loc.lng() });
          }
        });
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSpot = (spot: ParkingSpot) => {
    setSelected(spot);
    setMapCenter({ lat: spot.latitude, lng: spot.longitude });
  };

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
         setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  };

  const avgPrice = spots.length > 0 ? Math.round(spots.reduce((acc, spot) => acc + (spot.pricePerHour || 0), 0) / spots.length) : 0;
  const cityLoad = spots.length > 0 ? Math.round((spots.reduce((acc, spot) => acc + ((spot.totalSlots - (spot.availability?.availableSlots ?? spot.availableSlots))), 0) / spots.reduce((acc, spot) => acc + spot.totalSlots, 0)) * 100) : 0;

  if (locLoading) return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="absolute w-24 h-24 bg-[#3b82f6] rounded-full blur-[50px] opacity-20 animate-pulse"></div>
      <p className="text-[#85adff] font-medium z-10 tracking-widest uppercase text-sm">Targeting Location...</p>
    </div>
  );

  return (
    <main className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0a0a0a]">
      {/* MAP BACKGROUND (100% wrapper with absolute inset-0) */}
      <div className="absolute inset-0 z-0 bg-[#131313]">
        {center && (
          <MapView center={center} onMapClick={() => setSelected(null)}>
            {sortedSpots.map((spot) => (
              <SpotMarker key={spot.id} spot={spot} onClick={handleSelectSpot} />
            ))}
          </MapView>
        )}
      </div>

      {/* MAP SYNC INDICATOR */}
      {spotsLoading && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-full px-5 py-2 text-xs font-semibold text-[#85adff] shadow-xl flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping"></div>
          Syncing grid...
        </div>
      )}

      {/* FLOATING EXPANDED CARD */}
      {selected && (
        <div className="absolute bottom-32 lg:bottom-10 left-1/2 lg:left-[55%] -translate-x-1/2 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ExpandedSpotCard spot={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* SIDEBAR OVERLAY */}
      <aside className="absolute lg:top-4 top-4 lg:left-8 left-4 bottom-4 lg:bottom-8 w-[min(calc(100%-2rem),22rem)] lg:w-96 z-10 flex flex-col gap-4 pointer-events-none">
        
        {/* Search & Filter Area */}
        <div className="bg-[#1a1919]/80 backdrop-blur-xl p-6 rounded-xl border border-white/5 shadow-2xl pointer-events-auto">
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa]">search</span>
            <input 
              className="w-full bg-[#262626] border border-[#494847]/20 rounded-xl py-3 pl-12 pr-12 text-sm focus:ring-1 focus:ring-[#85adff] focus:border-[#85adff] outline-none transition-all placeholder:text-[#adaaaa] text-white" 
              placeholder="Search neighborhood or street..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setFiltersOpen(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#333] text-[#adaaaa] hover:text-white transition-colors flex items-center justify-center pointer-events-auto"
              title="Advanced Filters"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <FilterChip label="All" active={activeChip === "All"} onClick={() => handleChipClick("All")} />
            <FilterChip label="Free Only" active={activeChip === "Free"} onClick={() => handleChipClick("Free")} />
            <FilterChip label="Paid" active={activeChip === "Paid"} onClick={() => handleChipClick("Paid")} />
            <FilterChip label="EV Charging" active={activeChip === "EV"} onClick={() => handleChipClick("EV")} />
          </div>
        </div>

        {/* Global Popup Filter Component (hidden wrapper) */}
        <div className="hidden">
           <SpotFilters
             filters={filters}
             onChange={setFilters}
             open={filtersOpen}
             onOpenChange={setFiltersOpen}
             hideTrigger
           />
        </div>

        {/* List of Results */}
        <div className="flex-1 overflow-y-auto pr-2 pb-24 lg:pb-0 pointer-events-auto flex flex-col gap-3 scrollbar-hide">
          {sortedSpots.length === 0 ? (
            <div className="bg-[#111111]/90 backdrop-blur-md border border-white/5 rounded-xl p-8 text-center shadow-xl">
               <p className="text-gray-400 text-sm font-medium">No spots found matching your search.</p>
            </div>
          ) : (
            sortedSpots.map((spot) => (
              <ParkingSpotCard 
                key={spot.id} 
                spot={spot} 
                onClick={handleSelectSpot} 
                selected={selected?.id === spot.id} 
              />
            ))
          )}
        </div>
      </aside>

      {/* FLOATING ACTION BUTTONS */}
      <div className="absolute bottom-10 right-8 z-20 hidden lg:flex flex-col gap-4">
        <button 
          onClick={handleLocate}
          className="w-14 h-14 bg-[#1a1919]/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white shadow-2xl border border-white/10 hover:bg-[#262626] transition-colors pointer-events-auto"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
        <button className="w-14 h-14 bg-[#1a1919]/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white shadow-2xl border border-white/10 hover:bg-[#262626] transition-colors pointer-events-auto">
          <span className="material-symbols-outlined">layers</span>
        </button>
        <button className="w-14 h-14 bg-gradient-to-br from-[#85adff] to-[#ac8aff] rounded-full flex items-center justify-center text-[#0e0e0e] shadow-[0_10px_25px_rgba(133,173,255,0.4)] hover:scale-105 active:scale-90 transition-transform pointer-events-auto">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        </button>
      </div>

      {/* DYNAMIC METRICS OVERLAY (Bottom Center) */}
      <div className="absolute bottom-10 left-[55%] -translate-x-1/2 z-10 hidden lg:flex gap-4 pointer-events-none">
        <div className="bg-[#131313]/60 backdrop-blur-2xl px-8 py-4 rounded-2xl border border-white/5 flex items-baseline gap-4 shadow-2xl pointer-events-auto">
          <div>
            <span className="block text-[10px] font-bold text-[#85adff] tracking-widest uppercase mb-1">AVERAGE PRICE</span>
            <span className="text-2xl font-bold tracking-tight text-white">₹{avgPrice}</span>
          </div>
          <div className="w-px h-8 bg-white/10 self-center"></div>
          <div>
            <span className="block text-[10px] font-bold text-[#69f6b8] tracking-widest uppercase mb-1">CITY LOAD</span>
            <span className="text-2xl font-bold tracking-tight text-white">{cityLoad}%</span>
          </div>
        </div>
      </div>
    </main>
  );
}