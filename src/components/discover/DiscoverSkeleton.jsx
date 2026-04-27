import { Skeleton } from '@/components/ui/skeleton'
import { Container } from '@/components/layout/Container'

export function DiscoverSkeleton({ gridSize = 'default', count = 12 }) {
  // Predefined heights to avoid layout shifts and look like Pinterest
  const skeletonHeights = [
    'h-[250px]', 'h-[350px]', 'h-[280px]', 'h-[400px]',
    'h-[320px]', 'h-[260px]', 'h-[380px]', 'h-[300px]',
    'h-[340px]', 'h-[270px]', 'h-[310px]', 'h-[360px]'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <div className="pt-20 pb-8">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Skeleton className="h-7 w-40 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 w-80 mx-auto mb-5 rounded-xl" />
            <Skeleton className="h-5 w-96 mx-auto rounded-lg" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="mt-8 max-w-[760px] mx-auto">
            <Skeleton className="h-12 w-full rounded-full" />
            <div className="flex items-center justify-center gap-2 mt-6">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </Container>
      </div>

      {/* Masonry Grid Skeleton */}
      <Container className="py-6 pb-20">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {Array.from({ length: count }).map((_, index) => {
            const heightClass = skeletonHeights[index % skeletonHeights.length]
            return (
              <div
                key={index}
                className="break-inside-avoid"
              >
                <div
                  className="overflow-hidden rounded-2xl border bg-card p-0 shadow-sm"
                  style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-border))' }}
                >
                   <Skeleton className={`w-full ${heightClass} rounded-2xl mb-3`} />
                   <div className="p-3">
                     <Skeleton className="h-4 w-3/4 mb-2" />
                     <Skeleton className="h-3 w-1/2" />
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
