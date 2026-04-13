'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { dataGet } from '@/lib/frontend-data';
import { ArrowRight, Eye, Heart } from 'lucide-react';

function GalleryCardSkeleton() {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export function GalleryPreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedDesigns();
  }, []);

  const fetchFeaturedDesigns = async () => {
    try {
      const data = await dataGet('/gallery?featured=true&limit=12');
      const normalized =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.designs)
            ? data.designs
            : Array.isArray(data?.items)
              ? data.items
              : [];

      setDesigns(normalized);
    } catch (error) {
      console.error('Failed to fetch featured designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (min, max) => {
    const formatNum = (n) => {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      return `₹${(n / 1000).toFixed(0)}K`;
    };
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  // If no designs from DB, show placeholder designs with real images
  const placeholderDesigns = [
    {
      id: 'ph-1',
      design_title: 'Serene Minimalist Bedroom',
      cover_image_url: '/styles/japanese-zen/portfolio-6-home-office.png',
      room_type: 'Master Bedroom',
      style_primary: 'Modern Minimalist',
      budget_range: 'mid_range',
      estimated_budget_min: 150000,
      estimated_budget_max: 250000,
      view_count: 1240,
      save_count: 89
    },
    {
      id: 'ph-2',
      design_title: 'Cozy Scandinavian Living',
      cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png',
      room_type: 'Living Room',
      style_primary: 'Scandinavian',
      budget_range: 'mid_range',
      estimated_budget_min: 200000,
      estimated_budget_max: 350000,
      view_count: 980,
      save_count: 76
    },
    {
      id: 'ph-3',
      design_title: 'Warm Traditional Pooja Room',
      cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
      room_type: 'Pooja Room',
      style_primary: 'Traditional Indian',
      budget_range: 'premium',
      estimated_budget_min: 80000,
      estimated_budget_max: 150000,
      view_count: 756,
      save_count: 92
    },
    {
      id: 'ph-4',
      design_title: 'Modern Home Office',
      cover_image_url: '/styles/japanese-zen/portfolio-6-home-office.png',
      room_type: 'Home Office',
      style_primary: 'Contemporary',
      budget_range: 'budget_friendly',
      estimated_budget_min: 75000,
      estimated_budget_max: 120000,
      view_count: 654,
      save_count: 45
    },
    {
      id: 'ph-5',
      design_title: 'Bohemian Kids Bedroom',
      cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
      room_type: 'Kids Bedroom',
      style_primary: 'Bohemian',
      budget_range: 'mid_range',
      estimated_budget_min: 100000,
      estimated_budget_max: 180000,
      view_count: 543,
      save_count: 67
    },
    {
      id: 'ph-6',
      design_title: 'Industrial Dining Space',
      cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png',
      room_type: 'Dining Room',
      style_primary: 'Industrial',
      budget_range: 'premium',
      estimated_budget_min: 250000,
      estimated_budget_max: 400000,
      view_count: 432,
      save_count: 38
    },
    {
      id: 'ph-7',
      design_title: 'Japandi Calm Kitchen',
      cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png',
      room_type: 'Kitchen',
      style_primary: 'Japandi',
      budget_range: 'mid_range',
      estimated_budget_min: 180000,
      estimated_budget_max: 300000,
      view_count: 1110,
      save_count: 104
    },
    {
      id: 'ph-8',
      design_title: 'Luxury Modern Bathroom',
      cover_image_url: '/styles/japanese-zen/portfolio-6-home-office.png',
      room_type: 'Bathroom',
      style_primary: 'Modern Luxury',
      budget_range: 'premium',
      estimated_budget_min: 140000,
      estimated_budget_max: 260000,
      view_count: 876,
      save_count: 64
    },
    {
      id: 'ph-9',
      design_title: 'Soft Neutral Guest Bedroom',
      cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
      room_type: 'Guest Bedroom',
      style_primary: 'Contemporary',
      budget_range: 'mid_range',
      estimated_budget_min: 120000,
      estimated_budget_max: 220000,
      view_count: 690,
      save_count: 51
    },
    {
      id: 'ph-10',
      design_title: 'Compact Dining Nook',
      cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png',
      room_type: 'Dining Room',
      style_primary: 'Modern Minimalist',
      budget_range: 'budget_friendly',
      estimated_budget_min: 65000,
      estimated_budget_max: 110000,
      view_count: 510,
      save_count: 39
    },
    {
      id: 'ph-11',
      design_title: 'Warm Earthy Living Space',
      cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
      room_type: 'Living Room',
      style_primary: 'Bohemian',
      budget_range: 'mid_range',
      estimated_budget_min: 210000,
      estimated_budget_max: 340000,
      view_count: 740,
      save_count: 70
    },
    {
      id: 'ph-12',
      design_title: 'Clean Work-From-Home Setup',
      cover_image_url: '/styles/japanese-zen/portfolio-6-home-office.png',
      room_type: 'Home Office',
      style_primary: 'Scandinavian',
      budget_range: 'mid_range',
      estimated_budget_min: 90000,
      estimated_budget_max: 160000,
      view_count: 620,
      save_count: 48
    }
  ];

  const safeDesigns = Array.isArray(designs) ? designs : [];
  const displayDesigns =
    safeDesigns.length >= 8 ? safeDesigns.slice(0, 12) : [...safeDesigns, ...placeholderDesigns].slice(0, 12);
  const activeDesign = displayDesigns[activeIndex] || displayDesigns[0];

  return (
    <section ref={ref} className="bg-background py-16 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Home discovery engine</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Explore homes designed 
              <br />
              <span className="text-muted-foreground">with actual budgets</span>
            </h2>
          </div>
          <div className="lg:pl-8">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Browse completed projects and find inspiration for your space. Each card includes room type, style, and budget range.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* Desktop: Featured preview + thumbnail rail */}
          <div className="hidden gap-4 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="group relative overflow-hidden rounded-[22px] border border-border/60 bg-card shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
              {loading ? (
                <GalleryCardSkeleton />
              ) : (
                <>
                    <div className="relative h-[340px] overflow-hidden md:h-[360px]">
                    <img
                      src={activeDesign?.cover_image_url}
                      alt={activeDesign?.design_title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                    <div className="absolute left-5 top-5 flex items-center gap-2">
                      <Badge className="bg-background/90 text-foreground backdrop-blur-sm text-xs">
                        {activeDesign?.room_type}
                      </Badge>
                      <Badge className="bg-background/90 text-foreground backdrop-blur-sm text-xs">
                        {activeDesign?.style_primary}
                      </Badge>
                    </div>
                    <div className="absolute right-5 top-5 flex items-center gap-2 text-white text-xs">
                      <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1"><Eye className="h-3.5 w-3.5" /> {activeDesign?.view_count ?? 0}</span>
                      <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1"><Heart className="h-3.5 w-3.5" /> {activeDesign?.save_count ?? 0}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-semibold leading-tight">{activeDesign?.design_title}</h3>
                      <p className="mt-2 inline-block rounded-full bg-white/15 px-2.5 py-1 text-xs backdrop-blur">
                        {formatBudget(activeDesign?.estimated_budget_min ?? 0, activeDesign?.estimated_budget_max ?? 0)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </Card>

            <div className="max-h-[360px] space-y-2.5 overflow-auto pr-1">
              {(loading ? Array.from({ length: 7 }).map((_, idx) => ({ id: `s-${idx}` })) : displayDesigns.slice(0, 10)).map((design, idx) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: Math.min(idx, 6) * 0.05 }}
                >
                  {loading ? (
                    <GalleryCardSkeleton />
                  ) : (
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onFocus={() => setActiveIndex(idx)}
                      onClick={() => router.push('/discover')}
                      className={`w-full overflow-hidden rounded-[18px] border text-left transition-all duration-300 ${
                        activeIndex === idx ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <img
                          src={design.cover_image_url}
                          alt={design.design_title}
                          className="h-16 w-20 rounded-xl object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs text-muted-foreground">{design.style_primary}</p>
                          <p className="line-clamp-2 text-sm font-medium text-foreground">{design.design_title}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {formatBudget(design.estimated_budget_min ?? 0, design.estimated_budget_max ?? 0)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: Keep swipeable gallery cards */}
          <div className="lg:hidden">
            <Carousel opts={{ align: 'start', dragFree: true }} className="relative" aria-label="Gallery preview">
              <CarouselContent className="-ml-2 md:-ml-3">
                {loading
                  ? Array.from({ length: 10 }).map((_, idx) => (
                      <CarouselItem key={idx} className="basis-[88%] pl-2 sm:basis-[60%] md:basis-1/2 md:pl-3">
                        <GalleryCardSkeleton />
                      </CarouselItem>
                    ))
                  : displayDesigns.slice(0, 12).map((design, idx) => (
                      <CarouselItem key={design.id} className="basis-[88%] pl-2 sm:basis-[60%] md:basis-1/2 md:pl-3">
                        <motion.div
                          initial={{ opacity: 0, y: 18 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.5, delay: Math.min(idx, 6) * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          <Card
                          className="group relative overflow-hidden rounded-[20px] border border-border/60 bg-card p-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_44px_rgba(0,0,0,0.12)]"
                            onClick={() => router.push('/discover')}
                          >
                            <div className="relative h-[220px] overflow-hidden">
                              <img
                                src={design.cover_image_url}
                                alt={design.design_title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                draggable={false}
                              />
                              <div className="absolute left-4 top-4">
                                <Badge className="bg-background/90 text-foreground backdrop-blur-sm text-xs">
                                  {design.room_type}
                                </Badge>
                              </div>
                              <div className="absolute right-4 top-4 flex items-center gap-3 text-white text-xs">
                                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1"><Eye className="h-3.5 w-3.5" /> {design.view_count ?? 0}</span>
                                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1"><Heart className="h-3.5 w-3.5" /> {design.save_count ?? 0}</span>
                              </div>
                            </div>

                            <div className="space-y-2 p-4">
                              <p className="text-xs text-muted-foreground">{design.style_primary}</p>
                              <h3 className="text-base font-semibold leading-tight text-foreground">{design.design_title}</h3>
                              <div className="flex items-center justify-between">
                                <p className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs text-foreground">
                                  {formatBudget(design.estimated_budget_min ?? 0, design.estimated_budget_max ?? 0)}
                                </p>
                                <Button size="sm" variant="ghost" className="rounded-full text-primary hover:bg-primary/10">
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </CarouselItem>
                    ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-background/95 border-border shadow" />
              <CarouselNext className="hidden md:flex -right-4 bg-background/95 border-border shadow" />
            </Carousel>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/discover')}
            className="group h-11 rounded-full px-7 transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Explore Gallery
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}


