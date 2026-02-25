'use client';

import { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
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

  useEffect(() => {
    fetchFeaturedDesigns();
  }, []);

  const fetchFeaturedDesigns = async () => {
    try {
      const data = await apiGet('/api/gallery?featured=true&limit=6');
      if (data) {
        setDesigns(data);
      }
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
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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
      id: '5',
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
      id: '6',
      design_title: 'Industrial Dining Space',
      cover_image_url: '/styles/japanese-zen/portfolio-4-dining-room.png',
      room_type: 'Dining Room',
      style_primary: 'Industrial',
      budget_range: 'premium',
      estimated_budget_min: 250000,
      estimated_budget_max: 400000,
      view_count: 432,
      save_count: 38
    }
  ];

  const displayDesigns = designs.length > 0 ? designs : placeholderDesigns;

  return (
    <section ref={ref} className="section-apple bg-background">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium mb-4">Inspiration Gallery</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Stunning designs,
            <br />
            <span className="text-muted-foreground">real results.</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse completed projects and find inspiration for your space.
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            <>
              <GalleryCardSkeleton />
              <GalleryCardSkeleton />
              <GalleryCardSkeleton />
              <GalleryCardSkeleton />
              <GalleryCardSkeleton />
              <GalleryCardSkeleton />
            </>
          ) : (
            displayDesigns.map((design, idx) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Card 
                  className="group relative aspect-[4/3] overflow-hidden border-0 cursor-pointer will-change-transform"
                  onClick={() => router.push('/discover')}
                >
                  {/* Image */}
                  <img
                    src={design.cover_image_url}
                    alt={design.design_title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Top badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm text-xs">
                      {design.room_type}
                    </Badge>
                  </div>
                  
                  {/* Stats */}
                  <div className="absolute top-4 right-4 flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {design.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {design.save_count}
                    </span>
                  </div>
                  
                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-xs text-white/70 mb-1">{design.style_primary}</p>
                    <h3 className="text-lg font-semibold leading-tight mb-2">
                      {design.design_title}
                    </h3>
                    <p className="text-sm backdrop-blur-sm bg-white/10 px-2 py-0.5 rounded-full inline-block">
                      {formatBudget(design.estimated_budget_min, design.estimated_budget_max)}
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      className="bg-white/95 backdrop-blur-sm text-foreground hover:bg-white shadow-xl rounded-full"
                    >
                      View Design
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/discover')}
            className="rounded-full h-12 px-8 group hover:bg-foreground hover:text-background transition-all duration-300"
          >
            View all designs
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
