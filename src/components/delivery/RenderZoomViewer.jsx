import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight, } from 'lucide-react';
export function RenderZoomViewer({ isOpen, onClose, renders, initialIndex }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const currentRender = renders[currentIndex];
    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);
    useEffect(() => {
        if (isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    }, [isOpen, currentIndex]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen)
                return;
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    if (currentIndex > 0)
                        setCurrentIndex(prev => prev - 1);
                    break;
                case 'ArrowRight':
                    if (currentIndex < renders.length - 1)
                        setCurrentIndex(prev => prev + 1);
                    break;
                case '+':
                case '=':
                    setScale(prev => Math.min(prev + 0.5, 4));
                    break;
                case '-':
                    setScale(prev => Math.max(prev - 0.5, 0.5));
                    break;
                case '0':
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, renders.length, onClose]);
    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5));
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };
    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y
            };
        }
    };
    const handleMouseMove = (e) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y,
            });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleDownload = async () => {
        if (!currentRender?.url)
            return;
        try {
            const response = await fetch(currentRender.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `houspire-design-${currentIndex + 1}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error('Download failed:', error);
        }
    };
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prev => Math.max(0.5, Math.min(4, prev + delta)));
    };
    if (!isOpen)
        return null;
    return (<AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95" onClick={onClose}>
        {/* Controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}>
            <ZoomOut className="h-4 w-4"/>
          </Button>
          <span className="text-white text-sm font-medium px-3">
            {Math.round(scale * 100)}%
          </span>
          <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}>
            <ZoomIn className="h-4 w-4"/>
          </Button>
          <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={(e) => { e.stopPropagation(); handleReset(); }}>
            <RotateCcw className="h-4 w-4"/>
          </Button>
          <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={(e) => { e.stopPropagation(); handleDownload(); }}>
            <Download className="h-4 w-4"/>
          </Button>
        </div>

        {/* Close button */}
        <Button size="icon" variant="ghost" className="absolute top-4 right-4 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={onClose}>
          <X className="h-5 w-5"/>
        </Button>

        {/* Navigation arrows */}
        {currentIndex > 0 && (<Button size="icon" variant="ghost" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev - 1); }}>
            <ChevronLeft className="h-6 w-6"/>
          </Button>)}
        {currentIndex < renders.length - 1 && (<Button size="icon" variant="ghost" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 text-white" onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev + 1); }}>
            <ChevronRight className="h-6 w-6"/>
          </Button>)}

        {/* Image container */}
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} onClick={(e) => e.stopPropagation()} style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}>
          <motion.img key={currentIndex} src={currentRender?.url} alt={currentRender?.label} className="max-w-[90vw] max-h-[85vh] object-contain select-none" initial={{ opacity: 0, scale: 0.9 }} animate={{
            opacity: 1,
            scale: scale,
            x: position.x,
            y: position.y,
        }} transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
        }} draggable={false}/>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="text-white/80 text-sm">
            {currentRender?.label} • {currentIndex + 1} of {renders.length}
          </p>
          <p className="text-white/50 text-xs mt-1">
            Use arrow keys to navigate, scroll to zoom
          </p>
        </div>

        {/* Thumbnails */}
        {renders.length > 1 && (<div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {renders.map((render, index) => (<button key={index} onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }} className={`w-12 h-8 rounded overflow-hidden transition-all ${index === currentIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                    : 'opacity-50 hover:opacity-80'}`}>
                <img src={render.url} alt={render.label} className="w-full h-full object-cover"/>
              </button>))}
          </div>)}
      </motion.div>
    </AnimatePresence>);
}
