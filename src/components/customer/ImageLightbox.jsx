import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2, Minimize2, RotateCw } from 'lucide-react';
export default function ImageLightbox({ images, initialIndex = 0, isOpen, onClose, roomName }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);
    useEffect(() => {
        if (!isOpen) {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            return;
        }
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    handleNext();
                    break;
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                    handleZoomOut();
                    break;
                case '0':
                    handleResetZoom();
                    break;
            }
        };
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [isOpen, currentIndex, images.length]);
    const handlePrevious = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [images.length]);
    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [images.length]);
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.5, 4));
    };
    const handleZoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.5, 1);
            if (newZoom <= 1) {
                setPosition({ x: 0, y: 0 });
            }
            return newZoom;
        });
    };
    const handleResetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };
    const handleMouseDown = (e) => {
        if (zoom > 1) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };
    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleDownload = () => {
        const currentImage = images[currentIndex];
        const link = document.createElement('a');
        link.href = currentImage.url;
        link.download = `${roomName || 'design'}-${currentIndex + 1}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
            else {
                await document.exitFullscreen();
            }
        }
        catch (error) {
            console.error('Fullscreen error:', error);
        }
    };
    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        }
        else {
            handleZoomOut();
        }
    };
    if (!isOpen || images.length === 0)
        return null;
    const currentImage = images[currentIndex];
    return (<AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={(e) => {
            if (e.target === e.currentTarget)
                onClose();
        }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <div className="flex items-center gap-3">
            {roomName && (<Badge variant="outline" className="text-white border-white/30">
                {roomName}
              </Badge>)}
            {currentImage.angle && (<Badge variant="outline" className="text-white/70 border-white/20 capitalize">
                {currentImage.angle} view
              </Badge>)}
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-6 w-6"/>
          </Button>
        </div>

        {/* Main Image Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} style={{
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}>
          <motion.img key={currentIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={currentImage.url} alt={`${roomName} design ${currentIndex + 1}`} className="max-w-[90vw] max-h-[75vh] object-contain select-none" style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }} draggable={false}/>

          {/* Navigation Arrows */}
          {images.length > 1 && (<>
              <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12" onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
            }}>
                <ChevronLeft className="h-8 w-8"/>
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12" onClick={(e) => {
                e.stopPropagation();
                handleNext();
            }}>
                <ChevronRight className="h-8 w-8"/>
              </Button>
            </>)}
        </div>

        {/* Bottom Controls */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 1} className="text-white hover:bg-white/20 h-9 w-9 disabled:opacity-50">
                <ZoomOut className="h-5 w-5"/>
              </Button>
              <span className="text-white text-sm min-w-[50px] text-center font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 4} className="text-white hover:bg-white/20 h-9 w-9 disabled:opacity-50">
                <ZoomIn className="h-5 w-5"/>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetZoom} disabled={zoom === 1} className="text-white hover:bg-white/20 text-xs px-2 disabled:opacity-50">
                <RotateCw className="h-4 w-4"/>
              </Button>
            </div>

            {/* Download Button */}
            <Button variant="ghost" size="icon" onClick={handleDownload} className="text-white hover:bg-white/10">
              <Download className="h-5 w-5"/>
            </Button>

            {/* Fullscreen Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
              {isFullscreen ? (<Minimize2 className="h-5 w-5"/>) : (<Maximize2 className="h-5 w-5"/>)}
            </Button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <p className="text-white/40 text-xs text-center hidden md:block">
            ← → navigate • +/- zoom • scroll to zoom • 0 reset • ESC close • drag to pan
          </p>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (<div className="pb-4 px-4">
            <div className="flex justify-center gap-2 overflow-x-auto max-w-full">
              {images.map((image, index) => (<button key={index} onClick={() => {
                    setCurrentIndex(index);
                    setZoom(1);
                    setPosition({ x: 0, y: 0 });
                }} className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded overflow-hidden border-2 transition-all ${index === currentIndex
                    ? 'border-white ring-2 ring-white/50'
                    : 'border-white/30 hover:border-white/60 opacity-60 hover:opacity-100'}`}>
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                </button>))}
            </div>
          </div>)}
      </motion.div>
    </AnimatePresence>);
}
