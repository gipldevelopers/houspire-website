import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { X, ChevronLeft, ChevronRight, Share2, Check, Keyboard, Maximize2, Heart } from 'lucide-react'
import { formatText } from './types'
import { cn } from '@/lib/utils'
import { useSwipe } from '@/hooks/useSwipe'
import { useRouter } from 'next/navigation'
import { SaveToBoardButton } from '@/components/inspiration/SaveToBoardButton'
import { RelatedDesigns } from './RelatedDesigns'

export function ImageDetailModal({
  design,
  currentIndex,
  totalDesigns,
  isLiked,
  onClose,
  onNext,
  onPrevious,
  onLike,
  onShare,
  onRelatedClick,
}) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showKeyboardHint, setShowKeyboardHint] = useState(true)

  // Get all images (cover + renders)
  const allImages = design
    ? [design.cover_image_url, ...(design.render_urls || [])]
    : []

  // Swipe handlers for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (activeImageIndex < allImages.length - 1) {
        setActiveImageIndex((prev) => prev + 1)
        setImageLoaded(false)
      } else if (currentIndex < totalDesigns - 1) {
        onNext()
      }
    },
    onSwipeRight: () => {
      if (activeImageIndex > 0) {
        setActiveImageIndex((prev) => prev - 1)
        setImageLoaded(false)
      } else if (currentIndex > 0) {
        onPrevious()
      }
    },
  })

  // Reset state when design changes
  useEffect(() => {
    setActiveImageIndex(0)
    setImageLoaded(false)
  }, [design?.id])

  // Hide keyboard hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyboardHint(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!design) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        if (activeImageIndex < allImages.length - 1) {
          setActiveImageIndex((prev) => prev + 1)
          setImageLoaded(false)
        } else {
          onNext()
        }
      }
      if (e.key === 'ArrowLeft') {
        if (activeImageIndex > 0) {
          setActiveImageIndex((prev) => prev - 1)
          setImageLoaded(false)
        } else {
          onPrevious()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [design, onClose, onNext, onPrevious, activeImageIndex, allImages.length])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (design) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [design])

  const handleGetDesign = useCallback(() => {
    if (design) {
      router.push(`/select-package?reference=${design.id}`)
    }
  }, [router, design])


  if (!design) return null

  const currentImage = allImages[activeImageIndex] || design.cover_image_url

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Design detail: ${design.design_title}`}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          size="icon"
          variant="secondary"
          className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-[calc(env(safe-area-inset-right)+1rem)] z-50 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 text-foreground border border-border/50 shadow-lg hover:bg-background/90"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 md:h-6 md:w-6" />
        </Button>

        {/* Counter & Keyboard Hint */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {currentIndex + 1} / {totalDesigns}
          </div>
          
          {/* Keyboard Hint - Desktop only */}
          <AnimatePresence>
            {showKeyboardHint && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full text-white/70 text-xs"
              >
                <Keyboard className="h-3 w-3" />
                <span>← → to navigate</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-background rounded-2xl md:rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
        >
          <div className="grid md:grid-cols-2 h-full max-h-[95vh]">
            {/* Image Side */}
            <div 
              className="relative md:h-full bg-black flex flex-col min-h-[280px] md:min-h-0 select-none"
              onContextMenu={(e) => e.preventDefault()}
              {...swipeHandlers}
            >
              {/* Main Image Container */}
              <div className="relative flex-1 flex items-center justify-center">
                {/* Loading Skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-full h-full" />
                  </div>
                )}
                
                <img
                  src={currentImage}
                  alt={`${design.design_title} - View ${activeImageIndex + 1}`}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-contain max-h-[40vh] md:max-h-[75vh] pointer-events-none transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Center Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-5xl md:text-7xl font-semibold tracking-tight text-transparent select-none [text-shadow:0_1px_20px_rgba(0,0,0,0.35)] [-webkit-text-stroke:3px_rgba(249,115,22,0.32)]">
                    Houspire
                  </span>
                </div>

                {/* Navigation Arrows */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeImageIndex > 0) {
                      setActiveImageIndex((prev) => prev - 1)
                      setImageLoaded(false)
                    } else {
                      onPrevious()
                    }
                  }}
                  size="icon"
                  disabled={activeImageIndex === 0 && currentIndex === 0}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 disabled:opacity-30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeImageIndex < allImages.length - 1) {
                      setActiveImageIndex((prev) => prev + 1)
                      setImageLoaded(false)
                    } else {
                      onNext()
                    }
                  }}
                  size="icon"
                  disabled={activeImageIndex === allImages.length - 1 && currentIndex === totalDesigns - 1}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 disabled:opacity-30"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                {/* Image Counter (when multiple images) */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs">
                    {activeImageIndex + 1} / {allImages.length} views
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="bg-black/80 p-2 md:p-3 border-t border-white/10">
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveImageIndex(idx)
                          setImageLoaded(false)
                        }}
                        className={`relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all ${
                          activeImageIndex === idx
                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Designed by Badge */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium">
                Designed by Houspire
              </div>
            </div>

            {/* Details Side */}
            <div className="p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[55vh] md:max-h-[95vh]">
              <div className="space-y-4 md:space-y-5">
                {/* Title */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                  {design.design_title}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                    {formatText(design.room_type)}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                    {formatText(design.style_primary)}
                  </span>
                  {design.difficulty_level && (
                    <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2.5 py-0.5 text-xs font-medium capitalize">
                      {design.difficulty_level}
                    </span>
                  )}
                </div>


                {/* About */}
                {design.design_description && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      About This Design
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {design.design_description}
                    </p>
                  </div>
                )}

                {/* Room Dimensions */}
                {design.room_dimensions && (
                  <div className="bg-muted/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Room Size</span>
                    </div>
                    <p className="text-sm font-medium">{design.room_dimensions}</p>
                  </div>
                )}

                {/* Key Features */}
                {design.key_features && design.key_features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Key Features
                    </h3>
                    <ul className="space-y-1.5">
                      {design.key_features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="mt-0.5 h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 text-primary" />
                          </div>
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why It Works */}
                {design.why_it_works && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Why This Design Works
                    </h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {design.why_it_works}
                    </p>
                  </div>
                )}

                {/* Designer Persona */}
                {design.designer_persona && (
                  <div className="bg-gradient-to-r from-primary/5 to-transparent border-l-2 border-primary/30 pl-4 py-2">
                    <p className="text-xs text-muted-foreground italic">
                      "{design.designer_persona}"
                    </p>
                  </div>
                )}

                {/* Want this style CTA */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="text-sm font-semibold text-foreground mb-3">Want this style in your home?</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push('/style-quiz')}
                      className="flex-1 rounded-xl"
                    >
                      Take the Style Quiz
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                        // Navigate to discover filtered by this style
                        window.location.href = `/discover?style=${design.style_primary}`
                      }}
                    >
                      View Similar
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t">
                  <Button
                    onClick={handleGetDesign}
                    size="lg"
                    className="w-full h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-xl"
                  >
                    Get This Design - Starting ₹499
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike();
                      }}
                      variant="outline"
                      className={cn(
                        "flex-1 h-10 md:h-12 rounded-xl border-border bg-white text-foreground shadow-sm hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all font-bold text-xs group",
                        isLiked && "text-destructive hover:text-destructive border-destructive/20"
                      )}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>

                    <SaveToBoardButton
                      imageUrl={design.cover_image_url}
                      sourceType="gallery"
                      sourceId={design.id}
                      roomType={design.room_type}
                      style={design.style_primary}
                      designTitle={design.design_title}
                      variant="button"
                      size="default"
                      className="flex-1 h-10 md:h-12 rounded-xl"
                    />

                    <Button
                      onClick={onShare}
                      variant="outline"
                      className="flex-1 h-10 md:h-12 rounded-xl"
                      aria-label="Share design"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Customizable Note */}
                <p className="text-xs text-muted-foreground text-center">
                  💡 This design can be customized to your room dimensions
                </p>

                {/* More Like This */}
                {onRelatedClick && (
                  <RelatedDesigns
                    currentDesign={design}
                    onDesignClick={(relatedDesign) => {
                      // Convert partial design to full design for display
                      onRelatedClick(relatedDesign)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
