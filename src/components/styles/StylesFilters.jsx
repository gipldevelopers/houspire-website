'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  X,
  Sparkles,
  Filter,
} from 'lucide-react';

export function StylesFilters({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedRoom,
  onRoomChange,
  roomTypes,
  resultCount,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 space-y-4"
    >
      {/* Search & Room Filter Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by style, aesthetic, or vibe..."
            className="pl-12 h-12 text-base rounded-xl border-2 focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Room Type Filter */}
        <Select value={selectedRoom} onValueChange={onRoomChange}>
          <SelectTrigger className="h-12 min-w-[180px] rounded-xl border-2">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`rounded-full h-9 px-4 text-sm font-medium transition-colors ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Styles
        </button>
        <button
          onClick={() => onFilterChange('featured')}
          className={`rounded-full h-9 px-4 text-sm font-medium transition-colors flex items-center ${selectedFilter === 'featured' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Featured
        </button>
        <button
          onClick={() => onFilterChange('budget')}
          className={`rounded-full h-9 px-4 text-sm font-medium transition-colors ${selectedFilter === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Budget Friendly
        </button>
        <button
          onClick={() => onFilterChange('luxury')}
          className={`rounded-full h-9 px-4 text-sm font-medium transition-colors ${selectedFilter === 'luxury' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Luxury
        </button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{resultCount}</span> style{resultCount !== 1 ? 's' : ''}
        </p>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
    </motion.div>
  );
}
