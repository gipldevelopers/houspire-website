import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
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
      <div
        className="flex h-10 md:h-12 items-center overflow-hidden rounded-full border shadow-[0_10px_28px_rgba(30,42,56,0.06)]"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 94%, white)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-border))',
        }}
      >
        {/* Search */}
        <div className="flex-shrink-0 flex items-center pl-3 md:pl-4 pr-1.5 md:pr-2">
          <Search className="mr-1.5 md:mr-2.5 h-3.5 w-3.5 md:h-4 md:w-4" style={{ color: 'var(--color-primary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-20 md:w-32 bg-transparent text-[11px] md:text-sm font-medium placeholder:text-muted-foreground focus:outline-none"
            style={{ color: 'var(--color-heading-secondary)' }}
          />
        </div>

        {/* Divider */}
        <div
          className="h-5 w-px"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-border))' }}
        />

        {/* Chips Container */}
        <div className="flex-1 relative flex items-center min-w-0 px-2 group/scroll h-full">
          {showLeftArrow && (
            <button 
              className="absolute bottom-0 left-0 top-0 z-30 flex w-10 items-center pl-1 group-hover/scroll:flex"
              style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-bg) 96%, white), color-mix(in srgb, var(--color-bg) 82%, transparent), transparent)' }}
              onClick={() => scroll('left')}
              title="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" style={{ color: 'var(--color-description)' }} />
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
                  className={`flex-shrink-0 relative z-20 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                     active 
                       ? 'scale-[1.02] shadow-md text-primary-foreground' 
                      : 'hover:bg-secondary/60 hover:text-foreground'
                    }`}
                   style={
                     active
                       ? {
                           backgroundColor: 'var(--color-primary)',
                           boxShadow: '0 10px 20px color-mix(in srgb, var(--color-primary) 18%, transparent)',
                         }
                       : {
                           color: 'var(--color-description)',
                           backgroundColor: 'transparent',
                         }
                   }
                 >
                   {chip.label}
                 </button>
              )
            })}
          </div>
          
          {showRightArrow && (
            <button 
              className="absolute bottom-0 right-0 top-0 z-30 flex w-10 items-center justify-end pr-1 group-hover/scroll:flex"
              style={{ background: 'linear-gradient(to left, color-mix(in srgb, var(--color-bg) 96%, white), color-mix(in srgb, var(--color-bg) 82%, transparent), transparent)' }}
              onClick={() => scroll('right')}
              title="Scroll right"
            >
              <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-description)' }} />
            </button>
          )}
        </div>

        <div className="flex-shrink-0 pr-1 md:pr-1.5 pl-0.5 md:pl-1">
          <button
            onClick={onToggleFilters}
            className={`h-8 md:h-9 px-3 md:px-4 flex items-center gap-1.5 md:gap-2 rounded-full transition-all ${
              showFilters || activeFilterCount > 0
                ? 'text-foreground'
                : 'bg-transparent'
            }`}
            style={
              showFilters || activeFilterCount > 0
                ? {
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-bg))',
                    color: 'var(--color-heading-secondary)',
                  }
                : {
                    color: 'var(--color-description)',
                  }
            }
          >
            <SlidersHorizontal className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="text-[10px] md:text-xs font-bold hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="flex h-4 w-4 md:h-4.5 md:w-4.5 min-w-[16px] md:min-w-[18px] items-center justify-center rounded-full text-[9px] md:text-[10px] font-black text-primary-foreground"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
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
            className="card-apple mt-4 grid grid-cols-1 gap-4 md:gap-8 rounded-2xl md:rounded-[28px] p-4 md:p-6 shadow-[0_16px_40px_rgba(30,42,56,0.08)] md:grid-cols-3"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, white)',
              borderColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-border))',
            }}
          >
            {/* Room Type */}
            <div>
              <p className="mb-2 md:mb-3 text-[10px] md:text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-description)' }}>Room Type</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.slice(0, 12).map((room) => (
                  <button
                    key={room.value}
                    onClick={() => onRoomChange(room.value)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                      selectedRoom === room.value 
                        ? 'text-primary-foreground shadow-sm' 
                        : ''
                    }`}
                    style={
                      selectedRoom === room.value
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: '0 10px 22px color-mix(in srgb, var(--color-primary) 16%, transparent)',
                          }
                        : {
                            backgroundColor: 'color-mix(in srgb, var(--color-secondary-1) 55%, white)',
                            color: 'var(--color-heading-secondary)',
                          }
                    }
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <p className="mb-2 md:mb-3 text-[10px] md:text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-description)' }}>Style</p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => onStyleChange(style.value)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                      selectedStyle === style.value 
                        ? 'text-primary-foreground shadow-sm' 
                        : ''
                    }`}
                    style={
                      selectedStyle === style.value
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: '0 10px 22px color-mix(in srgb, var(--color-primary) 16%, transparent)',
                          }
                        : {
                            backgroundColor: 'color-mix(in srgb, var(--color-secondary-1) 55%, white)',
                            color: 'var(--color-heading-secondary)',
                          }
                    }
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <p className="mb-2 md:mb-3 text-[10px] md:text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-description)' }}>Budget Range</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => onBudgetChange(budget.value)}
                    className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                      selectedBudget === budget.value 
                        ? 'text-primary-foreground shadow-sm' 
                        : ''
                    }`}
                    style={
                      selectedBudget === budget.value
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: '0 10px 22px color-mix(in srgb, var(--color-primary) 16%, transparent)',
                          }
                        : {
                            backgroundColor: 'color-mix(in srgb, var(--color-secondary-1) 55%, white)',
                            color: 'var(--color-heading-secondary)',
                          }
                    }
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
