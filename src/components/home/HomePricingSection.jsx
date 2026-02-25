'use client';

import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const HIGHLIGHTED_SLUGS = ['starter', 'home-design', 'complete-home'];

export function HomePricingSection() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await apiGet('/api/packages');
        if (data) {
          setPackages(data);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  const mainPackages = packages.filter(p => HIGHLIGHTED_SLUGS.includes(p.slug));
  const premiumPkg = packages.find(p => p.slug === 'premium');

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Choose your package.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            One-time payment. No subscriptions. No hidden fees.
          </p>
        </motion.div>

        {/* Free quiz nudge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-muted-foreground mb-10"
        >
          Not sure yet? Take our free{' '}
          <button
            onClick={() => router.push('/style-quiz')}
            className="text-accent hover:underline font-medium"
          >
            Style Quiz
          </button>{' '}
          to discover your design style — no signup required.
        </motion.p>

        {/* 3 Main Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * idx }}
                className="bg-background border border-border/50 rounded-2xl p-8"
              >
                <div className="h-6 bg-muted rounded w-2/3 mb-2 shimmer" />
                <div className="h-4 bg-muted rounded w-1/2 mb-6 shimmer" />
                <div className="h-12 bg-muted rounded w-1/2 mb-6 shimmer" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded w-full shimmer" />
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            mainPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: pkg.is_popular ? 1.03 : 1 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * idx, ease: [0.25, 0.1, 0.25, 1] }}
                className={`relative rounded-2xl border p-8 flex flex-col hover:-translate-y-1 transition-all duration-500 ${
                  pkg.is_popular
                    ? 'border-l-4 border-l-accent border-t-border/50 border-r-border/50 border-b-border/50 shadow-xl shadow-accent/10'
                    : 'border-border/50 hover:border-accent/20 hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                {pkg.is_popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg bg-accent text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    MOST POPULAR
                  </Badge>
                )}

                {/* Package Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pkg.tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="inline-flex items-baseline">
                    <span className="text-xl font-medium text-muted-foreground/70 mr-1">₹</span>
                    <span className="text-5xl font-bold text-foreground tracking-tight">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">one-time · {pkg.room_count_display}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {(pkg.deliverables || []).slice(0, 6).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[15px]">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className={`text-foreground ${i < 2 ? 'font-medium' : ''}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    variant={pkg.is_popular ? 'default' : 'outline'}
                    onClick={() => router.push(`/select-package?package=${pkg.slug}`)}
                    className="w-full group"
                  >
                    {pkg.slug === 'starter' ? 'Start with One Room' :
                     pkg.slug === 'home-design' ? 'Design My Home' :
                     'Transform My Home'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3 text-success" />
                    100% money-back guarantee
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Premium upsell */}
        {premiumPkg && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Designing 8+ rooms? Our{' '}
            <button
              onClick={() => router.push(`/select-package?package=premium`)}
              className="text-accent hover:underline font-medium"
            >
              Premium plan (₹{formatPrice(premiumPkg.price)})
            </button>{' '}
            includes a dedicated design coordinator.
          </motion.p>
        )}

        {/* Comparison */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-4"
        >
          Traditional interior designers charge ₹50,000+ for this scope
        </motion.p>
      </div>
    </section>
  );
}
