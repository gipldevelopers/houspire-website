"use client";

import { motion } from "framer-motion";

export default function TeamBehind() {
  return (
    <section
      className="relative overflow-hidden py-4 md:py-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#EC7446]/6 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#2C5A52]/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Dark card */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-[2rem] bg-[#1E2A38] px-10 py-6 md:px-16 md:py-10 shadow-[0_30px_80px_rgba(30,42,56,0.18)]"
        >
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(236,116,70,0.10),transparent)]" />

          <div className="relative z-10 mx-auto max-w-7xl text-center">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#EC7446]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#EC7446]">
                The team behind every home
              </span>
            </motion.div>

            {/* Body copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-base leading-[1.9] text-white/70 md:text-lg"
            >
              Alongside our founders, Houspire works with a growing community of experienced
              interior designers — each one manually crafting every plan that leaves our platform.
              Your home isn't processed by a template. It's thought through by a real designer who
              treats your space like their own.
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mx-auto my-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#EC7446]/50 to-transparent"
            />

            {/* Closing line — styled as a quote */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-base font-medium italic leading-relaxed text-white/90 md:text-lg"
            >
              "The AI helps us move at the speed you need. The human behind it ensures the result
              is worth living in."
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
