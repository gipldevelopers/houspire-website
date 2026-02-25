'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

export function DashboardSearch({
  onSearch,
  onFilterChange,
  currentFilters,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7' },
    { label: 'Last 30 Days', value: '30' },
    { label: 'Last 90 Days', value: '90' },
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const toggleStatus = (status) => {
    const newStatuses = currentFilters.status.includes(status)
      ? currentFilters.status.filter((s) => s !== status)
      : [...currentFilters.status, status];

    onFilterChange({ ...currentFilters, status: newStatuses });
  };

  const clearFilters = () => {
    onFilterChange({ status: [], dateRange: 'all' });
    setSearchQuery('');
    onSearch('');
  };

  const activeFilterCount =
    currentFilters.status.length +
    (currentFilters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="pl-10 h-11"
          />
        </div>

        <Button onClick={handleSearch} className="h-11">
          Search
        </Button>

        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="h-11 relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button onClick={clearFilters} variant="ghost" size="icon" className="h-11 w-11">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 rounded-lg border bg-card space-y-4">
          {/* Status Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                    currentFilters.status.includes(option.value)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
            <div className="flex flex-wrap gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFilterChange({
                      ...currentFilters,
                      dateRange: option.value,
                    })
                  }
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                    currentFilters.dateRange === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
