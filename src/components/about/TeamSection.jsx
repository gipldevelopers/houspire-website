"use client";

import { motion } from "framer-motion";

export default function MeetFounders() {
  const founders = [
    {
      name: "ABHISHEK SHARMA",
      role: "CEO",
      bio: "Watched his own family get ripped off. Started Houspire to kill opaque pricing. Believes Indian renovation doesn't need more contractors — it needs honest planning.",
    },
    {
      name: "SALONI MEHTA",
      role: "DESIGN HEAD",
      bio: "A decade in Mumbai & Delhi. Saw designers forced to prioritize vendor margins over client dreams. Built Houspire's process to kill the guessing game.",
    },
  ];

  return (
    <section
      className="border-y border-[var(--color-border)]"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header - single line */}
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--color-border)] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono" style={{ color: "var(--color-primary)" }}>
              ⬤
            </span>
            <span
              className="text-[9px] font-mono font-bold tracking-[0.2em]"
              style={{ color: "var(--color-primary)" }}
            >
              MEET THE FOUNDERS
            </span>
          </div>
          <span
            className="text-[9px] font-mono tracking-wide"
            style={{ color: "var(--color-description)" }}
          >
            NO VC ● BOOTSTRAPPED ● INDIAN
          </span>
        </div>

        {/* Founders - side by side with divider */}
        <div className="grid grid-cols-2 gap-0">
          {founders.map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`py-3 ${idx === 0 ? "pr-4 border-r border-[var(--color-border)]" : "pl-4"}`}
            >
              {/* Name and role - same line */}
              <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
                <span
                  className="text-[11px] font-black tracking-tight"
                  style={{ color: "var(--color-heading-secondary)" }}
                >
                  {founder.name}
                </span>
                <span
                  className="text-[8px] font-mono font-bold tracking-[0.15em]"
                  style={{ color: "var(--color-primary)" }}
                >
                  {founder.role}
                </span>
              </div>

              {/* Bio - dense */}
              <p
                className="text-[11px] leading-[1.3] tracking-tight"
                style={{ color: "var(--color-description)" }}
              >
                {founder.bio}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer line */}
        <div className="mt-3 pt-2 border-t border-[var(--color-border)] flex justify-between">
          <span className="text-[8px] font-mono" style={{ color: "var(--color-primary)" }}>
            ●
          </span>
          <span
            className="text-[8px] font-mono tracking-[0.15em]"
            style={{ color: "var(--color-description)" }}
          >
            BUILT FOR HOMEOWNERS ● BY HOMEOWNERS
          </span>
          <span className="text-[8px] font-mono" style={{ color: "var(--color-primary)" }}>
            ●
          </span>
        </div>
      </div>
    </section>
  );
}