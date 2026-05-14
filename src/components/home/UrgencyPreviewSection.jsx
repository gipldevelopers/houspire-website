'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { urgencyStories } from '@/lib/urgency';

export function UrgencyPreviewSection() {
  const stories = urgencyStories.slice(0, 3);
  const [current, setCurrent] = useState(1);
  const scrollRef = useRef(null);

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

  return (
    <section id="urgency" className="bg-background py-8 md:py-10 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(236,116,70,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Fixed in 72 hours
              </span>
            </div>
            <h2 className="text-[28px] md:text-[clamp(24px,3.5vw,36px)] font-black tracking-[-0.03em] leading-[1.15] text-foreground">
              Real stories from homeowners
            </h2>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-[1.5] mt-1 max-w-[55ch]">
              From contractor ghosts to budget nightmares, we provide clarity without the stress.
            </p>
          </div>

          <Link href="/urgency" className="btn-secondary btn-sm gap-1.5 group hidden md:flex">
            See all stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile View: Horizontal Slider */}
        <div className="md:hidden">
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-pl-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex w-max gap-4 pl-6 pr-20">
              {stories.map((story) => (
                <div key={story.slug} className="flex-none w-[270px] snap-start scroll-ml-6">
                  <Link
                    href={`/urgency/${story.slug}`}
                    className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-border bg-card h-full"
                  >
                    <div className="relative aspect-[3/2] bg-muted overflow-hidden">
                      <img
                        src={story.image || '/placeholder.svg'}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      <div className="absolute top-3 left-3 right-3 flex flex-col gap-1.5 pointer-events-none">
                        <div className="inline-flex items-center w-fit bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg">
                          Problem: {story.problem_tag}
                        </div>
                        <div className="inline-flex items-center w-fit bg-white/95 backdrop-blur text-green-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-lg border border-green-100">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                          Solved in 72h
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          {story.person.name} • {story.person.city}
                        </p>
                      </div>
                      
                      <h3 className="text-base font-bold text-foreground leading-tight tracking-tight line-clamp-2 min-h-[38px]">
                        {story.title}
                      </h3>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em]">
                          {story.cta_text}
                        </span>
                        <div className="h-7 w-7 flex items-center justify-center rounded-full bg-primary text-white">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-1">
            {stories.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  current === i + 1 ? 'w-6 bg-[var(--color-primary)]' : 'w-1 bg-border'
                }`}
              />
            ))}
          </div>

          <div className="mt-4 px-6 text-center">
            <Link href="/urgency" className="btn-secondary w-full gap-2 py-2.5 text-sm">
              See all stories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/urgency/${story.slug}`}
              className="group flex flex-col rounded-[1.5rem] overflow-hidden border border-border bg-card hover:shadow-[0_24px_48px_rgba(0,0,0,0.07)] transition-all duration-500"
            >
              <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={story.image || '/placeholder.svg'}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                
                <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 pointer-events-none">
                  <div className="inline-flex items-center w-fit bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                    Problem: {story.problem_tag}
                  </div>
                  <div className="inline-flex items-center w-fit bg-white/95 backdrop-blur text-green-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg border border-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Solved in 72 hours
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {story.person.name} • {story.person.city}
                  </p>
                </div>
                
                <h3 className="text-lg font-bold text-foreground leading-[1.2] tracking-tight group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-[14px] text-muted-foreground leading-[1.5] mt-2 flex-1 font-medium line-clamp-2">
                  {story.summary}
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.1em] border-b border-primary/20 group-hover:border-primary transition-all">
                    {story.cta_text}
                  </span>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
