'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/SEOHead';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { useEffect, useState } from 'react';
import { dataGet } from '@/lib/frontend-data';
import { 
  Wand2, 
  CreditCard, 
  Home,
  Eye,
  Download,
  ArrowRight,
  Clock,
  Package,
  CheckCircle,
  Image,
  ShoppingBag,
  FileText,
  Sparkles
} from 'lucide-react';

export default function HowItWorks() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { packages: packagesData } = await dataGet('/packages?limit=4');
      setPackages(packagesData || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const steps = [
    {
      icon: CreditCard,
      number: '01',
      title: 'Choose Your Package',
      description: 'Select from our plans starting at ₹499 or full home packages up to ₹14,999. Pay once—no subscriptions or hidden fees.',
      time: '2 minutes',
    },
    {
      icon: Home,
      number: '02',
      title: 'Share Your Space',
      description: 'Upload photos of your room, share dimensions, and tell us your preferences. Let us know what you love and what to avoid.',
      time: '10 minutes',
    },
    {
      icon: Eye,
      number: '03',
      title: 'Review Your Design',
      description: 'Receive photorealistic room designs, a detailed budget breakdown, and a complete shopping list within 72 hours. Share feedback and request changes.',
      time: '72 hours',
    },
    {
      icon: Download,
      number: '04',
      title: 'Download & Execute',
      description: 'Get your complete design package, shop for products using our curated links, and transform your space with our step-by-step guides.',
      time: 'Your pace',
    },
  ];

  const deliverables = [
    {
      icon: Image,
      title: 'Photorealistic Room Designs',
      description: 'Multiple photorealistic views of your redesigned space from different angles'
    },
    {
      icon: ShoppingBag,
      title: 'Shopping List',
      description: 'Curated product links with prices from trusted Indian retailers'
    },
    {
      icon: FileText,
      title: 'Budget Breakdown',
      description: 'Detailed cost analysis by category so you know exactly where your money goes'
    },
    {
      icon: Package,
      title: 'Execution Guide',
      description: 'Step-by-step instructions to bring your design to life'
    },
  ];

  const pageButtonBase =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 whitespace-nowrap';
  const pageButtonPrimary =
    `${pageButtonBase} h-14 px-10 text-lg gap-2 border border-[#ec7446] bg-[#ec7446] text-[#fffaf3] shadow-[0_18px_40px_rgba(236,116,70,0.28)] hover:-translate-y-0.5 hover:bg-[#f08a5d] hover:border-[#f08a5d] hover:shadow-[0_24px_50px_rgba(240,138,93,0.34)]`;
  const pageButtonSecondary =
    `${pageButtonBase} h-14 px-10 text-lg border border-[#1e2a38]/12 bg-[#fffaf3] text-[#2f2924] shadow-[0_16px_34px_rgba(30,42,56,0.08)] hover:-translate-y-0.5 hover:border-[#ec7446]/20 hover:bg-[#f8f1e7] hover:text-[#1e1813]`;
  const pageButtonPrimaryCompact =
    `${pageButtonBase} h-11 px-5 text-sm border border-[#ec7446] bg-[#ec7446] text-[#fffaf3] shadow-[0_14px_28px_rgba(236,116,70,0.22)] hover:-translate-y-0.5 hover:bg-[#f08a5d] hover:border-[#f08a5d]`;
  const pageButtonSecondaryCompact =
    `${pageButtonBase} h-11 px-5 text-sm border border-[#1e2a38]/12 bg-[#fffaf3] text-[#2f2924] shadow-[0_12px_24px_rgba(30,42,56,0.06)] hover:-translate-y-0.5 hover:border-[#ec7446]/20 hover:bg-[#f8f1e7]`;
  const pageButtonDarkPrimary =
    `${pageButtonBase} h-14 px-10 text-lg gap-2 border border-[#fffaf3] bg-[#fffaf3] text-[#1e1813] shadow-[0_20px_45px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:bg-[#f5ede2] hover:border-[#f5ede2]`;
  const pageButtonDarkSecondary =
    `${pageButtonBase} h-14 px-10 text-lg border border-white/10 bg-white/[0.02] text-[#ddd3c7] hover:-translate-y-0.5 hover:bg-white/[0.04] hover:text-[#fffaf3] hover:border-[#f08a5d]/25`;
  const pageTextLink =
    'inline-flex items-center rounded-full border border-[#ec7446]/15 bg-[#fff7f2] px-5 py-2.5 text-sm font-semibold text-[#c8643a] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ec7446]/30 hover:bg-[#fff1e8] hover:text-[#a94e2c]';

  return (
    <>
      <SEOHead 
        title="How It Works | Houspire"
        description="From choosing your package to a dream room in 72 hours. Learn how Houspire delivers professional room designs, budgets, and contractor connections."
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroHighlight className="bg-background">
          <section className="relative overflow-hidden pt-32 pb-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-28 right-[-120px] h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.2]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, hsl(var(--foreground) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.06) 1px, transparent 1px)',
                  backgroundSize: '56px 56px',
                }}
              />
            </div>

            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <Badge
                  className="mb-6 border-[var(--color-border)]"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                    color: 'var(--color-primary)',
                  }}
                >
                  Simple 5-Step Process
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6" style={{ color: 'var(--color-heading-main)' }}>
                  From Package to Dream Room
                  <span className="block" style={{ color: 'var(--color-heading-main-highlight)' }}>in 72 Hours</span>
                </h1>
                <p className="text-xl max-w-2xl mx-auto mb-8 opacity-60" style={{ color: 'var(--color-description)' }}>
                  Professional interior design made simple. Choose your package, share your space,
                  and get stunning designs delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/select-package" className={`${pageButtonPrimary} !h-12 md:!h-14 !px-8 md:!px-10 !text-base md:!text-lg`}>
                    <Sparkles className="h-5 w-5" />
                    Choose Your Package
                  </Link>
                  <Link href="/discover" className={`${pageButtonSecondary} !h-12 md:!h-14 !px-8 md:!px-10 !text-base md:!text-lg`}>
                    View Gallery
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </HeroHighlight>

        {/* Stats Bar (Dark) */}
        <section className="py-8 md:py-12 border-y border-white/10 bg-[#0c0c0e]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-8 text-center">
              <div>
                <p className="text-2xl md:text-4xl font-bold text-white">~15</p>
                <p className="text-xs md:text-sm mt-1 text-white/60">Minutes to Start</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-primary">72</p>
                <p className="text-xs md:text-sm mt-1 text-white/60">Hours to Delivery</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-white">₹499</p>
                <p className="text-xs md:text-sm mt-1 text-white/60">Starting Price</p>
              </div>
              <div>
                <p className="text-2xl md:text-4xl font-bold text-white">100%</p>
                <p className="text-xs md:text-sm mt-1 text-white/60">Money-Back Guarantee</p>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: 'var(--color-heading-main)' }}>
                The Process
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
                Five simple steps from inspiration to transformation
              </p>
            </motion.div>

            {/* Steps Section — Slider on mobile, vertical list on desktop */}
            <div className="relative group/slider">
              <div className="flex gap-4 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar md:block md:max-w-5xl md:mx-auto md:space-y-6 md:pb-0">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative min-w-[75vw] snap-center md:min-w-full"
                  >
                    {/* Connecting line (Desktop Only) */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-border to-transparent hidden md:block" />
                    )}

                    <Card className="p-6 border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg shadow-none h-full">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Icon & Number */}
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-heading-main-highlight)] flex items-center justify-center shadow-lg">
                            <step.icon className="h-7 w-7 text-white" />
                          </div>
                          <div
                            className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center"
                            style={{
                              backgroundColor: 'var(--color-bg)',
                              color: 'var(--color-primary)',
                              border: '1.5px solid var(--color-border)',
                            }}
                          >
                            {step.number}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <h3 className="text-xl font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>
                              {step.title}
                            </h3>
                          </div>
                          <p className="text-sm md:text-base opacity-60" style={{ color: 'var(--color-description)' }}>
                            {step.description}
                          </p>
                        </div>

                        {/* Arrow (Desktop Only) */}
                        {index < steps.length - 1 && (
                          <div className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Scroll Progress Bar (Mobile Only) */}
              <div className="mt-4 px-6 md:hidden">
                <div className="h-0.5 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/4" />
                </div>
                <p className="mt-2 text-[10px] text-center uppercase tracking-widest opacity-40" style={{ color: 'var(--color-description)' }}>Swipe to see more</p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
               <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: 'var(--color-heading-main)' }}>
                What You'll Receive
              </h2>
              <p className="text-lg max-w-2xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
                Everything you need to transform your space, delivered digitally
              </p>
            </motion.div>

            {/* Deliverables Grid — Slider on mobile, grid on desktop */}
            <div className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:pb-0 max-w-7xl mx-auto">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[75vw] snap-center md:min-w-0"
                >
                  <Card className="p-8 h-full text-center border-2 border-border/50 hover:border-accent/30 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                      <item.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-base text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Scroll Progress Bar (Mobile Only) */}
            <div className="mt-4 px-6 md:hidden">
              <div className="h-0.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/4" />
              </div>
              <p className="mt-2 text-[10px] text-center uppercase tracking-widest opacity-40" style={{ color: 'var(--color-description)' }}>Swipe to see more</p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: 'var(--color-heading-main)' }}>
                  72-Hour Delivery Guarantee
                </h2>
                <p className="text-lg opacity-60" style={{ color: 'var(--color-description)' }}>
                  Here's exactly what happens after you submit your project
                </p>
              </div>

              <Card className="p-8 border-2 border-accent/30 bg-accent/5">
                <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-3 md:pb-0">
                  <div className="text-center min-w-[75vw] snap-center md:min-w-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                      <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>0-24h</span>
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--color-heading-secondary)' }}>Designer Assignment</h4>
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                      Your project is matched with the perfect designer based on your style preferences
                    </p>
                  </div>
                  <div className="text-center min-w-[75vw] snap-center md:min-w-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                      <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>24-48h</span>
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--color-heading-secondary)' }}>Design Creation</h4>
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                      Your designer creates concepts, sources products, and prepares photorealistic room designs
                    </p>
                  </div>
                  <div className="text-center min-w-[75vw] snap-center md:min-w-0">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                      <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>48-72h</span>
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--color-heading-secondary)' }}>Quality Review</h4>
                    <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                      Final review, packaging, and delivery of your complete design package
                    </p>
                  </div>
                </div>

                {/* Scroll Progress Bar (Mobile Only) */}
                <div className="mt-6 px-6 md:hidden">
                  <div className="h-0.5 w-full bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/3" />
                  </div>
                  <p className="mt-2 text-[10px] text-center uppercase tracking-widest opacity-40" style={{ color: 'var(--color-description)' }}>Swipe to see more</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-10 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4" style={{ color: 'var(--color-heading-main)' }}>
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg opacity-60" style={{ color: 'var(--color-description)' }}>
                Professional interior design starting at ₹499. No hidden fees, no subscriptions.
              </p>
            </motion.div>

            {/* Package Grid — 2x2 on mobile, 2/4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <Card key={idx} className="p-4 md:p-6 animate-pulse">
                    <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                    <div className="h-8 bg-muted rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-3 bg-muted rounded w-full" />
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className={`relative p-4 md:p-6 h-full flex flex-col border-2 transition-all duration-300 hover:shadow-lg cursor-pointer shadow-none ${
                        pkg.isPopular ? 'border-primary' : 'border-border/50 hover:border-primary/30'
                      }`}
                      onClick={() => router.push(`/select-package?package=${pkg.slug}`)}
                    >
                      {/* Badge */}
                      {(pkg.isPopular || pkg.badgeText) && (
                        <Badge 
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] md:text-xs px-2 py-0.5 whitespace-nowrap ${
                            pkg.isPopular 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-foreground text-background'
                          }`}
                        >
                          {pkg.isPopular ? 'MOST POPULAR' : pkg.badgeText}
                        </Badge>
                      )}

                      <h3 className="text-sm md:text-base font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>{pkg.name}</h3>
                      <p className="text-[10px] md:text-sm mb-2 md:mb-3 opacity-60" style={{ color: 'var(--color-description)' }}>{pkg.tagline}</p>

                      <div className="mb-2 md:mb-3">
                        <span className="text-xl md:text-3xl font-bold" style={{ color: 'var(--color-heading-main)' }}>₹{formatPrice(pkg.price)}</span>
                        <p className="text-[10px] md:text-sm opacity-60" style={{ color: 'var(--color-description)' }}>{pkg.roomCountDisplay}</p>
                      </div>

                      <ul className="space-y-1 md:space-y-1.5 flex-1 mb-3 md:mb-4">
                        <li className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm">
                          <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                          <span className="opacity-60" style={{ color: 'var(--color-description)' }}>
                            {pkg.revisionsDisplay || `${pkg.revisionsIncluded} revision${pkg.revisionsIncluded > 1 ? 's' : ''}`}
                          </span>
                        </li>
                        <li className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm">
                          <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                          <span className="opacity-60" style={{ color: 'var(--color-description)' }}>72-hour delivery</span>
                        </li>
                        <li className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm">
                          <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                          <span className="opacity-60" style={{ color: 'var(--color-description)' }}>{pkg.supportDays}-day support</span>
                        </li>
                      </ul>

                      <button
                        type="button"
                        className={`w-full !h-9 md:!h-11 !px-3 !text-xs md:!text-sm ${pkg.isPopular ? pageButtonPrimaryCompact : pageButtonSecondaryCompact}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/select-package?package=${pkg.slug}`);
                        }}
                      >
                        {pkg.isTrial ? 'Try Now' : 'Select'}
                      </button>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Link href="/select-package" className={pageTextLink}>
                View all packages & add-ons →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0f0e0d] py-10 md:py-16 overflow-hidden min-h-[auto]">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative text-center max-w-4xl mx-auto rounded-[1.5rem] md:rounded-[2rem] border border-white/[0.08] bg-[radial-gradient(circle_at_top,_rgba(236,116,70,0.14),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(255,255,255,0.01))] px-5 py-8 md:px-12 md:py-14 shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
            >
              <div className="mb-4 md:mb-5 inline-flex items-center gap-3 rounded-full border border-[#f08a5d]/20 bg-[#f08a5d]/[0.08] px-3 py-1.5 md:px-4 md:py-2 text-[0.6rem] md:text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#f08a5d]">
                <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[#f08a5d]" />
                Delivered in 72 hours
              </div>
              <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3 md:mb-4 text-[#fffaf3]">
                Ready to Transform Your Space?
              </h2>
              <p className="text-base md:text-lg mb-6 md:mb-8 text-[#c6beb4]">
                Choose your perfect package and get professional designs in 72 hours
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Link href="/select-package" className={`${pageButtonDarkPrimary} !h-12 md:!h-14 !px-8 md:!px-10 !text-base md:!text-lg`}>
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                  Select Your Package
                </Link>
                <Link
                  href="/faq"
                  className={`${pageButtonDarkSecondary} !h-12 md:!h-14 !px-8 md:!px-10 !text-base md:!text-lg`}
                >
                  Have Questions? View FAQ
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
