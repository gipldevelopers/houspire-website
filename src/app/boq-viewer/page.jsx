"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  ArrowLeft,
  PieChart,
  List,
  Zap, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2,
  Box,
  Palette,
  HardHat,
  Gem,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_BOQ_DATA = {
  projectName: "Standard Interior BOQ",
  clientName: "Houspire Client",
  date: "Feb 23, 2026",
  total: 485000,
  categories: [
    { name: "Furniture", color: "#10263d", icon: Box },
    { name: "Wall & Floor Finishes", color: "#4f46e5", icon: Palette },
    { name: "Lighting & Electrical", color: "#f59e0b", icon: Zap },
    { name: "Accessories & Decor", color: "#10b981", icon: Gem },
    { name: "Labor & Installation", color: "#dc2626", icon: HardHat }
  ],
  items: [
    // Bedroom Items
    { id: '1', name: "Queen Size Bed with Storage", category: "Furniture", room: "bedroom", rate: 45000, quantity: 1, unit: "No.", specification: "Engineered wood with laminate finish", imageUrl: "https://images.unsplash.com/photo-1505693419148-ad30b0a2a8da?auto=format&fit=crop&w=150&q=80", showAlternatives: true },
    { id: '2', name: "Bedside Tables", category: "Furniture", room: "bedroom", rate: 8000, quantity: 2, unit: "No.", specification: "Matching laminate finish with drawer", imageUrl: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=150&q=80" },
    { id: '3', name: "Wardrobe (8ft x 7ft)", category: "Furniture", room: "bedroom", rate: 85000, quantity: 1, unit: "No.", specification: "Floor to ceiling with loft, soft-close hinges", imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120ec?auto=format&fit=crop&w=150&q=80", showAlternatives: true },
    
    // Lighting Items (From Screenshot)
    { id: '4', name: "Chandelier", category: "Lighting & Electrical", room: "bedroom", rate: 28000, quantity: 1, unit: "No.", specification: "Contemporary design over table", imageUrl: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&w=150&q=80" },
    { id: '5', name: "Wall Sconces", category: "Lighting & Electrical", room: "bedroom", rate: 4500, quantity: 2, unit: "No.", specification: "Accent lighting" },
    { id: '6', name: "Cabinet LED Strip", category: "Lighting & Electrical", room: "bedroom", rate: 200, quantity: 8, unit: "Rft", specification: "For crockery display" },

    // Wall & Floor Finishes (From Screenshot)
    { id: '7', name: "Wall Paint", category: "Wall & Floor Finishes", room: "bedroom", rate: 18, quantity: 350, unit: "Sq.ft", specification: "Premium emulsion" },
    { id: '8', name: "Accent Wall (Wallpaper)", category: "Wall & Floor Finishes", room: "bedroom", rate: 85, quantity: 60, unit: "Sq.ft", specification: "Premium textured wallpaper" },
    { id: '9', name: "Flooring (Tiles)", category: "Wall & Floor Finishes", room: "bedroom", rate: 140, quantity: 120, unit: "Sq.ft", specification: "Italian marble look tiles" },
    
    // Accessories & Decor
    { id: '13', name: "Premium Curtains", category: "Accessories & Decor", room: "bedroom", rate: 12500, quantity: 2, unit: "Set", specification: "Blackout velvet with double tracks" },
    { id: '14', name: "Area Rug", category: "Accessories & Decor", room: "bedroom", rate: 18000, quantity: 1, unit: "No.", specification: "Hand-tufted wool rug (5x8 ft)" },

    // Labor & Installation
    { id: '15', name: "Electrical Wiring & Points", category: "Labor & Installation", room: "bedroom", rate: 850, quantity: 12, unit: "Point", specification: "Internal wiring with safety casing" },
    { id: '16', name: "Painting Labor Charge", category: "Labor & Installation", room: "bedroom", rate: 12, quantity: 350, unit: "Sqft", specification: "2 coats of putty + 2 coats of paint" },

    // Living Room Items
    { id: '10', name: "3-Seater Premium Sofa", category: "Furniture", room: "living", rate: 65000, quantity: 1, unit: "No.", specification: "Velvet upholstery with solid wood frame", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80" },
    { id: '11', name: "TV Unit with Stone Finish", category: "Furniture", room: "living", rate: 45000, quantity: 1, unit: "No.", specification: "Charcoal gray with white marble top" },
    { id: '12', name: "Italian Marble Wall Panel", category: "Wall & Floor Finishes", room: "living", rate: 850, quantity: 120, unit: "Sqft", specification: "Statuario marble with mirror polish" },
    
    // Kitchen Items
    { id: '17', name: "Modular Base Cabinets", category: "Furniture", room: "kitchen", rate: 85000, quantity: 1, unit: "Set", specification: "BWP Plywood with Laminate" },
    { id: '18', name: "Wall Mounted Lofts", category: "Furniture", room: "kitchen", rate: 45000, quantity: 1, unit: "Set", specification: "Soft close lift-up systems" },
    { id: '19', name: "Quartz Countertop", category: "Wall & Floor Finishes", room: "kitchen", rate: 450, quantity: 45, unit: "Sqft", specification: "Jet black quartz 18mm" }
  ]
}

const ROOMS = [
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'living', name: 'Living Room' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'dining', name: 'Dining Room' },
  { id: 'office', name: 'Home Office' },
  { id: 'bathroom', name: 'Bathroom' }
]

export default function BOQViewerPage() {
  const [items, setItems] = useState(MOCK_BOQ_DATA.items)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('bedroom')
  const [editQuantities, setEditQuantities] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(['Furniture', 'Wall & Floor Finishes'])

  // Core formatting
  const formatINR = (val) => new Intl.NumberFormat('en-IN').format(val)
  const formatCurrency = (val) => `₹${formatINR(val)}`

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const roomMatch = item.room === selectedRoom
      const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      return roomMatch && searchMatch
    })
  }, [items, selectedRoom, searchQuery])

  // Analytics Computation
  const analytics = useMemo(() => {
    const roomItems = items.filter(i => i.room === selectedRoom)
    const roomTotal = roomItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0)
    
    const categoryStats = MOCK_BOQ_DATA.categories.map(cat => {
      const catItems = roomItems.filter(i => i.category === cat.name)
      const amount = catItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0)
      const percentage = roomTotal > 0 ? Math.round((amount / roomTotal) * 100) : 0
      return {
        ...cat,
        amount,
        percentage,
        itemsCount: catItems.length
      }
    }).filter(c => c.itemsCount > 0)

    return { categoryStats, roomTotal }
  }, [items, selectedRoom])

  // Actions
  const handleQuantityChange = (id, newQty) => {
    const qty = parseInt(newQty) || 0
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: qty } : item
    ))
  }

  const toggleCategory = (name) => {
    setExpandedCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    )
  }

  const expandAll = () => setExpandedCategories(MOCK_BOQ_DATA.categories.map(c => c.name))
  const collapseAll = () => setExpandedCategories([])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#10263d]">
      {/* Light Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8">
        <Container>
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-[#10263d] transition-colors text-xs font-bold w-fit"
            >
              <ArrowLeft className="h-3.3 w-3.5" />
              Back to Tools
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                  <FileText className="h-6 w-6 text-[#10263d]/40" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-[#10263d]">BOQ Viewer</h1>
                  <p className="text-sm text-muted-foreground font-medium">Detailed itemized breakdown for {ROOMS.find(r => r.id === selectedRoom)?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl border-gray-200 text-[#10263d] font-bold h-10 px-5 shadow-sm hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button className="rounded-xl bg-[#10263d] hover:bg-[#0c1d2e] text-white font-bold h-10 px-6 shadow-md transition-all active:scale-95">
                  <Printer className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6 sticky top-24">
            {/* Room Tabs */}
            <div className="bg-gray-100/50 p-1 rounded-2xl border border-gray-100 grid grid-cols-2 gap-1">
              {ROOMS.map(room => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                    selectedRoom === room.id 
                      ? "bg-white text-[#10263d] shadow-sm" 
                      : "text-muted-foreground hover:text-[#10263d] hover:bg-white/50"
                  )}
                >
                  {room.name}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#10263d] transition-colors" />
                <Input 
                  placeholder="Search materials..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-12 h-12 rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-[#10263d]/5 focus:border-[#10263d]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400">⌘ K</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-[#10263d] font-bold justify-between px-5 hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-[10px] px-1.5 h-4.5 min-w-[1.125rem] flex items-center justify-center font-bold">0</Badge>
              </Button>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", editQuantities ? "bg-green-500 animate-pulse" : "bg-gray-300")} />
                  <span className="text-xs font-bold text-[#10263d]">Edit quantities</span>
                </div>
                <button 
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-300 overflow-hidden border",
                    editQuantities ? "bg-[#10263d] border-[#10263d]" : "bg-gray-200 border-gray-200"
                  )}
                  onClick={() => setEditQuantities(!editQuantities)}
                >
                  <motion.div 
                    animate={{ x: editQuantities ? 20 : 0 }}
                    className="absolute top-0.5 left-1 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="h-11 rounded-xl border-gray-200 text-[#10263d] font-bold text-[11px] gap-2 shadow-sm hover:bg-gray-50"
                  onClick={expandAll}
                >
                  <List className="h-3.5 w-3.5" /> Expand
                </Button>
                <Button 
                  variant="outline" 
                  className="h-11 rounded-xl border-gray-200 text-[#10263d] font-bold text-[11px] gap-2 shadow-sm hover:bg-gray-50"
                  onClick={collapseAll}
                >
                  <Box className="h-3.5 w-3.5" /> Collapse
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Analysis Card */}
            <Card className="p-8 rounded-[2.5rem] border-gray-100 shadow-sm bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10263d]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                    <PieChart className="h-3 w-3" /> Category Breakdown
                  </h3>
                  <div className="flex flex-wrap gap-5">
                    {analytics.categoryStats.length > 0 ? analytics.categoryStats.map((cat, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="relative w-16 h-16 group">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                            <motion.circle 
                              cx="32" cy="32" r="28" fill="none" 
                              stroke={cat.color} strokeWidth="6" 
                              strokeDasharray={175.9}
                              initial={{ strokeDashoffset: 175.9 }}
                              animate={{ strokeDashoffset: 175.9 - (175.9 * cat.percentage / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-black">{cat.percentage}%</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase text-muted-foreground tracking-tight whitespace-nowrap">{cat.name.split(' ')[0]}</span>
                      </div>
                    )) : (
                      <div className="flex items-center justify-center h-20 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400">No data for this room</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" /> Area Cost Control
                    </h3>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground font-black uppercase block mb-0.5">Room Estimate</span>
                      <span className="text-2xl font-black text-[#10263d]">{formatCurrency(analytics.roomTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                      {analytics.categoryStats.map((cat, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          style={{ backgroundColor: cat.color }} 
                          className="h-full border-r border-white/10 last:border-0" 
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                      {analytics.categoryStats.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2 group cursor-help">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-[9px] font-bold text-muted-foreground uppercase truncate group-hover:text-[#10263d] transition-colors">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Accordion Categories */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {analytics.categoryStats.map((cat) => {
                  const itemsInCategory = filteredItems.filter(i => i.category === cat.name)
                  if (itemsInCategory.length === 0) return null
                  
                  const isExpanded = expandedCategories.includes(cat.name)
                  
                  return (
                    <motion.div
                      layout
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
                        <button 
                          onClick={() => toggleCategory(cat.name)}
                          className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                              <cat.icon className="h-4.5 w-4.5" style={{ color: cat.color }} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-black text-[#10263d] uppercase tracking-tight">{cat.name}</h4>
                              <p className="text-[10px] text-muted-foreground font-bold">{cat.itemsCount} items found</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                              <span className="text-[9px] font-black text-muted-foreground uppercase block leading-none mb-1">Subtotal</span>
                              <span className="text-sm font-black text-[#10263d]">{formatCurrency(cat.amount)}</span>
                            </div>
                            <div className="w-1.5 h-8 rounded-full bg-gray-100 overflow-hidden">
                              <div className="w-full h-full" style={{ height: `${cat.percentage}%`, backgroundColor: cat.color }} />
                            </div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-gray-50 bg-[#fafbfc]"
                            >
                              <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[700px]">
                                  <thead>
                                    <tr className="text-[9px] font-black uppercase tracking-widest text-[#10263d]/30 border-b border-gray-100">
                                      <th className="pl-16 py-3.5">Specification & Item Details</th>
                                      <th className="px-4 py-3.5 text-center">Unit</th>
                                      <th className="px-4 py-3.5 text-center">Qty</th>
                                      <th className="px-4 py-3.5 text-right">Rate</th>
                                      <th className="px-6 py-3.5 text-right bg-white/50">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {itemsInCategory.map((item) => (
                                      <tr key={item.id} className="group/row hover:bg-white transition-colors">
                                        <td className="px-6 py-4.5">
                                          <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                                              {item.imageUrl ? (
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover/row:scale-110 transition-transform duration-500" />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                  <div className="w-6 h-6 rounded bg-gray-200" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="space-y-1">
                                              <h5 className="text-[12px] font-black text-[#10263d]">{item.name}</h5>
                                              <p className="text-[11px] text-muted-foreground leading-snug max-w-[320px] font-medium">{item.specification}</p>
                                              {item.showAlternatives && (
                                                <button className="text-[9px] text-indigo-600 font-black flex items-center gap-1 mt-2 tracking-wide uppercase group-hover/row:translate-x-1 transition-transform">
                                                  <Sparkles className="h-2.5 w-2.5" /> Show Alternatives
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-4 py-4.5 text-center">
                                          <Badge variant="outline" className="text-[10px] font-black text-muted-foreground bg-white uppercase py-0.5 px-2 border-gray-100">{item.unit}</Badge>
                                        </td>
                                        <td className="px-4 py-4.5 text-center">
                                          {editQuantities ? (
                                            <div className="flex flex-col items-center gap-1">
                                              <input 
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-12 h-8 rounded-lg border-2 border-indigo-200 text-center text-xs font-black text-[#10263d] focus:border-[#10263d] focus:ring-0 shadow-inner outline-none"
                                              />
                                              <span className="text-[8px] font-bold text-indigo-400 uppercase">Input</span>
                                            </div>
                                          ) : (
                                            <span className="text-xs font-black text-[#10263d]">{item.quantity}</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-4.5 text-right">
                                          <span className="text-[11px] font-bold text-muted-foreground">{formatCurrency(item.rate)}</span>
                                        </td>
                                        <td className="px-6 py-4.5 text-right font-black text-[#10263d] bg-white text-[13px]">
                                          {formatCurrency(item.rate * item.quantity)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Bottom Total Block */}
            <Card className="p-10 rounded-[2.5rem] bg-[#10263d] text-white shadow-2xl relative overflow-hidden mt-12 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-center md:text-left space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Total Estimated Project Value</span>
                  <div className="flex items-baseline gap-3 justify-center md:justify-start">
                    <h3 className="text-5xl font-black tracking-tighter tabular-nums">{formatCurrency(analytics.roomTotal)}</h3>
                    <Badge className="bg-white/10 text-white border-0 hover:bg-white/20 font-black text-[10px] py-1">GST INCL.</Badge>
                  </div>
                  <p className="text-[11px] text-white/50 font-bold max-w-sm">This estimate includes material costs, delivery, and professional installation by Houspire verified partners.</p>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="text-right">
                        <span className="text-[9px] font-black text-white/30 uppercase block">Sample By</span>
                        <span className="text-xs font-black text-white uppercase tracking-wider">Houspire AI Builder</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                         <Zap className="h-5 w-5 text-white" />
                      </div>
                   </div>
                   <Button className="w-full bg-white text-[#10263d] hover:bg-white/90 font-black rounded-xl h-11 px-8 active:scale-95 transition-all shadow-xl">
                      Book Free Consultation
                   </Button>
                </div>
              </div>
            </Card>

            <div className="flex flex-col items-center gap-6 mt-16 pb-12">
              <Separator className="w-24 bg-[#10263d]/10" />
              <p className="text-[10px] text-muted-foreground/60 text-center max-w-lg leading-relaxed font-medium italic">
                Disclaimer: The prices shown above are estimated markers based on current market rates for premium Grade-A materials. Final BOQ will be provided after on-site measurement and technical survey by our design team.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
