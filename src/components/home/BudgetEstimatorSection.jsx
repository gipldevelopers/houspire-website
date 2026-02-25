'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ChevronDown, Calculator, Zap } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94];
const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'];
const budgetLevels = [
  { key: 'good', label: 'Good', desc: 'Essential' },
  { key: 'better', label: 'Better', desc: 'Premium' },
  { key: 'best', label: 'Best', desc: 'Luxury' },
];

export function BudgetEstimatorSection() {
  const [city, setCity] = useState('');
  const [rooms, setRooms] = useState(3);
  const [level, setLevel] = useState('better');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section id="budget-estimator" className="bg-[#fdfdfd] py-16">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
          
          {/* LEFT: ANIMATED INPUTS */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8662E]/10 text-[#E8662E] text-[10px] font-bold uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3 fill-current" />
                <span>Smart Calc</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                Estimate your cost.
              </h2>
            </motion.div>

            {/* City Selection */}
            <motion.div variants={itemVariants} className="relative">
              <label className="text-[11px] font-bold uppercase text-[#86868B] mb-2 block">City</label>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border-b-2 border-[#D2D2D7] py-3 text-xl transition-all hover:border-[#E8662E] group"
              >
                <span className={city ? 'text-[#1D1D1F]' : 'text-[#D2D2D7]'}>
                  {city || 'Select Location'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E8662E]' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#F5F5F7] rounded-xl shadow-2xl z-50 p-2 grid grid-cols-2 gap-1"
                  >
                    {cities.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCity(c); setIsOpen(false); }}
                        className="text-left px-4 py-2 rounded-lg text-sm hover:bg-[#F5F5F7] transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Room Count */}
            <motion.div variants={itemVariants} className="flex items-center justify-between bg-[#F5F5F7] p-4 rounded-2xl">
              <div>
                <span className="block text-sm font-bold text-[#1D1D1F]">Number of Rooms</span>
                <span className="text-xs text-[#86868B]">Project Scope</span>
              </div>
              <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-xl shadow-sm">
                <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="hover:scale-110 transition-transform"><Minus className="w-4 h-4" /></button>
                <span className="text-xl font-black min-w-[24px] text-center">{rooms}</span>
                <button onClick={() => setRooms(Math.min(15, rooms + 1))} className="hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></button>
              </div>
            </motion.div>

            {/* Quality Level */}
            <motion.div variants={itemVariants}>
              <label className="text-[11px] font-bold uppercase text-[#86868B] mb-3 block">Material Grade</label>
              <div className="flex gap-2">
                {budgetLevels.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setLevel(b.key)}
                    className="relative flex-1 py-3 px-2 rounded-xl text-center group overflow-hidden"
                  >
                    <div className={`absolute inset-0 transition-colors duration-300 ${level === b.key ? 'bg-[#E8662E]' : 'bg-[#F5F5F7] group-hover:bg-[#E8E8ED]'}`} />
                    <span className={`relative block text-xs font-bold transition-colors ${level === b.key ? 'text-white' : 'text-[#1D1D1F]'}`}>{b.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: THE SUMMARY BOX (Small & Elevated) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:w-[320px] bg-[#1D1D1F] rounded-[32px] p-8 text-white flex flex-col justify-between relative overflow-hidden"
          >
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8662E] blur-[80px] opacity-20" />
            
            <div className="relative">
              <Calculator className="w-8 h-8 text-[#E8662E] mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-white/50 text-xs">Project Summary</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{rooms} Rooms</p>
                  <p className="text-sm text-white/60">{city || 'Location Pending'}</p>
                </div>
                <div className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest text-[#E8662E]">
                  {level} Quality
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/budget-calculator')}
              className="relative w-full py-4 bg-[#E8662E] text-white font-bold rounded-2xl shadow-lg shadow-[#E8662E]/20 mt-8 overflow-hidden"
            >
              Get Detailed Quote
            </motion.button>/
          </motion.div>

        </div>
      </div>
    </section>
  );
}