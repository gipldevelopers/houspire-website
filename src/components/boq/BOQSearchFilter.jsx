import { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
export function BOQSearchFilter({ onSearch, onPriceFilter, onCategoryFilter, categories, maxPrice, }) {
    const [query, setQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, maxPrice]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const inputRef = useRef(null);
    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    const handleSearch = (value) => {
        setQuery(value);
        onSearch(value);
    };
    const handlePriceChange = (values) => {
        const range = [values[0], values[1]];
        setPriceRange(range);
        onPriceFilter(range);
    };
    const toggleCategory = (category) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(updated);
        onCategoryFilter(updated);
    };
    const clearFilters = () => {
        setQuery('');
        setPriceRange([0, maxPrice]);
        setSelectedCategories([]);
        onSearch('');
        onPriceFilter(null);
        onCategoryFilter([]);
    };
    const hasActiveFilters = query || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;
    const formatCurrency = (amount) => {
        if (amount >= 100000)
            return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000)
            return `₹${(amount / 1000).toFixed(0)}K`;
        return `₹${amount}`;
    };
    return (<div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input ref={inputRef} value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search items..." className="pl-9 pr-20"/>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (<button onClick={() => handleSearch('')} className="p-0.5 hover:bg-muted rounded">
              <X className="h-3.5 w-3.5 text-muted-foreground"/>
            </button>)}
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Filter Popover */}
      <Popover open={showFilters} onOpenChange={setShowFilters}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4"/>
            Filters
            {hasActiveFilters && (<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {(selectedCategories.length > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)}
              </Badge>)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-card" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (<button onClick={clearFilters} className="text-xs text-primary hover:underline">
                  Clear all
                </button>)}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (<Badge key={cat} variant={selectedCategories.includes(cat) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleCategory(cat)}>
                    {cat}
                  </Badge>))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Price Range</label>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </span>
              </div>
              <Slider value={priceRange} min={0} max={maxPrice} step={1000} onValueChange={handlePriceChange} className="w-full"/>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>);
}
