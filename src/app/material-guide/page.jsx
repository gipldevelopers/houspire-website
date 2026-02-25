"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Layers, 
  Check, 
  X, 
  Star, 
  Info, 
  Calculator as CalcIcon, 
  Palette, 
  Droplet,
  ChevronDown,
  ChevronUp,
  Save,
  Share2,
  Maximize2,
  Box,
  Layout,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  PieChart,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MATERIAL_CATEGORIES = [
  { id: 'flooring', name: 'Flooring', icon: Layers },
  { id: 'kitchen', name: 'Kitchen Cabinets', icon: Box },
  { id: 'paint', name: 'Wall Paint', icon: Palette },
  { id: 'furniture', name: 'Furniture Material', icon: LayoutDashboard },
  { id: 'countertop', name: 'Countertops', icon: Layout },
  { id: 'lighting', name: 'Lighting Fixtures', icon: Zap },
  { id: 'window', name: 'Window Treatments', icon: Droplet },
  { id: 'hardware', name: 'Hardware & Fittings', icon: ShieldCheck },
]

const MATERIAL_DATA = {
  flooring: {
    title: "Flooring",
    subtitle: "Foundation of your space - affects both aesthetics and durability",
    tiers: [
      {
        id: 'budget',
        name: 'Budget',
        priceRange: '₹40-80/sq.ft',
        minPrice: 40,
        maxPrice: 80,
        durability: 3,
        aesthetics: 3,
        maintenance: 'Medium',
        warranty: '1-2 years',
        examples: ['Laminate Flooring', 'Vinyl Sheets', 'Ceramic Tiles'],
        color: '#3b82f6',
        pros: ['Highly affordable', 'Quick installation', 'Easy to replace'],
        cons: ['Lower moisture resistance', 'Average lifespan', 'Cannot be refinished'],
        stats: { durability: 60, aesthetics: 50, value: 90, easycare: 70, lifespan: 50 }
      },
      {
        id: 'standard',
        name: 'Standard',
        priceRange: '₹100-180/sq.ft',
        minPrice: 100,
        maxPrice: 180,
        durability: 4,
        aesthetics: 4,
        maintenance: 'Low',
        warranty: '5-10 years',
        examples: ['Vitrified Tiles', 'Engineered wood', 'Porcelain Tiles'],
        color: '#10b981',
        bestFor: 'Family homes, moderate traffic areas',
        pros: ['Good durability', 'Better aesthetics', 'Easy maintenance'],
        cons: ['Higher cost', 'Professional installation needed', 'Limited customization'],
        stats: { durability: 85, aesthetics: 75, value: 70, easycare: 90, lifespan: 80 }
      },
      {
        id: 'premium',
        name: 'Premium',
        priceRange: '₹250-500/sq.ft',
        minPrice: 250,
        maxPrice: 500,
        durability: 5,
        aesthetics: 5,
        maintenance: 'Medium',
        warranty: '15-25 years',
        examples: ['Italian marble', 'Solid hardwood', 'Natural stone'],
        color: '#f59e0b',
        pros: ['Elite aesthetics', 'Extremely durable', 'Adds property value'],
        cons: ['Premium pricing', 'High maintenance', 'Requires expert installation'],
        stats: { durability: 95, aesthetics: 95, value: 50, easycare: 60, lifespan: 95 }
      }
    ],
    roomRecs: [
      { room: 'Living Room', tier: 'Standard', note: 'High traffic needs durability with good aesthetics', badges: ['Durability', 'Easy Clean'] },
      { room: 'Bedroom', tier: 'Budget', note: 'Low traffic, comfort over durability', badges: ['Comfort', 'Warmth'] },
      { room: 'Kitchen', tier: 'Standard', note: 'Needs water resistance and easy cleaning', badges: ['Water Resistant', 'Stain Proof'] },
      { room: 'Bathroom', tier: 'Premium', note: 'Water exposure demands best materials', badges: ['Water Proof', 'Anti-Slip'] },
    ],
    colors: [
      { name: 'Natural', code: '#d1b48c' },
      { name: 'Walnut', code: '#6b4423' },
      { name: 'Grey Ash', code: '#8e9294' },
      { name: 'White Silk', code: '#f5f5f5' },
      { name: 'Beige', code: '#e5d1b5' },
      { name: 'Dark Oak', code: '#3d3d3d' },
      { name: 'Terracotta', code: '#cc6633' },
      { name: 'Sandy', code: '#c2b280' },
    ]
  }
}

