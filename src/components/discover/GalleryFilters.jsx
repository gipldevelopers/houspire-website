import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROOM_TYPES, DESIGN_STYLES } from '@/lib/constants'
import { SlidersHorizontal, X } from 'lucide-react'

export function GalleryFilters({ filters, onFilterChange, onClearFilters }) {
  const hasActiveFilters = filters.roomType !== 'all' || filters.style !== 'all'

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filter Designs
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Room Type Filter */}
            <Select value={filters.roomType} onValueChange={(value) => onFilterChange('roomType', value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Room Types</SelectItem>
                {ROOM_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Style Filter */}
            <Select value={filters.style} onValueChange={(value) => onFilterChange('style', value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {DESIGN_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.roomType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {ROOM_TYPES.find(r => r.value === filters.roomType)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onFilterChange('roomType', 'all')}
                />
              </Badge>
            )}
            {filters.style !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {DESIGN_STYLES.find(s => s.value === filters.style)?.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => onFilterChange('style', 'all')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
