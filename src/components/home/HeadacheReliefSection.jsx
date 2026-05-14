'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, X, ShieldAlert, ArrowRight, Clock, Coins, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeadacheReliefSection() {
  const router = useRouter();

  const painPoints = [
    {
      icon: Clock,
      title: 'Time drain',
      desc: 'Endless calls. Site visits. Weeks wasted.'
    },
    {
      icon: Coins,
      title: 'Budget surprises',
      desc: 'Costs keep changing. You lose control.'
    },
    {
      icon: Wrench,
      title: 'Execution chaos',
      desc: 'Too many people. No clear direction.'
    }
  ];

  return (
    <section className="bg-[#0c0c0e] py-6 md:py-16 overflow-hidden w-full relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-4xl mb-6 md:mb-12">
          <div className="flex items-center gap-2 mb-3 md:mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff8c42] shadow-[0_0_12px_rgba(255,140,66,0.5)]" />
            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#ff8c42]">
              Delivered in 72 hours
            </span>
          </div>
          <h2 className="text-2xl md:text-[clamp(32px,4vw,52px)] font-black tracking-tight leading-[1.1] text-white">
            Most homeowners get this wrong. <br />
            <span className="text-white/30">You don’t have to.</span>
          </h2>
          <p className="mt-3 text-[12px] md:text-xl text-white/70 leading-relaxed font-medium max-w-2xl italic">
            “Design, budget, and execution usually don’t talk to each other. That’s where things go wrong.”
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-14">

          {/* Left: The 3 Core Problems */}
          <div className="lg:col-span-4 space-y-3.5 md:space-y-8">
            {painPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 md:gap-5"
              >
                <div className="h-7 w-7 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#ff8c42]">
                  <point.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-[13px] md:text-lg font-bold text-white mb-0.5">{point.title}</h3>
                  <p className="text-[9px] md:text-sm text-white/50 leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            ))}

            <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className="h-5 w-5 text-[#ff8c42]" />
              </div>
              <p className="text-[#ff8c42] italic font-bold text-[10px] md:text-lg leading-snug relative z-10">
                “If you’ve already started your home and feel stuck this is why.”
              </p>
            </div>
          </div>

          {/* Right: The Comparison Table (Houspire vs Traditional) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="bg-white rounded-[1.5rem] p-3 md:p-8 shadow-2xl relative overflow-hidden max-w-[640px] ml-auto">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary/10 rounded-bl-lg hidden md:block">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Comparison Board</span>
              </div>

              <div className="grid grid-cols-[1fr,1fr] gap-4 mb-2 md:mb-8">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-1">Traditional</span>
                  <div className="h-0.5 w-10 bg-black/10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#ff8c42] mb-1">Houspire</span>
                  <div className="h-0.5 w-10 bg-[#ff8c42]" />
                </div>
              </div>

              <div className="space-y-1 md:space-y-4 relative">
                {/* Row 1 */}
                <div className="grid grid-cols-[1fr,1fr] gap-1.5 md:gap-4 items-center">
                  <div className="flex items-center gap-1 md:gap-2.5 p-1.5 md:p-3 rounded-xl bg-red-50/30">
                    <X className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-red-500 shrink-0" />
                    <p className="text-black/70 font-bold text-[10px] md:text-sm">Endless coordination</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2.5 p-1.5 md:p-3 rounded-xl bg-green-50">
                    <Check className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-green-600 shrink-0" />
                    <p className="text-black font-extrabold text-[10px] md:text-sm">Plan in 72 hours</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[1fr,1fr] gap-1.5 md:gap-4 items-center">
                  <div className="flex items-center gap-1 md:gap-2.5 p-1.5 md:p-3 rounded-xl bg-red-50/30">
                    <X className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-red-500 shrink-0" />
                    <p className="text-black/70 font-bold text-[10px] md:text-sm">Unclear budgets</p>
                  </div>
                  <div className="flex items-center gap-1.5 md:p-3 rounded-xl bg-green-50">
                    <Check className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-green-600 shrink-0" />
                    <p className="text-black font-extrabold text-[10px] md:text-sm">Upfront budgeting</p>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[1fr,1fr] gap-1.5 md:gap-4 items-center">
                  <div className="flex items-center gap-1 md:gap-2.5 p-1.5 md:p-3 rounded-xl bg-red-50/30">
                    <X className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-red-500 shrink-0" />
                    <p className="text-black/70 font-bold text-[10px] md:text-sm">Execution chaos</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2.5 p-1.5 md:p-3 rounded-xl bg-green-50">
                    <Check className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-green-600 shrink-0" />
                    <p className="text-black font-extrabold text-[10px] md:text-sm">Smooth execution</p>
                  </div>
                </div>
              </div>

              <div className="mt-2 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-6 border-t border-black/5 pt-2 md:pt-6">
                <p className="text-[9px] md:text-[10px] text-black/40 font-medium md:max-w-[150px] text-center sm:text-left whitespace-nowrap">
                  One plan. All connections. Zero headaches.
                </p>
                <Button
                  onClick={() => router.push('/pricing')}
                  className="h-8.5 md:h-10 px-6 rounded-full bg-[#ff8c42] hover:bg-[#ff6b1a] text-white font-black text-xs shadow-xl shadow-[#ff8c42]/20"
                >
                  See pricing
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
