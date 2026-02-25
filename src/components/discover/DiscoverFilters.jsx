import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  SlidersHorizontal,
  Check,
  Grid3X3,
  LayoutGrid,
  Square,
  ArrowUpDown,
} from 'lucide-react'
import {  ROOM_TYPES,
  STYLES,
  BUDGET_RANGES,
  SORT_OPTIONS,
} from './types'

// Helper component for visual demo icons
const ViewDemoIcon = ({ type, isActive }) => {
  const color = isActive ? 'currentColor' : 'hsl(var(--muted-foreground))';
  
  if (type === 'compact') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill={color} />
        <rect x="9" y="2" width="6" height="6" rx="1.5" fill={color} />
        <rect x="16" y="2" width="6" height="6" rx="1.5" fill={color} />
        <rect x="2" y="9" width="6" height="6" rx="1.5" fill={color} />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill={color} />
        <rect x="16" y="9" width="6" height="6" rx="1.5" fill={color} />
        <rect x="2" y="16" width="6" height="6" rx="1.5" fill={color} />
        <rect x="9" y="16" width="6" height="6" rx="1.5" fill={color} />
        <rect x="16" y="16" width="6" height="6" rx="1.5" fill={color} />
      </svg>
    )
  }
  
  if (type === 'default') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="9" height="9" rx="2" fill={color} />
        <rect x="13" y="2" width="9" height="9" rx="2" fill={color} />
        <rect x="2" y="13" width="9" height="9" rx="2" fill={color} />
        <rect x="13" y="13" width="9" height="9" rx="2" fill={color} />
      </svg>
    )
  }
  
  return ( // large
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="3" fill={color} />
    </svg>
  )
}

export function DiscoverFilters({
  searchQuery,
  onSearchChange,
  selectedRoom,
  onRoomChange,
  selectedStyle,
  onStyleChange,
  selectedBudget,
  onBudgetChange,
  sortBy,
  onSortChange,
  gridSize,
  onGridSizeChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}) {
  const clearAllFilters = () => {
    onRoomChange('all')
    onStyleChange('all')
    onBudgetChange('all')
    onSearchChange('')
  }

  return (
    <div className="space-y-6">
      {/* Search Bar & Filter Button Combined */}
      <div className="relative max-w-[760px] mx-auto group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by room type, style, or keyword..."
          className="w-full pl-12 pr-32 h-14 text-[15px] rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all"
        />
        <button
          onClick={onToggleFilters}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-5 flex items-center gap-2.5 rounded-full border-2 border-primary/10 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-foreground transition-all group/filter"
        >
          <SlidersHorizontal className="h-4 w-4 text-primary group-hover/filter:scale-110 transition-transform" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center min-h-[20px] min-w-[20px] rounded-full bg-primary text-primary-foreground text-[10px] font-black shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* View & Sort Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-[760px] mx-auto px-1">
        {/* Grid Size Toggle */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">View:</span>
          <div className="inline-flex items-center rounded-full border border-border bg-white p-1.5 shadow-sm">
            <Button
              onClick={() => onGridSizeChange('compact')}
              variant="ghost"
              size="sm"
              className={`rounded-full px-5 h-9 gap-2.5 text-xs font-bold transition-all ${gridSize === 'compact' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md translate-y-[-1px]' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <ViewDemoIcon type="compact" isActive={gridSize === 'compact'} />
              <span>Compact</span>
            </Button>
            <Button
              onClick={() => onGridSizeChange('default')}
              variant="ghost"
              size="sm"
              className={`rounded-full px-5 h-9 gap-2.5 text-xs font-bold transition-all ${gridSize === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md translate-y-[-1px]' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <ViewDemoIcon type="default" isActive={gridSize === 'default'} />
              <span>Default</span>
            </Button>
            <Button
              onClick={() => onGridSizeChange('large')}
              variant="ghost"
              size="sm"
              className={`rounded-full px-5 h-9 gap-2.5 text-xs font-bold transition-all ${gridSize === 'large' ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md translate-y-[-1px]' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <ViewDemoIcon type="large" isActive={gridSize === 'large'} />
              <span>Large</span>
            </Button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => onSortChange(v)}>
            <SelectTrigger className="w-[145px] h-10 rounded-full border-border text-xs font-bold bg-white shadow-sm focus:ring-primary/20 hover:border-primary/30 transition-all" aria-label="Sort by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border shadow-xl">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs font-medium focus:bg-primary/5 focus:text-primary">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Pills */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Room Type */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Room Type</p>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map((room) => (
                    <Button
                      key={room.value}
                      onClick={() => onRoomChange(room.value)}
                      variant={selectedRoom === room.value ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      aria-pressed={selectedRoom === room.value}
                    >
                      {room.label}
                      {selectedRoom === room.value && <Check className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Style</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((style) => (
                    <Button
                      key={style.value}
                      onClick={() => onStyleChange(style.value)}
                      variant={selectedStyle === style.value ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      aria-pressed={selectedStyle === style.value}
                    >
                      {style.label}
                      {selectedStyle === style.value && <Check className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Budget Range</p>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_RANGES.map((budget) => (
                    <Button
                      key={budget.value}
                      onClick={() => onBudgetChange(budget.value)}
                      variant={selectedBudget === budget.value ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full"
                      aria-pressed={selectedBudget === budget.value}
                    >
                      {budget.label}
                      {selectedBudget === budget.value && <Check className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

