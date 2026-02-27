"use client";

import AboutHero from "./components/AboutHero";
import ImageShowcase from "./components/ImageShowcase";
// import BrandStory from "./components/BrandStory";
import OurJourney from "./components/OurJourney";
// import KnowledgeSection from "./components/KnowledgeSection";
import AboutContactCTA from "./components/AboutContactCTA";

import { motion, useScroll, useSpring } from "framer-motion";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
      <main className="relative min-h-screen bg-white font-outfit">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-orange z-[100] origin-left"
        style={{ scaleX }}
      />

      
      <div className="pt-8">
        <AboutHero />
        <OurJourney />
        <AboutContactCTA />
        <ImageShowcase />
        {/* <BrandStory /> */}
        {/* <KnowledgeSection /> */}
        
      </div>


      {/* Back to Top */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-soft-black text-white shadow-2xl flex items-center justify-center z-40 hover:bg-primary-orange transition-colors"
      >
        <span className="text-xl">↑</span>
      </motion.button>
      </main>

);
}
