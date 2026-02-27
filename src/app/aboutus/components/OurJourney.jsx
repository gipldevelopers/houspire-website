"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const milestones = [
  { 
    year: "2021", 
    event: "The Genesis", 
    desc: "Housepire was born from a vision to redefine spatial narratives, beginning as a studio of three visionaries dedicated to craft and architectural precision.",
    image: "/images/detail.png"
  },
  { 
    year: "2022", 
    event: "Expanding Horizons", 
    desc: "Achieved our first 100+ bespoke designs, scaling our reach while maintaining the meticulous attention to detail that defines our brand identity.",
    image: "/images/living-room.png"
  },
  { 
    year: "2023", 
    event: "Technological Edge", 
    desc: "Launched our proprietary 3D visualization platform, an industry-first tool that allows our clients to inhabit their future spaces digitally.",
    image: "/images/office.png"
  },
  { 
    year: "2024", 
    event: "Global Distinction", 
    desc: "Recognized internationally for sustainable innovation and ultra-fast delivery, firmly establishing Housepire as a leader in high-end design.",
    image: "/images/exterior.png"
  },
];

export default function OurJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-12 lg:py-16 bg-slate-50 relative overflow-hidden font-outfit">
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/images/noise.png')]" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary-orange font-bold text-[8px] uppercase tracking-[0.4em] mb-2"
          >
            Evolutionary Curation
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-medium text-soft-black italic font-serif leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Path of <br /> <span className="not-italic">Modern Distinction</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Central Vertical Line Decor - Progress bar style */}
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-slate-200 md:-translate-x-1/2" />
          <motion.div 
            className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-primary-orange md:-translate-x-1/2 origin-top hidden md:block"
            style={{ scaleY }}
          />

          {/* Scrolling Dot */}
          <motion.div 
            className="absolute left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-primary-orange border-[2px] border-white shadow-md z-30 hidden md:block"
            style={{ top: dotTop }}
          />

          <div className="space-y-10 md:space-y-20">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-16 relative ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Visual Connector Node */}
                <div className="absolute left-6 md:left-1/2 top-0 w-2 h-2 bg-primary-orange rounded-full -translate-x-1/2 hidden md:block z-20" />

                {/* Arched Image Side */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex-1 w-full pl-10 md:pl-0"
                >
                  <div className={`relative h-[180px] lg:h-[280px] w-full max-w-[220px] ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} rounded-t-full rounded-b-full overflow-hidden shadow-lg group cursor-crosshair border-[6px] border-white shadow-black/5`}>
                    <Image 
                      src={m.image} 
                      alt={m.event} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-soft-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Year badge on image for mobile */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-md md:hidden">
                       <span className="text-xs font-black text-soft-black tracking-tighter">{m.year}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Text Content Side */}
                <motion.div 
                   initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                   viewport={{ once: true, margin: "-50px" }}
                   className={`flex-1 space-y-3 pl-10 md:pl-0 ${i % 2 === 0 ? 'text-left md:pr-8' : 'text-left md:pl-8 md:text-right'}`}
                >
                  <div className={`flex items-baseline gap-2.5 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <span className="text-4xl md:text-[3rem] lg:text-[4rem] font-medium text-primary-orange/10 font-serif italic leading-[0.8]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {m.year}
                    </span>
                    <div className="h-0.5 w-8 bg-primary-orange/30" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl lg:text-[1.75rem] font-black text-soft-black tracking-tight leading-none uppercase">
                      {m.event}
                    </h3>
                    <div className={`h-1 w-8 bg-primary-orange/20 ${i % 2 === 0 ? '' : 'md:ml-auto'}`} />
                  </div>
                  
                  <p className="text-slate-500 font-medium leading-relaxed max-w-[280px] md:ml-auto md:mr-0 text-[10px] md:text-xs">
                    {m.desc}
                  </p>

                  <div className={`flex ${i % 2 === 0 ? 'justify-start' : 'md:justify-end'}`}>
                     <div className="px-4 py-1 bg-primary text-white rounded-full text-[7px] font-bold shadow-md shadow-black/10 uppercase tracking-[0.2em]">
                        Step 0{i+1}
                     </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
