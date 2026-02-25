import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';
export function MobileImageGallery({ images, initialIndex = 0, onClose, }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const handleDragEnd = (_event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
        else if (info.offset.x < -swipeThreshold && currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    const handleDownload = async () => {
        const link = document.createElement('a');
        link.href = images[currentIndex];
        link.download = `image-${currentIndex + 1}.jpg`;
        link.click();
    };
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this design',
                    url: images[currentIndex],
                });
            }
            catch (error) {
                console.error('Share failed:', error);
            }
        }
    };
    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-area-top">
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleDownload} className="text-white hover:bg-white/10">
            <Download className="w-5 h-5"/>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleShare} className="text-white hover:bg-white/10">
            <Share2 className="w-5 h-5"/>
          </Button>

          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5"/>
          </Button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img key={currentIndex} src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} className="absolute inset-0 w-full h-full object-contain" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd}/>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (<Button variant="ghost" size="icon" onClick={handlePrevious} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 w-12 h-12">
            <ChevronLeft className="w-8 h-8"/>
          </Button>)}

        {currentIndex < images.length - 1 && (<Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 w-12 h-12">
            <ChevronRight className="w-8 h-8"/>
          </Button>)}
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 p-4 overflow-x-auto safe-area-bottom hide-scrollbar">
        {images.map((image, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentIndex
                ? 'border-white'
                : 'border-transparent opacity-50'}`}>
            <img src={image} alt="" className="w-full h-full object-cover"/>
          </button>))}
      </div>

      {/* Swipe Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-xs">
        ← Swipe to navigate →
      </div>
    </motion.div>);
}
