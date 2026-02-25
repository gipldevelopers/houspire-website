import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoveHorizontal, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After', showLabels = true, className = '', allowFullscreen = true }) {
    const [position, setPosition] = useState(50);
    const [isFullscreen, setIsFullscreen] = useState(false);
    // Ensure images are loaded from public folder with absolute paths
    // Convert to string and ensure it starts with /
    const beforeSrc = (() => {
        if (!beforeImage)
            return '';
        const img = typeof beforeImage === 'string' ? beforeImage : String(beforeImage);
        if (img === '[object Object]' || img === 'undefined' || img === 'null') {
            console.error('BeforeAfterSlider: Invalid beforeImage', beforeImage);
            return '';
        }
        return img.startsWith('/') ? img : `/${img}`;
    })();
    const afterSrc = (() => {
        if (!afterImage)
            return '';
        const img = typeof afterImage === 'string' ? afterImage : String(afterImage);
        if (img === '[object Object]' || img === 'undefined' || img === 'null') {
            console.error('BeforeAfterSlider: Invalid afterImage', afterImage);
            return '';
        }
        return img.startsWith('/') ? img : `/${img}`;
    })();
    // Validate that we have valid image paths
    if (!beforeSrc || beforeSrc === '/' || !afterSrc || afterSrc === '/') {
        console.error('BeforeAfterSlider: Invalid image paths', { beforeSrc, afterSrc, beforeImage, afterImage });
        return null;
    }
    // Debug: Log the image sources
    console.log('BeforeAfterSlider image sources:', { beforeSrc, afterSrc, beforeImage, afterImage });
    return (<>
      <Card className={`relative overflow-hidden group ${className}`}>
        <div className="w-full aspect-video relative bg-muted">
          <ReactCompareSlider itemOne={<ReactCompareSliderImage src={beforeSrc} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>} itemTwo={<ReactCompareSliderImage src={afterSrc} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>} position={position} onPositionChange={setPosition} onlyHandleDraggable={false} className="w-full h-full" handle={<ReactCompareSliderHandle buttonStyle={{
                backdropFilter: 'none',
                background: 'hsl(var(--secondary))',
                border: 0,
                color: 'hsl(var(--secondary-foreground))',
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                cursor: 'ew-resize',
            }} linesStyle={{
                background: 'hsl(var(--secondary))',
                width: 3,
            }} style={{
                cursor: 'ew-resize',
            }}/>} style={{
            cursor: 'ew-resize',
            width: '100%',
            height: '100%',
        }}/>
        </div>

        {/* Labels - pointer-events-none so they don't block slider interaction */}
        {showLabels && (<>
            <Badge className="absolute top-4 left-4 bg-background/80 text-foreground backdrop-blur-sm border-0 pointer-events-none z-10">
              {beforeLabel}
            </Badge>
            <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground pointer-events-none z-10">
              {afterLabel}
            </Badge>
          </>)}

        {/* Fullscreen Button - needs pointer-events-auto to be clickable */}
        {allowFullscreen && (<Button onClick={() => setIsFullscreen(true)} variant="secondary" size="sm" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto z-20">
            <Maximize2 className="h-4 w-4 mr-1"/>
            Expand
          </Button>)}

        {/* Instruction - pointer-events-none so it doesn't block slider interaction */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-100 group-hover:opacity-0 transition-opacity pointer-events-none z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            <MoveHorizontal className="h-3 w-3 mr-1"/>
            Drag to compare
          </Badge>
        </div>
      </Card>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {beforeLabel}
                </Badge>
                <span className="text-white/60">↔</span>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {afterLabel}
                </Badge>
              </div>

              <Button onClick={() => setIsFullscreen(false)} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <X className="h-5 w-5 mr-2"/>
                Close
              </Button>
            </div>

            {/* Fullscreen Slider */}
            <div className="flex-1 overflow-hidden">
              <ReactCompareSlider itemOne={<ReactCompareSliderImage src={beforeSrc} alt="Before"/>} itemTwo={<ReactCompareSliderImage src={afterSrc} alt="After"/>} position={position} onPositionChange={setPosition} onlyHandleDraggable={false} handle={<ReactCompareSliderHandle buttonStyle={{
                    backdropFilter: 'none',
                    background: 'hsl(var(--secondary))',
                    border: 0,
                    color: 'hsl(var(--secondary-foreground))',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'ew-resize',
                }} linesStyle={{
                    background: 'hsl(var(--secondary))',
                    width: 4,
                }} style={{
                    cursor: 'ew-resize',
                }}/>} className="h-full" style={{
                cursor: 'ew-resize',
            }}/>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/50 flex justify-center">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                <MoveHorizontal className="h-3 w-3 mr-1"/>
                Drag to compare
              </Badge>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </>);
}
