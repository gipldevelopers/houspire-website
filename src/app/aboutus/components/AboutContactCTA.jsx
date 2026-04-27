"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AboutContactCTA() {
  return (
    <section
      className="relative overflow-hidden py-10"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#0c0c0e] shadow-[0_30px_100px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,_rgba(236,116,70,0.08),_transparent_34%)]" />
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('/images/noise.png')]" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-6 px-8 py-10 md:px-14 lg:grid-cols-2 lg:px-20 lg:py-12">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  Next Step
                </span>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-[#fffaf3] md:text-4xl"
              >
                Ready to plan your home with more clarity?
              </motion.h2>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
                If the home page promise resonates, this is where we help you
                turn that direction into something visual, budget-aware, and
                ready for execution.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  href="/style-quiz"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-9 text-base font-semibold text-white shadow-[0_20px_40px_rgba(236,116,70,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f08a5d] hover:border-[#f08a5d]"
                >
                  Design my home now
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-transparent px-9 text-base font-semibold text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03] hover:text-white"
                >
                  Contact our team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex h-[360px] items-center justify-center gap-3 overflow-hidden md:h-[420px] lg:justify-end"
            >
              {[0, 1, 2, 3, 4].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  whileInView={{ height: idx === 2 ? "100%" : idx % 2 === 0 ? "72%" : "86%" }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full w-12 overflow-hidden rounded-full border border-white/8 bg-white/[0.02] md:w-16"
                >
                  <div className="absolute inset-0">
                    <Image
                      src="/images/detail.png"
                      alt="Design detail"
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: `${idx * 20}% center`,
                        filter: "contrast(1.05) saturate(0.85) brightness(0.92)",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(12,12,14,0.3))]" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
