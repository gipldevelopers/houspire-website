"use client"

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { BudgetCalculator } from '@/components/calculator/BudgetCalculator'
import { Calculator, Sparkles, ShieldCheck, Clock } from 'lucide-react'

export default function BudgetCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section - Compact Premium Light Theme */}
      <div className="relative pt-24 pb-12 overflow-hidden bg-white">
        {/* Advanced Background Design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] bg-primary/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#10263d]/5 rounded-full blur-[120px]" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" 
            style={{ backgroundImage: 'radial-gradient(#10263d 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} 
          />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 bg-primary/5 px-3 py-1 rounded-full text-[10px] font-bold text-primary mb-6 border border-primary/10 shadow-sm"
            >
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </div>
              Instant Interior Estimator
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-[#10263d] tracking-tight mb-5 leading-[1.1]"
            >
              Plan Your Dream Home <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Within Your Budget</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
            >
              Get a personalized cost estimate for your interiors in less than 60 seconds. Our algorithm uses real-time market rates and material trends.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
            >
              {[
                { icon: Sparkles, label: "Transparent", desc: "No hidden costs" },
                { icon: ShieldCheck, label: "Detailed BOQ", desc: "Itemized list" },
                { icon: Clock, label: "Instant", desc: "Live updates" },
                { icon: Calculator, label: "98.5% Accuracy", desc: "Market rates" },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/50 hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-primary/5">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#10263d]">
                      {item.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-bold opacity-60">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Main Calculator Section */}
      <div className="relative -mt-12 pb-24">
        <BudgetCalculator />
      </div>

      {/* Trust Quote Section */}
      <div className="bg-white py-16 border-t border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1 text-primary">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="text-xl">★</span>
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground italic">
              "The budget calculator helped us plan our 3BHK effortlessly. The final quotes were surprisingly close to our initial estimate!"
            </h2>
            <div>
              <p className="font-bold text-foreground">Siddharth & Ananya</p>
              <p className="text-sm text-muted-foreground font-medium">Prestige Falcon City Residents</p>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer CTA */}
      <div className="bg-[#10263d] py-20 text-white">
        <Container>
          <div className="bg-primary/10 rounded-3xl p-8 md:p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
              <p className="text-white/60 font-medium">Book a free design consultation today and get ₹10,000 off on your project! No commitment required.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-[#10263d] font-black text-sm uppercase tracking-widest transition-all">
                Book Consultation
              </button>
              <button className="px-8 py-4 rounded-full border-2 border-white/20 hover:bg-white/5 font-bold text-sm transition-all">
                View Portfolio
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
