"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section
      className="relative flex min-h-[85vh] items-center overflow-hidden pt-16"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--color-primary)]/8 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[var(--color-secondary-2)]/8 blur-3xl" />
      </div>

      {/* Corner images — bottom corners */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="pointer-events-none absolute -bottom-8 -left-12 z-0 h-56 w-56 overflow-hidden rounded-full border border-[var(--color-border)] opacity-25 md:h-72 md:w-72 lg:h-80 lg:w-80"
      >
        <Image src="/images/living-room.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--color-primary-1)", opacity: 0.4 }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.65 }}
        className="pointer-events-none absolute -bottom-8 -right-12 z-0 h-56 w-56 overflow-hidden rounded-full border border-[var(--color-border)] opacity-25 md:h-72 md:w-72 lg:h-80 lg:w-80"
      >
        <Image src="/images/exterior.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--color-primary-1)", opacity: 0.4 }} />
      </motion.div>

      {/* Corner images — top corners, behind everything */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="pointer-events-none absolute -top-12 -left-12 z-0 h-56 w-56 overflow-hidden rounded-full border border-[var(--color-border)] opacity-25 md:h-72 md:w-72 lg:h-80 lg:w-80"
      >
        <Image src="/images/living-room.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--color-primary-1)", opacity: 0.4 }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.65 }}
        className="pointer-events-none absolute -top-12 -right-12 z-0 h-56 w-56 overflow-hidden rounded-full border border-[var(--color-border)] opacity-25 md:h-72 md:w-72 lg:h-80 lg:w-80"
      >
        <Image src="/images/exterior.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--color-primary-1)", opacity: 0.4 }} />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">

          {/* Left — copy, takes all remaining space */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
              style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.7)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--color-primary)" }}>
                About Houspire
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: "var(--color-heading-main)" }}
            >
              You spend <span style={{ color: "var(--color-heading-main-highlight)" }}>lakhs</span> on home interiors before you even know what your home will look like.
            </h1>

            {/* Sub-copy */}
            <p
              className="mt-4 text-sm leading-relaxed md:text-base"
              style={{ color: "var(--color-description)" }}
            >
              Houspire helps homeowners visualize, plan, and budget their entire home before
              execution begins with no hidden designer commissions, contractor bias, or pricing games.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#journey" className="btn-primary gap-2">
                <Sparkles className="h-4 w-4" />
                Explore our story
              </Link>
              <Link href="/contact" className="btn-secondary gap-2">
                Talk to our team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right — price card, fixed width */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0"
          >
            <div
              className="overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_16px_48px_rgba(30,42,56,0.10)]"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="h-1 w-full bg-gradient-to-r from-[#EC7446] to-[#f08a5d]" />
              <div className="p-6 md:p-7">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--color-primary)" }}>
                  Flat price. No surprises.
                </p>
                <span className="text-5xl font-black tracking-tight" style={{ color: "var(--color-heading-main)" }}>
                  ₹4,999
                </span>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--color-description)" }}>
                  For what the industry charges{" "}
                  <span className="font-semibold" style={{ color: "var(--color-heading-main)" }}>
                    ₹50,000–₹5,00,000
                  </span>
                  . Flat. No markups. No surprises.
                </p>

                <div className="my-4 h-px w-full" style={{ backgroundColor: "var(--color-border)" }} />

                {["No hidden costs", "No kickbacks", "No pressure", "100% money-back guarantee"].map((point) => (
                  <div key={point} className="mb-2 flex items-center gap-2.5">
                    <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-sm" style={{ color: "var(--color-description)" }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
