'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Sparkles, Home, Shield, Info, Clock } from 'lucide-react';
import { dataGet, getStaticStyleBySlug } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';
import { Suspense } from 'react';

function SelectPackageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const packageSlug = searchParams.get('package');
  const styleSlug = searchParams.get('style');
  const referenceDesignId = searchParams.get('reference');

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [styleName, setStyleName] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (styleSlug && styleSlug !== styleName) {
      const style = getStaticStyleBySlug(styleSlug);
      if (style) {
        setStyleName(style.name || '');
      }
    }
  }, [styleSlug, styleName]);

  useEffect(() => {
    if (packageSlug && packages.length > 0 && !selectedPackage) {
      const pkg = packages.find((p) => (p.slug || p.slug) === packageSlug);
      if (pkg) setSelectedPackage(pkg);
    }
  }, [packageSlug, packages]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { packages: data } = await dataGet('/packages?limit=10');
      setPackages(data || []);
      if (packageSlug && (data || []).length > 0) {
        const pkg = (data || []).find((p) => p.slug === packageSlug);
        if (pkg) setSelectedPackage(pkg);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      toast({
        title: 'Error loading packages',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      toast({
        title: 'Please select a package',
        description: 'Choose a package to continue',
        variant: 'destructive',
      });
      return;
    }
    const params = new URLSearchParams();
    params.set('package', selectedPackage.slug);
    if (styleSlug) params.set('style', styleSlug);
    if (referenceDesignId) params.set('reference', referenceDesignId);
    router.push(`/select-addons?${params.toString()}`);
  };

  const trialPackages = packages.filter((p) => p.isTrial === true || p.is_trial === true);
  const fullHomePackages = packages.filter((p) => !p.isTrial && !p.is_trial);

  return (
    <>
      <SEOHead
        title="Choose Your Package | Houspire"
        description="Select the perfect design package for your home. From single room trials to complete home makeovers."
      />

      <div className="min-h-screen bg-background pt-24 pb-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/how-it-works">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {styleName && (
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                {styleName} Style Selected
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Package
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the package that matches your room count and design needs.
              All packages include photorealistic room designs.
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-10 bg-muted rounded w-1/3 mb-6" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && trialPackages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Trial Plans</h2>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  100% Money-Back
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                {trialPackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    selected={selectedPackage?.id === pkg.id}
                    onSelect={handleSelectPackage}
                  />
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20 max-w-3xl">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">100% Money-Back Guarantee:</strong>{' '}
                    Try our service risk-free. Get full credit back when you upgrade
                    to a full home package within 7 days.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {!loading && fullHomePackages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Home className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Full Home Packages</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {fullHomePackages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    selected={selectedPackage?.id === pkg.id}
                    onSelect={handleSelectPackage}
                    vertical
                  />
                ))}
              </div>
            </motion.section>
          )}

          {!loading && packages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No packages available at the moment. Please try again later.</p>
              <Button asChild className="mt-4">
                <Link href="/how-it-works">Back to How it works</Link>
              </Button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 py-8 border-t border-b my-12"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>72-Hour Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>100% Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secured by Razorpay</span>
            </div>
          </motion.div>

          <p className="text-center text-sm text-muted-foreground -mt-6 mb-12">
            Traditional interior designers charge ₹50,000+ for this scope
          </p>
        </div>

        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-2xl p-4 z-50"
          >
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedPackage.name} Selected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackage.roomCountDisplay || selectedPackage.room_count_display} •{' '}
                      {selectedPackage.revisionsDisplay || selectedPackage.revisions_display || '1 revision'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{formatPrice(selectedPackage.price)}
                    </p>
                  </div>
                  <Button size="lg" onClick={handleContinue} className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default function SelectPackagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SelectPackageContent />
    </Suspense>
  );
}

function PackageCard({ pkg, index, selected, onSelect, vertical = false }) {
  const isPopular = pkg.isPopular ?? pkg.is_popular;
  const badgeText = pkg.badgeText ?? pkg.badge_text;
  const roomDisplay = pkg.roomCountDisplay ?? pkg.room_count_display;
  const revisionsDisplay = pkg.revisionsDisplay ?? pkg.revisions_display ?? '1 revision';
  const supportDays = pkg.supportDays ?? pkg.support_days ?? 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <Card
        onClick={() => onSelect(pkg)}
        className={`relative cursor-pointer rounded-2xl transition-all h-full ${
          selected
            ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl'
            : isPopular
            ? 'border-2 border-primary/30 hover:border-primary/50 hover:shadow-lg'
            : 'border hover:border-primary/30 hover:shadow-lg'
        }`}
      >
        {(isPopular || badgeText) && (
          <Badge
            className={`absolute top-0 right-0 rounded-tl-none rounded-br-lg ${
              isPopular ? 'bg-primary' : 'bg-foreground text-background'
            }`}
          >
            {badgeText || 'MOST POPULAR'}
          </Badge>
        )}
        <div className="p-6 relative">
          <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{pkg.tagline}</p>
          <div className="mb-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{formatPrice(pkg.price)}
            </span>
            <p className="text-sm text-muted-foreground">{roomDisplay}</p>
          </div>
          <ul className="space-y-1.5 flex-1 mb-4">
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{revisionsDisplay}</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">72-hour delivery</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{supportDays}-day support</span>
            </li>
          </ul>
          <Button variant={selected ? 'default' : 'outline'} className="w-full">
            {selected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              'Select Package'
            )}
          </Button>
          {(pkg.isTrial || pkg.is_trial) && (
            <p className="text-xs text-center text-green-600 mt-3">
              ✓ 100% Money-Back Guarantee
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}


