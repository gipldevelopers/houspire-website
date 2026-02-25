import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Eye, Share2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CloudinaryImage } from '@/components/CloudinaryImage'

export function DesignCard({ design, onSave, onView }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()

  const handleSave = (e) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    onSave()
  }

  const handleGetThisDesign = (e) => {
    e.stopPropagation()
    router.push(`/select-package?reference=${design.id}`)
  }

  const formatText = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden cursor-pointer group" onClick={onView}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {design.cloudinary_public_id ? (
            <CloudinaryImage
              src={design.cloudinary_public_id}
              alt={design.design_title}
              transform="card"
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              objectFit="cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <img
              src={design.cover_image_url}
              alt={design.design_title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Watermark */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-muted-foreground">
            Houspire
          </div>

          {/* Difficulty Badge */}
          {design.difficulty_level && (
            <Badge 
              className="absolute top-2 left-2"
              variant={design.difficulty_level === 'easy' ? 'default' : design.difficulty_level === 'medium' ? 'secondary' : 'outline'}
            >
              {formatText(design.difficulty_level)}
            </Badge>
          )}

          {/* Hover Overlay */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            >
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleGetThisDesign}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Get This Design
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView()
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save Button (Always Visible on Mobile) */}
          <Button
            size="icon"
            variant="secondary"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full transition-opacity ${
              isHovered || isSaved ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
            }`}
            onClick={handleSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">
                {design.design_title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatText(design.room_type)} • {formatText(design.style_primary)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Implementation Time */}
            {design.execution_time_weeks && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {design.execution_time_weeks} weeks
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-muted-foreground ml-auto">
              <span className="flex items-center gap-1 text-xs">
                <Eye className="h-3 w-3" />
                {design.view_count}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Heart className="h-3 w-3" />
                {design.save_count}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
