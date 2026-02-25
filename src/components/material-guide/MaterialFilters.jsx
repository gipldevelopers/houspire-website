import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Droplets, Leaf, PawPrint, Sun, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
const availableFilters = [
    { id: 'water-resistant', label: 'Water Resistant', icon: <Droplets className="h-4 w-4"/> },
    { id: 'eco-friendly', label: 'Eco-Friendly', icon: <Leaf className="h-4 w-4"/> },
    { id: 'pet-friendly', label: 'Pet-Friendly', icon: <PawPrint className="h-4 w-4"/> },
    { id: 'uv-resistant', label: 'UV Resistant', icon: <Sun className="h-4 w-4"/> },
    { id: 'scratch-resistant', label: 'Scratch Resistant', icon: <Shield className="h-4 w-4"/> },
    { id: 'easy-clean', label: 'Easy to Clean', icon: <Sparkles className="h-4 w-4"/> },
];
export function MaterialFilters({ activeFilters, onFiltersChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleFilter = (filterId) => {
        if (activeFilters.includes(filterId)) {
            onFiltersChange(activeFilters.filter(f => f !== filterId));
        }
        else {
            onFiltersChange([...activeFilters, filterId]);
        }
    };
    const clearFilters = () => {
        onFiltersChange([]);
    };
    return (<div className="flex flex-wrap items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4"/>
            Filter by Properties
            {activeFilters.length > 0 && (<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilters.length}
              </Badge>)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Material Properties</h4>
              {activeFilters.length > 0 && (<Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto py-1 px-2 text-xs">
                  Clear all
                </Button>)}
            </div>
            <div className="space-y-2">
              {availableFilters.map((filter) => (<div key={filter.id} className="flex items-center space-x-2">
                  <Checkbox id={filter.id} checked={activeFilters.includes(filter.id)} onCheckedChange={() => toggleFilter(filter.id)}/>
                  <Label htmlFor={filter.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    {filter.icon}
                    {filter.label}
                  </Label>
                </div>))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <AnimatePresence>
        {activeFilters.map((filterId) => {
            const filter = availableFilters.find(f => f.id === filterId);
            if (!filter)
                return null;
            return (<motion.div key={filterId} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Badge variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80" onClick={() => toggleFilter(filterId)}>
                {filter.icon}
                {filter.label}
                <X className="h-3 w-3 ml-1"/>
              </Badge>
            </motion.div>);
        })}
      </AnimatePresence>
    </div>);
}
