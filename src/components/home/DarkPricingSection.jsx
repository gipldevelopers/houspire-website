'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShimmerButton } from '@/components/ui/shimmer-button';

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
      '3 revisions',
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
      '5 revisions',
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

  return (
    <section id="pricing" className="bg-muted py-12 md:py-20 min-h-screen flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.04em] uppercase text-muted-foreground mb-2">Pricing</p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.025em] leading-[1.1] text-foreground">
            Transparent pricing. <span className="text-muted-foreground">Zero hidden commissions.</span>
          </h2>
          <p className="text-[16px] md:text-[18px] text-muted-foreground leading-[1.4] mt-1">
            Choose the plan that fits your vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-auto items-stretch">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`relative bg-white rounded-[16px] p-5 md:p-6 flex flex-col ${
                p.popular ? 'md:scale-[1.02] border-2 border-primary' : ''
              }`}
              style={{
                boxShadow: p.popular
                  ? '0 4px 20px rgba(var(--primary),0.15)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[11px] font-semibold rounded-[980px] whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{p.subtitle}</p>

              <div className="mt-4 mb-4 flex items-center">
                <NumberTicker
                  value={p.price}
                  prefix="₹"
                  className="text-[36px] font-bold text-foreground leading-none"
                />
                <span className="text-xs text-muted-foreground/80 ml-1.5">one-time</span>
              </div>

              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-muted-foreground leading-tight">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {p.primary ? (
                  <ShimmerButton
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-2.5 rounded-full text-[15px] bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                  >
                    {p.cta}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-2.5 rounded-full text-[15px] border-[1.5px] border-primary text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    {p.cta}
                  </button>
                )}
                <p className="text-[10px] text-muted-foreground/80 text-center mt-2 leading-tight">
                  100% money-back guarantee if not delivered in 3 days
                </p>
              </div>
            </motion.div>
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
  );
}