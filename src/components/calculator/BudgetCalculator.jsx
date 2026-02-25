import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { 
  Calculator, 
  Home, 
  Layout, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Info,
  ShieldCheck,
  Check,
  Zap,
  Crown,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ROOM_OPTIONS = [
  { id: 'living', name: 'Living Room', icon: Layout, basePrice: 180000 },
  { id: 'kitchen', name: 'Modular Kitchen', icon: ShoppingBag, basePrice: 220000 },
  { id: 'master', name: 'Master Bedroom', icon: Home, basePrice: 140000 },
  { id: 'kids', name: 'Kids Bedroom', icon: Sparkles, basePrice: 110000 },
  { id: 'guest', name: 'Guest Bedroom', icon: Home, basePrice: 100000 },
  { id: 'dining', name: 'Dining Room', icon: Layout, basePrice: 70000 },
  { id: 'bathroom', name: 'Bathrooms (Total)', icon: Zap, basePrice: 40000 },
]

const PACKAGES = [
  { 
    id: 'essential', 
    name: 'Essential', 
    icon: Zap, 
    multiplier: 1, 
    description: 'High quality finishes, focused on functionality and durability.',
    features: ['Branded Laminates', 'Standard Hardware', '2-Year Warranty', 'Premium Paint']
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    icon: Sparkles, 
    multiplier: 1.6, 
    description: 'Bespoke designs, superior materials, and enhanced storage solutions.',
    features: ['Anti-scratch Laminates', 'Soft-close Hardware', '5-Year Warranty', 'Texture Paints', 'Designer Lighting']
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    icon: Crown, 
    multiplier: 2.5, 
    description: 'Top-tier materials, automated features, and unique material palettes.',
    features: ['Acrylic/Veneer Finishes', 'Hettich/Blum Hardware', '10-Year Warranty', 'Italian Marble Accents', 'Smart Home Ready']
  }
]

export function BudgetCalculator() {
  const [selectedRooms, setSelectedRooms] = useState(['living', 'kitchen', 'master'])
  const [selectedPackage, setSelectedPackage] = useState('premium')
  const [sqft, setSqft] = useState(1200)

  const toggleRoom = (roomId) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId) 
        : [...prev, roomId]
    )
  }

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN').format(val)
  }

  const calculation = useMemo(() => {
    const pkg = PACKAGES.find(p => p.id === selectedPackage)
    const multiplier = pkg.multiplier
    
    const roomCosts = selectedRooms.map(roomId => {
      const room = ROOM_OPTIONS.find(r => r.id === roomId)
      // Scale according to sqft (baseline 1000 sqft)
      const sqftFactor = sqft / 1000
      return {
        name: room.name,
        cost: Math.round(room.basePrice * sqftFactor * multiplier)
      }
    })

    const subtotal = roomCosts.reduce((sum, item) => sum + item.cost, 0)
    const tax = Math.round(subtotal * 0.18) // 18% GST typical for services/materials combo
    const total = subtotal + tax

    return {
      roomCosts,
      subtotal,
      tax,
      total,
      pkgName: pkg.name
    }
  }, [selectedRooms, selectedPackage])

  return (
    <div className="py-10 lg:py-16">
      <Container>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selections */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                  <Home className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-black text-[#10263d] uppercase tracking-tight">
                  Step 01: Define Space
                </h2>
              </div>
              
              <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl shadow-primary/5">
                <div className="flex items-center justify-between mb-5">
                  <div className="space-y-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#10263d]/30 leading-none">Carpet Area</span>
                    <h3 className="text-xl font-black text-primary leading-none mt-1">
                      {sqft} <span className="text-[10px] font-bold text-muted-foreground uppercase">sqft</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10263d]/5 rounded-xl border border-[#10263d]/5">
                    <Layout className="h-3.5 w-3.5 text-[#10263d]" />
                    <span className="text-[10px] font-black text-[#10263d] uppercase tracking-tight">
                      {Math.round(sqft / 100)} BHK <span className="text-[8px] opacity-40">Est.</span>
                    </span>
                  </div>
                </div>
                <Slider 
                  value={[sqft]} 
                  onValueChange={([val]) => setSqft(val)} 
                  min={300} 
                  max={5000} 
                  step={50}
                  className="mb-3"
                />
                <div className="flex justify-between text-[9px] font-black text-[#10263d]/20 uppercase tracking-widest">
                  <span>300 sqft</span>
                  <span>5000 sqft</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                  <Layout className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-black text-[#10263d] uppercase tracking-tight">
                  Step 02: Selected Rooms
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROOM_OPTIONS.map((room) => {
                  const isSelected = selectedRooms.includes(room.id)
                  const Icon = room.icon
                  return (
                    <motion.button
                      key={room.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleRoom(room.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 gap-2 overflow-hidden group",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5 ring-1 ring-primary/10" 
                          : "border-[#10263d]/5 bg-white hover:border-primary/10"
                      )}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-6 h-6 bg-primary/10 rounded-bl-2xl flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner",
                        isSelected ? "bg-primary text-white" : "bg-[#10263d]/5 text-[#10263d]/20 group-hover:bg-[#10263d]/10"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-tight text-center leading-none",
                        isSelected ? "text-primary" : "text-[#10263d]/50"
                      )}>
                        {room.name}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-black text-[#10263d] uppercase tracking-tight">
                  Step 03: Select Tier
                </h2>
              </div>

              <div className="grid gap-4">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id
                  const Icon = pkg.icon
                  return (
                    <motion.button
                      key={pkg.id}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={cn(
                        "relative flex items-center p-5 rounded-2xl border transition-all duration-300 gap-5 text-left",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 z-10" 
                          : "border-[#10263d]/5 bg-white hover:border-primary/10"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                        isSelected ? "bg-primary text-white" : "bg-[#10263d]/5 text-[#10263d]/30"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            "font-black text-base uppercase tracking-tight",
                            isSelected ? "text-primary" : "text-[#10263d]"
                          )}>
                            {pkg.name} Tier
                          </h3>
                          {isSelected && (
                            <Badge className="bg-primary hover:bg-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 leading-none">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-3 leading-tight font-medium max-w-sm">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {pkg.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[9px] font-black text-[#10263d]/40">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Results sticky - Compact UI */}
          <div className="lg:col-span-5 sticky top-24">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-primary/10 overflow-hidden relative bg-[#10263d] text-white">
              {/* Background Glows */}
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-primary/15 rounded-full blur-[60px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-primary/5 rounded-full blur-[40px]" />
              
              <div className="relative p-7 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black uppercase tracking-tight">Estimate</h3>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest leading-none">Instant Total</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 px-2.5 py-1 bg-primary/5">
                    {calculation.pkgName}
                  </Badge>
                </div>

                <div className="space-y-3 mb-8">
                  {calculation.roomCosts.length > 0 ? (
                    calculation.roomCosts.map((room, i) => (
                      <div key={i} className="flex items-center justify-between text-[13px] group">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                          <span className="text-white/50 font-bold">{room.name}</span>
                        </div>
                        <span className="text-white/90 font-black">₹{formatINR(room.cost)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
                      <p className="text-xs text-white/30 italic font-medium">
                        Select rooms for estimate
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 py-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/30 font-bold uppercase tracking-widest text-[9px]">Subtotal</span>
                    <span className="text-white/70 font-bold tracking-tight">₹{formatINR(calculation.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/30 font-bold uppercase tracking-widest text-[9px]">Taxes (18%)</span>
                    <span className="text-white/70 font-bold tracking-tight">₹{formatINR(calculation.tax)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 mb-6 shadow-lg shadow-primary/10 border border-white/10">
                  <p className="text-[9px] font-black text-[#10263d] uppercase tracking-widest mb-1 opacity-50">Estimated Total</p>
                  <div className="flex items-baseline gap-1.5 text-[#10263d]">
                    <span className="text-3xl font-black tracking-tighter">₹{formatINR(calculation.total)}</span>
                    <span className="text-[8px] uppercase font-black opacity-50">*Approx.</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-13 rounded-xl bg-white hover:bg-white/90 text-[#10263d] font-black text-xs uppercase tracking-widest shadow-lg shadow-black/5 transition-all duration-300">
                    Free Consultation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="ghost" className="w-full h-10 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-widest transition-all">
                    Download Quote
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2.5 py-3 border-t border-white/5 opacity-30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Market data synced daily</span>
                </div>
              </div>
            </Card>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-[1.75rem] bg-white border border-[#10263d]/5 shadow-lg shadow-[#10263d]/5 flex items-center gap-4"
            >
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur group-hover:blur-md transition-all" />
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" 
                    alt="Consultant" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#10263d] tracking-tight">Need help?</p>
                <p className="text-[10px] text-muted-foreground font-bold italic mb-2 truncate">"I can customize this for you."</p>
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white text-[9px] font-black uppercase tracking-widest h-7 px-4">
                    Chat
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full border-[#10263d]/5 text-[#10263d] text-[9px] font-black uppercase tracking-widest h-7 px-4">
                    WhatsApp
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </Container>
    </div>
  )
}
