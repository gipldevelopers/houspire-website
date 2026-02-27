"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function KnowledgeSection() {
  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative mb-4 group">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[32/9] rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl shadow-black/5"
          >
            <Image 
              src="/images/living-room.png" 
              alt="Interior knowledge" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </motion.div>

          {/* Text Overlay Box */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="absolute top-0 left-0 bg-white p-5 md:p-6 rounded-br-[2rem] max-w-[220px] md:max-w-[260px] border-r border-b border-slate-100 shadow-xl"
          >
            <h2 className="text-xl md:text-2xl font-black text-soft-black mb-1">
              Our Knowledge
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed text-[8px] md:text-[10px]">
              Housepire&apos;s strength is its expertise, combining culture and knowledge to form design ideas before bringing them to life.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer"
          >
            <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg">
              <Image src="/images/detail.png" alt="Day System" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              {/* Overlay Label */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-5 md:p-6">
                <h4 className="text-sm md:text-lg font-black text-white leading-tight">
                  Art Of The <br /> Day System
                </h4>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative group cursor-pointer"
          >
            <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg">
              <Image src="/images/office.png" alt="Night System" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              {/* Overlay Label */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-5 md:p-6">
                <h4 className="text-sm md:text-lg font-black text-white leading-tight">
                  Art Of The <br /> Night System
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
