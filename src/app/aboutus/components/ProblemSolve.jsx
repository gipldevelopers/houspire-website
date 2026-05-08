"use client";

import { motion } from "framer-motion";
import { AlertCircle, DollarSign, Eye, Users } from "lucide-react";

const problems = [
  {
    number: "01",
    title: "Quotes that change",
    description:
      "You're shown one number to get you hooked. Another appears after you've signed.",
    icon: DollarSign,
  },
  {
    number: "02",
    title: "Costs you can't explain",
    description:
      "Hidden margins buried in vendor rates you never asked about — and were never told.",
    icon: AlertCircle,
  },
  {
    number: "03",
    title: "Decisions made blind",
    description:
      "You're asked to finalise colours, layouts, and materials before you've ever seen what they'll look like.",
    icon: Eye,
  },
  {
    number: "04",
    title: "Family fights, confusion",
    description:
      "Half the family wants one thing, the other half another — and nobody has a visual to align around.",
    icon: Users,
  },
];

export default function ProblemSolving() {
  return (
    <section
      className="relative overflow-hidden py-8 lg:py-12"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            <span
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              The problem we're solving
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-3 max-w-3xl text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            Why home interiors feel
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}broken
            </span>
          </motion.h2>
          <p
            className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed md:text-base lg:text-lg"
            style={{ color: "var(--color-description)" }}
          >
            The industry is built on confusion. Here's what that looks like for real people.
          </p>
        </div>

        {/* Problems Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, margin: "-30px" }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-1)] p-3.5 md:p-5 transition-all duration-300 hover:shadow-lg">
                {/* Number and Icon Row */}
                <div className="mb-2 flex items-start justify-between">
                  <span
                    className="text-2xl font-black tracking-tighter opacity-20 md:text-3xl"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {problem.number}
                  </span>
                  <div className="rounded-full bg-white p-1.5 shadow-sm">
                    <problem.icon
                      className="h-3 w-3 md:h-4 md:w-4"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-xs font-semibold tracking-tight md:text-base lg:text-lg"
                  style={{ color: "var(--color-heading-secondary)" }}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-1.5 text-[11px] leading-relaxed md:text-sm"
                  style={{ color: "var(--color-description)" }}
                >
                  {problem.description}
                </p>

                {/* Decorative line */}
                <div className="mt-3 h-0.5 w-6 bg-[var(--color-primary)]/20 transition-all duration-300 group-hover:w-12 group-hover:bg-[var(--color-primary)]/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}