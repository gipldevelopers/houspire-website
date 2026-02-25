'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SEOHead } from '@/components/SEOHead';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Suspense } from 'react';

function SelectAddonsContent() {
  const searchParams = useSearchParams();
  const packageSlug = searchParams.get('package');
  const styleSlug = searchParams.get('style');
  const reference = searchParams.get('reference');

  const checkoutParams = new URLSearchParams();
  if (packageSlug) checkoutParams.set('package', packageSlug);
  if (styleSlug) checkoutParams.set('style', styleSlug);
  if (reference) checkoutParams.set('reference', reference);

  return (
    <>
      <SEOHead
        title="Add-ons | Houspire"
        description="Add optional extras to your design package."
      />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button asChild variant="ghost" className="mb-8">
            <Link href={`/select-package${packageSlug ? `?package=${packageSlug}` : ''}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Add-ons</h1>
          <p className="text-muted-foreground mb-8">
            Optional extras for your design package. You can skip this step and add them later.
          </p>
          <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground mb-8">
            No add-ons required. Your selected package includes everything you need to get started.
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link href={`/checkout?${checkoutParams.toString()}`}>
              Continue to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default function SelectAddonsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SelectAddonsContent />
    </Suspense>
  );
}
