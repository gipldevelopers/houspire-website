'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ChevronDown } from 'lucide-react';

const ease = [0.25, 0.46, 0.45, 0.94];
const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai'];
const budgetLevels = [
  { key: 'good', label: 'Good', desc: 'Budget-friendly' },
  { key: 'better', label: 'Better', desc: 'Balanced quality' },
  { key: 'best', label: 'Best', desc: 'Premium finishes' },
];

export function BudgetEstimatorSection() {
  const [city, setCity] = useState('');
  const [rooms, setRooms] = useState(3);
  const [level, setLevel] = useState('better');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <section id="budget-estimator" className="bg-white py-[40px] md:py-[60px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold tracking-[0.04em] uppercase text-[#6E6E73] mb-3">Budget Estimator</p>
          <h2 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.025em] leading-[1.07] text-[#1D1D1F]">
            How much will your home design cost?
          </h2>
          <p className="text-[21px] text-[#6E6E73] leading-[1.38] mt-2">Get an instant estimate in 10 seconds.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-[700px] mx-auto bg-white rounded-[20px] p-8 md:p-12"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          {/* City dropdown */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">City</label>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#D2D2D7] rounded-xl text-[17px] text-left hover:border-[#86868B] transition-colors"
              >
                <span className={city ? 'text-[#1D1D1F]' : 'text-[#86868B]'}>
                  {city || 'Select your city'}
                </span>
                <ChevronDown className={`w-5 h-5 text-[#86868B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#D2D2D7] rounded-xl overflow-hidden z-10 shadow-lg">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCity(c); setIsOpen(false); }}
                      className="w-full text-left px-4 py-3 text-[17px] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Room count */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Rooms</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-11 h-11 rounded-full border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
              >
                <Minus className="w-5 h-5 text-[#1D1D1F]" />
              </button>
              <span className="text-[28px] font-bold text-[#1D1D1F] w-12 text-center">{rooms}</span>
              <button
                onClick={() => setRooms(Math.min(15, rooms + 1))}
                className="w-11 h-11 rounded-full border border-[#D2D2D7] flex items-center justify-center hover:bg-[#F5F5F7] transition-colors"
              >
                <Plus className="w-5 h-5 text-[#1D1D1F]" />
              </button>
            </div>
          </div>

          {/* Budget level */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Budget level</label>
            <div className="grid grid-cols-3 gap-2">
              {budgetLevels.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setLevel(b.key)}
                  className={`py-3 px-2 rounded-xl text-center transition-all duration-200 ${
                    level === b.key
                      ? 'bg-[#E8662E] text-white'
                      : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]'
                  }`}
                >
                  <span className="block text-[15px] font-semibold">{b.label}</span>
                  <span className={`block text-xs mt-0.5 ${level === b.key ? 'text-white/70' : 'text-[#86868B]'}`}>
                    {b.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push('/budget-calculator')}
            className="w-full py-3.5 text-[17px] text-white bg-[#E8662E] hover:bg-[#D45A1F] rounded-full transition-all duration-300"
          >
            Get Your Detailed Room-by-Room Breakdown →
          </button>

          <p className="text-xs text-[#86868B] text-center mt-4">
            Your Home Design Report includes itemized product-level pricing.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
