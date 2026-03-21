"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveAvailability } from "@/components/spots/LiveAvailability";
import { ParkingSpot, Review } from "@/types";

type SpotDetail = ParkingSpot & {
  reviews?: Review[];
  availability?: {
    availableSlots: number;
    totalSlots?: number;
    updatedAt: string;
  } | null;
};

export default function SpotDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [spot, setSpot] = useState<SpotDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!params?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/spots/${params.id}`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Failed to load parking spot");
        }

        setSpot(payload.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load parking spot");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [params?.id]);

  const availableSlots = spot?.availability?.availableSlots ?? spot?.availableSlots ?? 0;
  const totalSlots = spot?.availability?.totalSlots ?? spot?.totalSlots ?? 0;

  const avgRating = useMemo(() => {
    const reviews = spot?.reviews ?? [];
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [spot?.reviews]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-4">
        <p className="text-muted-foreground">Loading parking spot details...</p>
      </main>
    );
  }

  if (error || !spot) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-3 p-4">
        <p className="text-sm text-destructive">{error ?? "Spot not found"}</p>
        <Button variant="outline" onClick={() => router.push("/")}>Back to map</Button>
      </main>
    );
  }

  const normalizedType = String(spot.type).replaceAll("_", " ");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
  const isFull = String(spot.status).toUpperCase() === "FULL" || availableSlots <= 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to map
        </Button>

        <Button asChild>
          <a href={directionsUrl} target="_blank" rel="noreferrer">
            Get directions
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="mb-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{spot.name}</h1>
          <Badge variant="outline" className="uppercase">{normalizedType}</Badge>
          <Badge variant={isFull ? "destructive" : "secondary"}>{isFull ? "Full" : "Available"}</Badge>
          {spot.hasEVCharging && <Badge>EV</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{spot.address}</p>
      </div>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{spot.isFree ? "Free" : `Rs. ${spot.pricePerHour ?? 0}/hr`}</p>
          </CardContent>
        </Card>

        <LiveAvailability
          spotId={spot.id}
          initialSlots={availableSlots}
          totalSlots={totalSlots}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <p className="text-2xl font-semibold">{avgRating ? avgRating.toFixed(1) : "N/A"}</p>
            <p className="text-xs text-muted-foreground">({spot.reviews?.length ?? 0} reviews)</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
        <div className="space-y-3">
          {(spot.reviews ?? []).length === 0 && (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">No reviews yet.</CardContent>
            </Card>
          )}

          {(spot.reviews ?? []).map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm">{review.user?.name ?? "Anonymous"}</CardTitle>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    {review.rating.toFixed(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {review.comment?.trim() || "No written comment."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}