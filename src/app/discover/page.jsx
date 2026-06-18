'use client';

import DiscoverGallerySection from '@/components/discover/DiscoverGallerySection';
import { SEOHead } from '@/components/SEOHead';

import { Suspense } from 'react';

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SEOHead
        title="Design Gallery - Discover Interior Design Ideas"
        description="Browse our collection of professional interior designs. Filter by room type, style, and budget to find your perfect design inspiration."
        url="https://houspire.com/discover"
      />
      <DiscoverGallerySection />
    </Suspense>
  );
}

