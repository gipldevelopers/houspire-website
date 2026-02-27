'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroHighlight } from '@/components/ui/hero-highlight';

const ease = [0.25, 0.46, 0.45, 0.94];

const includedTiles = [
  { icon: ImageIcon, title: 'Photoreal renders', desc: 'See the finished room.' },
  { icon: IndianRupee, title: 'Itemized budget', desc: 'Clear costs.' },
  { icon: ShoppingBag, title: 'Shopping list', desc: 'Direct links.' },
  { icon: Users, title: 'Verified pros', desc: 'Shortlist contractors.' },
];

const previewImages = [
  {
    src: '/styles/japanese-zen/portfolio-4-dining-room.png',
    label: 'Dining / Japandi',
    alt: 'Japandi dining room design preview',
  },
  {
    src: '/styles/japanese-zen/portfolio-6-home-office.png',
    label: 'Office / Minimal',
    alt: 'Minimal home office design preview',
  },
  {
    src: '/styles/traditional-indian/portfolio-8-balcony.png',
    label: 'Balcony / Warm',
    alt: 'Warm balcony design preview',
  },
];

function PreviewTile({ src, alt, label }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="relative aspect-[4/3]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export function HeroSection() {
  const router = useRouter();

  return (
    <HeroHighlight className="bg-background">
      <section className="relative overflow-hidden pt-14 pb-10 md:pt-16 md:pb-14 flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-28 right-[-120px] h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(to right, hsl(var(--foreground) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.06) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Delivered in 72 hours
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
                className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]"
              >
                Interior design,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  without guesswork
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.25 }}
                className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
              >
                Get photorealistic room renders, itemized budgets, shopping lists, and a contractor shortlist.
                Everything you need to execute - without hidden commissions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <Button
                  size="lg"
                  onClick={() => router.push('/style-quiz')}
                  className="h-11 rounded-full px-7 text-base"
                >
                  Take the free style quiz
                  <ArrowRight className="ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/report-preview')}
                  className="h-11 rounded-full px-7 text-base"
                >
                  See a sample report
                </Button>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.45 }}
                className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground"
              >
                <li className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  72-hour delivery
                </li>
                <li className="inline-flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  Flat fee from {'\u20B9'}999
                </li>
                <li className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Verified pros
                </li>
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.5 }}
                className="mt-5 grid grid-cols-2 gap-3 max-w-xl"
              >
                {includedTiles.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-background/70 backdrop-blur p-3"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="mt-2 text-[13px] font-semibold text-foreground leading-snug">{item.title}</div>
                    <div className="mt-1 text-[12px] text-muted-foreground leading-snug">{item.desc}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="relative"
            >
              <div className="card-apple p-3 md:p-4">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="relative aspect-[6/4]">
                    <Image
                      src={previewImages[0].src}
                      alt={previewImages[0].alt}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
                      {previewImages[0].label}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-foreground">
                      4K render
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <PreviewTile src={previewImages[1].src} alt={previewImages[1].alt} label={previewImages[1].label} />
                  <PreviewTile src={previewImages[2].src} alt={previewImages[2].alt} label={previewImages[2].label} />
                </div>
              </div>

              <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
            </motion.div>
          </div>

        </div>
      </section>
    </HeroHighlight>
  );
}
