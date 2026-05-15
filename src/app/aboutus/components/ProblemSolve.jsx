"use client";

import { motion } from "framer-motion";
import { AlertCircle, DollarSign, Eye, Users } from "lucide-react";

const problems = [
  {
    number: "01",
    title: "Quotes that keep changing",
    points: [
      "You approve one number to get started.",
      "Then new costs, upgrades, and “unexpected” expenses slowly start appearing once work begins.",
    ], 
    icon: DollarSign,
  },
  {
    number: "02",
    title: "You’re forced to trust blindly",
    description: "Most homeowners don’t really know:",
    points: [
      "if materials are overpriced",
      "if the budget is realistic",
      "or whether they’re being pushed toward choices that benefit someone else",
    ],
    afterText: "So you’re left depending entirely on the designer or vendor to guide every major decision",
    icon: AlertCircle,
  },
  {
    number: "03",
    title: "Decisions made without clarity",
    points: [
      "You’re expected to finalise colours, layouts, finishes, and materials before you’ve actually seen your home come together realistically.",
      "You spend lakhs based on imagination.",
    ],
    icon: Eye,
  },
  {
    number: "04",
    title: "Everyone imagines the home differently",
    points: [
      "One person wants modern.",
      "Another wants warmth.",
      "Someone else is worried about budget.",
    ],
    afterText:"Without a clear visual plan, small disagreements quickly become stressful and emotional.",
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

        {/* Problems Grid — Slider on mobile, 4 cols desktop */}
        <div className="relative group/slider">
          <div className="flex gap-4 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar lg:grid lg:grid-cols-4 lg:gap-4 lg:pb-0">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-30px" }}
                className="group relative min-w-[75vw] snap-center md:min-w-full"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-primary-1)] p-5 transition-all duration-300 hover:shadow-lg">
                  {/* Number and Icon Row */}
                  <div className="mb-2 flex items-start justify-between">
                    <span
                      className="text-2xl font-black tracking-tighter opacity-20 md:text-3xl"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {problem.number}
                    </span>
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      <problem.icon
                        className="h-4 w-4"
                        style={{ color: "var(--color-primary)" }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-semibold tracking-tight md:text-lg lg:text-xl"
                    style={{ color: "var(--color-heading-secondary)" }}
                  >
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <div
                    className="mt-3 text-sm leading-relaxed md:text-base"
                    style={{ color: "var(--color-description)" }}
                  >
                    <p>{problem.description}</p>
                    {problem.points && (
                      <ul className="mt-3 space-y-2 list-disc list-outside ml-4">
                        {problem.points.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {problem.afterText && (
                      <p className="mt-3 font-medium" style={{ color: "var(--color-heading-main)" }}>{problem.afterText}</p>
                    )}
                  </div>

                  {/* Decorative line */}
                  <div className="mt-4 h-0.5 w-8 bg-[var(--color-primary)]/20 transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--color-primary)]/40" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Progress Bar (Mobile Only) */}
          <div className="mt-4 px-6 md:hidden">
            <div className="h-0.5 w-full bg-[var(--color-primary)]/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--color-primary)]"
                initial={{ width: "25%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-2 text-[10px] text-center uppercase tracking-widest opacity-40" style={{ color: 'var(--color-description)' }}>Swipe to see more</p>
          </div>
        </div>
      </div>
    </section>
  );
}