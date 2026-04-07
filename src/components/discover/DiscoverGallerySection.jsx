import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { appDataClient } from '@/lib/static-client'
import { useToast } from '@/hooks/use-toast'
import { useLikedDesigns } from '@/hooks/useLikedDesigns'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useGalleryPagination } from '@/hooks/useGalleryPagination'
import { useGalleryKeyboard } from '@/hooks/useGalleryKeyboard'
import { useAuth } from '@/contexts/AuthContext'
import { GRID_SIZE_CONFIG, BENTO_PATTERNS } from '@/components/discover/types'
import { BentoCard } from '@/components/discover/BentoCard'
import { ImageDetailModal } from '@/components/discover/ImageDetailModal'
import { DiscoverFilters } from '@/components/discover/DiscoverFilters'
import { DiscoverSkeleton } from '@/components/discover/DiscoverSkeleton'
import { BackToTopButton } from '@/components/discover/BackToTopButton'
import { TrendingTopics } from '@/components/discover/TrendingTopics'
import { cn } from '@/lib/utils'
import { Gem, Search, Loader2, Keyboard, Sparkles, X, Plus, LayoutGrid, FolderHeart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function GalleryCtaBanner() {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('galleryBannerDismissed')) {
      setDismissed(true)
    }
  }, [])

  if (dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 max-w-[760px] mx-auto bg-white border border-[#d9dee5] rounded-full px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm"
    >
      <p className="text-xs md:text-sm text-[#334155]">
        Love a design? Get a personalized version for <strong>YOUR</strong> home - starting at Rs 999
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={() => router.push('/style-quiz')} className="rounded-full text-xs h-7 px-3 bg-[#10263d] text-white hover:bg-[#0c2035]">
          Start Now
        </Button>
        <button
          onClick={() => {
            setDismissed(true)
            sessionStorage.setItem('galleryBannerDismissed', 'true')
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

const MOCK_DESIGNS = [
  
  {
    id: 'mock-2',
    design_title: 'Modern Industrial Master Bedroom',
    cover_image_url: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80',
    room_type: 'master_bedroom',
    style_primary: 'modern',
    view_count: 890,
    save_count: 230,
    is_featured: false,
  },
  {
    id: 'mock-3',
    design_title: 'Contemporary Luxury Kitchen',
    cover_image_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    room_type: 'kitchen',
    style_primary: 'contemporary',
    view_count: 2100,
    save_count: 670,
    is_featured: true,
  },
  {
    id: 'mock-4',
    design_title: 'Bohemian Style Guest Room',
    cover_image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    room_type: 'guest_bedroom',
    style_primary: 'bohemian',
    view_count: 560,
    save_count: 120,
    is_featured: false,
  },
  {
    id: 'mock-5',
    design_title: 'Modern Minimalist Home Office',
    cover_image_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    room_type: 'home_office',
    style_primary: 'minimalist',
    view_count: 1560,
    save_count: 340,
    is_featured: false,
  },
  {
    id: 'mock-6',
    design_title: 'Traditional Indian Dining Area',
    cover_image_url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    room_type: 'dining_room',
    style_primary: 'traditional_indian',
    view_count: 3400,
    save_count: 890,
    is_featured: true,
  },
  
  {
    id: 'mock-8',
    design_title: 'Industrial Style Library',
    cover_image_url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    room_type: 'library',
    style_primary: 'industrial',
    view_count: 1200,
    save_count: 430,
    is_featured: false,
  }
]

export default function Discover() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  // UI state
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [gridSize, setGridSize] = useState('default')

  // Liked designs persistence
  const { isLiked, toggleLike } = useLikedDesigns()

  // Get filters from URL params
  const searchQuery = searchParams.get('q') || ''
  const selectedRoom = searchParams.get('room') || 'all'
  const selectedStyle = searchParams.get('style') || 'all'
  const selectedBudget = searchParams.get('budget') || 'all'
  const sortBy = searchParams.get('sort') || 'newest'

  // Server-side paginated data fetching
  const filters = useMemo(() => ({
    room: selectedRoom,
    style: selectedStyle,
    budget: selectedBudget,
    search: searchQuery,
    sort: sortBy,
  }), [selectedRoom, selectedStyle, selectedBudget, searchQuery, sortBy])

  const {
    designs: fetchedDesigns,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    totalCount: fetchedTotalCount,
  } = useGalleryPagination(filters)

  // Use mock designs as fallback if nothing is found and not loading
  const designs = useMemo(() => {
    if (!loading && fetchedDesigns.length === 0 && !searchQuery && selectedRoom === 'all' && selectedStyle === 'all' && selectedBudget === 'all') {
      return MOCK_DESIGNS
    }
    return fetchedDesigns
  }, [fetchedDesigns, loading, searchQuery, selectedRoom, selectedStyle, selectedBudget])

  const totalCount = useMemo(() => {
    if (!loading && fetchedDesigns.length === 0 && designs.length > 0) {
      return designs.length
    }
    return fetchedTotalCount
  }, [fetchedTotalCount, fetchedDesigns.length, designs.length, loading])

  // Keyboard navigation
  const { focusedIndex } = useGalleryKeyboard({
    designs,
    onDesignSelect: (index) => handleDesignClick(designs[index], index),
    onSave: (designId) => handleLike(designId),
    isModalOpen: selectedDesign !== null,
    onCloseModal: () => setSelectedDesign(null),
  })

  // Load more trigger with intersection observer
  const { ref: loadMoreRef, isIntersecting: shouldLoadMore } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
  })

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    if (shouldLoadMore && hasMore && !loadingMore && !loading) {
      loadMore()
    }
  }, [shouldLoadMore, hasMore, loadingMore, loading, loadMore])

  // Update URL params
  const updateParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all' && value !== 'newest') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    router.push(`/discover?${newParams.toString()}`, { scroll: false })
  }, [searchParams, router])

  // Filter handlers
  const setSearchQuery = (value) => updateParam('q', value)
  const setSelectedRoom = (value) => updateParam('room', value)
  const setSelectedStyle = (value) => updateParam('style', value)
  const setSelectedBudget = (value) => updateParam('budget', value)
  const setSortBy = (value) => updateParam('sort', value)

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (selectedRoom !== 'all') count++
    if (selectedStyle !== 'all') count++
    if (selectedBudget !== 'all') count++
    if (searchQuery) count++
    return count
  }, [selectedRoom, selectedStyle, selectedBudget, searchQuery])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Failed to load gallery',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleDesignClick = async (design, index) => {
    setSelectedDesign(design)
    setCurrentIndex(index)

    // Increment view count (fire and forget)
    appDataClient
      .from('gallery_designs')
      .update({ view_count: (design.view_count || 0) + 1 })
      .eq('id', design.id)
      .then(() => {})
  }

  const handleLike = async (designId, e) => {
    e?.stopPropagation()

    const wasLiked = isLiked(designId)
    toggleLike(designId)

    const design = designs.find((d) => d.id === designId)
    if (!design) return

    const newCount = wasLiked
      ? Math.max(0, (design.save_count || 0) - 1)
      : (design.save_count || 0) + 1

    // Update database (fire and forget)
    appDataClient
      .from('gallery_designs')
      .update({ save_count: newCount })
      .eq('id', designId)
      .then(() => {})

    toast({
      title: wasLiked ? 'Removed from favorites' : 'Added to favorites',
      duration: 2000,
    })
  }

  const handleShare = async (design) => {
    const shareUrl = `${window.location.origin}/discover?design=${design.id}`
    
    // Try native share first (works on mobile and some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.design_title,
          text: design.design_description || 'Check out this design on Houspire!',
          url: shareUrl,
        })
        toast({
          title: 'Shared successfully',
          duration: 2000,
        })
        return
      } catch (error) {
        // If user cancelled, don't show error
        if (error.name === 'AbortError') {
          return
        }
        // Fall through to clipboard copy on other errors
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied',
        description: 'Share this link with anyone',
        duration: 2000,
      })
    } catch (clipboardError) {
      toast({
        title: 'Could not share',
        description: 'Please copy the URL manually',
        variant: 'destructive',
      })
    }
  }

  const handleNext = () => {
    if (currentIndex < designs.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setSelectedDesign(designs[nextIndex])
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setSelectedDesign(designs[prevIndex])
    }
  }

  const getBentoSize = (index) => {
    return BENTO_PATTERNS[index % BENTO_PATTERNS.length]
  }

  if (loading) {
    return <DiscoverSkeleton gridSize={gridSize} />
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest"
            >
              <Sparkles className="h-3 w-3" />
              {totalCount > 0 ? `${Math.floor(totalCount / 100) * 100}+ Curated Designs` : '4900+ Curated Designs'}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-foreground tracking-tighter"
            >
              Design Gallery
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#64748b] text-base md:text-lg font-medium"
            >
              Discover your perfect space in our collection of professionally designed interiors
            </motion.p>

            {/* My Collections CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              
            >
              <Link href="/boards">
                <div className="group relative inline-flex items-center gap-4 bg-white border border-secondary/50 rounded-[2rem] p-4 pr-10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  <div className="relative p-3 rounded-2xl bg-secondary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <FolderHeart className="h-6 w-6" />
                  </div>
                  <div className="relative text-left">
                    <h3 className="text-sm font-bold text-foreground leading-none">View My Collections</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1 group-hover:text-primary/70 transition-colors">Personal Inspiration Boards</p>
                  </div>
                  <ArrowRight className="absolute right-6 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          </div>

          <GalleryCtaBanner />
        </Container>
      </section>

      <div className="pb-6">
        <Container>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-[980px] mx-auto"
          >
            <TrendingTopics
              activeFilters={{
                sort: sortBy,
                style: selectedStyle,
                budget: selectedBudget,
                room: selectedRoom,
                search: searchQuery,
              }}
              onTopicClick={(filter) => {
                const newParams = new URLSearchParams()
                
                Object.entries(filter).forEach(([key, value]) => {
                  if (value) {
                    if (key === 'sort') newParams.set('sort', value)
                    else if (key === 'style') newParams.set('style', value)
                    else if (key === 'budget') newParams.set('budget', value)
                    else if (key === 'room') newParams.set('room', value)
                    else if (key === 'search') newParams.set('q', value)
                  }
                })
                router.push(`/discover?${newParams.toString()}`, { scroll: false })
              }}
            />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4"
          >
            <DiscoverFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              selectedBudget={selectedBudget}
              onBudgetChange={setSelectedBudget}
              sortBy={sortBy}
              onSortChange={setSortBy}
              gridSize={gridSize}
              onGridSizeChange={setGridSize}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              activeFilterCount={activeFilterCount}
            />

            <div className="mt-5 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full gap-2.5 h-11 px-6 border-border bg-white text-foreground shadow-sm hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all font-bold text-xs group"
                onClick={() => router.push(user ? '/dashboard/inspiration' : '/login')}
              >
                <span className="text-primary text-lg group-hover:scale-125 transition-transform">♥</span>
                {user ? 'View my inspiration boards' : 'Sign in to save favorites'}
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Masonry Grid */}
      <Container className="py-6 pb-20">
        {designs.length > 0 ? (
          <>
            <div 
              className={cn(
                "columns-1 md:columns-2 lg:columns-3 xl:columns-4 transition-all duration-300 gap-4 space-y-4",
                gridSize === 'compact' && "xl:columns-5",
                gridSize === 'large' && "lg:columns-2 xl:columns-3"
              )}
            >
              {designs.map((design, index) => {
                const isFocused = focusedIndex === index

                return (
                  <div key={design.id} className="break-inside-avoid">
                    <BentoCard
                      design={design}
                      index={index}
                      bentoSize={{ cols: 1, rows: 1 }} // Simplified for Masonry
                      onClick={() => handleDesignClick(design, index)}
                      isFocused={isFocused}
                      layout="masonry"
                    />
                  </div>
                )
              })}
            </div>

            {/* Load More / Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {loadingMore ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading more designs...</span>
                  </div>
                ) : (
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    className="rounded-full"
                  >
                    Load more designs
                  </Button>
                )}
              </div>
            )}

            {/* Results count & Keyboard hint */}
            <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
              <div>Showing {designs.length} of {Math.floor(totalCount / 100) * 100}+ designs</div>
              <div className="hidden md:flex items-center justify-center gap-2 text-xs">
                <Keyboard className="h-3 w-3" />
                <span>Press J/K to navigate, S to save, Enter to open</span>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No designs found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                router.push('/discover')
              }}
              className="rounded-full"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </Container>

      {/* Back to Top Button */}
      <BackToTopButton />

      {/* Modal Components */}

      {/* Detail Modal */}
      <ImageDetailModal
        design={selectedDesign}
        currentIndex={currentIndex}
        totalDesigns={designs.length}
        isLiked={selectedDesign ? isLiked(selectedDesign.id) : false}
        onClose={() => setSelectedDesign(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onLike={() => selectedDesign && handleLike(selectedDesign.id)}
        onShare={() => selectedDesign && handleShare(selectedDesign)}
        onRelatedClick={(relatedDesign) => {
          // Find the index if it exists in current designs, otherwise just show it
          const idx = designs.findIndex(d => d.id === relatedDesign.id)
          if (idx !== -1) {
            setCurrentIndex(idx)
            setSelectedDesign(designs[idx])
          } else {
            // Show the related design directly (it will be a partial, but modal handles it)
            setSelectedDesign(relatedDesign)
            setCurrentIndex(-1) // Not in current list
          }
        }}
      />
    </div>
  )
}





