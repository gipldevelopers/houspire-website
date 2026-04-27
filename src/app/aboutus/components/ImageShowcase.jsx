"use client";

import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
    { src: "/images/living-room.png", alt: "Modern living room", className: "aspect-[3/4]" },
    { src: "/images/exterior.png", alt: "Luxury exterior", className: "aspect-video" },
    { src: "/images/detail.png", alt: "Interior detail", className: "aspect-[3/4]" },
  ];

  return (
    <section
      id="gallery"
      className="relative overflow-hidden py-16"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              Visual Language
            </span>
          </div>
          <h2
            className="mx-auto mt-5 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            The same warm palette,
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}now carried across About Us
            </span>
            .
          </h2>
        </div>

        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {images.map((img, i) => (
            <div key={img.alt} className={`flex flex-col items-center gap-8 ${i === 1 ? "z-10 md:-translate-y-12" : ""}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative w-full overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[0_20px_50px_rgba(30,42,56,0.08)] ${img.className}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(30,42,56,0.12))]" />
              </motion.div>

              {i === 1 && (
                <>
                  <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 rounded-[2rem] border border-[var(--color-border)] bg-white/70 px-6 py-5 shadow-sm backdrop-blur-sm">
                    {stats.map((s) => (
                      <div key={s.label} className="text-center md:text-left">
                        <p className="text-2xl font-bold" style={{ color: "var(--color-heading-main)" }}>
                          <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c8378]">
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
                    <Link href="/discover" className="btn-primary btn-lg">
                      View the gallery
                    </Link>
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
