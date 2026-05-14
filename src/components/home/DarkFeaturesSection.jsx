'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, IndianRupee, ShoppingBag, Users } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
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
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const count = cards.length;

  // Handle scroll to update dots
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const track = el.children[0];
      if (!track) return;
      const items = Array.from(track.children);
      const scrollCenter = el.scrollLeft + (el.offsetWidth / 2);
      
      let activeIndex = 0;
      items.forEach((item, i) => {
        const itemLeft = item.offsetLeft;
        const itemRight = itemLeft + item.offsetWidth;
        if (scrollCenter >= itemLeft && scrollCenter < itemRight) {
          activeIndex = i;
        }
      });
      
      setCurrent(activeIndex + 1);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

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

          <h2 className="mt-4 text-2xl sm:text-5xl lg:text-5xl font-semibold tracking-tight leading-[1.2]" style={{ color: 'var(--color-heading-main)' }}>
            Design, budget, and <br className="sm:hidden" />
            execution clarity <span className="inline-block sm:inline" style={{ color: 'var(--color-heading-main-highlight)' }}>in just 3 days</span>
          </h2>

          <p className="mt-3 text-base sm:text-lg opacity-60" style={{ color: 'var(--color-description)' }}>
            Here’s how you go from confusion → clarity → execution
          </p>
        </motion.div>

        {/* Desktop View: 4-column grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5">
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

        {/* Mobile View: Horizontal Scroll Slider */}
        <div className="lg:hidden">
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-8 snap-x snap-mandatory scroll-pl-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex w-max gap-4 pl-6 pr-20">
              {cards.map((card, i) => (
                <div 
                  key={card.title} 
                  className="flex-none w-[280px] snap-start scroll-ml-6"
                >
                  <div
                    className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card shadow-md aspect-[4/5]"
                  >
                    <div className="absolute inset-0">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/90" style={{ backgroundColor: 'rgba(236, 116, 70, 0.3)' }}>
                          <card.icon className="h-3 w-3" />
                          Included
                        </div>
                        <h3 className="mt-3 text-lg font-bold tracking-tight text-white line-clamp-2">{card.title}</h3>
                        <p className="mt-1 text-xs text-white/70 line-clamp-2">{card.subtitle}</p>
                      </div>

                      <div 
                        onClick={() => handleCardRedirect(card)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white cursor-pointer active:scale-95 transition-transform"
                      >
                        {card.cta}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls - Kept for accessibility/visual hint */}
          <div className="flex items-center justify-center gap-4 mt-2">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === i + 1 ? 'w-6 bg-[var(--color-primary)]' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

