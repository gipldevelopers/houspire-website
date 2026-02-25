"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Home,
  Layers,
  Paintbrush,
  Sofa,
  Zap,
  Droplets,
  ShieldCheck,
  AlertCircle,
  Info,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const HOME_TYPES = [
  { id: '1bhk', label: '1 BHK', sqft: '400–600 sq.ft' },
  { id: '2bhk', label: '2 BHK', sqft: '600–1000 sq.ft' },
  { id: '3bhk', label: '3 BHK', sqft: '1000–1500 sq.ft' },
  { id: '4bhk', label: '4 BHK+', sqft: '1500+ sq.ft' },
]

const SCOPE_ITEMS = [
  { id: 'flooring', label: 'Flooring', icon: Layers, weeks: 1 },
  { id: 'painting', label: 'Painting', icon: Paintbrush, weeks: 1 },
  { id: 'furniture', label: 'Furniture & Joinery', icon: Sofa, weeks: 3 },
  { id: 'electrical', label: 'Electrical', icon: Zap, weeks: 1 },
  { id: 'plumbing', label: 'Plumbing', icon: Droplets, weeks: 1 },
  { id: 'false_ceiling', label: 'False Ceiling', icon: Home, weeks: 1.5 },
  { id: 'civil', label: 'Civil / Demo', icon: Wrench, weeks: 2 },
  { id: 'smart_home', label: 'Smart Home', icon: ShieldCheck, weeks: 1 },
]

const COMPLEXITY_LEVELS = [
  { id: 'basic', label: 'Basic', desc: 'Standard finishes, minimal customisation', multiplier: 1 },
  { id: 'moderate', label: 'Moderate', desc: 'Mix of custom and standard elements', multiplier: 1.25 },
  { id: 'premium', label: 'Premium', desc: 'High-end finishes, full customisation', multiplier: 1.5 },
]

const PHASES = [
  { id: 'design', name: 'Design & Planning', icon: Sparkles, color: 'indigo', description: 'Concept, mood boards, 3D visuals, drawing approval.', weeksBase: 2, isFixed: true },
  { id: 'procurement', name: 'Material Procurement', icon: Layers, color: 'amber', description: 'Sourcing, ordering, and delivery of all materials.', weeksBase: 2, isFixed: true },
  { id: 'civil', name: 'Civil & Structural', icon: Wrench, color: 'rose', description: 'Demolition, masonry, tiling, false ceiling.', weeksBase: 0, isFixed: false, scopeIds: ['civil', 'flooring', 'false_ceiling'] },
  { id: 'mep', name: 'MEP (Elec / Plumb)', icon: Zap, color: 'emerald', description: 'Electrical, plumbing, HVAC, smart-home infra.', weeksBase: 0, isFixed: false, scopeIds: ['electrical', 'plumbing', 'smart_home'] },
  { id: 'finishes', name: 'Painting & Finishes', icon: Paintbrush, color: 'sky', description: 'Primer, paint, textures, polishing.', weeksBase: 0, isFixed: false, scopeIds: ['painting'] },
  { id: 'furniture', name: 'Furniture & Joinery', icon: Sofa, color: 'violet', description: 'Kitchen, wardrobes, TV units, custom pieces.', weeksBase: 0, isFixed: false, scopeIds: ['furniture'] },
  { id: 'handover', name: 'Snagging & Handover', icon: CheckCircle2, color: 'teal', description: 'QC checks, touch-ups, cleaning, walkthrough.', weeksBase: 1, isFixed: true },
]

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  bar: 'bg-amber-500' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   bar: 'bg-rose-500' },
  emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',bar: 'bg-emerald-500' },
  sky:    { bg: 'bg-sky-50',    text: 'text-sky-600',    bar: 'bg-sky-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-500' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   bar: 'bg-teal-500' },
}

