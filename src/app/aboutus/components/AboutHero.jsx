"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function AboutHero() {
  const archedImages = [
    { src: "/images/living-room.png", alt: "Living Room Design", delay: 0.1 },
    { src: "/images/detail.png", alt: "Material Detail", delay: 0.2 },
    { src: "/images/office.png", alt: "Office Space", delay: 0.3 },
    { src: "/images/exterior.png", alt: "Architectural Exterior", delay: 0.4 },
  ];

  return (
    <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-5"
        >
          <h1 className="text-2xl md:text-6xl font-bold leading-[1.1] tracking-tight" style={{ color: 'var(--color-heading-main)' }}>
            Elevate Your <span className="relative inline-block">
              Living
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewBox="0 0 100 20"
                className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-4 md:h-8 pointer-events-none fill-none stroke-[3] stroke-current stroke-round"
                style={{ color: 'var(--color-primary)' }}
                preserveAspectRatio="none"
              >
                <path d="M5 15 Q 50 18 95 15" />
              </motion.svg>
            </span> <br /> 
            and Achieve Your Dreams
          </h1>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden relative shadow-sm">
                  <Image src="/images/detail.png" alt="User" fill className="object-cover" />
                </div>
              ))}
              <div className="pl-3 md:pl-5 flex flex-col items-start gap-0.5">
                <div className="flex gap-0.5" style={{ color: 'var(--color-primary)' }}>
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} fill="currentColor" />)}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Trusted by 5k+ Homeowners
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 md:pt-4">
            <Link 
              href="#work" 
              className="btn-primary inline-flex items-center px-10 py-4 text-white rounded-full font-bold text-xs tracking-widest transition-all hover:scale-105 shadow-xl shadow-black/5"
            >
              Explore Our Work
            </Link>
          </div>
        </motion.div>

        {/* Arched Images Row - FIXED MOBILE OVERLAP */}
        <div className="mt-16 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 md:gap-6 items-center relative max-w-[400px] md:max-w-none mx-auto">
          {archedImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ 
                opacity: 1, 
                // Desktop: Keep perfect -40/10
                // Mobile: Smaller offset to prevent text collision
                y: (i === 1 || i === 2) 
                  ? [ -20, -40 ] 
                  : [ 0, 10 ] 
              }}
              viewport={{ once: true }}
              transition={{ delay: img.delay, duration: 0.8 }}
              /* 1. aspect-[2/3] forces them to be tall capsules, not circles.
                2. max-w-[140px] ensures they don't grow too wide on big phones.
              */
              className="relative w-full aspect-[2/3] md:h-[320px] mx-auto group"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-50 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}