import { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
const testimonials = [
    {
        id: 1,
        name: 'Priya Sharma',
        location: 'Mumbai',
        rating: 5,
        text: 'Houspire transformed my living room beyond my expectations! The designer understood my vision perfectly and delivered stunning results. The whole process was smooth and professional.',
        projectType: 'Living Room Makeover'
    },
    {
        id: 2,
        name: 'Rahul Verma',
        location: 'Bangalore',
        rating: 5,
        text: 'Amazing experience! My bedroom now feels like a luxury hotel. The designer was patient with my multiple revision requests and delivered exactly what I wanted. Worth every rupee!',
        projectType: 'Master Bedroom Design'
    },
    {
        id: 3,
        name: 'Anjali Patel',
        location: 'Delhi',
        rating: 5,
        text: 'I was skeptical about online interior design, but Houspire exceeded all my expectations. The 3D renders helped me visualize everything, and the final result was even better!',
        projectType: 'Complete Home Design'
    },
    {
        id: 4,
        name: 'Karthik Reddy',
        location: 'Hyderabad',
        rating: 5,
        text: 'Professional, creative, and affordable! The designer helped me maximize my small apartment space brilliantly. I get compliments from every guest who visits. Highly recommended!',
        projectType: 'Small Apartment Optimization'
    },
    {
        id: 5,
        name: 'Sneha Iyer',
        location: 'Chennai',
        rating: 5,
        text: 'Best decision for our new home! The kitchen design is not only beautiful but also highly functional. The designer considered every detail - from storage to lighting. Simply perfect!',
        projectType: 'Modular Kitchen Design'
    }
];
export function TestimonialCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        containScroll: 'trimSnaps'
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);
    const onSelect = useCallback(() => {
        if (!emblaApi)
            return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi)
            return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        // Autoplay
        const autoplay = setInterval(() => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext();
            }
            else {
                emblaApi.scrollTo(0);
            }
        }, 5000);
        return () => {
            clearInterval(autoplay);
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);
    function renderStars(rating) {
        return Array.from({ length: 5 }).map((_, index) => (<Star key={index} className={`h-4 w-4 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`}/>));
    }
    return (<section className="py-16 md:py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => {
            const initials = testimonial.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            return (<div key={testimonial.id} className="flex-shrink-0 w-[85vw] md:w-[60%] lg:w-[40%]">
                    <Card className="p-6 md:p-8 h-full bg-card hover:shadow-lg transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.location}
                            </p>
                            <div className="flex gap-0.5 mt-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>
                        </div>

                        <Quote className="h-8 w-8 text-primary/20"/>
                      </div>

                      {/* Quote */}
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        "{testimonial.text}"
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm font-medium text-primary">
                          Project: {testimonial.projectType}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <span>✓</span>
                          Verified Customer
                        </span>
                      </div>
                    </Card>
                  </div>);
        })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button variant="outline" size="icon" onClick={scrollPrev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hidden md:flex">
            <ChevronLeft className="h-5 w-5"/>
          </Button>
          <Button variant="outline" size="icon" onClick={scrollNext} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hidden md:flex">
            <ChevronRight className="h-5 w-5"/>
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (<button key={index} onClick={() => scrollTo(index)} className={`h-2 rounded-full transition-all ${index === selectedIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`}/>))}
        </div>
      </div>
    </section>);
}
