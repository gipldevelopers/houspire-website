'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94];

const testimonials = [
  {
    stars: 5,
    quote: 'We were about to sign with a designer who quoted ₹3.5 lakhs. Got Houspire\'s report for ₹6,999 and realized we were being overcharged on almost every line item. Saved us over ₹1.2 lakhs.',
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
];

export function TestimonialsSectionHome() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef(null);

  const minSwipeDistance = 50;

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 8 seconds
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 5000);
      return;
    }
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
    if (!isLeftSwipe && !isRightSwipe) {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    };
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-16 h-[420px] w-[420px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/6 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-6"
        >
          <p className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#6E6E73] mb-3">
            What Homeowners Say
          </p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            200+ homes transformed.
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#6E6E73] max-w-2xl mx-auto">
            Real reviews from homeowners who used Houspire to plan, budget, and execute their interiors.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 flex flex-col border border-black/5 shadow-[0_12px_40px_rgba(16,24,40,0.08)] hover:shadow-[0_18px_60px_rgba(16,24,40,0.12)] transition-shadow"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
              <p className="text-[16px] text-[#1D1D1F] leading-[1.65] flex-1">
                <span className="text-[#6E6E73]">“</span>
                {t.quote}
                <span className="text-[#6E6E73]">”</span>
              </p>
              <div className="border-t border-[#E5E5E5] pt-4 mt-6 flex items-start justify-between gap-4">
                <p className="text-[15px] font-semibold text-[#1D1D1F]">{t.name}</p>
                <p className="text-[14px] text-[#6E6E73]">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative">
          <div
            className="overflow-hidden relative rounded-3xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white rounded-3xl p-7 flex flex-col border border-black/5 shadow-[0_12px_40px_rgba(16,24,40,0.08)]"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonials[currentIndex].stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
                <p className="text-[16px] text-[#1D1D1F] leading-[1.65] flex-1">
                  <span className="text-[#6E6E73]">“</span>
                  {testimonials[currentIndex].quote}
                  <span className="text-[#6E6E73]">”</span>
                </p>
                <div className="border-t border-[#E5E5E5] pt-4 mt-6">
                  <p className="text-[15px] font-semibold text-[#1D1D1F]">{testimonials[currentIndex].name}</p>
                  <p className="text-[14px] text-[#6E6E73]">{testimonials[currentIndex].location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === currentIndex
                    ? 'w-4 h-2 bg-[#E8662E]'
                    : 'w-2 h-2 bg-[#E5E5E5] hover:bg-[#D0D0D0]'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
