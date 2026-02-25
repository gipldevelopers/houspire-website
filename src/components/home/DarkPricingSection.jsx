'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ShimmerButton } from '@/components/ui/shimmer-button';

const ease = [0.25, 0.46, 0.45, 0.94];

const plans = [
  {
    name: 'Starter',
    subtitle: 'Perfect for one room',
    price: 999,
    features: [
      '1 photorealistic room design (multiple angles)',
      'Budget estimate',
      '1 revision round',
      '72-hour delivery',
    ],
    cta: 'Start with One Room →',
    primary: false,
  },
  {
    name: 'Home Design',
    subtitle: 'Complete design for your home',
    price: 6999,
    popular: true,
    features: [
      '5–10 photorealistic room designs',
      'Full Design Intelligence Report (PDF)',
      'Room-by-Room Cost Breakdown',
      'Verified contractor shortlist for your city',
      '2 revision rounds',
      '2 consultation calls',
    ],
    cta: 'Design My Home →',
    primary: true,
  },
  {
    name: 'Complete Home',
    subtitle: 'Everything you need, faster',
    price: 14999,
    features: [
      '10+ photorealistic room designs',
      'Everything in Home Design',
      '5 revision rounds',
      '5 consultation calls',
      'Priority delivery (48 hours)',
      'Dedicated design coordinator',
    ],
    cta: 'Transform My Home →',
    primary: false,
  },
];

export function DarkPricingSection() {
  const router = useRouter();

  return (
    <section id="pricing" className="bg-[#F5F5F7] py-[40px] md:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#6E6E73] mb-3">Pricing</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            One price. No surprises.
          </h2>
          <p className="text-[21px] text-[#6E6E73] leading-[1.38] mt-2">Traditional designers charge ₹50,000+. We start at ₹999.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1060px] mx-auto items-stretch">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`relative bg-white rounded-[20px] p-8 md:p-10 flex flex-col ${
                p.popular ? 'md:scale-[1.03] border-2 border-[#E8662E]' : ''
              }`}
              style={{
                boxShadow: p.popular
                  ? '0 8px 30px rgba(0,113,227,0.12)'
                  : '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#E8662E] text-white text-[13px] font-semibold rounded-[980px]">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-[#1D1D1F]">{p.name}</h3>
              <p className="text-sm text-[#6E6E73] mt-1">{p.subtitle}</p>

              <div className="mt-6 mb-6 flex items-center">
                <NumberTicker
                  value={p.price}
                  prefix="₹"
                  className="text-[48px] font-bold text-[#1D1D1F] leading-none"
                />
                <span className="text-sm text-[#86868B] ml-2">one-time</span>
              </div>

              <ul className="space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#E8662E] mt-0.5 flex-shrink-0" />
                    <span className="text-[15px] text-[#6E6E73] leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {p.primary ? (
                  <ShimmerButton
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-3 rounded-full text-[17px] bg-[#E8662E] text-white hover:bg-[#D45A1F] transition-all duration-300"
                  >
                    {p.cta}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-3 rounded-full text-[17px] border-[1.5px] border-[#E8662E] text-[#E8662E] hover:bg-[#E8662E]/5 transition-all duration-300"
                  >
                    {p.cta}
                  </button>
                )}
                <p className="text-xs text-[#86868B] text-center mt-3">100% money-back guarantee if not delivered in 72 hours</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-[#6E6E73] mt-10">
          Designing 8+ rooms? Our{' '}
          <button onClick={() => router.push('/select-package')} className="text-[#06C] hover:underline">
            Premium plan (₹29,999)
          </button>{' '}
          includes a dedicated design coordinator.
        </p>
      </div>
    </section>
  );
}
