import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Badge } from '@/components/ui/badge'
import houspireWatermark from '@/assets/houspire-watermark.png'
import { cn } from '@/lib/utils'
import { Eye, Clock, Star, Heart, Bookmark } from 'lucide-react'
import { formatText } from './types'
import { SaveToBoardButton } from '@/components/inspiration/SaveToBoardButton'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { useLikedDesigns } from '@/hooks/useLikedDesigns'

export function BentoCard({ design, index, onClick, isFocused = false, layout = 'grid' }) {
  const { isLiked, toggleLike } = useLikedDesigns()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const shouldAnimate = index < 24
  
  const { ref, isIntersecting: isInView } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={shouldAnimate ? { duration: 0.4, delay: Math.min(index * 0.02, 0.2) } : { duration: 0 }}
      className={`group cursor-pointer select-none ${isFocused ? 'ring-2 ring-[#10263d] ring-offset-2 rounded-2xl' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      aria-label={`View ${design.design_title}`}
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden bg-gray-50",
          layout === 'masonry' ? "aspect-auto" : "aspect-[3/4]"
        )}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <img src={houspireWatermark} alt="" className="w-12 opacity-10" />
            </div>
          )}

          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <img src={houspireWatermark} alt="" className="w-24 md:w-28 opacity-15" draggable={false} />
          </div>
           
          {design.cloudinary_public_id ? (
            <CloudinaryImage
              src={design.cloudinary_public_id}
              alt={design.design_title}
              transform="card"
              className={`w-full transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              objectFit="cover"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <img
              src={design.cover_image_url}
              alt={design.design_title}
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-auto transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Featured Badge - Top Left (Matching brand color) */}
          {(design.is_featured) && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-primary text-primary-foreground px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg z-20">
              <Star className="h-3 w-3 fill-current" />
              <span>Featured</span>
            </div>
          )}

          {/* Actions - Top Right */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(design.id);
              }}
              className={cn(
                "h-9 w-9 flex items-center justify-center bg-white rounded-full shadow-lg border-0 transition-all hover:scale-110 active:scale-95 group/like",
                isLiked(design.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
              )}
              aria-label={isLiked(design.id) ? "Unlike" : "Like"}
            >
              <Heart className={cn("h-5 w-5 transition-colors", isLiked(design.id) && "fill-current")} />
            </button>

            {/* Save to Board Button */}
            <SaveToBoardButton
              imageUrl={design.cover_image_url}
              sourceType="gallery"
              sourceId={design.id}
              roomType={design.room_type}
              style={design.style_primary}
              designTitle={design.design_title}
              className="h-9 w-9 bg-white text-foreground hover:bg-white rounded-full shadow-lg border-0 transition-transform hover:scale-110 active:scale-95"
            />
          </div>

          {/* Housepire Watermark - Bottom Right (Matching brand) */}
          <div className="absolute bottom-3 right-3 bg-foreground/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] text-white font-bold tracking-tight z-10 border border-white/10">
            Housepire
          </div>

          {/* Title Overlay - Bottom Left */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent pt-12 transition-opacity duration-300">
             <h3 className="text-white text-sm font-bold line-clamp-2 drop-shadow-md leading-tight max-w-[80%]">
              {design.design_title}
            </h3>
          </div>
        </div>

        {/* Content Section Below Image (Pinterest-style) - Simplified */}
        <div className="p-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">
              {formatText(design.room_type)}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] font-medium text-muted-foreground">
               {formatText(design.style_primary)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-semibold">
            <Heart className="h-3 w-3" />
            <span>{design.save_count || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
