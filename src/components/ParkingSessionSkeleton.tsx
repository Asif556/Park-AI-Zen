import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
export function ParkingSessionSkeleton() {
  return (
    <Card className="p-6 space-y-4 relative overflow-hidden">
      {}
      <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {}
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            {}
            <Skeleton className="h-6 w-32" />
            {}
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        {}
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      {}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </Card>
  );
}
export function SlotAvailabilitySkeleton() {
  return (
    <Card className="p-6 relative overflow-hidden">
      {}
      <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-16 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-16 mx-auto" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-16 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    </Card>
  );
}
export function PricingInfoSkeleton() {
  return (
    <Card className="p-6 relative overflow-hidden">
      {}
      <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </Card>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </Card>
      </div>
      <Skeleton className="h-4 w-full mt-4" />
    </Card>
  );
}
export function ParkingSessionListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ParkingSessionSkeleton key={index} />
      ))}
    </div>
  );
}
export function SlotGridSkeleton({ slots = 50 }: { slots?: number }) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
      {Array.from({ length: slots }).map((_, index) => (
        <div key={index} className="relative aspect-square">
          <Skeleton className="h-full w-full rounded-xl" />
          <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
        </div>
      ))}
    </div>
  );
}
export function AdminTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {}
      <div className="grid grid-cols-8 gap-4 pb-3 border-b">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
      {}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-8 gap-4 py-3 border-b border-border/50">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
      {}
      <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
export function AIInsightsSkeleton() {
  return (
    <Card className="p-6 h-full relative overflow-hidden">
      {}
      <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
export function SlotMapHeaderSkeleton() {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer-loading bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
