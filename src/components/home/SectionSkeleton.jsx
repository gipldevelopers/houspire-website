'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-6 py-32">
        <div className="text-center">
          <Skeleton className="h-6 w-40 mx-auto mb-6" />
          <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-16 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
          <Skeleton className="aspect-[16/10] max-w-5xl mx-auto mt-20 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-4 left-4 right-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function DesignerCardSkeleton() {
  return (
    <div className="p-6 border rounded-2xl bg-card">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <Skeleton className="h-14 w-14 rounded-2xl mb-3" />
      <Skeleton className="h-5 w-24 mb-1" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function GalleryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function DesignerCarouselSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden">
      <DesignerCardSkeleton />
      <DesignerCardSkeleton />
      <DesignerCardSkeleton />
      <DesignerCardSkeleton />
    </div>
  );
}
