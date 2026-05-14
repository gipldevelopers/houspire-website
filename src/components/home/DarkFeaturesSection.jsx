'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { redirectToHouspireHome } from '@/lib/external-links';

const ease = [0.25, 0.46, 0.45, 0.94];

const cards = [
  {
    icon: ImageIcon,
    title: 'See your actual home 3D designs',
    subtitle: 'No guesswork. No surprises.',
    image: '/styles/japanese-zen/portfolio-4-dining-room.png',
    scrollTo: 'transformation',
    cta: 'Start your design',
  },
  {
    icon: IndianRupee,
    title: 'Know exactly what your home will cost-before you start',
    subtitle: 'No hidden charges. No last-minute shocks.',
    image: '/styles/japanese-zen/portfolio-5-bathroom.png',
    scrollTo: 'budget-estimator',
    cta: 'Plan your budget',
  },
  {
    icon: ShoppingBag,
    title: 'Buy exactly what you see',
    subtitle: 'No hunting, no confusion, no mismatches',
    image: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
    scrollTo: 'pricing',
    cta: 'Explore shopping list',
  },
  {
    icon: Users,
    title: 'Buy from the right people from day one',
    subtitle: 'No trial and error. Save time',
    image: '/styles/japanese-zen/portfolio-6-home-office.png',
    scrollTo: 'pricing',
    cta: 'Meet your vendors',
  },
];

export function DarkFeaturesSection() {
  const handleCardRedirect = () => {
    redirectToHouspireHome();
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden py-8 md:py-20" style={{ background: 'var(--color-primary-1)' }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-140px] h-[520px] w-[520px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-6 max-w-3xl text-center md:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] backdrop-blur px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-bg)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            What you get
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl lg:text-5xl font-semibold tracking-tight leading-[1.15]" style={{ color: 'var(--color-heading-main)' }}>
            Design, budget, and execution clarity
            <span style={{ color: 'var(--color-heading-main-highlight)' }}> in just 3 days</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg opacity-60" style={{ color: 'var(--color-description)' }}>
            Here’s how you go from confusion → clarity → execution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              onClick={() => handleCardRedirect(card)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/30 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-foreground/5"
            >
              <div className="absolute inset-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />
              </div>

              <div className="relative flex min-h-[320px] flex-col justify-between p-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white/90" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-3) 20%, transparent)' }}>
                    <card.icon className="h-4 w-4" />
                    Included
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{card.subtitle}</p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

