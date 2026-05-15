"use client";

import { motion } from "framer-motion";

const founders = [
  {
    initial: "A",
    name: "Abhishek",
    lastName: "Khanna",
    role: "Founder & CEO",
    bio: `With 15+ years of experience across interior execution, technology, and design operations, Abhishek Khanna is the tech and systems force powering Houspire’s vision for scalable, modern interiors.\n\nBlending deep expertise in 3D visualization, AI workflows, automation, and execution management, he has helped transform complex interior processes into streamlined, tech-enabled systems that enhance speed, accuracy, and customer experience.\n\nAt Houspire, Abhishek leads the integration of technology with design — building intelligent workflows, automation-driven operations, and scalable systems that allow homeowners, designers, and vendors to collaborate more seamlessly. His focus lies in using technology not just to optimize execution, but to fundamentally redefine how interior design is delivered at scale.`,
    accent: "from-[#EC7446] to-[#f08a5d]",
    avatarBg: "bg-[#EC7446]",
    tag: "Founder · Vision · Strategy",
  },
  {
    initial: "S",
    name: "Saloni",
    lastName: "Narayankar",
    role: "Co-Founder",
    bio: `Saloni Narayankar is the Founder and Principal Designer behind Saloni Narayankar Interiors and the visionary driving the design philosophy of Houspire. With over 14 years of experience in residential and commercial interiors, she is known for creating spaces that are timeless, deeply personal, and effortlessly functional. Her work blends thoughtful design, practical planning, and a strong understanding of how people truly live within their spaces.\n\nAt Houspire, Saloni brings together design expertise and technology to simplify the interior design journey — making beautifully designed homes more accessible, transparent, and seamless for modern homeowners. Her approach focuses on creating spaces that are not just visually striking, but also warm, intuitive, and built around the client’s lifestyle.`,
    website: {
      label: "saloninarayankar.com",
      url: "https://www.saloninarayankar.com/?utm_source=chatgpt.com"
    },
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
      className="relative overflow-hidden py-8 md:py-16 lg:py-20"
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
          className="mb-12 text-center"
        >
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(255,255,255,0.6)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC7446]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#EC7446]">
              Our Story
            </span>
          </div>
          <h2
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-8"
            style={{ color: "var(--color-heading-main)" }}
          >
            Why we built <span style={{ color: "var(--color-heading-main-highlight)" }}>Houspire</span>
          </h2>
          
          <div className="mx-auto max-w-4xl space-y-6 text-base leading-relaxed md:text-lg lg:text-xl" style={{ color: "var(--color-description)" }}>
            <p className="font-semibold" style={{ color: "var(--color-heading-main)" }}>
              We saw homeowners committing ₹10–50 lakh renovation decisions based on imagination, pressure, and incomplete information.
            </p>
            
            <div className="flex flex-col gap-1 md:flex-row md:justify-center md:gap-8 lg:gap-12 text-sm md:text-base font-bold uppercase tracking-wide">
              <span className="text-[#EC7446]">The industry profits from confusion.</span>
              <span className="text-[#EC7446]">Contractors profit from execution.</span>
              <span className="text-[#EC7446]">Homeowners carry the risk.</span>
            </div>

            <div className="pt-4">
              <p>So we built something different:</p>
              <p className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-heading-main)" }}>
                a planning platform designed entirely around the homeowner.
              </p>
            </div>
          </div>
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
                  className="text-sm leading-[1.8] md:text-base whitespace-pre-line"
                  style={{ color: "var(--color-description)" }}
                >
                  {founder.bio}
                  {founder.website && (
                    <span className="block mt-4">
                      <a
                        href={founder.website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EC7446] hover:underline font-medium"
                      >
                        {founder.website.label}
                      </a>
                    </span>
                  )}
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

          <div className="space-y-6 text-base leading-[1.9] md:text-lg" style={{ color: "var(--color-description)" }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              viewport={{ once: true }}
            >
              Alongside our founders, Houspire is powered by a growing network of experienced interior designers who thoughtfully craft every space with care and precision. Every plan that leaves our platform is personally designed by a real professional — never generated from a generic template.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25 }}
              viewport={{ once: true }}
            >
              We believe every home deserves human insight, creativity, and attention to detail, which is why each design is approached with the same care as if it were their own.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto my-12 h-px w-20 origin-center bg-gradient-to-r from-transparent via-[#EC7446]/40 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h4 className="text-xl font-bold md:text-2xl mb-2" style={{ color: "var(--color-heading-main)" }}>
              AI gives you speed. Designers make it worth living in.
            </h4>
            <p className="text-base md:text-lg italic" style={{ color: "var(--color-description)" }}>
              Technology helps us move faster. <br className="hidden md:block" />
              Real designers ensure every home still feels personal, thoughtful, and human.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
