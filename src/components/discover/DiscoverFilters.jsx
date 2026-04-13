import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Search,
  SlidersHorizontal,
  Check,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { ROOM_TYPES, STYLES, BUDGET_RANGES } from './types'

const CHIPS = [
  { label: 'Bedroom', value: 'master_bedroom', type: 'room' },
  { label: 'Living', value: 'living_room', type: 'room' },
  { label: 'Kitchen', value: 'kitchen', type: 'room' },
  { label: 'Modern', value: 'modern', type: 'style' },
  { label: 'Japandi', value: 'minimalist', type: 'style' }, // Mapping Japandi to minimalist for now
  { label: 'Budget ₹', value: 'budget', type: 'budget' },
  { label: 'Small spaces', value: 'small', type: 'search' },
]

export function DiscoverFilters({
  searchQuery,
  onSearchChange,
  selectedRoom,
  onRoomChange,
  selectedStyle,
  onStyleChange,
  selectedBudget,
  onBudgetChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}) {
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleChipClick = (chip) => {
    if (chip.type === 'room') onRoomChange(selectedRoom === chip.value ? 'all' : chip.value)
    if (chip.type === 'style') onStyleChange(selectedStyle === chip.value ? 'all' : chip.value)
    if (chip.type === 'budget') onBudgetChange(selectedBudget === chip.value ? 'all' : chip.value)
    if (chip.type === 'search') onSearchChange(searchQuery === chip.value ? '' : chip.value)
  }

  const isChipActive = (chip) => {
    if (chip.type === 'room') return selectedRoom === chip.value
    if (chip.type === 'style') return selectedStyle === chip.value
    if (chip.type === 'budget') return selectedBudget === chip.value
    if (chip.type === 'search') return searchQuery === chip.value
    return false
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4">
      <div className="flex items-center h-12 bg-white rounded-full border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Search */}
        <div className="flex-shrink-0 flex items-center pl-4 pr-2">
          <Search className="h-4 w-4 text-gray-400 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-24 md:w-32 bg-transparent text-sm font-medium focus:outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200" />

        {/* Chips Container */}
        <div className="flex-1 relative flex items-center min-w-0 px-2 group/scroll h-full">
          {showLeftArrow && (
            <button 
              className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/90 to-transparent z-30 flex items-center pl-1 group-hover/scroll:flex" 
              onClick={() => scroll('left')}
              title="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            </button>
          )}

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full px-2"
          >
            {CHIPS.map((chip) => {
              const active = isChipActive(chip)
              return (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip)}
                  className={`flex-shrink-0 relative z-20 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active 
                      ? 'bg-foreground text-background shadow-md transform scale-[1.02]' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-foreground'
                  }`}
                >
                  {chip.label}
                </button>
              )
            })}
          </div>
          
          {showRightArrow && (
            <button 
              className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white/80 to-transparent z-30 flex items-center justify-end pr-1 group-hover/scroll:flex" 
              onClick={() => scroll('right')}
              title="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Trigger */}
        <div className="flex-shrink-0 pr-1.5 pl-1">
          <button
            onClick={onToggleFilters}
            className={`h-9 px-4 flex items-center gap-2 rounded-full transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-gray-100 text-foreground'
                : 'bg-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="text-xs font-bold hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center h-4.5 w-4.5 min-w-[18px] rounded-full bg-foreground text-background text-[10px] font-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-6 bg-white rounded-2xl border border-border shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Room Type */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Room Type</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.slice(0, 12).map((room) => (
                  <button
                    key={room.value}
                    onClick={() => onRoomChange(room.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedRoom === room.value 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary/50 text-foreground/70 hover:bg-secondary'
                    }`}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Style</p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onStyleChange(style.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedStyle === style.value 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary/50 text-foreground/70 hover:bg-secondary'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Budget Range</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => onBudgetChange(budget.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedBudget === budget.value 
                        ? 'bg-primary text-white' 
                        : 'bg-secondary/50 text-foreground/70 hover:bg-secondary'
                    }`}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
