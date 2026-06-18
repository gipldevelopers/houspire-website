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
import { BentoCard } from '@/components/discover/BentoCard'
import { ImageDetailModal } from '@/components/discover/ImageDetailModal'
import { DiscoverFilters } from '@/components/discover/DiscoverFilters'
import { DiscoverSkeleton } from '@/components/discover/DiscoverSkeleton'
import { BackToTopButton } from '@/components/discover/BackToTopButton'
import { cn } from '@/lib/utils'
import { HeroHighlight } from '@/components/ui/hero-highlight'
import { Search, Loader2, Keyboard, Sparkles, MessageCircle } from 'lucide-react'
import { redirectToHouspireHome } from '@/lib/external-links'

function GalleryPromoBanner({ onStartTrial }) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-apple mt-4 md:mt-6 flex w-full items-center justify-between gap-3 md:gap-4 rounded-[20px] md:rounded-[30px] px-4 md:px-5 py-3 md:py-4 shadow-[0_16px_40px_rgba(30,42,56,0.08)]"
      style={{ 
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 92%, white)',
        borderColor: 'color-mix(in srgb, var(--color-primary) 14%, var(--color-border))' 
      }}
    >
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <div
          className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-bg))' }}
        >
          <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" style={{ color: 'var(--color-primary)' }} />
        </div>
        <p className="text-[11px] leading-[1.4] md:text-[15px] md:leading-[1.45]" style={{ color: 'var(--color-heading-secondary)' }}>
          Love a design? Get a personalized version for <strong>YOUR</strong> home - <span className="font-bold" style={{ color: 'var(--color-primary)' }}>starting at Rs 499</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button 
          onClick={onStartTrial} 
          className="btn-primary h-8 md:h-9 rounded-full px-4 md:px-5 text-[10px] md:text-xs font-bold"
        >
          Start Now
        </Button>
      </div>
    </motion.div>
  )
}

