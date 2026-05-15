import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import houspireWatermark from '@/assets/houspire-watermark.png'
import { cn } from '@/lib/utils'
import { Star, Heart } from 'lucide-react'
import { formatText } from './types'
import { SaveToBoardButton } from '@/components/inspiration/SaveToBoardButton'
import { CloudinaryImage } from '@/components/CloudinaryImage'
import { useLikedDesigns } from '@/hooks/useLikedDesigns'

export function BentoCard({ design, index, onClick, isFocused = false, layout = 'grid' }) {
  const { isLiked, toggleLike } = useLikedDesigns()
  const [imageLoaded, setImageLoaded] = useState(false)
  
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
      className={`group cursor-pointer select-none ${isFocused ? 'rounded-2xl ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
      role="button"
      tabIndex={0}
      aria-label={`View ${design.design_title}`}
    >
      <div
        className="card-apple-hover relative overflow-hidden rounded-2xl p-0 shadow-[0_12px_32px_rgba(30,42,56,0.08)]"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 92%, white)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-border))',
        }}
      >
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          layout === 'masonry' ? "aspect-square md:aspect-auto" : "aspect-square md:aspect-[3/4]"
        )} style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary-1) 45%, white)' }}>
          {!imageLoaded && (
            <div
              className="absolute inset-0 flex animate-pulse items-center justify-center"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary-1) 58%, white)' }}
            >
              <img src={houspireWatermark} alt="" className="w-12 opacity-10" />
            </div>
          )}

          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span 
              className="text-2xl md:text-5xl font-semibold tracking-tight text-transparent select-none [text-shadow:0_1px_12px_rgba(0,0,0,0.12)]"
              style={{ WebkitTextStroke: '2px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
            >
              Houspire
            </span>
          </div>
           
          {design.cloudinary_public_id ? (
            <CloudinaryImage
              src={design.cloudinary_public_id}
              alt={design.design_title}
              transform="cardWatermarked"
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
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
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Featured Badge - Top Left (Matching brand color) */}
          {(design.is_featured) && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3 flex items-center gap-1 md:gap-1.5 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold shadow-lg z-20" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-current" />
              <span>Featured</span>
            </div>
          )}

          {/* Pricing Badge - Always visible */}
          <div className="absolute left-2 md:left-3 top-[38px] md:top-[56px] z-10 rounded-full border px-2 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black tracking-tight shadow-sm backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
               style={{
                 color: 'var(--color-primary)',
                 backgroundColor: 'color-mix(in srgb, var(--color-bg) 86%, white)',
                 borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
               }}>
            Starts ₹499
          </div>

          {/* Actions - Top Right */}
           <div className="absolute top-2 md:top-3 right-2 md:right-3 z-20 flex flex-col gap-2">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(design.id);
              }}
              className={cn(
                "group/like flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full border shadow-lg transition-all hover:scale-110 active:scale-95",
                isLiked(design.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
              )}
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, white)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 14%, var(--color-border))',
              }}
              aria-label={isLiked(design.id) ? "Unlike" : "Like"}
            >
              <Heart className={cn("h-4 w-4 md:h-5 md:w-5 transition-colors", isLiked(design.id) && "fill-current")} />
            </button>

            {/* Save to Board Button */}
            <SaveToBoardButton
              imageUrl={design.cover_image_url}
              sourceType="gallery"
              sourceId={design.id}
              roomType={design.room_type}
              style={design.style_primary}
              designTitle={design.design_title}
              className="h-7 w-7 md:h-9 md:w-9 rounded-full border shadow-lg transition-transform hover:scale-110 active:scale-95"
            />
          </div>

          {/* Housepire Watermark - Bottom Right (Matching brand) */}
          <div
            className="absolute bottom-2 md:bottom-3 right-2 md:right-3 z-10 rounded-full border px-2 md:px-2.5 py-1 text-[8px] md:text-[9px] font-bold tracking-tight backdrop-blur-md"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-primary-2) 46%, transparent)',
              borderColor: 'rgba(255,255,255,0.14)',
              color: 'var(--color-primary-1)',
            }}
          >
            Housepire
          </div>

          {/* Title & CTA Overlay - Bottom Left */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-5 z-30">
             <h3 className="text-white text-sm md:text-base font-bold line-clamp-2 leading-tight mb-2 md:mb-4">
              {design.design_title}
            </h3>
            <button className="w-full text-[10px] md:text-xs font-black py-2 md:py-3 rounded-xl transition-all shadow-xl uppercase tracking-wider btn-primary">
              Plan my home like this
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent p-2 md:p-4 pt-8 md:pt-12 transition-opacity duration-300 group-hover:opacity-0">
             <h3 className="text-white text-xs md:text-sm font-bold line-clamp-2 drop-shadow-md leading-tight max-w-[80%]">
              {design.design_title}
            </h3>
          </div>
        </div>

        {/* Content Section Below Image (Pinterest-style) - Simplified */}
        <div
          className="flex items-center justify-between border-t p-2 md:p-3"
          style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 8%, var(--color-border))' }}
        >
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-heading-secondary)' }}>
              {formatText(design.room_type)}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="text-[8px] md:text-[10px] font-medium" style={{ color: 'var(--color-description)' }}>
               {formatText(design.style_primary)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-semibold" style={{ color: 'var(--color-description)' }}>
            <Heart className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{design.save_count || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