export default function MaterialGuidePage() {
  const [activeCategory, setActiveCategory] = useState('flooring')
  const [expandedTier, setExpandedTier] = useState('standard')
  const [area, setArea] = useState(100)
  const [wastage, setWastage] = useState(10)

  const data = MATERIAL_DATA[activeCategory] || MATERIAL_DATA.flooring

  const formatCurrency = (val) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(val))}`

  const calculateCost = (min, max) => {
    const totalArea = area * (1 + wastage / 100)
    return {
      min: totalArea * min,
      max: totalArea * max
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#10263d]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-6">
        <Container>
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-[#10263d] transition-colors text-xs font-black uppercase tracking-widest w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </button>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                  <Layers className="h-7 w-7 text-[#10263d]/40" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-[#10263d] uppercase">Material Guide</h1>
                  <p className="text-sm text-muted-foreground font-semibold mt-0.5">Compare quality tiers across different materials to make informed decisions for your project</p>
                </div>
              </div>
            </div>

            {/* Category Switcher */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {MATERIAL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap border shadow-sm uppercase tracking-widest",
                    activeCategory === cat.id 
                      ? "bg-[#10263d] text-white border-[#10263d]" 
                      : "bg-white text-[#10263d] border-gray-100 hover:border-gray-200"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex flex-col gap-10">
          {/* Category Intro */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-[#10263d] uppercase tracking-tight">{data.title}</h2>
                <p className="text-sm text-muted-foreground font-semibold mt-1">{data.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="rounded-xl bg-[#10263d] text-white font-black text-xs h-10 px-6 shadow-md hover:bg-[#10263d]/90 transition-all uppercase tracking-widest">
                  <Save className="h-4 w-4 mr-2" /> Save Selection
                </Button>
                <Button variant="outline" className="rounded-xl border-gray-200 text-[#10263d] font-black text-xs h-10 px-6 shadow-sm hover:bg-gray-50 transition-all uppercase tracking-widest">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="rounded-xl text-[#10263d] font-black text-xs h-10 px-5 uppercase tracking-widest hover:bg-gray-50">
                  <Sparkles className="h-4 w-4 mr-2 text-indigo-500" /> Filter by Properties
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" className="rounded-xl text-[#10263d] font-black text-xs h-10 px-5 uppercase tracking-widest hover:bg-gray-50">
                   Property Matrix
                </Button>
              </div>
              <div className="flex items-center gap-6 px-4">
                <button className="flex items-center gap-2 text-xs font-black text-[#10263d] hover:text-indigo-600 transition-colors uppercase tracking-widest">
                  <Maximize2 className="h-4 w-4" /> Compare All
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-[#10263d] hover:text-indigo-600 transition-colors uppercase tracking-widest">
                  <ChevronDown className="h-4 w-4" /> Expand All
                </button>
              </div>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {data.tiers.map((tier) => (
              <Card key={tier.id} className={cn(
                "rounded-[2.5rem] border-gray-100 overflow-hidden bg-white hover:shadow-2xl transition-all duration-700 flex flex-col group",
                tier.id === 'standard' && "ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/5 scale-[1.02] z-10"
              )}>
                <div className="p-8 space-y-6 flex-grow">
                  <div className="flex items-center justify-between">
                    <Badge className={cn("rounded-lg px-3 py-1.5 text-[10px] font-black uppercase border-0 tracking-widest", 
                      tier.id === 'budget' && "bg-blue-50 text-blue-600",
                      tier.id === 'standard' && "bg-emerald-50 text-emerald-600",
                      tier.id === 'premium' && "bg-amber-50 text-amber-600"
                    )}>
                      {tier.name} Tier
                    </Badge>
                    <span className="text-sm font-black text-[#10263d] tabular-nums bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">{tier.priceRange}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest group-hover:text-[#10263d] transition-colors">Durability</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < tier.durability ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest group-hover:text-[#10263d] transition-colors">Aesthetics</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < tier.aesthetics ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest group-hover:text-[#10263d] transition-colors">Maintenance</span>
                      <span className="text-xs font-black text-[#10263d] uppercase tracking-wider">{tier.maintenance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest group-hover:text-[#10263d] transition-colors">Warranty</span>
                      <span className="text-xs font-black text-[#10263d] tabular-nums">{tier.warranty}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10263d]/30">Typical Materials</span>
                    <div className="flex flex-wrap gap-2">
                      {tier.examples.map((ex, i) => (
                        <Badge key={i} variant="outline" className="rounded-xl px-3 py-1 text-[10px] font-black border-gray-100 bg-gray-50/50 text-muted-foreground uppercase tracking-wider group-hover:border-[#10263d]/20 transition-all">
                          {ex}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-6">
                   <button 
                    onClick={() => setExpandedTier(expandedTier === tier.id ? '' : tier.id)}
                    className="w-full flex items-center justify-between py-4 border-t border-gray-50 text-[11px] font-black text-[#10263d] hover:text-indigo-600 transition-colors group/btn"
                  >
                    <span className="uppercase tracking-[0.15em]">{expandedTier === tier.id ? 'Collapse Details' : 'Detailed Specifications'}</span>
                    <motion.div animate={{ rotate: expandedTier === tier.id ? 180 : 0 }}>
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedTier === tier.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden space-y-6 pt-2 pb-4"
                      >
                        {tier.bestFor && (
                          <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100/50">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            <span className="text-xs font-black text-emerald-800 uppercase tracking-tight">Ideal for: {tier.bestFor}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-600" /> Key Benefits
                            </h4>
                            <ul className="space-y-3 pl-1">
                              {tier.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-bold text-[#10263d]/70">
                                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0 stroke-[3px]" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-rose-600" /> Trade-offs
                            </h4>
                            <ul className="space-y-3 pl-1">
                              {tier.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-bold text-[#10263d]/70">
                                  <X className="h-4 w-4 text-rose-500 mt-0.5 shrink-0 stroke-[3px]" />
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            ))}
          </div>

          {/* Middle Analysis & Costing */}
          <div className="grid lg:grid-cols-12 gap-8 pt-6">
            {/* Visual Comparison */}
            <Card className="lg:col-span-5 p-10 rounded-[3rem] border-gray-100 shadow-xl bg-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#10263d]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-xs font-black text-[#10263d] text-center mb-10 tracking-[0.2em] uppercase">Value vs. Performance Matrix</h3>
                
                <div className="relative aspect-square flex items-center justify-center max-w-[280px] mx-auto">
                   <div className="absolute inset-0 flex items-center justify-center">
                     <svg width="280" height="280" viewBox="0 0 100 100" className="w-full h-full text-gray-100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />

                        {/* Standard Area - Emerald */}
                        <motion.polygon 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          points="50,15 85,35 80,75 25,75 15,35" 
                          fill="#10b98115" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                        />
                        {/* Budget Area - Blue */}
                        <motion.polygon 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          points="50,35 65,45 60,65 40,65 35,45" 
                          fill="#3b82f615" 
                          stroke="#3b82f6" 
                          strokeWidth="2" 
                        />
                     </svg>
                   </div>
                   
                   <span className="absolute -top-6 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.3em]">Durability</span>
                   <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.3em] rotate-90">Aesthetics</span>
                   <span className="absolute -bottom-6 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.3em]">Easy Care</span>
                   <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.3em] -rotate-90">Lifespan</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 pt-8 border-t border-gray-50">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Budget</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Standard</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Premium</span>
                   </div>
                </div>
            </Card>

            {/* Cost Calculator */}
            <Card className="lg:col-span-7 p-10 rounded-[3rem] border-gray-100 shadow-xl bg-white group/calc">
               <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#10263d] text-white flex items-center justify-center shadow-lg shadow-[#10263d]/20">
                        <CalcIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#10263d] uppercase tracking-widest leading-none mb-1">Live Costing Tool</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Interactive Estimation</p>
                    </div>
                 </div>
                 <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-[#10263d] border border-gray-100 shadow-inner">
                    UNIT: SQ.FT
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black text-[#10263d] uppercase tracking-[0.1em]">Target Area</span>
                        <div className="bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
                           <span className="text-sm font-black text-[#10263d] tabular-nums">{area} ft²</span>
                        </div>
                      </div>
                      <Slider 
                        value={[area]} 
                        onValueChange={(val) => setArea(val[0])}
                        max={2000} 
                        step={10}
                        className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-[3px] [&_[role=slider]]:border-[#10263d] [&_[role=slider]]:shadow-xl"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black text-[#10263d] uppercase tracking-[0.1em]">Wastage Buffer</span>
                        <div className="bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
                           <span className="text-sm font-black text-[#10263d] tabular-nums">{wastage}%</span>
                        </div>
                      </div>
                      <Slider 
                        value={[wastage]} 
                        onValueChange={(val) => setWastage(val[0])}
                        max={20} 
                        step={5}
                        className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-[3px] [&_[role=slider]]:border-[#10263d] [&_[role=slider]]:shadow-xl"
                      />
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                       <div className="flex items-center gap-3">
                          <Info className="h-5 w-5 text-indigo-600 shrink-0" />
                          <p className="text-[11px] text-indigo-900 font-bold uppercase tracking-tight leading-relaxed">
                            Estimates include material + basic installation. High wastage (15-20%) recommended for complex layouts or stone patterns.
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#10263d]/30 block px-2">Estimated Investment</span>
                    <div className="flex flex-col gap-3">
                      {data.tiers.map((tier) => {
                        const costs = calculateCost(tier.minPrice, tier.maxPrice)
                        return (
                          <div key={tier.id} className={cn(
                            "px-6 py-4 rounded-[1.5rem] flex items-center justify-between transition-all border shadow-sm group",
                            tier.id === 'standard' ? "bg-emerald-50/70 border-emerald-200" : "bg-white border-gray-100 hover:border-gray-200"
                          )}>
                            <div className="flex items-center gap-3">
                               <div className={cn("w-3 h-3 rounded-full shadow-sm", 
                                 tier.id === 'budget' && "bg-blue-500",
                                 tier.id === 'standard' && "bg-emerald-500",
                                 tier.id === 'premium' && "bg-amber-500"
                               )} />
                               <span className="text-xs font-black uppercase text-[#10263d] tracking-widest">{tier.name}</span>
                            </div>
                            <div className="flex items-center gap-2 font-black tabular-nums">
                               <span className="text-base text-[#10263d]">{formatCurrency(costs.min)}</span>
                               <span className="text-gray-300 font-normal"> - </span>
                               <span className="text-base text-[#10263d]">{formatCurrency(costs.max)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                 </div>
               </div>
            </Card>
          </div>

          {/* Room Recommendations & Colors */}
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Room Recommendations */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#10263d]/5 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#10263d]" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10263d]/40 leading-none mb-1.5">Contextual Selection</h3>
                    <h4 className="text-xl font-black text-[#10263d] uppercase tracking-tight">Best Use Cases per Space</h4>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 {data.roomRecs.map((rec, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ x: 10, backgroundColor: '#ffffff' }}
                     className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-6 group transition-all hover:shadow-lg"
                   >
                     <div className="flex items-center gap-6 flex-grow">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#10263d] transition-all duration-300 shadow-sm">
                           {rec.room === 'Living Room' && <Layout className="h-6 w-6 text-[#10263d]/40 group-hover:text-white" />}
                           {rec.room === 'Bedroom' && <Zap className="h-6 w-6 text-[#10263d]/40 group-hover:text-white" />}
                           {rec.room === 'Kitchen' && <Layers className="h-6 w-6 text-[#10263d]/40 group-hover:text-white" />}
                           {rec.room === 'Bathroom' && <Droplet className="h-6 w-6 text-[#10263d]/40 group-hover:text-white" />}
                        </div>
                        <div className="space-y-1.5 flex-grow">
                           <div className="flex items-center gap-3">
                             <h4 className="text-base font-black text-[#10263d] uppercase tracking-tight">{rec.room}</h4>
                             <Badge className={cn("rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase border-0 shadow-sm", 
                              rec.tier === 'Budget' && "bg-blue-50 text-blue-600",
                              rec.tier === 'Standard' && "bg-emerald-50 text-emerald-600",
                              rec.tier === 'Premium' && "bg-amber-50 text-amber-600"
                             )}>
                               {rec.tier} Tier
                             </Badge>
                           </div>
                           <p className="text-xs text-muted-foreground font-bold leading-relaxed max-w-xl">{rec.note}</p>
                           <div className="flex flex-wrap gap-3 pt-1">
                              {rec.badges.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 pr-4 border-r last:border-0 border-gray-100">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                  <span className="text-[10px] font-black text-[#10263d]/40 uppercase tracking-widest">{b}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <Button variant="outline" className="rounded-xl h-12 px-8 text-xs font-black uppercase tracking-widest border-gray-100 group-hover:border-[#10263d] group-hover:text-[#10263d] transition-all shrink-0 shadow-sm">
                        Specs <ChevronRight className="h-4 w-4 ml-2" />
                     </Button>
                   </motion.div>
                 ))}
              </div>
            </div>

            {/* Trending Colors */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Palette className="h-6 w-6 text-indigo-500" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10263d]/40 leading-none mb-1.5">Design Curation</h3>
                    <h4 className="text-xl font-black text-[#10263d] uppercase tracking-tight">Trending Finishes</h4>
                 </div>
              </div>

              <Card className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-xl">
                <div className="grid grid-cols-4 gap-6">
                  {data.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                      <div 
                        style={{ backgroundColor: color.code }} 
                        className="w-full aspect-[4/3] rounded-[1.5rem] shadow-sm border border-gray-100 group-hover:scale-105 group-hover:shadow-lg transition-all relative overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                         <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black uppercase text-[#10263d]">{color.code}</span>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-[#10263d]/70 uppercase tracking-[0.2em] truncate w-full text-center">{color.name}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-8 rounded-xl border-gray-100 text-[#10263d] font-black text-[10px] h-10 uppercase tracking-widest hover:bg-gray-50">
                  Browse All 40+ Finishes
                </Button>
              </Card>
            </div>
          </div>

          {/* Expert Recommendation Block */}
          <div className="pt-4 pb-10">
            <Card className="p-12 rounded-[4rem] bg-[#10263d] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.07] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/[0.07] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                   <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center shrink-0 border border-white/20 rotate-3 group-hover:rotate-0 transition-all duration-700">
                      <Sparkles className="h-12 w-12 text-indigo-300" />
                   </div>
                   <div className="flex-grow space-y-4 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4">
                         <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.4em]">Expert Strategy</span>
                         <div className="h-px w-20 bg-white/10" />
                      </div>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-[1.1]">The Smart Interior Decision</h4>
                      <p className="text-base text-white/70 font-medium leading-relaxed max-w-3xl">
                         For 80% of Indian urban homes, we recommend investing in the <span className="text-white font-black underline decoration-emerald-400 decoration-4 underline-offset-8">Standard Tier</span> for flooring and cabinets. It withstands tropical humidity and heavy use while providing the premium look of elite materials. Reserve your budget for focal points like TV units or Master Bedrooms.
                      </p>
                      <button className="text-xs font-black text-indigo-300 uppercase tracking-[0.3em] flex items-center gap-3 pt-6 group/btn hover:text-white transition-all">
                         GET CUSTOMIZED MATERIAL COMBO <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-4 transition-transform stroke-[3px]" />
                      </button>
                   </div>
                </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
