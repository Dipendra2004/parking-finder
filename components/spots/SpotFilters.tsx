"use client";

import { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpotFilters as FilterType } from "@/types";
import { SlidersHorizontal } from "lucide-react";

interface SpotFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function SpotFilters({ filters, onChange, open, onOpenChange, hideTrigger = false }: SpotFiltersProps) {
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.type) count += 1;
    if (filters.isFree !== undefined) count += 1;
    if (filters.hasEVCharging) count += 1;
    if (filters.radius && filters.radius !== 5) count += 1;
    return count;
  }, [filters]);

  const setType = (value: string) => {
    onChange({
      ...filters,
      type: value === "all" ? undefined : (value as FilterType["type"]),
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-[#111111] border-white/10 text-white hover:bg-[#1a1a1a]">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeCount > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-[#3b82f6] text-white border-0">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
      )}

      <SheetContent side="right" className="w-full sm:w-96 bg-[#0a0a0a] border-l border-white/10 text-white shadow-2xl flex flex-col pt-12">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold tracking-tight text-white mb-2">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-8 mt-4 flex-1 items-center text-center">
          <div className="flex flex-col gap-3 items-center w-full">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parking Type</p>
            <Select
              value={filters.type ?? "all"}
              onValueChange={setType}
            >
              <SelectTrigger className="bg-[#111111] border-white/10 text-white focus:ring-1 focus:ring-[#3b82f6] h-12 rounded-xl outline-none">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent className="bg-[#111111] border border-white/10 text-white rounded-xl shadow-xl">
                <SelectItem value="all" className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer py-2 border-0">All types</SelectItem>
                <SelectItem value="OPEN" className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer py-2 border-0">Open Air</SelectItem>
                <SelectItem value="COVERED" className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer py-2 border-0">Covered</SelectItem>
                <SelectItem value="UNDERGROUND" className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer py-2 border-0">Underground</SelectItem>
                <SelectItem value="MULTI_STOREY" className="focus:bg-[#1a1a1a] focus:text-white cursor-pointer py-2 border-0">Multi Storey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 items-center w-full">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pricing Constraint</p>
            <div className="flex gap-2 justify-center">
              {[undefined, true, false].map((val, i) => (
                <Button
                  key={String(val)}
                  size="sm"
                  className={`h-11 px-6 rounded-xl font-medium transition-all duration-200 border ${filters.isFree === val ? "bg-[#3b82f6]/20 text-[#85adff] border-[#3b82f6]/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#111111] border-white/5 text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-300"}`}
                  onClick={() => onChange({ ...filters, isFree: val })}
                >
                  {i === 0 ? "All" : i === 1 ? "Free" : "Paid"}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 items-center w-full">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Radius</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {[2, 5, 10, 20].map((r) => (
                <Button
                  key={r}
                  size="sm"
                  className={`h-11 px-5 rounded-xl font-medium transition-all duration-200 border ${filters.radius === r ? "bg-[#8b5cf6]/20 text-[#c4a6ff] border-[#8b5cf6]/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "bg-[#111111] border-white/5 text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-300"}`}
                  onClick={() => onChange({ ...filters, radius: r })}
                >
                  {r} km
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 items-center w-full">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Required Amenities</p>
            <Button
              size="sm"
              className={`h-11 px-6 w-fit rounded-xl font-medium transition-all duration-200 border ${filters.hasEVCharging ? "bg-[#3b82f6]/20 text-[#85adff] border-[#3b82f6]/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-[#111111] border-white/5 text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-300"}`}
              onClick={() => onChange({ ...filters, hasEVCharging: !filters.hasEVCharging })}
            >
              ⚡ EV Charging Station
            </Button>
          </div>

          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full mt-4 h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => onChange({ radius: 5, isFree: undefined, hasEVCharging: undefined, type: undefined })}
            >
              Reset to default
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}