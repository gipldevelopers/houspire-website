'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Sparkles, Home, Shield, Info, Clock, Zap, TrendingUp, Crown, Star } from 'lucide-react';
import { dataGet, getStaticStyleBySlug } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';
import { Suspense } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

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

  const shouldOpenWizard = (pkg) => {
    const slug = pkg?.slug?.toLowerCase();
    return slug === 'smart' || slug === 'premium' || slug === 'luxury';
  };

  const handlePackageAction = (pkg) => {
    if (shouldOpenWizard(pkg)) {
      setIsWizardOpen(true);
      return;
    }

    handleSelectPackage(pkg);
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

      <div className="min-h-screen bg-white font-outfit pt-24 pb-32 relative">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 z-[100] origin-left"
          style={{ backgroundColor: 'var(--color-primary)', scaleX }}
        />
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
            className="text-center mb-16 space-y-6"
          >
            {styleName && (
              <Badge variant="secondary" className="mb-4 border-none px-4 py-1" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}>
                <Sparkles className="h-3 w-3 mr-1" />
                {styleName} Style Selected
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight max-w-4xl mx-auto" style={{ color: 'var(--color-heading-main)' }}>
              Choose Your <span className="relative inline-block">
                Package
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewBox="0 0 100 20"
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-4 md:h-8 pointer-events-none fill-none stroke-[3] stroke-current stroke-round"
                  style={{ color: 'var(--color-primary)' }}
                  preserveAspectRatio="none"
                >
                  <path d="M5 15 Q 50 18 95 15" />
                </motion.svg>
              </span>
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
          {!loading && packages.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg, index) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    selected={selectedPackage?.id === pkg.id}
                    onSelect={handlePackageAction}
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
        </div>

        <div className="container mx-auto px-4 max-w-7xl pt-12">
          <PricingComparisonTable />
        </div>

        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t shadow-2xl p-4 z-50"
          >
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                    <Check className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>
                      {selectedPackage.name} Selected
                    </p>
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                      {selectedPackage.roomCountDisplay || selectedPackage.room_count_display} •{' '}
                      {selectedPackage.revisionsDisplay || selectedPackage.revisions_display || '1 revision'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>Starting at</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-heading-main)' }}>
                      ₹{formatPrice(selectedPackage.price)}
                    </p>
                  </div>
                  <Button size="lg" onClick={handleContinue} className="gap-2 text-white rounded-full px-8 btn-primary">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Back to Top - from About Us */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-8 w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center z-40 transition-colors"
          style={{ backgroundColor: 'var(--color-secondary)', hover: { backgroundColor: 'var(--color-primary)' } }}
        >
          <span className="text-xl">↑</span>
        </motion.button>
        <PlanningWizardModal open={isWizardOpen} onOpenChange={setIsWizardOpen} />
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
  
  const getIcon = () => {
    switch (pkg.slug) {
      case 'trial':
        return <div className="p-2 bg-blue-500 rounded-lg"><Sparkles className="w-5 h-5 text-white" /></div>;
      case 'smart':
        return <div className="p-2 bg-orange-500 rounded-lg"><Zap className="w-5 h-5 text-white" /></div>;
      case 'premium':
        return <div className="p-2 bg-purple-500 rounded-lg"><TrendingUp className="w-5 h-5 text-white" /></div>;
      case 'luxury':
        return <div className="p-2 bg-yellow-500 rounded-lg"><Crown className="w-5 h-5 text-white" /></div>;
      default:
        return <div className="p-2 bg-primary rounded-lg"><Home className="w-5 h-5 text-white" /></div>;
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
        className={`relative cursor-pointer rounded-2xl transition-all h-full flex flex-col ${
          selected
            ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl'
            : isPopular
            ? 'border-2 border-primary/40 shadow-md scale-[1.02]'
            : 'border hover:border-primary/30 hover:shadow-lg'
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1 shadow-lg border-none text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Star className="w-3 h-3 fill-white" /> MOST POPULAR
            </Badge>
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            {getIcon()}
            <h3 className="text-lg font-bold leading-tight" style={{ color: 'var(--color-heading-secondary)' }}>{pkg.name}</h3>
          </div>
          
          <p className="text-xs mb-4 opacity-60" style={{ color: 'var(--color-description)' }}>{pkg.tagline}</p>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground line-through opacity-60">
                ₹{formatPrice(pkg.originalPrice || pkg.price * 2)}
              </span>
              <span className="text-3xl font-black text-foreground">
                ₹{formatPrice(pkg.price)}
              </span>
            </div>
            {pkg.discount && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 text-[10px] items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {pkg.discount}
              </Badge>
            )}
          </div>
          
          <ul className="space-y-3 flex-1 mb-8">
            {(pkg.features || []).map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-snug">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onSelect(pkg);
            }}
            className={`w-full font-bold h-11 transition-all ${
              selected 
                ? 'bg-black text-white hover:bg-black/90' 
                : 'text-white'
            }`}
            style={!selected ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Selected
              </span>
            ) : (
              pkg.buttonText || `Choose ${pkg.name}`
            )}
          </Button>
          
          {(pkg.isTrial || pkg.is_trial) && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-green-600 font-medium">
              <Shield className="w-3 h-3" />
              100% Money-Back Guarantee
            </div>
          )}
        </div>
      </Card>
    </motion.div>
    );
}

function PricingComparisonTable() {
  const sections = [
    {
      title: 'Design Deliverables',
      icon: '🎨',
      rows: [
        { label: '3D Renders', values: ['1 view', '5-7 3D views', '7-10 3D views', '10+ 3D views'], highlightIndex: 1 },
        { label: 'Design Style Options', values: ['Randomly selected', '5 styles', '12 premium styles', '20+ exclusive styles'], highlightIndex: 1 },
        { label: 'Custom Mood Board', values: [false, false, false, true] },
      ]
    },
    {
      title: 'Planning & Budget',
      icon: '📊',
      rows: [
        { label: 'Budget Breakdown', values: [true, true, true, true] },
        { label: 'Material Specifications', values: [true, true, true, true] },
      ]
    },
    {
      title: 'Support & Services',
      icon: '💬',
      rows: [
        { label: 'Design Revisions', values: ['No', '1 revision', '3 revisions', '5 revisions'], highlightIndex: 1 },
        { label: 'Consultation Calls', values: ['1 call', '1 call', '2 calls', '3 calls'], highlightIndex: 1 },
        { label: 'Response Time', values: ['24-72 hours', '12-24 hours', '6-12 hours', '2-4 hours'], highlightIndex: 1 },
      ]
    },
    {
      title: 'Vendor & Execution',
      icon: '🔨',
      rows: [
        { label: 'Vendor Recommendations', values: ['3 vendors', '10-15 vendors', '15-20 vendors', '20+ pre-vetted vendors'], highlightIndex: 1 },
      ]
    },
    {
      title: 'Delivery & Guarantee',
      icon: '⚡',
      rows: [
        { label: 'Delivery Time', values: ['72 hours', '72 hours', '72 hours', '72 hours'], highlightIndex: 1 },
      ]
    }
  ];

  const headers = [
    { name: 'Single Room Trial', price: '₹499' },
    { name: 'Smart Home', price: '₹4,999', highlighted: true },
    { name: 'Premium Home', price: '₹9,999' },
    { name: 'Luxury Home', price: '₹14,999' }
  ];

  return (
    <section className="mt-20 mb-32 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--color-heading-main)' }}>Complete Feature Comparison</h2>
        <p className="text-sm max-w-xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>Compare our plans to find the perfect fit for your vision</p>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="min-w-[900px] bg-white border border-[#eaeaea] rounded-[24px] shadow-sm overflow-hidden mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-[#eaeaea] font-bold text-sm w-[200px]" style={{ color: 'var(--color-heading-secondary)' }}>Feature</th>
                {headers.map((h, i) => (
                  <th 
                    key={i} 
                    className={`p-6 border-b border-[#eaeaea] text-center w-[175px] transition-all duration-300 ${
                      h.highlighted 
                        ? 'text-white' 
                        : 'bg-white text-foreground'
                    }`}
                    style={h.highlighted ? { backgroundColor: 'var(--color-primary)' } : {}}
                  >
                    <div className="text-[13px] font-bold mb-1 opacity-90">{h.name}</div>
                    <div className="text-xl font-black">{h.price}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section, sIdx) => (
                <Suspense key={sIdx} fallback={<tr><td>Loading...</td></tr>}>
                  {/* Section Title */}
                  <tr className="bg-[#faf9f6]">
                    <td 
                      colSpan={1} 
                      className="p-4 pl-6 border-b border-[#eaeaea] font-bold text-[13px] text-foreground flex items-center gap-2"
                    >
                      <span className="text-base grayscale opacity-70 leading-none">{section.icon}</span>
                      {section.title}
                    </td>
                    <td colSpan={4} className="border-b border-[#eaeaea]"></td>
                  </tr>
                  {/* Values */}
                  {section.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="group transition-colors bg-white">
                      <td className="p-4 pl-6 border-b border-[#eaeaea] text-[13px] font-medium text-muted-foreground">{row.label}</td>
                      {row.values.map((val, vIdx) => (
                        <td 
                          key={vIdx} 
                          className={`p-4 border-b border-[#eaeaea] text-center text-[13px] transition-all ${
                            vIdx === 1 ? 'bg-[#f4fcf6]/50' : ''
                          }`}
                        >
                          {typeof val === 'boolean' ? (
                            val ? (
                              <div className="flex justify-center">
                                <div className="w-5 h-5 bg-[#17c964] rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white stroke-[3px]" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground opacity-30">✕</span>
                            )
                          ) : (
                            <span className={`${vIdx === 1 ? 'text-[#17c964] font-bold' : 'text-muted-foreground'}`}>
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


