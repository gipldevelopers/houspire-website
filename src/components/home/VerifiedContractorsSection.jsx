'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, MapPin, ShieldCheck } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94];

const areas = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'];

const highlights = [
  'Curated, city-wise contractor shortlist',
  'Transparent quotes + clear timelines',
  'Matched to your exact design + budget',
];

export function VerifiedContractorsSection() {
  const router = useRouter();

  return (
    <section id="contractors" className="bg-[#F5F5F7] py-[40px] md:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm border border-black/5">
              <ShieldCheck className="h-4 w-4 text-[#E8662E]" />
              <span className="text-xs font-semibold tracking-[0.08em] uppercase text-[#6E6E73]">
                Verified Contractors
              </span>
            </div>

            <h2 className="mt-4 text-[clamp(32px,4.2vw,52px)] font-bold tracking-[-0.025em] leading-[1.08] text-[#1D1D1F]">
              Execution-ready,
              <br />
              <span className="text-[#6E6E73]">in your city.</span>
            </h2>

            <p className="mt-4 text-[17px] text-[#6E6E73] leading-[1.55] max-w-[52ch]">
              Get a verified contractor shortlist aligned to your design, budget, and timeline—so you can move from
              “plan” to “finished home” with confidence.
            </p>

            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[#E8662E] mt-0.5 flex-shrink-0" />
                  <span className="text-[15px] text-[#1D1D1F]/80">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push('/style-quiz')}
                className="h-12 px-7 rounded-full bg-[#E8662E] hover:bg-[#D45A1F] text-white text-[15px] shadow-sm"
              >
                Get contractor shortlist
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/discover')}
                className="h-12 px-7 rounded-full border-black/10 text-[#1D1D1F] hover:bg-black/[0.03] text-[15px]"
              >
                Explore designs
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-b from-black/5 via-black/0 to-black/0 blur-2xl" />
            <div className="relative bg-white rounded-[24px] border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Major areas we serve</p>
                  <p className="text-sm text-[#6E6E73] mt-1">Expanding city-by-city.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[#6E6E73]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">India</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {areas.map((city) => (
                  <Badge
                    key={city}
                    className="rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-black/5 px-3 py-1 text-sm"
                  >
                    {city}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[#F5F5F7] border border-black/5 p-4">
                <p className="text-sm font-semibold text-[#1D1D1F]">How it works</p>
                <p className="text-sm text-[#6E6E73] mt-1 leading-relaxed">
                  After your design report is ready, we share a shortlist of vetted pros and help you compare quotes and
                  timelines.
                </p>
              </div>

              <p className="mt-5 text-xs text-[#6E6E73]">
                Note: availability depends on your locality and project scope.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

