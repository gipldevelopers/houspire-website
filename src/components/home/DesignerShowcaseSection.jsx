'use client';

import { useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DESIGNER_PERSONAS } from '@/lib/constants';
import { Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export function DesignerShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Get top 8 designers by projects completed
  const topDesigners = [...DESIGNER_PERSONAS]
    .sort((a, b) => b.projects_completed - a.projects_completed)
    .slice(0, 8);

  return (
    <section ref={ref} className="section-apple bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-accent font-medium mb-4">Expert Designers</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Meet your designer.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-xl">
              14 specialized designers, each with their own unique style and expertise.
            </p>
          </div>
          
          {/* Navigation arrows - desktop */}
          <div className="hidden md:flex items-center gap-3 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full h-12 w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none hidden md:block" />
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {topDesigners.map((designer, idx) => (
                <motion.div
                  key={designer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="flex-shrink-0 w-[280px] md:w-[320px]"
                >
                  <Card className="p-6 h-full hover:shadow-apple-lg transition-all duration-500 group">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        <AvatarImage src={designer.avatar} alt={designer.name} />
                        <AvatarFallback>{designer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {designer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {designer.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{designer.rating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({designer.projects_completed}+ projects)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {designer.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {designer.signature_style.slice(0, 3).map((style) => (
                        <Badge 
                          key={style} 
                          variant="secondary" 
                          className="text-xs font-normal"
                        >
                          {style.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/designer/${designer.id}`)}
                      className="w-full justify-center group-hover:bg-secondary"
                    >
                      View portfolio
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="rounded-full h-10 w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/select-package')}
            className="rounded-full h-12 px-8 group"
          >
            Get started with our designers
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
