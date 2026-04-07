import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { appDataClient } from '@/lib/static-client'
import { formatText } from './types'
import { SaveToBoardButton } from '@/components/inspiration/SaveToBoardButton'

const MOCK_RELATED = [
  {
    id: 'rel-1',
    design_title: 'Minimalist Study Nook',
    cover_image_url: 'https://images.unsplash.com/photo-1513519247388-19345420d517?auto=format&fit=crop&w=400&q=80',
    room_type: 'home_office',
    style_primary: 'minimalist',
    save_count: 145
  },
  {
    id: 'rel-2',
    design_title: 'Modern Japandi Bedroom',
    cover_image_url: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=400&q=80',
    room_type: 'master_bedroom',
    style_primary: 'modern',
    save_count: 234
  },
  {
    id: 'rel-3',
    design_title: 'Rustic Wood Kitchen',
    cover_image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    room_type: 'kitchen',
    style_primary: 'rustic_farmhouse',
    save_count: 567
  },
  {
    id: 'rel-4',
    design_title: 'Boho Chic Living Space',
    cover_image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    room_type: 'living_room',
    style_primary: 'bohemian',
    save_count: 890
  }
]

export function RelatedDesigns({ currentDesign, onDesignClick }) {
  const [relatedDesigns, setRelatedDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true)
      
      try {
        const { data: roomData } = await appDataClient
          .from('gallery_designs')
          .select('id, design_title, cover_image_url, room_type, style_primary, save_count')
          .eq('is_published', true)
          .eq('room_type', currentDesign.room_type)
          .neq('id', currentDesign.id)
          .limit(4)

        const { data: styleData } = await appDataClient
          .from('gallery_designs')
          .select('id, design_title, cover_image_url, room_type, style_primary, save_count')
          .eq('is_published', true)
          .eq('style_primary', currentDesign.style_primary)
          .neq('id', currentDesign.id)
          .limit(4)

        const allData = [...(roomData || []), ...(styleData || [])]
        
        if (allData.length === 0) {
          // Use MOCK_RELATED as fallback, but filter out current design if it's there
          setRelatedDesigns(MOCK_RELATED.filter(d => d.id !== currentDesign.id))
        } else {
          const seenIds = new Set()
          const merged = []
          
          for (const design of allData) {
            if (!seenIds.has(design.id)) {
              seenIds.add(design.id)
              merged.push(design)
            }
          }
          
          merged.sort((a, b) => (b.save_count || 0) - (a.save_count || 0))
          setRelatedDesigns(merged.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch related designs:', error)
        setRelatedDesigns(MOCK_RELATED.filter(d => d.id !== currentDesign.id))
      }
      
      setLoading(false)
    }

    fetchRelated()
  }, [currentDesign.id, currentDesign.room_type, currentDesign.style_primary])

  if (loading) {
    return (
      <div className="pt-6 border-t">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Finding similar designs...</span>
        </div>
      </div>
    )
  }

  if (relatedDesigns.length === 0) return null

  return (
    <div className="pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">More Like This</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {relatedDesigns.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onDesignClick(design)}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onDesignClick(design)
              }
            }}
            role="button"
            tabIndex={0}
            className="group relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer"
          >
            <img
              src={design.cover_image_url}
              alt={design.design_title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Center Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-semibold tracking-tight text-transparent select-none [-webkit-text-stroke:2px_rgba(249,115,22,0.26)]">
                Houspire
              </span>
            </div>
             
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-medium truncate">
                  {design.design_title}
                </p>
                <p className="text-white/70 text-xs truncate">
                  {formatText(design.room_type)}
                </p>
              </div>
            </div>

            {/* Quick Save Button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <SaveToBoardButton
                imageUrl={design.cover_image_url}
                sourceType="gallery"
                sourceId={design.id}
                roomType={design.room_type}
                style={design.style_primary}
                designTitle={design.design_title}
                size="sm"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

