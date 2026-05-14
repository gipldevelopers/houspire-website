'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroHighlight } from '@/components/ui/hero-highlight';
import { PlanningWizardModal } from '@/components/wizard/PlanningWizardModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <>
      <HeroHighlight className="bg-background">
        <section className="relative overflow-hidden pt-24 pb-4 md:pt-24 md:pb-24 flex items-center min-h-auto md:min-h-0">
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

          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 flex-1 flex flex-col justify-between md:block py-4">
          <div className="flex-1 flex flex-col justify-center gap-6 md:gap-0">
            <div className="grid items-center gap-6 md:gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-6 md:block">
                <div className="space-y-1.5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.1 }}
                    className="flex items-center gap-2 mb-1 md:mb-6"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_rgba(236,116,70,0.5)]" />
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-primary)' }}>
                      Delivered in 72 hours
                    </span>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.15 }}
                    className="text-[28px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.35]"
                    style={{ color: 'var(--color-heading-main)' }}
                  >
                    Design your home in <br className="md:hidden" />
                    <span className="whitespace-nowrap" style={{ color: 'var(--color-heading-main-highlight)' }}>3 days</span> not 3 months
                  </motion.h1>
                </div>

                {/* Mobile Layout: Images and Features side-by-side */}
                <div className="md:hidden flex gap-3 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.2 }}
                    className="flex-[1.6]"
                  >
                    <div className="card-apple p-1 border border-primary/10 shadow-lg h-full flex flex-col">
                      <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card flex-1">
                        <div className="relative h-full aspect-[1/1.1]">
                          <Image
                            src={previewImages[0].src}
                            alt={previewImages[0].alt}
                            fill
                            priority
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="mt-1 grid grid-cols-2 gap-1 h-[50px]">
                        <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-border/40">
                          <Image src={previewImages[1].src} alt={previewImages[1].alt} fill className="object-cover" />
                        </div>
                        <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-border/40">
                          <Image src={previewImages[2].src} alt={previewImages[2].alt} fill className="object-cover" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Vertical Features beside images */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.3 }}
                    className="flex-1 flex flex-col gap-1.5"
                  >
                    {includedTiles.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg border border-[var(--color-border)] bg-background/50 backdrop-blur-sm p-1.5 py-1 hover:border-[var(--color-primary)]/20 transition-colors flex-1 flex flex-col justify-center"
                      >
                        <item.icon className="h-3 w-3" style={{ color: 'var(--color-primary)' }} />
                        <div className="mt-0.5 text-[9px] font-bold leading-tight" style={{ color: 'var(--color-heading-secondary)' }}>{item.title}</div>
                        <div className="text-[7.5px] leading-tight opacity-60 font-medium" style={{ color: 'var(--color-description)' }}>{item.desc}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.25 }}
                    className="space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 h-3 w-3 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-2 w-2" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <p className="text-[12px] md:text-xl font-normal leading-tight" style={{ color: 'var(--color-heading-secondary)' }}>
                        See your exact home <span style={{ color: 'var(--color-heading-secondary-highlight)' }}>before work begins.</span>
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 h-3 w-3 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-2 w-2" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <p className="text-[12px] md:text-xl font-normal leading-tight" style={{ color: 'var(--color-heading-secondary)' }}>
                        Know where every rupee goes <span style={{ color: 'var(--color-heading-secondary-highlight)' }}>before work begins.</span>
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.35 }}
                  >
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="btn-primary h-11 px-8 text-sm md:h-14 md:px-10 md:text-lg gap-2 w-full sm:w-auto shadow-xl shadow-primary/20"
                    >
                      Start your home plan
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease, delay: 0.5 }}
                  className="mt-8 hidden md:grid grid-cols-2 gap-2.5 max-w-lg"
                >
                  {includedTiles.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-[var(--color-border)] bg-background/50 backdrop-blur-sm p-2.5 md:p-3 hover:border-[var(--color-primary)]/20 transition-colors"
                    >
                      <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: 'var(--color-primary)' }} />
                      <div className="mt-1 text-[12px] md:text-[13px] font-bold leading-snug" style={{ color: 'var(--color-heading-secondary)' }}>{item.title}</div>
                      <div className="mt-0.5 text-[10px] md:text-[11px] leading-snug opacity-60" style={{ color: 'var(--color-description)' }}>{item.desc}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Desktop Image Preview - Hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.2 }}
                className="relative hidden md:block"
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
        </div>
      </section>
    </HeroHighlight>
      <PlanningWizardModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedPackage={selectedPackage}
      />
    </>
  );
}
