import { Skeleton } from '@/components/ui/skeleton';

export function PageLoader() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Title skeleton */}
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-10 w-3/4" />
          <Skeleton className="mx-auto h-5 w-1/2" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
