"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const milestones = [
  {
    year: "2021",
    event: "The Genesis",
    desc: "Houspire started with a simple premise: homeowners should see clear design direction before money and execution start pulling in different directions.",
    image: "/images/detail.png",
  },
  {
    year: "2022",
    event: "Expanding Horizons",
    desc: "We scaled our reach while staying obsessive about clarity, building a process that keeps design, budget, and execution tied together.",
    image: "/images/living-room.png",
  },
  {
    year: "2023",
    event: "Technological Edge",
    desc: "Visualization and planning tools became central to our workflow so clients could understand their future spaces faster and with fewer surprises.",
    image: "/images/office.png",
  },
  {
    year: "2024",
    event: "Built for Real Homes",
    desc: "The focus sharpened around speed, transparency, and practical execution, bringing the same promise you see across the home page into every project.",
    image: "/images/exterior.png",
  },
];

export default function OurJourney() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative overflow-hidden py-6 lg:py-10"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-background" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              Our Journey
            </span>
          </motion.div> */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mx-auto mt-5 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            Built around
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}speed, clarity, and execution
            </span>
            .
          </motion.h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--color-description)" }}
          >
            The visuals have evolved, but the core idea has stayed the same:
            design should help people move forward with confidence.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 hidden w-px bg-[var(--color-border)] md:left-1/2 md:block md:-translate-x-1/2" />
          <motion.div
            className="absolute left-6 top-0 bottom-0 hidden w-px origin-top md:left-1/2 md:block md:-translate-x-1/2"
            style={{ backgroundColor: "var(--color-primary)", scaleY }}
          />
          <motion.div
            className="absolute left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white shadow-md md:block"
            style={{ backgroundColor: "var(--color-primary)", top: dotTop }}
          />

          <div className="space-y-8 md:space-y-12">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex flex-col gap-6 md:flex-row md:items-center md:gap-12 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
              >
                <div
                  className="absolute left-6 top-10 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white shadow-sm md:left-1/2 md:block"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex-1"
                >
                  <div className={`relative h-[240px] w-full max-w-[280px] overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[0_24px_60px_rgba(30,42,56,0.08)] ${i % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                    <Image src={m.image} alt={m.event} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(30,42,56,0.16))]" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] shadow-sm" style={{ color: "var(--color-primary)" }}>
                      {m.year}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex-1"
                >
                  <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-primary-1)] p-6 shadow-sm md:p-8">
                    <div className={`flex items-center gap-3 ${i % 2 === 0 ? "" : "md:justify-end"}`}>
                      <span
                        className="text-sm font-black uppercase tracking-[0.2em]"
                        style={{ color: "var(--color-primary)" }}
                      >
                        Step 0{i + 1}
                      </span>
                      <span className="h-px w-10 bg-[var(--color-primary)]/30" />
                    </div>

                    <h3
                      className={`mt-5 text-2xl font-semibold tracking-tight ${i % 2 === 0 ? "text-left" : "text-left md:text-right"}`}
                      style={{ color: "var(--color-heading-secondary)" }}
                    >
                      {m.event}
                    </h3>

                    <p
                      className={`mt-4 text-base leading-relaxed ${i % 2 === 0 ? "text-left" : "text-left md:text-right"}`}
                      style={{ color: "var(--color-description)" }}
                    >
                      {m.desc}
                    </p>
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
