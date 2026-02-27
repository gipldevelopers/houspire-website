"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutContactCTA() {
  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative min-h-[500px] rounded-[3rem] overflow-hidden bg-[rgb(23,15,15)] flex items-center">
          {/* Subtle Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('/images/noise.png')]" />
          
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-10 md:px-20 py-20">
            {/* Left Content */}
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-6xl md:text-8xl font-medium tracking-tight text-white/95 leading-[0.9] italic font-serif"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  The Great <br /> 
                  <span className="not-italic">Unconformity</span>
                </motion.h2>

                <div className="flex items-center gap-6 pt-4">
                  <div className="h-px w-12 bg-white/20" />
                  <p className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                    A Tectonic Shift in Culture and Aesthetics predicted for 2025
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  href="/contact" 
                  className="inline-block px-12 py-5 bg-primary text-white rounded-full font-bold text-sm tracking-widest transition-all hover:scale-105 hover:bg-white hover:text-black shadow-2xl shadow-orange-500/20"
                >
                  Discover the Insights
                </Link>
              </motion.div>
            </div>

            {/* Right Artistic Arch Layout */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[400px] flex items-center justify-center lg:justify-end gap-3 md:gap-4 overflow-hidden"
            >
              {[0.1, 0.2, 0.3, 0.2, 0.1].map((delay, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  whileInView={{ height: idx === 2 ? '100%' : idx % 2 === 0 ? '70%' : '85%' }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-12 md:w-16 h-full rounded-full overflow-hidden border border-white/5"
                >
                  <div className="absolute inset-0 w-[500px] h-[400px] -left-[200px]">
                    <Image 
                      src="/images/detail.png" 
                      alt="Aesthetic detail" 
                      fill 
                      className="object-cover"
                      style={{ 
                        objectPosition: `${idx * 20}% center`,
                        filter: 'contrast(1.1) saturate(0.8) brightness(0.9)' 
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-soft-black/20 mix-blend-multiply" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Background Decorative Arches (Subtle) */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 border-[40px] border-white/[0.02] rounded-full pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-white/[0.03] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
