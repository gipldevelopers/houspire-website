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
      className="relative overflow-hidden py-4 lg:py-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="relative mx-auto max-w-10xl px-6">
        {/* Section Header */}
        <div className="mb-6 text-center">
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
              The problem we're solving
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-6 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            Why home interiors feel
            <span style={{ color: "var(--color-heading-main-highlight)" }}>
              {" "}broken
            </span>
          </motion.h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--color-description)" }}
          >
            The industry is built on confusion. Here's what that looks like for real people.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-1)] p-6 transition-all duration-300 hover:shadow-xl md:p-8">
                {/* Number and Icon Row */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-4xl font-black tracking-tighter opacity-20 md:text-5xl"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {problem.number}
                  </span>
                  <div className="rounded-full bg-white p-2 shadow-sm">
                    <problem.icon
                      className="h-5 w-5 md:h-6 md:w-6"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="mt-4 text-xl font-semibold tracking-tight md:text-2xl"
                  style={{ color: "var(--color-heading-secondary)" }}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-3 text-base leading-relaxed md:text-lg"
                  style={{ color: "var(--color-description)" }}
                >
                  {problem.description}
                </p>

                {/* Decorative line */}
                <div className="mt-5 h-0.5 w-12 bg-[var(--color-primary)]/20 transition-all duration-300 group-hover:w-20 group-hover:bg-[var(--color-primary)]/40" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional: Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          
        </motion.div>
      </div>
    </section>
  );
}