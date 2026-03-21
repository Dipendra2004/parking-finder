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
}

export function SpotFilters({ filters, onChange }: SpotFiltersProps) {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-background/90 backdrop-blur">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Filter spots</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Parking type</p>
            <Select
              value={filters.type ?? "all"}
              onValueChange={setType}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="COVERED">Covered</SelectItem>
                <SelectItem value="UNDERGROUND">Underground</SelectItem>
                <SelectItem value="MULTI_STOREY">Multi storey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Price</p>
            <div className="flex gap-2">
              {[undefined, true, false].map((val, i) => (
                <Button
                  key={String(val)}
                  size="sm"
                  variant={filters.isFree === val ? "default" : "outline"}
                  onClick={() => onChange({ ...filters, isFree: val })}
                >
                  {i === 0 ? "All" : i === 1 ? "Free" : "Paid"}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Search radius</p>
            <div className="flex gap-2 flex-wrap">
              {[2, 5, 10, 20].map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={filters.radius === r ? "default" : "outline"}
                  onClick={() => onChange({ ...filters, radius: r })}
                >
                  {r} km
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Amenities</p>
            <Button
              size="sm"
              variant={filters.hasEVCharging ? "default" : "outline"}
              className="w-fit"
              onClick={() => onChange({ ...filters, hasEVCharging: !filters.hasEVCharging })}
            >
              EV Charging
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => onChange({ radius: 5 })}
          >
            Clear all filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}