'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

const ease = [0.25, 0.46, 0.45, 0.94];

const plans = [
  {
    name: 'Single Room Trial',
    subtitle: 'Try before committing',
    price: 499,
    features: [
      '1 room view',
      'Randomly selected style',
      'Budget breakdown',
      'Vendor recommendations',
    ],
    cta: 'Start Trial for ₹499',
    primary: false,
  },
  {
    name: 'Smart Home',
    subtitle: 'Everything you need',
    price: 4999,
    popular: true,
    features: [
      '5-7 3D design views',
      'Choose from 5 styles',
      '1 revision',
      'Complete budget breakdown',
      'Material specifications',
      'Vendor recommendations',
    ],
    cta: 'Get Complete Home for ₹4,999',
    primary: true,
  },
  {
    name: 'Premium Home',
    subtitle: 'Enhanced experience',
    price: 9999,
    features: [
      '7-10 3D design views',
      '12 premium style options',
      '1 revision',
      'Premium materials + alternatives',
      '3 consultation calls',
      'Priority support',
      'Vendor recommendations',
      'Complete budget breakdown',
    ],
    cta: 'Choose Premium for ₹9,999',
    primary: false,
  },
  {
    name: 'Luxury Home',
    subtitle: 'White-glove service',
    price: 14999,
    features: [
      '10-15 3D design views',
      '20+ exclusive styles',
      '3 revisions',
      'Dedicated designer',
      '24/7 priority support',
      'Complete budget breakdown',
      'Vendor recommendations',
    ],
    cta: 'Get Luxury for ₹14,999',
    primary: false,
  },
];

export function DarkPricingSection() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handlePlanClick = (plan) => {
    if (plan.price === 499 || plan.price === 4999 || plan.price === 9999 || plan.price === 14999) {
      setSelectedPackage(plan.price);
      setIsModalOpen(true);
      return;
    }

    router.push('/style-quiz');
  };

  return (
    <>
      <section id="pricing" className="bg-background py-8 md:py-20 md:min-h-screen md:flex md:items-center">
        <div className="max-w-[1400px] mx-auto px-0 md:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.04em] uppercase opacity-40 mb-2" style={{ color: 'var(--color-description)' }}>Pricing</p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.025em] leading-[1.1]" style={{ color: 'var(--color-heading-main)' }}>
            Transparent pricing. <span style={{ color: 'var(--color-heading-main-highlight)' }}>Zero hidden commissions.</span>
          </h2>
          <p className="text-[16px] md:text-[18px] opacity-60 mt-1" style={{ color: 'var(--color-description)' }}>
            Choose the plan that fits your vision.
          </p>
        </motion.div>

        <div 
          className="overflow-x-auto md:overflow-x-visible pt-4 pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory px-0 md:px-0 scroll-pl-[22px]"
          onScroll={(e) => {
            const el = e.currentTarget;
            const track = el.children[0];
            if (!track) return;
            const items = Array.from(track.children);
            const scrollCenter = el.scrollLeft + (el.offsetWidth / 2);
            
            let index = 0;
            items.forEach((item, i) => {
              const itemLeft = item.offsetLeft;
              const itemRight = itemLeft + item.offsetWidth;
              if (scrollCenter >= itemLeft && scrollCenter < itemRight) {
                index = i;
              }
            });

            const dots = document.querySelectorAll('.pricing-dot');
            dots.forEach((dot, i) => {
              dot.style.opacity = i === index ? '1' : '0.2';
              dot.style.width = i === index ? '16px' : '6px';
            });
          }}
        >
          <div className="flex md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-max md:w-full pl-[22px] pr-20 md:px-0">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                className={`relative bg-card rounded-[16px] p-4 md:p-6 flex flex-col min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-start scroll-ml-[22px] ${
                  p.popular ? 'md:scale-[1.02] border-2 border-primary' : 'border border-border/50'
                }`}
                style={{
                  boxShadow: p.popular
                    ? '0 4px 20px rgba(var(--primary),0.15)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[10px] font-semibold rounded-[980px] whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg md:text-xl font-bold" style={{ color: 'var(--color-heading-secondary)' }}>{p.name}</h3>
                <p className="text-[11px] md:text-xs mt-0.5 opacity-60" style={{ color: 'var(--color-description)' }}>{p.subtitle}</p>

                <div className="mt-3 mb-3 md:mt-4 md:mb-4 flex items-center">
                  <NumberTicker
                    value={p.price}
                    prefix="₹"
                    className="text-[28px] md:text-[36px] font-bold leading-none"
                    style={{ color: 'var(--color-heading-main)' }}
                  />
                  <span className="text-[11px] md:text-xs ml-1.5 opacity-40" style={{ color: 'var(--color-description)' }}>one-time</span>
                </div>

                <ul className="space-y-1.5 md:space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-3 md:w-3.5 h-3 md:h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-[12px] md:text-[13px] leading-tight opacity-60" style={{ color: 'var(--color-description)' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 md:mt-5">
                  {p.primary ? (
                    <ShimmerButton
                      onClick={() => handlePlanClick(p)}
                      className="btn-primary w-full h-9 md:h-11 text-xs md:text-sm"
                    >
                      {p.cta}
                    </ShimmerButton>
                  ) : (
                    <button
                      onClick={() => handlePlanClick(p)}
                      className="btn-secondary w-full h-9 md:h-11 text-xs md:text-sm"
                    >
                      {p.cta}
                    </button>
                  )}
                  <p className="text-[9px] md:text-[10px] text-muted-foreground/80 text-center mt-2 leading-tight">
                    100% money-back guarantee if not delivered in 3 days
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator Dots */}
        <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
          {plans.map((_, i) => (
            <div 
              key={i}
              className="pricing-dot h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ 
                width: i === 0 ? '16px' : '6px',
                opacity: i === 0 ? '1' : '0.2'
              }}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 font-medium">
          Designing a complex space?{' '}
          <button onClick={() => router.push('/contact')} className="text-primary hover:underline font-bold">
            Contact us for custom quotes.
          </button>
        </p>
        </div>
      </section>
      <PlanningWizardModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        selectedPackage={selectedPackage} 
      />
    </>
  );
}
