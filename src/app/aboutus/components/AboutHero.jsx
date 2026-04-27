"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function AboutHero() {
  const archedImages = [
    { src: "/images/living-room.png", alt: "Living room design", delay: 0.1 },
    { src: "/images/detail.png", alt: "Material detail", delay: 0.2 },
    { src: "/images/office.png", alt: "Office space", delay: 0.3 },
    { src: "/images/exterior.png", alt: "Architectural exterior", delay: 0.4 },
  ];

  return (
    <section
      className="relative overflow-hidden pb-6 pt-14 md:pt-20"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-[var(--color-secondary-2)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_rgba(236,116,70,0.45)]" />
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              About Houspire
            </span>
          </div> */}

          <h1
            className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            Elevate your living with
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}design clarity{" "}
            </span>
            that feels personal.
          </h1>

          {/* <p
            className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed md:text-l"
            style={{ color: "var(--color-description)" }}
          >
            We help homeowners make faster, smarter design decisions with the
            same mix of visual clarity, budget awareness, and execution focus
            that drives the home page.
          </p> */}

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex -space-x-3 items-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm"
                >
                  <Image src="/images/detail.png" alt="Customer" fill className="object-cover" />
                </div>
              ))}
              <div className="pl-5 text-left">
                <div className="flex gap-0.5" style={{ color: "var(--color-primary)" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8c8378]">
                  Trusted by 5k+ homeowners
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="#journey" className="btn-primary btn-lg gap-2">
              <Sparkles className="h-5 w-5" />
              Explore our story
            </Link>
            <Link href="/contact" className="btn-secondary btn-lg gap-2">
              Talk to our team
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-[420px] grid-cols-2 items-center gap-x-8 gap-y-12 md:mt-16 md:max-w-none md:grid-cols-4 md:gap-6">
          {archedImages.map((img, i) => (
            <motion.div
              key={img.alt}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{
                opacity: 1,
                y: i === 1 || i === 2 ? [-20, -40] : [0, 10],
               }}
               viewport={{ once: true }}
               transition={{ delay: img.delay, duration: 0.8 }}
              className="group relative mx-auto aspect-square w-full max-w-[210px] md:max-w-[260px]"
            >
              <div className="absolute -inset-3 rounded-full bg-[var(--color-primary)]/8 blur-2xl" />
              <div className="relative h-full w-full overflow-hidden rounded-full border border-[var(--color-border)] bg-white shadow-[0_20px_50px_rgba(30,42,56,0.08)] transition-transform duration-500 group-hover:-translate-y-2">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(30,42,56,0.12))]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
