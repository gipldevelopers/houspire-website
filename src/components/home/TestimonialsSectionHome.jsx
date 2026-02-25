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

  const minSwipeDistance = 50;

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
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
      setTimeout(() => setIsAutoPlaying(true), 5000);
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
      setTimeout(() => setIsAutoPlaying(true), 5000);
    }
  };

  return (
    <section ref={ref} className="bg-white py-[40px] md:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12"
        >
          <p className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#6E6E73] mb-3">
            What Homeowners Say
          </p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            200+ homes transformed.
          </h2>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 max-w-[1060px] mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 flex flex-col"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
              <p className="text-[16px] text-[#1D1D1F] leading-[1.6] italic flex-1">
                "{t.quote}"
              </p>
              <div className="border-t border-[#E5E5E5] pt-4 mt-5">
                <p className="text-[15px] font-semibold text-[#1D1D1F]">{t.name}</p>
                <p className="text-[14px] text-[#6E6E73]">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative px-12">
          <div
            className="overflow-hidden relative rounded-2xl"
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
                className="bg-white rounded-2xl p-8 flex flex-col"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonials[currentIndex].stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
                <p className="text-[16px] text-[#1D1D1F] leading-[1.6] italic flex-1">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="border-t border-[#E5E5E5] pt-4 mt-5">
                  <p className="text-[15px] font-semibold text-[#1D1D1F]">{testimonials[currentIndex].name}</p>
                  <p className="text-[14px] text-[#6E6E73]">{testimonials[currentIndex].location}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 z-10 flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-[#1D1D1F]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 z-10 flex items-center justify-center transition-all duration-200 active:scale-95"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-[#1D1D1F]" />
          </button>

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
