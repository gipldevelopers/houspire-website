"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Target, Heart } from "lucide-react";

const values = [
  {
    title: "Speed",
    desc: "We deliver complete 3D designs in 48-72 hours, not weeks.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Transparency",
    desc: "Fixed pricing and detailed budget breakdowns with zero hidden costs.",
    icon: <Target className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Quality",
    desc: "Every design is vetted by our lead architects for functional excellence.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Empathy",
    desc: "We design spaces that reflect your personality and needs.",
    icon: <Heart className="w-6 h-6" />,
    color: "bg-red-100 text-red-600",
  },
];

export default function Values() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-12">Driven by Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-left hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${v.color}`}>
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