export default function TimelineEstimatorPage() {
  const [homeType, setHomeType] = useState('2bhk')
  const [selectedScope, setSelectedScope] = useState(['flooring', 'painting', 'furniture', 'electrical'])
  const [complexity, setComplexity] = useState('moderate')

  const toggleScope = (id) =>
    setSelectedScope(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])

  const estimate = useMemo(() => {
    const comp = COMPLEXITY_LEVELS.find(c => c.id === complexity)
    const phases = PHASES.map(phase => {
      let weeks = phase.weeksBase
      if (!phase.isFixed && phase.scopeIds) {
        weeks += phase.scopeIds.reduce((acc, sid) => {
          if (!selectedScope.includes(sid)) return acc
          const item = SCOPE_ITEMS.find(s => s.id === sid)
          return acc + (item?.weeks ?? 0)
        }, 0)
      }
      weeks = Math.ceil(weeks * comp.multiplier)
      return { ...phase, weeks }
    }).filter(p => p.weeks > 0)

    const totalWeeks = Math.max(phases.reduce((a, p) => a + p.weeks, 0), 4)
    return { phases, totalWeeks }
  }, [homeType, selectedScope, complexity])

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + estimate.totalWeeks * 7)
  const fmt = (d) => d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#10263d]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-5">
        <Container>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-[#10263d] transition-colors text-xs font-black uppercase tracking-widest w-fit"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Tools
            </button>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                <Clock className="h-5 w-5 text-[#10263d]/40" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#10263d] uppercase leading-none">Timeline Estimator</h1>
                <p className="text-xs text-muted-foreground font-semibold mt-1">Estimate project duration by home size, scope & finish quality</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-7">
        <div className="flex flex-col gap-7">

          {/* Steps + Result: side by side on large screens */}
          <div className="grid lg:grid-cols-12 gap-6">

            {/* Left: 3 steps */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* Step 1 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10263d] text-white text-[10px] font-black flex items-center justify-center">1</div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#10263d]/30">Step One</p>
                    <h2 className="text-sm font-black text-[#10263d] uppercase tracking-tight leading-none">Home Type</h2>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {HOME_TYPES.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setHomeType(h.id)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3.5 rounded-xl border transition-all text-left",
                        homeType === h.id
                          ? "bg-[#10263d] text-white border-[#10263d] shadow-lg"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      )}
                    >
                      <Home className={cn("h-4 w-4", homeType === h.id ? "text-white/50" : "text-[#10263d]/25")} />
                      <span className="text-xs font-black uppercase tracking-wide mt-0.5">{h.label}</span>
                      <span className={cn("text-[9px] font-bold", homeType === h.id ? "text-white/40" : "text-muted-foreground")}>{h.sqft}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Step 2 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10263d] text-white text-[10px] font-black flex items-center justify-center">2</div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#10263d]/30">Step Two</p>
                    <h2 className="text-sm font-black text-[#10263d] uppercase tracking-tight leading-none">Work Scope</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SCOPE_ITEMS.map(item => {
                    const active = selectedScope.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleScope(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all group",
                          active ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all",
                          active ? "bg-indigo-600 text-white" : "bg-gray-50 text-[#10263d]/25 group-hover:bg-gray-100"
                        )}>
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className={cn("text-[10px] font-black uppercase tracking-wide truncate", active ? "text-indigo-800" : "text-[#10263d]")}>{item.label}</p>
                          <p className={cn("text-[9px] font-bold", active ? "text-indigo-400" : "text-muted-foreground")}>+{item.weeks}w</p>
                        </div>
                        {active && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Step 3 */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10263d] text-white text-[10px] font-black flex items-center justify-center">3</div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#10263d]/30">Step Three</p>
                    <h2 className="text-sm font-black text-[#10263d] uppercase tracking-tight leading-none">Complexity</h2>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-2.5">
                  {COMPLEXITY_LEVELS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setComplexity(c.id)}
                      className={cn(
                        "flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all",
                        complexity === c.id
                          ? "bg-[#10263d] text-white border-[#10263d] shadow-lg"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black uppercase tracking-wide">{c.label}</span>
                        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md",
                          complexity === c.id ? "bg-white/10 text-white/60" : "bg-gray-50 text-muted-foreground"
                        )}>×{c.multiplier}</span>
                      </div>
                      <p className={cn("text-[10px] font-semibold leading-relaxed", complexity === c.id ? "text-white/50" : "text-muted-foreground")}>{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Result */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Duration Card */}
              <Card className="p-6 rounded-2xl bg-[#10263d] text-white shadow-xl border-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Estimated Duration</p>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-6xl font-black tabular-nums leading-none">{estimate.totalWeeks}</span>
                    <div className="pb-1.5">
                      <p className="text-sm font-black text-white/50 leading-none">weeks</p>
                      <p className="text-[10px] text-white/25 font-bold mt-1">≈ {Math.round(estimate.totalWeeks / 4.33)} months</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/35">Finish by</span>
                      <span className="text-[10px] font-black text-white/70 flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmt(endDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/35">Home</span>
                      <span className="text-[10px] font-black text-white/70">{HOME_TYPES.find(h => h.id === homeType)?.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/35">Complexity</span>
                      <span className="text-[10px] font-black text-white/70 capitalize">{complexity}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-indigo-300 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-white/40 font-bold leading-relaxed">Parallel phases can reduce total time by ~20%.</p>
                  </div>
                </div>
              </Card>

              {/* Phase Breakdown */}
              <Card className="p-5 rounded-2xl border-gray-100 shadow-sm bg-white flex-grow">
                <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-[#10263d]/25 mb-4">Phase Breakdown</h3>
                <div className="flex flex-col gap-3">
                  {estimate.phases.map((phase, i) => {
                    const colors = COLOR_MAP[phase.color]
                    const widthPct = Math.round((phase.weeks / estimate.totalWeeks) * 100)
                    return (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-5 h-5 rounded-md flex items-center justify-center", colors.bg)}>
                              <phase.icon className={cn("h-3 w-3", colors.text)} />
                            </div>
                            <span className="text-[10px] font-black text-[#10263d] uppercase tracking-wide">{phase.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-[#10263d] tabular-nums">{phase.weeks}w</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                            className={cn("h-full rounded-full", colors.bar)}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>

          {/* Tips Row */}
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { icon: TrendingUp, title: 'Start Early', tip: 'Book your designer 4–6 weeks before your desired start date to lock approvals and material lead times.' },
              { icon: Users, title: 'Dedicated Site Team', tip: 'Projects with a dedicated site supervisor complete 15–25% faster due to fewer coordination delays.' },
              { icon: AlertCircle, title: 'Add Buffer Time', tip: 'Always add 10–15% buffer. Material delays and approval cycles are common in Indian projects.' },
            ].map((t, i) => (
              <Card key={i} className="p-4 rounded-xl border-gray-100 bg-white hover:shadow-md transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10263d]/5 flex items-center justify-center shrink-0 group-hover:bg-[#10263d] transition-all duration-300">
                    <t.icon className="h-4 w-4 text-[#10263d]/35 group-hover:text-white transition-all" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-[#10263d] uppercase tracking-widest mb-1">{t.title}</h4>
                    <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">{t.tip}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="p-7 rounded-2xl bg-[#10263d] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.07] rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Clock className="h-7 w-7 text-indigo-300" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.4em]">Ready to Begin?</span>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mt-1 mb-1.5">Get a Precise Timeline From Our Design Team</h4>
                <p className="text-xs text-white/50 font-medium max-w-xl">Our designers create a detailed, week-by-week project schedule tailored to your home — for free.</p>
              </div>
              <button className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white transition-all whitespace-nowrap shrink-0 group">
                Book Free Consultation <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform stroke-[3px]" />
              </button>
            </div>
          </Card>

        </div>
      </Container>
    </div>
  )
}
