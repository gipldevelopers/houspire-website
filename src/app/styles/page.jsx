'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/SEOHead';
import { dataGet } from '@/lib/frontend-data';
import { useToast } from '@/hooks/use-toast';
import { Search, Sparkles } from 'lucide-react';

import { StyleCard } from '@/components/styles/StyleCard';
import { StylesHero } from '@/components/styles/StylesHero';
import { StylesFilters } from '@/components/styles/StylesFilters';
import { StyleComparisonDrawer } from '@/components/styles/StyleComparisonDrawer';

export default function Styles() {
  const { toast } = useToast();

  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [compareStyles, setCompareStyles] = useState([]);

  const MAX_COMPARE = 3;

  // Get unique room types
  const allRoomTypes = useMemo(() => {
    const rooms = new Set();
    styles.forEach(style => {
      (style.room_types || style.roomTypes || []).forEach(room => rooms.add(room));
    });
    return ['All Rooms', ...Array.from(rooms).sort()];
  }, [styles]);

  useEffect(() => {
    fetchStyles();
  }, []);

  const fetchStyles = async () => {
    try {
      setLoading(true);
      const { styles: stylesData } = await dataGet('/design-styles');
      setStyles(stylesData || []);
    } catch (error) {
      console.error('Error fetching styles:', error);
      toast({
        title: 'Error loading design styles',
        description: error.message || 'Failed to load styles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredStyles = useMemo(() => {
    if (!styles || styles.length === 0) return [];
    
    return styles.filter(style => {
      const matchesSearch = searchQuery === '' || 
        style.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFeatured = selectedFilter === 'all' || 
        (selectedFilter === 'featured' && style.is_featured) ||
        (selectedFilter === 'budget' && (style.trial_price || 499) <= 499) ||
        (selectedFilter === 'luxury' && (style.max_package_price || 0) >= 9999);
      
      const matchesRoom = selectedRoom === 'All Rooms' ||
        style.room_types?.includes(selectedRoom);
      
      return matchesSearch && matchesFeatured && matchesRoom;
    });
  }, [styles, searchQuery, selectedFilter, selectedRoom]);

  const featuredStyles = filteredStyles.filter(s => s.is_featured);
  const regularStyles = filteredStyles.filter(s => !s.is_featured);

  // Stats
  const totalDesigners = styles.reduce((sum, s) => sum + (s.designer_count || 0), 0);
  const totalProjects = styles.reduce((sum, s) => sum + (s.total_projects || 0), 0);

  const hasActiveFilters = searchQuery !== '' || selectedFilter !== 'all' || selectedRoom !== 'All Rooms';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFilter('all');
    setSelectedRoom('All Rooms');
  };

  const handleCompareToggle = (style) => {
    setCompareStyles(prev => {
      const isSelected = prev.some(s => s.id === style.id);
      if (isSelected) {
        return prev.filter(s => s.id !== style.id);
      }
      if (prev.length >= MAX_COMPARE) {
        toast({
          title: 'Maximum reached',
          description: `You can compare up to ${MAX_COMPARE} styles at a time`,
        });
        return prev;
      }
      return [...prev, style];
    });
  };

  const isStyleSelected = (style) => 
    compareStyles.some(s => s.id === style.id);

  const canAddMore = compareStyles.length < MAX_COMPARE;

  return (
    <>
      <SEOHead
        title="Design Styles | Houspire"
        description="Browse 15 curated interior design styles. Find Modern Minimalist, Traditional Indian, Contemporary Fusion, and more with expert designers."
      />

      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 md:py-16">
          
          {/* Hero Section */}
          <StylesHero 
            stylesCount={styles.length}
            totalDesigners={totalDesigners}
            totalProjects={totalProjects}
          />

          {/* Filters */}
          <StylesFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
            roomTypes={allRoomTypes}
            resultCount={filteredStyles.length}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Featured Styles */}
          {!loading && featuredStyles.length > 0 && (
            <div id="styles-grid" className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Featured Styles</h2>
                <Badge variant="secondary">{featuredStyles.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStyles.map((style, index) => (
                  <StyleCard 
                    key={style.id} 
                    style={style} 
                    index={index} 
                    featured
                    isSelected={isStyleSelected(style)}
                    onCompareToggle={handleCompareToggle}
                    canCompare={canAddMore}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Styles */}
          {!loading && regularStyles.length > 0 && (
            <div className={compareStyles.length > 0 ? 'pb-48' : ''}>
              {featuredStyles.length > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold">All Design Styles</h2>
                  <Badge variant="secondary">{regularStyles.length}</Badge>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularStyles.map((style, index) => (
                  <StyleCard 
                    key={style.id} 
                    style={style} 
                    index={index}
                    isSelected={isStyleSelected(style)}
                    onCompareToggle={handleCompareToggle}
                    canCompare={canAddMore}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredStyles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No styles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={handleClearFilters}
                className="text-primary hover:underline font-medium"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Comparison Drawer */}
        <StyleComparisonDrawer
          selectedStyles={compareStyles}
          onRemove={(style) => setCompareStyles(prev => prev.filter(s => s.id !== style.id))}
          onClear={() => setCompareStyles([])}
          maxStyles={MAX_COMPARE}
        />
      </div>
    </>
  );
}


