'use client';

import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { dataGet } from '@/lib/frontend-data';

const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-indigo-500 to-violet-500',
];

const FALLBACK_TESTIMONIALS = [
  {
    id: 'fb-1',
    quote: "The designs exceeded our expectations. Clean, modern, and exactly what we wanted. The 3D renders were incredibly realistic!",
    author: "Priya Sharma",
    role: "Homeowner",
    location: "Mumbai",
    rating: 5,
    isVerified: true,
    gradient: GRADIENTS[0],
  },
  {
    id: 'fb-2',
    quote: "Transparent pricing and delivered on time. Houspire made our renovation stress-free. Highly recommend to anyone!",
    author: "Arjun Malhotra",
    role: "Tech Founder",
    location: "Bangalore",
    rating: 5,
    isVerified: true,
    gradient: GRADIENTS[1],
  },
  {
    id: 'fb-3',
    quote: "Worth every rupee. The shopping list with exact links saved us hours of research. Our living room looks amazing now.",
    author: "Neha Gupta",
    role: "Interior Enthusiast",
    location: "Delhi",
    rating: 5,
    isVerified: true,
    gradient: GRADIENTS[2],
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [dbReviews, setDbReviews] = useState([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Fetch featured reviews from DB
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        // TODO: Create API route for featured testimonials
        // const data = await dataGet('/reviews?featured=true&limit=6');
        // if (data) setDbReviews(data);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    }
    fetchTestimonials();
  }, []);

  const testimonials = useMemo(() => {
    if (!dbReviews || dbReviews.length === 0) return FALLBACK_TESTIMONIALS;

    return dbReviews.map((r, i) => ({
      id: r.id,
      quote: r.review_text || '',
      author: r.reviewer_name || 'Happy Customer',
      role: 'Verified Customer',
      location: 'India',
      rating: r.rating,
      isVerified: r.is_verified ?? false,
      gradient: GRADIENTS[i % GRADIENTS.length],
    }));
  }, [dbReviews]);

  // Show top 3 on desktop, all in carousel
  const displayTestimonials = testimonials.slice(0, 3);
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : '4.9';

  return (
    <section ref={ref} className="py-12 md:py-32 bg-gradient-to-b from-background via-accent/[0.02] to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            What Clients Say
          </p>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Star 
                key={i} 
                className="w-6 h-6 fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" 
              />
            ))}
          </div>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Rated {avgRating}/5 by our clients
          </p>
        </motion.div>

        {/* Featured Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <Quote className="w-12 h-12 text-accent/30 mx-auto mb-4" />
          <p className="text-2xl md:text-3xl font-medium text-foreground italic leading-relaxed">
            {displayTestimonials[0]?.quote
              ? `${displayTestimonials[0].quote.slice(0, 100)}${displayTestimonials[0].quote.length > 100 ? '...' : ''}`
              : "The designs exceeded our expectations!"}
          </p>
        </motion.div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {displayTestimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-background border border-border/50 rounded-2xl p-10 hover:border-accent/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-smooth"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" 
                    />
                  ))}
                </div>
                {testimonial.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <Quote className="w-10 h-10 text-accent/20 mb-4" />
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold`}>
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role} · {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-[85vw] max-w-[320px]"
                  >
                    <div className="bg-background border border-border/50 rounded-2xl p-6 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" 
                            />
                          ))}
                        </div>
                        {testimonial.isVerified && (
                          <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                            <BadgeCheck className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <Quote className="w-8 h-8 text-accent/20 mb-3" />
                      <p className="text-base text-foreground leading-relaxed mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold text-sm`}>
                          {testimonial.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role} · {testimonial.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-center gap-3 mt-6">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}


