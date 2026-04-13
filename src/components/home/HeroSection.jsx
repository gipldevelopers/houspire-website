'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { redirectToHouspireHome } from '@/lib/external-links';

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
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-24 flex items-center">
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

        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.1 }}
                className="flex items-center gap-2 mb-6"
              >
                <span className="h-2 w-2 rounded-full bg-[#ff8c42] shadow-[0_0_12px_rgba(255,140,66,0.5)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff8c42]">
                  Delivered in 72 hours
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.35]"
              >
                Design your home in <br className="hidden lg:block" />
                <span className="text-orange-600">3 days</span>{' '}
                not 3 months.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.25 }}
                className="mt-8 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-muted-foreground/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-lg md:text-xl text-foreground font-normal">
                    See your exact home before you commit a single rupee <span className="text-muted-foreground">before work begins.</span>
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded-full bg-muted-foreground/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-lg md:text-xl text-foreground font-normal">
                    Know where every rupee goes <span className="text-muted-foreground">before work begins.</span>
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
                className="mt-10"
              >
                <Button
                  size="lg"
                  onClick={redirectToHouspireHome}
                  className="h-14 rounded-full px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Start your home plan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.5 }}
                className="mt-8 grid grid-cols-2 gap-3 max-w-lg"
              >
                {includedTiles.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-3 hover:border-primary/20 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="mt-1.5 text-[13px] font-bold text-foreground leading-snug">{item.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{item.desc}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
              className="relative"
            >
              <div className="card-apple p-3 md:p-4 border-2 border-primary/10 shadow-2xl">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-4 py-1.5 text-xs font-bold text-primary shadow-sm">
                      What you’ll see in 3 days
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      4K RENDER
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40">
                    <Image src={previewImages[1].src} alt={previewImages[1].alt} fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40">
                    <Image src={previewImages[2].src} alt={previewImages[2].alt} fill className="object-cover" />
                  </div>
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
