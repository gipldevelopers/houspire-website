"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";

function Counter({ value, suffix = "", prefix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [count, value, isInView]);

  useEffect(() => {
    const unsub = rounded.on("change", (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${latest}${suffix}`;
      }
    });
    return unsub;
  }, [rounded, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
}

const stats = [
  { value: 1, label: "Top In Delivery", suffix: "st" },
  { value: 5, label: "Designs Delivered", suffix: "k+" },
  { value: 72, label: "Avg. Design Time", suffix: "h" },
  { value: 20, label: "Expert Designers", suffix: "+" },
];

export default function ImageShowcase() {
  const images = [
    { src: "/images/living-room.png", alt: "Modern Living Room", className: "aspect-[3/4]" },
    { src: "/images/exterior.png", alt: "Luxury Exterior", className: "aspect-video" },
    { src: "/images/detail.png", alt: "Interior Detail", className: "aspect-[3/4]" },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative">
          {images.map((img, i) => (
            <div key={i} className={`flex flex-col items-center gap-8 ${i === 1 ? "md:-translate-y-12 z-10" : ""}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm w-full ${img.className}`}
              >
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-105" 
                />
              </motion.div>
              
              {i === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full py-4 border-y border-slate-200/60 bg-white/40 backdrop-blur-sm rounded-3xl px-6">
                    {stats.map((s, idx) => (
                      <div key={idx} className="text-center md:text-left">
                        <p className="text-2xl font-black text-soft-black">
                          <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <button className="px-10 py-3.5 bg-primary text-white rounded-full font-bold text-xs tracking-widest transition-all hover:scale-105 hover:shadow-xl shadow-orange-500/20 uppercase">
                      Our Collection
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
