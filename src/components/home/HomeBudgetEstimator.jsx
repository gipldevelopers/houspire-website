'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Minus, Plus, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CITIES = [
  { name: 'Mumbai', multiplier: 1.35 },
  { name: 'Delhi NCR', multiplier: 1.25 },
  { name: 'Bangalore', multiplier: 1.20 },
  { name: 'Hyderabad', multiplier: 1.0 },
  { name: 'Chennai', multiplier: 1.05 },
  { name: 'Pune', multiplier: 1.10 },
  { name: 'Kolkata', multiplier: 0.95 },
  { name: 'Jaipur', multiplier: 0.90 },
  { name: 'Ahmedabad', multiplier: 0.95 },
  { name: 'Other', multiplier: 1.0 },
];

const BUDGET_LEVELS = [
  { key: 'good', label: 'Good', desc: 'Budget-friendly', multiplier: 0.6 },
  { key: 'better', label: 'Better', desc: 'Balanced quality', multiplier: 1.0 },
  { key: 'best', label: 'Best', desc: 'Premium finishes', multiplier: 1.8 },
];

const CATEGORY_SPLIT = [
  { name: 'Furniture', pct: 35 },
  { name: 'Kitchen', pct: 20 },
  { name: 'Flooring', pct: 15 },
  { name: 'Paint & Decor', pct: 12 },
  { name: 'Lighting', pct: 10 },
  { name: 'Other', pct: 8 },
];

const BASE_COST = 150000;

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    prevRef.current = value;
  }, [value]);

  if (display >= 10000000) return <>{`₹${(display / 10000000).toFixed(1)} Cr`}</>;
  if (display >= 100000) return <>{`₹${(display / 100000).toFixed(1)} L`}</>;
  return <>{`₹${display.toLocaleString('en-IN')}`}</>;
}

export function HomeBudgetEstimator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const router = useRouter();

  const [cityIndex, setCityIndex] = useState(-1);
  const [rooms, setRooms] = useState(3);
  const [budgetLevel, setBudgetLevel] = useState('better');

  const estimate = useMemo(() => {
    if (cityIndex < 0) return null;
    const cityMultiplier = CITIES[cityIndex].multiplier;
    const budgetMultiplier = BUDGET_LEVELS.find(b => b.key === budgetLevel).multiplier;
    const total = rooms * BASE_COST * cityMultiplier * budgetMultiplier;
    return {
      low: Math.round(total * 0.85),
      high: Math.round(total * 1.15),
      city: CITIES[cityIndex].name,
    };
  }, [cityIndex, rooms, budgetLevel]);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-accent/[0.04]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="text-accent font-medium tracking-[0.1em] uppercase text-xs mb-4">
            Budget Estimator
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            How Much Will Your Home Design Cost?
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Get an instant estimate in 10 seconds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-lg"
        >
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* City */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
                <select
                  value={cityIndex}
                  onChange={(e) => setCityIndex(Number(e.target.value))}
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition-colors"
                >
                  <option value={-1}>Select your city</option>
                  {CITIES.map((c, i) => (
                    <option key={c.name} value={i}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rooms */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rooms</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-3xl font-bold text-foreground w-10 text-center">{rooms}</span>
                <button
                  onClick={() => setRooms(Math.min(15, rooms + 1))}
                  className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Budget Level */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Budget Level</label>
              <div className="flex gap-1 bg-muted rounded-xl p-1">
                {BUDGET_LEVELS.map((level) => (
                  <button
                    key={level.key}
                    onClick={() => setBudgetLevel(level.key)}
                    className={`flex-1 py-2.5 px-2 rounded-lg text-center transition-all ${
                      budgetLevel === level.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-sm font-medium block">{level.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${budgetLevel === level.key ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {estimate && (
              <motion.div
                key={`${cityIndex}-${rooms}-${budgetLevel}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border/50 pt-6"
              >
                <p className="text-sm text-muted-foreground text-center mb-2">Estimated budget</p>
                <p className="text-4xl md:text-5xl font-bold text-primary text-center tracking-tight">
                  <AnimatedNumber value={estimate.low} /> — <AnimatedNumber value={estimate.high} />
                </p>

                {/* Category breakdown bar */}
                <div className="mt-6">
                  <div className="flex rounded-full overflow-hidden h-3">
                    {CATEGORY_SPLIT.map((cat, i) => (
                      <motion.div
                        key={cat.name}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.pct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.25, 0.1, 0.25, 1] }}
                        className="bg-accent first:rounded-l-full last:rounded-r-full"
                        style={{ opacity: 1 - i * 0.12 }}
                        title={`${cat.name}: ${cat.pct}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
                    {CATEGORY_SPLIT.map((cat, i) => (
                      <div key={cat.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent" style={{ opacity: 1 - i * 0.12 }} />
                        {cat.name} ({cat.pct}%)
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Based on average 2026 prices in {estimate.city} for {rooms} room{rooms > 1 ? 's' : ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => router.push('/select-package')}
              className="group px-8"
            >
              Get Your Detailed Room-by-Room Breakdown
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Your Home Design Report includes itemized product-level pricing.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
