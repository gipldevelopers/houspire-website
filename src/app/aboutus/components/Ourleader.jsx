"use client";

import { motion } from "framer-motion";

const founders = [
  {
    initial: "A",
    name: "Abhishek",
    lastName: "[Last Name]",
    role: "Co-Founder & CEO",
    bio: "Abhishek's bio goes here — his background, what led him to start Houspire, and what he believes about the Indian renovation market.",
    accent: "from-[#EC7446] to-[#f08a5d]",
    avatarBg: "bg-[#EC7446]",
    tag: "Founder · Vision · Strategy",
  },
  {
    initial: "S",
    name: "Saloni",
    lastName: "[Last Name]",
    role: "Co-Founder & [Role]",
    bio: "Saloni's bio goes here — her design background, what she brings to the product, and her perspective on how homeowners deserve to be treated.",
    accent: "from-[#2C5A52] to-[#3D6E70]",
    avatarBg: "bg-[#2C5A52]",
    tag: "Founder · Design · Product",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function MeetFounders() {
  return (
    <section
      className="relative overflow-hidden py-6 md:py-12"
      style={{ backgroundColor: "var(--color-primary-1)" }}
    >
      {/* Subtle background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#EC7446]/6 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-[#2C5A52]/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-10xl px-6">

        {/* ── FOUNDERS HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6 text-center"
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.6)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC7446]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#EC7446]">
              Meet the founders
            </span>
          </div>
          <h2
            className="text-3xl font-bold tracking-tight md:text-5xl"
            style={{ color: "var(--color-heading-main)" }}
          >
            Built by people who{" "}
            <span style={{ color: "var(--color-heading-main-highlight)" }}>care deeply</span>
          </h2>
        </motion.div>

        {/* ── FOUNDER CARDS ── */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.initial}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative overflow-hidden rounded-[1.75rem] border bg-white shadow-[0_8px_40px_rgba(30,42,56,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(30,42,56,0.12)]"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* Top accent bar */}
              <div className={`h-0.5 w-full bg-gradient-to-r ${founder.accent}`} />

              <div className="p-8">
                {/* Avatar + name */}
                <div className="mb-6 flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${founder.avatarBg} shadow-lg`}
                  >
                    <span className="text-3xl font-black text-white">{founder.initial}</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                  </motion.div>

                  <div>
                    <h3
                      className="text-lg font-bold tracking-tight md:text-xl"
                      style={{ color: "var(--color-heading-main)" }}
                    >
                      {founder.name}{" "}
                      <span
                        className="font-normal"
                        style={{ color: "var(--color-heading-main)", opacity: 0.35 }}
                      >
                        {founder.lastName}
                      </span>
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-[#EC7446]">{founder.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {founder.tag.split(" · ").map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: "var(--color-secondary-1)",
                            color: "var(--color-heading-main)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-5 h-px w-full" style={{ backgroundColor: "var(--color-border)" }} />

                {/* Bio */}
                <p
                  className="text-sm leading-[1.8] md:text-base"
                  style={{ color: "var(--color-description)" }}
                >
                  {founder.bio}
                </p>

                {/* Hover sweep line */}
                <div
                  className={`mt-6 h-px w-0 rounded-full bg-gradient-to-r ${founder.accent} transition-all duration-500 group-hover:w-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── DIVIDER ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="my-6 h-px w-full origin-left"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* ── TEAM BEHIND EVERY HOME ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-60px" }}
          className=""
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.6)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC7446]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#EC7446]">
              The team behind every home
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-base leading-[1.9] md:text-lg"
            style={{ color: "var(--color-description)" }}
          >
            Alongside our founders, Houspire works with a growing community of experienced interior
            designers — each one manually crafting every plan that leaves our platform. Your home
            isn't processed by a template. It's thought through by a real designer who treats your
            space like their own.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto my-8 h-px w-20 origin-center bg-gradient-to-r from-transparent via-[#EC7446]/40 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-base font-medium italic leading-relaxed md:text-lg"
            style={{ color: "var(--color-heading-main)" }}
          >
            "The AI helps us move at the speed you need. The human behind it ensures the result is
            worth living in."
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}
