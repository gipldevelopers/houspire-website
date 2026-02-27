"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandStory() {
  return (
    <section id="brand-story" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-soft-black mb-4"
          >
            Crafting Timeless Spaces
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Housepire's talent is its know-how, a capacity that merges culture and knowledge and which, prior to becoming a gesture, is a design idea.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden min-h-[350px] shadow-2xl shadow-black/5"
          >
            <Image 
              src="/images/office.png" 
              alt="Design Studio" 
              fill 
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-soft-black rounded-[2rem] p-10 flex flex-col justify-center text-white shadow-2xl shadow-black/10"
          >
            <h3 className="text-3xl text-white mb-6">Our History</h3>
            <div className="space-y-4 text-slate-300 font-medium leading-relaxed text-sm">
              <p>
                Housepire was founded with a vision to transform the interior design industry. 
                What started as a small team of passionate architects has grown into a modern powerhouse, 
                redefining how people experience their living spaces.
              </p>
              <p>
                Our name symbolizes a shift towards modern elegance, 
                simplicity, and future-forward thinking. We don't just design rooms; 
                we create environments where memories are built.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
