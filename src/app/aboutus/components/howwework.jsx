"use client";

import { motion } from "framer-motion";
import {
  Home,
  Layout,
  Palette,
  Clock,
  Shield,
  Handshake,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Home,
    title: "Photorealistic 3D renders",
    description: "See exactly what your home will look like before you spend a rupee",
  },
  {
    icon: Layout,
    title: "Your actual layout",
    description: "Not a generic showroom — your real rooms, your real dimensions",
  },
  {
    icon: Palette,
    title: "20 design styles",
    description: "Curated Indian and global styles that match your taste",
  },
  {
    icon: Clock,
    title: "72-hour delivery",
    description: "Get your complete plan faster than you thought possible",
  },
  {
    icon: Shield,
    title: "Zero execution bias",
    description: "We don't execute. We don't push vendors. Pure planning.",
  },
  {
    icon: Handshake,
    title: "No referral commissions",
    description: "Not a rupee. Our advice is 100% in your interest.",
  },
];

export default function HowWeWork() {
  return (
    <section
      className="relative overflow-hidden py-4 lg:py-6"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-96 w-96 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[var(--color-secondary-2)]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-10xl px-6">
        {/* Section Header */}
        <div className="mb-4 text-center lg:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/70 px-5 py-2 shadow-sm backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(236,116,70,0.5)]" />
            <span
              className="text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              How we work
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-6 max-w-4xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            We are <span style={{ color: "var(--color-heading-main-highlight)" }}>not</span> an interior execution company.
          </motion.h2>
        </div>

        {/* Main Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/50 backdrop-blur-sm shadow-lg lg:mb-6"
        >
          <div className="p-6 md:p-8 lg:p-10">
            <div
              className="text-base leading-relaxed md:text-lg lg:text-xl space-y-4"
              style={{ color: "var(--color-description)" }}
            >
              <div className="space-y-1">
                <p>We don’t profit from contractor commissions.</p>
                <p>We don’t push vendors.</p>
                <p>We don’t inflate budgets to protect margins.</p>
              </div>
              
              <div className="pt-4 border-t border-[var(--color-border)]/50">
                <p className="font-semibold" style={{ color: "var(--color-heading-main)" }}>We exist for one reason:</p>
                <p>to help homeowners make confident decisions before execution begins.</p>
              </div>

              {/* Comparison Table */}
              <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white/30 backdrop-blur-sm">
                <div className="grid grid-cols-2 bg-[var(--color-primary)]/5">
                  <div className="px-4 py-3 text-xs font-black uppercase tracking-wider md:px-6 md:text-sm" style={{ color: "var(--color-heading-main)" }}>
                    Traditional Interior Firms
                  </div>
                  <div className="px-4 py-3 text-xs font-black uppercase tracking-wider md:px-6 md:text-sm" style={{ color: "var(--color-primary)" }}>
                    Houspire
                  </div>
                </div>
                <div className="divide-y divide-[var(--color-border)]/50">
                  {[
                    ["Earn from execution", "Earn from planning"],
                    ["Hidden vendor margins", "Transparent pricing"],
                    ["Push preferred vendors", "Homeowner chooses"],
                    ["Design first, budget later", "Budget clarity upfront"],
                    ["Locked ecosystem", "Flexible execution"]
                  ].map(([trad, hous], i) => (
                    <div key={i} className="grid grid-cols-2 transition-colors hover:bg-white/40">
                      <div className="px-4 py-3 text-sm md:px-6 md:text-base" style={{ color: "var(--color-description)" }}>
                        {trad}
                      </div>
                      <div className="px-4 py-3 text-sm font-semibold md:px-6 md:text-base" style={{ color: "var(--color-heading-main)" }}>
                        {hous}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Choose from 20 curated Indian and global design styles", "Receive your complete plan within 72 hours", "Walk into every vendor conversation with full clarity — and never get taken advantage of again"].map((text, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm md:text-sm"
                  style={{ color: "var(--color-primary)" }}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benefits and Deliverables Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            
            {/* Left — Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:pl-8 lg:pl-12"
            >
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: "var(--color-heading-main)" }}>
                What changes after Houspire
              </h3>
              <div className="space-y-4">
                {[
                  "Your family sees the same vision",
                  "You know realistic budgets before execution",
                  "You walk into vendor meetings informed",
                  "You avoid expensive mid-project mistakes",
                  "You compare contractors with confidence"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                      <CheckCircle className="h-4 w-4" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <span className="text-base md:text-lg" style={{ color: "var(--color-description)" }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Deliverables Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-sm font-black uppercase tracking-[0.2em] opacity-60" style={{ color: "var(--color-primary)" }}>
                Deliverables
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { title: "renders", icon: Layout },
                  { title: "layout planning", icon: Home },
                  { title: "style selection", icon: Palette },
                  { title: "budgeting", icon: Shield },
                  { title: "vendor guidance", icon: Handshake }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4 text-center transition-all duration-300 hover:shadow-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                      <item.icon className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                    </div>
                    <span className="text-sm font-semibold capitalize" style={{ color: "var(--color-heading-secondary)" }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}