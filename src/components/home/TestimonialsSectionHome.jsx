'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight, MapPin } from 'lucide-react';
import Link from 'next/link';

const testimonials = [
  {
    stars: 5,
    quote: "We were about to sign with a designer who quoted ₹3.5 lakhs. Got Houspire's report for ₹6,999 and realized we were being overcharged on almost every line item. Saved us over ₹1.2 lakhs.",
    name: 'Priya & Arjun M.',
    location: 'Whitefield, Bangalore',
    details: '3BHK Interior Plan',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    slug: 'whitefield-3bhk'
  },
  {
    stars: 5,
    quote: 'The 3D renders looked exactly like the final result. My contractor used the shopping list directly — no confusion, no back-and-forth. Entire project done in 6 weeks.',
    name: 'Sneha R.',
    location: 'Gachibowli, Hyderabad',
    details: '2BHK Minimalist Home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    slug: 'gachibowli-2bhk'
  },
  {
    stars: 5,
    quote: 'I was skeptical about AI-generated designs. But the quality of the renders and the level of detail in the budget breakdown genuinely surprised me. Worth every rupee of the ₹499 plan.',
    name: 'Vikram T.',
    location: 'Andheri West, Mumbai',
    details: '1BHK Studio Apartment',
    image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&q=80&w=800',
    slug: 'andheri-1bhk'
  },
  {
    stars: 5,
    quote: 'We loved the clear shopping links and budget options. It made decisions much faster and avoided costly confusion.',
    name: 'Ritika S.',
    location: 'Kharadi, Pune',
    details: '2BHK Contemporary Living',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    slug: 'kharadi-2bhk'
  },
];

const singleRow = testimonials;

function ReviewCard({ item }) {
  return (
    <article 
      className="w-[280px] shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 group md:w-[290px]"
      style={{ backgroundColor: 'var(--color-card)' }}
    >
      {/* Home Image Container */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
        
        {/* Project Link Overlay */}
        <Link 
          href={`/discover?q=${item.slug}`}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary shadow-xl opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        {/* Home Detail Badge - Now dynamic visibility */}
        <div className="absolute top-3 left-3 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-widest shadow-sm">
          {item.details}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: item.stars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
          ))}
        </div>
        
        <p className="mb-4 line-clamp-3 min-h-[60px] text-[14px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
          "{item.quote}"
        </p>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center gap-2.5">
             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>
              {item.initials || item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--color-heading)' }}>{item.name}</p>
              <div className="flex items-center gap-1 text-[10px] opacity-60">
                <MapPin className="h-2.5 w-2.5" />
                {item.location}
              </div>
            </div>
          </div>
          
          <Link 
            href={`/discover?q=${item.slug}`}
            className="text-[9px] font-black uppercase tracking-widest transition-colors hover:underline underline-offset-4 text-right leading-[1.1]"
            style={{ color: 'var(--color-primary)' }}
          >
            Project<br />Detail
          </Link>
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
    const walk = (x - dragState.current.startX) * 1.5;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <section className="relative overflow-hidden py-10 md:py-10" style={{ backgroundColor: 'var(--color-primary-1)' }}>
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6 text-center md:mb-6"
        >

          <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--color-heading-main)' }}>
             From confusion to clarity <span style={{ color: 'var(--color-heading-main-highlight)' }}>200+ homes</span> and counting
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-medium md:text-base opacity-60" style={{ color: 'var(--color-description)' }}>
            Real reviews from homeowners who used Houspire to plan, budget, and execute their dream interiors without the stress.
          </p>
        </motion.div>

        <motion.div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-10 cursor-grab active:cursor-grabbing select-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex w-max gap-5 px-6 md:px-12 lg:mx-auto lg:justify-center">
            {singleRow.map((item, idx) => (
              <motion.div
                key={`row-${idx}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
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
