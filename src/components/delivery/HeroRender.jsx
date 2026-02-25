import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, Share2 } from 'lucide-react';
export function HeroRender({ render, roomType, styleName, generatedAt, onZoomClick, onShareClick, }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const handleDownload = async () => {
        if (!render?.url)
            return;
        try {
            const response = await fetch(render.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `houspire-${roomType.toLowerCase().replace(/\s+/g, '-')}-design.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Download failed:', error);
        }
    };
    if (!render?.url) {
        return (<div className="relative w-full aspect-[16/9] rounded-2xl bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Design render will appear here</p>
      </div>);
    }
    const formattedDate = new Date(generatedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return (<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden group cursor-pointer" onClick={onZoomClick}>
      {/* Loading skeleton */}
      {!imageLoaded && (<div className="absolute inset-0 bg-muted animate-pulse"/>)}

      {/* Main image */}
      <img src={render.url} alt={`${roomType} - ${styleName} Design`} className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImageLoaded(true)}/>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">{render.label}</p>
            <h3 className="text-white text-xl md:text-2xl font-semibold">
              {roomType} • {styleName}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Generated on {formattedDate}
            </p>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0" onClick={(e) => {
            e.stopPropagation();
            onShareClick();
        }}>
              <Share2 className="h-4 w-4 mr-2"/>
              Share
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0" onClick={(e) => {
            e.stopPropagation();
            handleDownload();
        }}>
              <Download className="h-4 w-4 mr-2"/>
              Download HD
            </Button>
          </div>
        </div>
      </div>

      {/* Zoom icon on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
          <ZoomIn className="h-5 w-5 text-white"/>
        </div>
      </div>
    </motion.div>);
}
