import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ShoppingCart, Share2, CheckCircle, Clock, Ruler } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { SaveToBoardButton } from '@/components/inspiration/SaveToBoardButton'

export function DesignDetailModal({ design, open, onOpenChange }) {
  const router = useRouter()
  const { toast } = useToast()

  if (!design) return null

  const handleGetThisDesign = () => {
    onOpenChange(false)
    router.push(`/select-package?reference=${design.id}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: design.design_title,
          text: design.design_description || 'Check out this amazing design!',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Share failed:', error)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Link copied! 📋' })
    }
  }

  const formatText = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const allImages = [design.cover_image_url, ...(design.render_urls || [])]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{design.design_title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Images */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {allImages.map((url, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={url}
                      alt={`${design.design_title} - View ${index + 1}`}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </>
              )}
            </Carousel>

            {/* Watermark */}
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-muted-foreground">
                Designed by Houspire
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{formatText(design.room_type)}</Badge>
              <Badge variant="secondary">{formatText(design.style_primary)}</Badge>
              {design.difficulty_level && (
                <Badge variant="outline">{formatText(design.difficulty_level)}</Badge>
              )}
            </div>

            {/* Description */}
            {design.design_description && (
              <div>
                <h4 className="font-semibold text-sm mb-1">About This Design</h4>
                <p className="text-sm text-muted-foreground">
                  {design.design_description}
                </p>
              </div>
            )}

            <Separator />

            {/* Room Details */}
            {design.room_dimensions && (
              <div className="flex items-start gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Room Size</h4>
                  <p className="text-sm text-muted-foreground">{design.room_dimensions}</p>
                </div>
              </div>
            )}

            {/* Key Features */}
            {design.key_features && design.key_features.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {design.key_features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why It Works */}
            {design.why_it_works && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Why This Design Works</h4>
                <p className="text-sm text-muted-foreground">{design.why_it_works}</p>
              </div>
            )}

            {/* Implementation */}
            {design.execution_time_weeks && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Implementation Time</h4>
                  <p className="text-sm text-muted-foreground">{design.execution_time_weeks} weeks to complete</p>
                </div>
              </div>
            )}

            <Separator />

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={handleGetThisDesign}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Get This Design - Starting ₹999
              </Button>
              <div className="flex gap-2">
                <SaveToBoardButton
                  imageUrl={design.cover_image_url}
                  sourceType="gallery"
                  sourceId={design.id}
                  roomType={design.room_type}
                  style={design.style_primary}
                  designTitle={design.design_title}
                  variant="button"
                  size="sm"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This design can be customized to your specific room dimensions and preferences
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
