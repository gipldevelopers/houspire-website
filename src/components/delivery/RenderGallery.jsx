import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function RenderGallery({ renders, selectedIndex, onSelect }) {
    const [loadedImages, setLoadedImages] = useState(new Set());
    const handleImageLoad = (index) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };
    if (renders.length === 0) {
        return null;
    }
    return (<div className="mt-6">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">View Options</h4>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {renders.map((render, index) => (<motion.button key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(index)} className={cn("relative flex-shrink-0 w-32 h-20 md:w-40 md:h-24 rounded-xl overflow-hidden transition-all duration-300", selectedIndex === index
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "ring-1 ring-border hover:ring-primary/50")}>
            {/* Loading skeleton */}
            {!loadedImages.has(index) && (<div className="absolute inset-0 bg-muted animate-pulse"/>)}

            <img src={render.url} alt={render.label} className={cn("w-full h-full object-cover transition-opacity duration-300", loadedImages.has(index) ? "opacity-100" : "opacity-0")} onLoad={() => handleImageLoad(index)}/>

            {/* Label overlay */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-white text-xs font-medium truncate block">
                {render.label}
              </span>
            </div>

            {/* Selected indicator */}
            {selectedIndex === index && (<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"/>)}
          </motion.button>))}
      </div>
    </div>);
}
