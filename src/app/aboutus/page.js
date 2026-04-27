"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import AboutContactCTA from "./components/AboutContactCTA";
import AboutHero from "./components/AboutHero";
import ImageShowcase from "./components/ImageShowcase";
import OurJourney from "./components/OurJourney";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-primary-1)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-[30rem] h-96 w-96 rounded-full bg-[var(--color-secondary-2)]/12 blur-3xl" />
      </div>

      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-1.5 origin-left bg-[var(--color-primary)]"
        style={{ scaleX }}
      />

      <div className="relative pt-8">
        <AboutHero />
        <OurJourney />
        <AboutContactCTA />
        <ImageShowcase />
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-1)] shadow-[0_20px_40px_rgba(236,116,70,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f08a5d]"
        aria-label="Back to top"
      >
        <span className="text-xl">↑</span>
      </motion.button>
    </main>
  );
}
