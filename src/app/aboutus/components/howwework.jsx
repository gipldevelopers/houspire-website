"use client";

import { motion } from "framer-motion";
import {
  Home,
  Layout,
  Palette,
  Clock,
  Shield,
  Handshake,
  ArrowRight,
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
            Planning-first platform.
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}No execution. No bias.
            </span>
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
            <p
              className="text-base leading-relaxed md:text-lg lg:text-xl"
              style={{ color: "var(--color-description)" }}
            >
              Houspire is a planning-first platform. We don't execute your
              renovation. We don't sign contractors. We don't earn a rupee in
              referral commissions. What we do is give your entire family a
              photorealistic 3D render of your actual home — your exact layout,
              your chosen style — so everyone is looking at the same picture
              before a single decision is made. No arguments about "what it'll
              look like." No last-minute regrets. No middleman with a margin to
              protect.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
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

        {/* Features Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, margin: "-30px" }}
              className="group relative"
            >
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative rounded-xl border border-[var(--color-border)] bg-white p-5 transition-all duration-300 hover:shadow-md md:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--color-primary)]/20">
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h3
                  className="mb-0 text-lg font-semibold tracking-tight md:text-xl"
                  style={{ color: "var(--color-heading-secondary)" }}
                >
                  {feature.title}
                </h3>
                {/* <p
                  className="text-sm leading-relaxed md:text-base"
                  style={{ color: "var(--color-description)" }}
                >
                  {feature.description}
                </p> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}