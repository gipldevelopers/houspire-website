'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Crown,
  Home,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dataGet, getStaticStyleBySlug } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

const comparisonSections = [
  {
    title: 'Design Deliverables',
    rows: [
      { label: '3D Renders', values: ['1 view', '5-7 3D views', '7-10 3D views', '10+ 3D views'] },
      { label: 'Design Style Options', values: ['Random selection', '5 styles', '12 premium styles', '20+ exclusive styles'] },
      { label: 'Custom Mood Board', values: [false, false, false, true] },
    ],
  },
  {
    title: 'Planning and Budget',
    rows: [
      { label: 'Budget Breakdown', values: [true, true, true, true] },
      { label: 'Material Specifications', values: [true, true, true, true] },
    ],
  },
  {
    title: 'Support and Services',
    rows: [
      { label: 'Design Revisions', values: ['No', '1 revision', '3 revisions', '5 revisions'] },
      { label: 'Consultation Calls', values: ['1 call', '1 call', '2 calls', '3 calls'] },
      { label: 'Response Time', values: ['24-72 hours', '12-24 hours', '6-12 hours', '2-4 hours'] },
    ],
  },
  {
    title: 'Vendor and Execution',
    rows: [
      { label: 'Vendor Recommendations', values: ['3 vendors', '10-15 vendors', '15-20 vendors', '20+ pre-vetted vendors'] },
    ],
  },
  {
    title: 'Delivery and Guarantee',
    rows: [
      { label: 'Delivery Time', values: ['72 hours', '72 hours', '72 hours', '72 hours'] },
    ],
  },
];

const comparisonHeaders = [
  { name: 'Single Room Trial', price: '₹499' },
  { name: 'Smart Home', price: '₹4,999', highlighted: true },
  { name: 'Premium Home', price: '₹9,999' },
  { name: 'Luxury Home', price: '₹14,999' },
];

function SelectPackageContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(null);

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
      const pkg = packages.find((p) => p.slug === packageSlug);
      if (pkg) setSelectedPackage(pkg);
    }
  }, [packageSlug, packages, selectedPackage]);

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

  const shouldOpenWizard = (pkg) => {
    const slug = pkg?.slug?.toLowerCase();
    return slug === 'trial' || slug === 'smart' || slug === 'premium' || slug === 'luxury';
  };

  const handlePackageAction = (pkg) => {
    if (shouldOpenWizard(pkg)) {
      setSelectedPackagePrice(pkg.price);
      setIsWizardOpen(true);
      return;
    }

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

  const primaryButtonClass =
    'inline-flex items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-8 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(236,116,70,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f08a5d] hover:border-[#f08a5d]';
  const secondaryButtonClass =
    'inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white/75 px-8 text-sm font-semibold text-[var(--color-heading-secondary)] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/20 hover:bg-[#fff7f2]';

  return (
    <>
      <SEOHead
        title="Choose Your Package | Houspire"
        description="Select the perfect design package for your home. From single room trials to complete home makeovers."
      />

      <div className="relative min-h-screen overflow-hidden bg-[var(--color-primary-1)] pt-24 pb-2">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
          <div className="absolute right-[-10rem] top-[24rem] h-96 w-96 rounded-full bg-[var(--color-secondary-2)]/12 blur-3xl" />
        </div>

        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-1.5 origin-left bg-[var(--color-primary)]"
          style={{ scaleX }}
        />

        <div className="container relative mx-auto max-w-7xl px-4">
          {/* <Link href="/how-it-works" className={`${secondaryButtonClass} mb-6 h-11 gap-2 px-5`}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 space-y-6 text-center"
          >
            {styleName && (
              <Badge
                variant="secondary"
                className="mb-4 border border-[var(--color-border)] bg-white/75 px-4 py-1 shadow-sm"
                style={{ color: 'var(--color-primary)' }}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {styleName} Style Selected
              </Badge>
            )}

            <h1
              className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
              style={{ color: 'var(--color-heading-main)' }}
            >
              Choose your <span style={{ color: 'var(--color-heading-main-highlight)' }}>package</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg opacity-80" style={{ color: 'var(--color-description)' }}>
              Select the package that matches your room count and design needs.
              Every option is built around the same Houspire promise: visual
              clarity, transparent budgeting, and fast delivery.
            </p>
          </motion.div>

          {loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse rounded-[1.5rem] border border-[var(--color-border)] bg-white/80 p-6 shadow-sm">
                  <div className="mb-4 h-6 w-3/4 rounded bg-muted" />
                  <div className="mb-3 h-4 w-1/2 rounded bg-muted" />
                  <div className="mb-6 h-10 w-1/3 rounded bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 rounded bg-muted" />
                    <div className="h-3 rounded bg-muted" />
                    <div className="h-3 rounded bg-muted" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && packages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {packages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    selected={selectedPackage?.id === pkg.id}
                    onSelect={handlePackageAction}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {!loading && packages.length === 0 && (
            <div className="py-12 text-center">
              <p style={{ color: 'var(--color-description)' }}>
                No packages available at the moment. Please try again later.
              </p>
              <Link href="/how-it-works" className={`${primaryButtonClass} mt-4 h-11 px-6`}>
                Back to How it works
              </Link>
            </div>
          )}
        </div>

        <div className="container mx-auto max-w-7xl px-4 pt-12">
          <PricingComparisonTable />
        </div>

        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-primary-1)_90%,white)]/95 p-4 shadow-2xl backdrop-blur-md"
          >
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                    <Check className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>
                      {selectedPackage.name} Selected
                    </p>
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                      {(selectedPackage.roomCountDisplay || selectedPackage.room_count_display) + ' • ' + (selectedPackage.revisionsDisplay || selectedPackage.revisions_display || '1 revision')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>Starting at</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-heading-main)' }}>
                      {'₹' + formatPrice(selectedPackage.price)}
                    </p>
                  </div>
                  <Button size="lg" onClick={handleContinue} className={`h-12 gap-2 ${primaryButtonClass}`}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-1)] shadow-[0_20px_40px_rgba(236,116,70,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f08a5d]"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>

        <PlanningWizardModal 
          open={isWizardOpen} 
          onOpenChange={setIsWizardOpen} 
          selectedPackage={selectedPackagePrice} 
        />
      </div>
    </>
  );
}

export default function SelectPackagePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-primary-1)] pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--color-primary)]"></div>
        </div>
      }
    >
      <SelectPackageContent />
    </Suspense>
  );
}

function PackageCard({ pkg, index, selected, onSelect }) {
  const isPopular = pkg.isPopular ?? pkg.is_popular;

  const getIcon = () => {
    switch (pkg.slug) {
      case 'trial':
        return (
          <div className="rounded-2xl bg-[var(--color-primary)]/12 p-2.5">
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
        );
      case 'smart':
        return (
          <div className="rounded-2xl bg-[var(--color-secondary-2)]/18 p-2.5">
            <Zap className="h-5 w-5 text-[var(--color-secondary-3)]" />
          </div>
        );
      case 'premium':
        return (
          <div className="rounded-2xl bg-[var(--color-secondary-4)]/12 p-2.5">
            <TrendingUp className="h-5 w-5 text-[var(--color-secondary-4)]" />
          </div>
        );
      case 'luxury':
        return (
          <div className="rounded-2xl bg-[var(--color-tertiary-1)]/18 p-2.5">
            <Crown className="h-5 w-5 text-[#9a6a12]" />
          </div>
        );
      default:
        return (
          <div className="rounded-2xl bg-[var(--color-primary)]/12 p-2.5">
            <Home className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <Card
        onClick={() => onSelect(pkg)}
        className={`relative flex h-full cursor-pointer flex-col rounded-[1.75rem] border bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 ${
          selected
            ? 'border-[var(--color-primary)] shadow-[0_24px_60px_rgba(236,116,70,0.16)] ring-4 ring-[var(--color-primary)]/10'
            : isPopular
            ? 'scale-[1.02] border-[var(--color-primary)]/35 shadow-lg'
            : 'border-[var(--color-border)] hover:-translate-y-1 hover:border-[var(--color-primary)]/25 hover:shadow-lg'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
            <Badge className="flex items-center gap-1 rounded-full border-none px-3 py-1 text-[10px] font-bold text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Star className="h-3 w-3 fill-white" />
              MOST POPULAR
            </Badge>
          </div>
        )}

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-heading-secondary)' }}>
              {pkg.name}
            </h3>
          </div>

          <p className="mb-4 text-xs opacity-60" style={{ color: 'var(--color-description)' }}>
            {pkg.tagline}
          </p>

          <div className="mb-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs line-through opacity-60" style={{ color: 'var(--color-description)' }}>
                {'₹' + formatPrice(pkg.originalPrice || pkg.price * 2)}
              </span>
              <span className="text-3xl font-bold" style={{ color: 'var(--color-heading-main)' }}>
                {'₹' + formatPrice(pkg.price)}
              </span>
            </div>
            {pkg.discount && (
              <Badge variant="secondary" className="items-center gap-1 border-none bg-[var(--color-tertiary-2)]/20 px-2 py-0 text-[10px] text-[var(--color-secondary-3)] hover:bg-[var(--color-tertiary-2)]/20">
                <TrendingUp className="h-3 w-3 text-[var(--color-secondary-3)]" />
                {pkg.discount}
              </Badge>
            )}
          </div>

          <ul className="mb-8 flex-1 space-y-3">
            {(pkg.features || []).map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-xs leading-snug" style={{ color: 'var(--color-description)' }}>
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-secondary-3)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={(event) => {
              event.stopPropagation();
              onSelect(pkg);
            }}
            className={`h-11 w-full rounded-full text-sm font-semibold transition-all ${
              selected
                ? 'border border-[var(--color-primary-2)] bg-[var(--color-primary-2)] text-white hover:bg-[var(--color-primary-2)]/92'
                : 'border border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:bg-[#f08a5d] hover:border-[#f08a5d]'
            }`}
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Selected
              </span>
            ) : (
              pkg.buttonText || `Choose ${pkg.name}`
            )}
          </Button>

          {(pkg.isTrial || pkg.is_trial) && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-[var(--color-secondary-3)]">
              <Shield className="h-3 w-3" />
              100% Money-Back Guarantee
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function PricingComparisonTable() {
  return (
    <section className="relative mt-20 mb-32">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--color-heading-main)' }}>
          Complete Feature Comparison
        </h2>
        <p className="mx-auto max-w-xl text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
          Compare our plans to find the right fit for your vision.
        </p>
      </div>

      <div className="overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="mb-12 min-w-[900px] overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white/82 shadow-sm backdrop-blur-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[200px] border-b border-[var(--color-border)] p-6 text-sm font-bold" style={{ color: 'var(--color-heading-secondary)' }}>
                  Feature
                </th>
                {comparisonHeaders.map((header) => (
                  <th
                    key={header.name}
                    className={`w-[175px] border-b border-[var(--color-border)] p-6 text-center transition-all duration-300 ${
                      header.highlighted ? 'text-white' : 'bg-white/80'
                    }`}
                    style={header.highlighted ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-heading-secondary)' }}
                  >
                    <div className="mb-1 text-[13px] font-bold opacity-90">{header.name}</div>
                    <div className="text-xl font-bold">{header.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonSections.map((section) => (
                <Suspense key={section.title} fallback={<tr><td>Loading...</td></tr>}>
                  <tr className="bg-[color-mix(in_srgb,var(--color-secondary-1)_38%,white)]">
                    <td
                      colSpan={1}
                      className="border-b border-[var(--color-border)] p-4 pl-6 text-[13px] font-bold"
                      style={{ color: 'var(--color-heading-secondary)' }}
                    >
                      {section.title}
                    </td>
                    <td colSpan={4} className="border-b border-[var(--color-border)]"></td>
                  </tr>

                  {section.rows.map((row) => (
                    <tr key={row.label} className="group bg-white/80 transition-colors">
                      <td className="border-b border-[var(--color-border)] p-4 pl-6 text-[13px] font-medium" style={{ color: 'var(--color-description)' }}>
                        {row.label}
                      </td>
                      {row.values.map((val, index) => (
                        <td
                          key={`${row.label}-${index}`}
                          className={`border-b border-[var(--color-border)] p-4 text-center text-[13px] ${
                            index === 1 ? 'bg-[var(--color-tertiary-2)]/10' : ''
                          }`}
                        >
                          {typeof val === 'boolean' ? (
                            val ? (
                              <div className="flex justify-center">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-secondary-3)]">
                                  <Check className="h-3 w-3 text-white stroke-[3px]" />
                                </div>
                              </div>
                            ) : (
                              <span className="opacity-30" style={{ color: 'var(--color-description)' }}>×</span>
                            )
                          ) : (
                            <span
                              className={index === 1 ? 'font-bold text-[var(--color-secondary-3)]' : ''}
                              style={index === 1 ? undefined : { color: 'var(--color-description)' }}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Suspense>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
