import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Maximize2, X, Move, RotateCcw, } from 'lucide-react';
export function RenderZoomViewer({ imageUrl, zoomPoints = [], viewName, className = '', }) {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedZoomPoint, setSelectedZoomPoint] = useState(null);
    const containerRef = useRef(null);
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.5, 5));
    };
    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.5, 1));
        if (zoom <= 1.5) {
            setPosition({ x: 0, y: 0 });
        }
    };
    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setSelectedZoomPoint(null);
    };
    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };
    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1 && containerRef.current) {
            const maxX = ((zoom - 1) * containerRef.current.clientWidth) / 2;
            const maxY = ((zoom - 1) * containerRef.current.clientHeight) / 2;
            const newX = Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.x));
            const newY = Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.y));
            setPosition({ x: newX, y: newY });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleZoomPointClick = (point) => {
        setSelectedZoomPoint(point);
        setZoom(point.zoom_level);
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            const targetX = (point.x_coordinate / 100) * containerWidth;
            const targetY = (point.y_coordinate / 100) * containerHeight;
            setPosition({
                x: containerWidth / 2 - targetX * point.zoom_level,
                y: containerHeight / 2 - targetY * point.zoom_level,
            });
        }
    };
    return (<Card className={`overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button onClick={handleZoomIn} disabled={zoom >= 5} variant="outline" size="sm" className="h-9 w-9 p-0">
            <ZoomIn className="h-4 w-4"/>
          </Button>

          <Button onClick={handleZoomOut} disabled={zoom <= 1} variant="outline" size="sm" className="h-9 w-9 p-0">
            <ZoomOut className="h-4 w-4"/>
          </Button>

          <Button onClick={handleReset} variant="outline" size="sm" className="h-9 w-9 p-0">
            <RotateCcw className="h-4 w-4"/>
          </Button>

          <Badge variant="secondary" className="ml-2">
            {Math.round(zoom * 100)}%
          </Badge>

          {zoom > 1 && (<span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
              <Move className="h-3 w-3"/>
              Drag to pan
            </span>)}
        </div>

        <div className="flex items-center gap-2">
          {viewName && (<Badge variant="outline">
              {viewName}
            </Badge>)}

          <Button onClick={() => setIsFullscreen(true)} variant="outline" size="sm" className="h-9">
            <Maximize2 className="h-4 w-4 mr-2"/>
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Zoom Points */}
      {zoomPoints.length > 0 && (<div className="flex gap-2 p-3 border-b border-border overflow-x-auto">
          {zoomPoints.map((point) => (<button key={point.id} onClick={() => handleZoomPointClick(point)} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedZoomPoint?.id === point.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'}`}>
              {point.point_name}
            </button>))}
        </div>)}

      {/* Image Viewer */}
      <div ref={containerRef} className="relative aspect-video overflow-hidden cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <motion.img src={imageUrl} alt={viewName || 'Render'} className="w-full h-full object-contain" animate={{
            scale: zoom,
            x: position.x,
            y: position.y,
        }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} draggable={false}/>

        {/* Zoom Point Markers */}
        {zoom === 1 &&
            zoomPoints.map((point) => (<button key={point.id} onClick={() => handleZoomPointClick(point)} className="absolute w-8 h-8 bg-primary rounded-full border-2 border-background shadow-lg flex items-center justify-center hover:scale-110 transition-transform group" style={{
                    left: `${point.x_coordinate}%`,
                    top: `${point.y_coordinate}%`,
                    transform: 'translate(-50%, -50%)',
                }}>
              <ZoomIn className="h-4 w-4 text-primary-foreground"/>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                {point.point_name}
              </span>
            </button>))}

        {/* Selected Point Description */}
        {selectedZoomPoint && selectedZoomPoint.description && (<div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg">
            <p className="font-semibold text-foreground">{selectedZoomPoint.point_name}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedZoomPoint.description}</p>
          </div>)}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Fullscreen Controls */}
            <div className="flex items-center justify-between p-4 bg-black/50">
              <div className="flex items-center gap-3">
                <Button onClick={handleZoomIn} disabled={zoom >= 5} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ZoomIn className="h-5 w-5"/>
                </Button>

                <Button onClick={handleZoomOut} disabled={zoom <= 1} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ZoomOut className="h-5 w-5"/>
                </Button>

                <Button onClick={handleReset} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <RotateCcw className="h-5 w-5"/>
                </Button>

                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {Math.round(zoom * 100)}%
                </Badge>
              </div>

              <Button onClick={() => setIsFullscreen(false)} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <X className="h-5 w-5 mr-2"/>
                Exit Fullscreen
              </Button>
            </div>

            {/* Fullscreen Image */}
            <div className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
              <motion.img src={imageUrl} alt={viewName || 'Render'} className="max-w-full max-h-full object-contain" animate={{
                scale: zoom,
                x: position.x,
                y: position.y,
            }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} draggable={false}/>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </Card>);
}
