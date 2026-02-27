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
      'Verified contractor shortlist',
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
    <section id="pricing" className="bg-[#F5F5F7] py-[20px] md:py-[30px] min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-semibold tracking-[0.04em] uppercase text-[#6E6E73] mb-2">Pricing</p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F]">
            One price. No surprises.
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#6E6E73] leading-[1.4] mt-1">
            Traditional designers charge ₹50,000+. We start at ₹999.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1060px] mx-auto items-stretch">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              viewport={{ once: true, amount: 0.2 }}
              className={`relative bg-white rounded-[16px] p-5 md:p-6 flex flex-col ${
                p.popular ? 'md:scale-[1.02] border-2 border-[#E8662E]' : ''
              }`}
              style={{
                boxShadow: p.popular
                  ? '0 4px 20px rgba(232,102,46,0.15)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#E8662E] text-white text-[11px] font-semibold rounded-[980px] whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-[#1D1D1F]">{p.name}</h3>
              <p className="text-xs text-[#6E6E73] mt-0.5">{p.subtitle}</p>

              <div className="mt-4 mb-4 flex items-center">
                <NumberTicker
                  value={p.price}
                  prefix="₹"
                  className="text-[36px] font-bold text-[#1D1D1F] leading-none"
                />
                <span className="text-xs text-[#86868B] ml-1.5">one-time</span>
              </div>

              <ul className="space-y-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#E8662E] mt-0.5 flex-shrink-0" />
                    <span className="text-[13px] text-[#6E6E73] leading-tight">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {p.primary ? (
                  <ShimmerButton
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-2.5 rounded-full text-[15px] bg-[#E8662E] text-white hover:bg-[#D45A1F] transition-all duration-300"
                  >
                    {p.cta}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={() => router.push('/style-quiz')}
                    className="w-full py-2.5 rounded-full text-[15px] border-[1.5px] border-[#E8662E] text-[#E8662E] hover:bg-[#E8662E]/5 transition-all duration-300"
                  >
                    {p.cta}
                  </button>
                )}
                <p className="text-[10px] text-[#86868B] text-center mt-2 leading-tight">
                  100% money-back guarantee if not delivered in 72 hours
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6E6E73] mt-6">
          Designing 8+ rooms? Our{' '}
          <button onClick={() => router.push('/select-package')} className="text-[#E8662E] hover:underline font-medium">
            Premium plan (₹29,999)
          </button>{' '}
          includes a dedicated design coordinator.
        </p>
      </div>
    </section>
  );
}