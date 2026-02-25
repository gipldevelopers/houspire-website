'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Users,
  Briefcase,
  ArrowRight,
  Palette,
  Sparkles,
  Plus,
  Check,
} from 'lucide-react';

export function StyleCard({ 
  style, 
  index, 
  featured = false,
  isSelected = false,
  onCompareToggle,
  canCompare = true,
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Get first 4 portfolio images for preview
  const previewImages = style.portfolio_images?.slice(0, 4) || [];

  const handleCardClick = (e) => {
    // Don't navigate if clicking on compare checkbox
    if (e.target.closest('[data-compare-toggle]')) {
      return;
    }
    router.push(`/styles/${style.slug}`);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompareToggle?.(style);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        onClick={handleCardClick}
        className={`group cursor-pointer overflow-hidden transition-all duration-500 
          ${featured 
            ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5' 
            : 'hover:ring-2 hover:ring-primary/20'
          }
          ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
          hover:shadow-2xl hover:-translate-y-2
        `}
      >
        {/* Cover Image with Hover Preview */}
        <div className="aspect-[16/10] relative overflow-hidden bg-muted">
          {/* Main Cover Image */}
          <AnimatePresence mode="wait">
            {!isHovered || previewImages.length === 0 ? (
              <motion.div
                key="cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {style.cover_image_url ? (
                  <img 
                    src={style.cover_image_url} 
                    alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Palette className="w-16 h-16 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5"
              >
                {previewImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="relative overflow-hidden"
                  >
                    <img 
                      src={img} 
                      alt={`${style.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
                {/* Overlay with label */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                  <span className="text-white/90 text-xs font-medium">
                    {style.portfolio_images?.length || 0} portfolio images
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/90" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-primary text-primary-foreground shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Compare Toggle */}
          {onCompareToggle && (
            <div 
              data-compare-toggle
              className="absolute top-3 right-3 z-10"
              onClick={handleCompareClick}
            >
              <Button
                size="sm"
                variant={isSelected ? "default" : "secondary"}
                className={`h-8 px-3 shadow-lg transition-all ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/90 hover:bg-white text-foreground'
                } ${!canCompare && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canCompare && !isSelected}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Compare
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title & Tagline */}
          <div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {style.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {style.tagline}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{style.designer_count || style.designerCount || 0}</p>
                <p className="text-xs text-muted-foreground">Designers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{style.total_projects?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">{style.avg_rating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">₹</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{style.trial_price?.toLocaleString() || 499}</p>
                <p className="text-xs text-muted-foreground">Starting</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="flex flex-wrap gap-1.5">
            {style.key_features?.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs font-normal px-2 py-0.5">
                {feature}
              </Badge>
            ))}
            {style.key_features && style.key_features.length > 2 && (
              <Badge variant="outline" className="text-xs font-normal px-2 py-0.5">
                +{style.key_features.length - 2}
              </Badge>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-primary group-hover:underline underline-offset-2">
              Explore Style
            </span>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-primary" />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
