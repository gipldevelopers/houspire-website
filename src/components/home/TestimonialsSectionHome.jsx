'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    stars: 5,
    quote: "We were about to sign with a designer who quoted ₹3.5 lakhs. Got Houspire's report for ₹6,999 and realized we were being overcharged on almost every line item. Saved us over ₹1.2 lakhs.",
    name: 'Priya & Arjun M.',
    location: '3BHK, Whitefield, Bangalore',
  },
  {
    stars: 5,
    quote: 'The 3D renders looked exactly like the final result. My contractor used the shopping list directly — no confusion, no back-and-forth. Entire project done in 6 weeks.',
    name: 'Sneha R.',
    location: '2BHK, Gachibowli, Hyderabad',
  },
  {
    stars: 5,
    quote: 'I was skeptical about AI-generated designs. But the quality of the renders and the level of detail in the budget breakdown genuinely surprised me. Worth every rupee of the ₹999 plan.',
    name: 'Vikram T.',
    location: '1BHK, Andheri West, Mumbai',
  },
  {
    stars: 5,
    quote: 'We loved the clear shopping links and budget options. It made decisions much faster and avoided costly confusion.',
    name: 'Ritika S.',
    location: '2BHK, Kharadi, Pune',
  },
  {
    stars: 5,
    quote: 'The plan felt practical from day one. We knew exactly what to buy, what to prioritize, and what to skip.',
    name: 'Naveen K.',
    location: '3BHK, Velachery, Chennai',
  },
  {
    stars: 5,
    quote: 'Best part was the transparency. We compared options quickly and completed execution without stressful back-and-forth.',
    name: 'Farah N.',
    location: '2BHK, Dwarka, Delhi',
  },
];

const singleRow = testimonials.slice(0, 6);

function ReviewCard({ item }) {
  const initials = item.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="w-[290px] shrink-0 rounded-2xl border border-border/60 bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 md:w-[320px]">
      <div className="mb-3 flex gap-1">
        {Array.from({ length: item.stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
        ))}
      </div>
      <p className="line-clamp-4 min-h-[92px] text-[15px] leading-[1.55] text-foreground">"{item.quote}"</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsSectionHome() {
  const scrollRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e) => {
    if (!scrollRef.current) return;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragState.current.scrollLeft = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    dragState.current.isDown = false;
  };

  const onMouseUp = () => {
    dragState.current.isDown = false;
  };

  const onMouseMove = (e) => {
    if (!dragState.current.isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.2;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background py-8 md:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-5 text-center md:mb-6"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">What Homeowners Say</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">200+ homes transformed.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-muted-foreground md:text-sm">
            Real reviews from homeowners who used Houspire to plan, budget, and execute their interiors.
          </p>
        </motion.div>

        <motion.div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 cursor-grab active:cursor-grabbing select-none"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex w-max gap-4">
            {singleRow.map((item, idx) => (
              <motion.div
                key={`row-${idx}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.05 }}
              >
                <ReviewCard item={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
