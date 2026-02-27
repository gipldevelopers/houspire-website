'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Check, Clock, Coins, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.25, 0.46, 0.45, 0.94];

const disadvantages = [
  {
    icon: Clock,
    title: 'Time drain',
    desc: 'Vendor calls, follow-ups, site visits, and endless coordination can drag for weeks.',
  },
  {
    icon: Coins,
    title: 'Budget surprises',
    desc: 'Hidden markups and vague estimates show up late—when changing course is expensive.',
  },
  {
    icon: Wrench,
    title: 'Execution chaos',
    desc: 'Multiple teams, mismatched materials, and unclear responsibilities create daily headaches.',
  },
];

const weHandle = ['Design direction + room plan', 'Itemized budget breakdown', 'Shopping list with links', 'Verified contractor shortlist'];

export function HeadacheReliefSection() {
  const router = useRouter();

  return (
    <section className="bg-[#F5F5F7] py-[40px] md:py-[60px]">
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm border border-black/5">
              <AlertTriangle className="h-4 w-4 text-[#E8662E]" />
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-[#6E6E73]">
                If you don’t use Houspire
              </span>
            </div>

            <h2 className="mt-4 text-[clamp(32px,4.2vw,52px)] font-bold tracking-[-0.025em] leading-[1.08] text-[#1D1D1F]">
              You’ll spend time.
              <br />
              <span className="text-[#6E6E73]">We remove the headache.</span>
            </h2>

            <p className="mt-4 text-[17px] text-[#6E6E73] leading-[1.55] max-w-[56ch]">
              Interior execution becomes stressful when design, budget, shopping, and contractors aren’t connected. We
              give you one clear plan—so you don’t waste your time coordinating everything.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push('/style-quiz')}
                className="h-12 px-7 rounded-full bg-[#E8662E] hover:bg-[#D45A1F] text-white text-[15px] shadow-sm"
              >
                Start with your style quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="h-12 px-7 rounded-full border-black/10 text-[#1D1D1F] hover:bg-black/[0.03] text-[15px]"
              >
                See pricing
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-b from-black/5 via-black/0 to-black/0 blur-2xl" />

            <div className="relative bg-white rounded-[24px] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-8">
              <p className="text-sm font-semibold text-[#1D1D1F]">Common disadvantages</p>
              <div className="mt-5 grid gap-4">
                {disadvantages.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-[#E8662E]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-[#E8662E]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#1D1D1F]">{item.title}</p>
                      <p className="text-sm text-[#6E6E73] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#F5F5F7] border border-black/5 p-4">
                <p className="text-sm font-semibold text-[#1D1D1F]">We handle it end-to-end</p>
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {weHandle.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#E8662E] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#1D1D1F]/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

