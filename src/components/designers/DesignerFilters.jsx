import { Search, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { cn } from '@/lib/utils';
export function DesignerFilters({ searchQuery, onSearchChange, sortBy, onSortChange, viewMode, onViewModeChange, resultCount, }) {
    return (<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
        <Input placeholder="Search by name or specialty..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10 bg-secondary/30 border-border/50 focus:bg-background"/>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Result count */}
        <span className="text-sm text-muted-foreground hidden sm:block">
          {resultCount} designer{resultCount !== 1 ? 's' : ''}
        </span>
        
        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px] bg-secondary/30 border-border/50">
            <SlidersHorizontal className="w-4 h-4 mr-2"/>
            <SelectValue placeholder="Sort by"/>
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
            <SelectItem value="projects">Most Projects</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        
        {/* View Toggle */}
        <div className="flex items-center bg-secondary/30 rounded-lg p-1">
          <Button variant="ghost" size="icon" className={cn('h-8 w-8 rounded-md', viewMode === 'grid' && 'bg-background shadow-sm')} onClick={() => onViewModeChange('grid')}>
            <LayoutGrid className="w-4 h-4"/>
          </Button>
          <Button variant="ghost" size="icon" className={cn('h-8 w-8 rounded-md', viewMode === 'list' && 'bg-background shadow-sm')} onClick={() => onViewModeChange('list')}>
            <List className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </div>);
}
