'use client';

import { motion, useInView } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { value: 72, suffix: 'h', label: 'Delivery Time', description: 'Average turnaround' },
  { value: 15, suffix: '+', label: 'Design Styles', description: 'Curated aesthetics' },
  { value: 25, suffix: '+', label: 'Cities Served', description: 'Across India' },
  { value: 100, suffix: '%', label: 'Money-Back', description: 'If we miss our deadline' },
];

function AnimatedNumber({ value, suffix, inView }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [inView, value]);
  
  return (
    <span className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <section ref={ref} className="py-20 md:py-28 bg-foreground text-background">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            What We Deliver
          </h2>
          <p className="text-background/70 max-w-xl mx-auto">
            Professional design intelligence for Indian homeowners.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-lg font-medium text-background mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-background/60">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