const MOCK_DESIGNS = [
  {
    id: 'mock-japandi-living',
    design_title: 'Minimalist Japandi Living Room',
    cover_image_url: '/images/living-room.png',
    room_type: 'living_room',
    style_primary: 'minimalist',
    view_count: 1840,
    save_count: 450,
    is_featured: true,
  },
  {
    id: 'mock-scandi-kids',
    design_title: 'Scandinavian Kids Bedroom',
    cover_image_url: '/styles/traditional-indian/portfolio-7-kids-bedroom.png',
    room_type: 'kids_bedroom',
    style_primary: 'scandinavian',
    view_count: 1280,
    save_count: 310,
    is_featured: false,
  },

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
    onDesignSelect: (index) => openDesignDetail(designs[index], index),
    onSave: (designId) => toggleDesignLike(designId),
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
  const updateFilterParam = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all' && value !== 'newest') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    router.push(`/discover?${newParams.toString()}`, { scroll: false })
  }, [searchParams, router])

  // Filter handlers
  const setSearchQuery = (value) => updateFilterParam('q', value)
  const setSelectedRoom = (value) => updateFilterParam('room', value)
  const setSelectedStyle = (value) => updateFilterParam('style', value)
  const setSelectedBudget = (value) => updateFilterParam('budget', value)
  const setSortBy = (value) => updateFilterParam('sort', value)

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

  const openDesignDetail = async (design, index) => {
    setSelectedDesign(design)
    setCurrentIndex(index)

    // Increment view count (fire and forget)
    appDataClient
      .from('gallery_designs')
      .update({ view_count: (design.view_count || 0) + 1 })
      .eq('id', design.id)
      .then(() => { })
  }

  const toggleDesignLike = async (designId, e) => {
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
      .then(() => { })

    toast({
      title: wasLiked ? 'Removed from favorites' : 'Added to favorites',
      duration: 2000,
    })
  }

  const shareDesign = async (design) => {
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

  const showNextDesign = () => {
    if (currentIndex < designs.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setSelectedDesign(designs[nextIndex])
    }
  }

  const showPreviousDesign = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setSelectedDesign(designs[prevIndex])
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <HeroHighlight className="bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-2 md:pt-24 md:pb-4">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-[-120px] top-10 h-[360px] w-[360px] rounded-full bg-accent/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </div>

          <Container>
            <div className="mx-auto flex w-full max-w-[980px] flex-col items-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-[1100px] text-balance text-center text-[clamp(24px,3.5vw,42px)] font-bold tracking-tight leading-[1.1]"
                style={{ color: 'var(--color-heading-main)' }}
              >
                Explore real homes by style, room & budget
              </motion.h1>

              <div className="w-full max-w-[960px] mt-2">
                <GalleryPromoBanner 
                  onStartTrial={() => {
                    redirectToHouspireHome({ openWizard: true, package: 499 });
                  }} 
                />
              </div>
            </div>
          </Container>
        </section>

        <div className="pb-4">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto max-w-[1040px]"
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

              <div className="mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3">
                <Button
                  className="btn-secondary h-9 md:h-11 gap-2 md:gap-2.5 rounded-full px-4 md:px-6 text-[10px] md:text-xs font-bold group"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-bg) 94%, white)',
                    borderColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--color-border))',
                    color: 'var(--color-heading-secondary)',
                  }}
                  onClick={() => router.push(user ? '/dashboard/inspiration' : '/login')}
                >
                  <span className="text-base md:text-lg group-hover:scale-125 transition-transform" style={{ color: 'var(--color-primary)' }}>♥</span>
                  {user ? 'View my inspiration boards' : 'Sign in to save favorites'}
                </Button>
                <Button
                  className="btn-secondary h-9 md:h-11 gap-2 md:gap-2.5 rounded-full px-4 md:px-6 text-[10px] md:text-xs font-bold"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-bg) 94%, white)',
                    borderColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--color-border))',
                    color: 'var(--color-primary)',
                  }}
                  onClick={() => router.push('/contact')}
                >
                  <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                  Talk to a Designer
                </Button>
              </div>
            </motion.div>
          </Container>
        </div>
      </HeroHighlight>

      {/* Masonry Grid */}
      <Container className="py-2 pb-20">
        {loading ? (
          <DiscoverSkeleton gridSize={gridSize} gridOnly={true} />
        ) : designs.length > 0 ? (
          <>
            <div
              className={cn(
                "columns-2 lg:columns-3 xl:columns-4 transition-all duration-300 gap-2 md:gap-4",
                gridSize === 'compact' && "xl:columns-5",
                gridSize === 'large' && "lg:columns-2 xl:columns-3"
              )}
            >
              {designs.map((design, index) => {
                const isFocused = focusedIndex === index

                return (
                  <div key={design.id} className="break-inside-avoid mb-2 md:mb-4">
                    <BentoCard
                      design={design}
                      index={index}
                      bentoSize={{ cols: 1, rows: 1 }} // Simplified for Masonry
                      onClick={() => openDesignDetail(design, index)}
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
                    className="btn-secondary rounded-full"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-bg) 94%, white)',
                      borderColor: 'color-mix(in srgb, var(--color-primary) 16%, var(--color-border))',
                      color: 'var(--color-heading-secondary)',
                    }}
                  >
                    Load more designs
                  </Button>
                )}
              </div>
            )}

            {/* Results count & Keyboard hint */}
            <div className="text-center text-sm text-muted-foreground mt-4 space-y-2">
              <div>Showing {designs.length} of {totalCount > 100 ? `${Math.floor(totalCount / 100) * 100}+` : totalCount} designs</div>
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
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-bg))' }}
            >
              <Search className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="mb-2 text-xl font-semibold" style={{ color: 'var(--color-heading-main)' }}>No designs found</h3>
            <p className="mb-6" style={{ color: 'var(--color-description)' }}>
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                router.push('/discover')
              }}
              className="btn-primary rounded-full"
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
        onNext={showNextDesign}
        onPrevious={showPreviousDesign}
        onLike={() => selectedDesign && toggleDesignLike(selectedDesign.id)}
        onShare={() => selectedDesign && shareDesign(selectedDesign)}
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





