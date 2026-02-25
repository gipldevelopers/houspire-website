import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
export function QuizImagePreview({ image, title, description, onClose }) {
    return (<AnimatePresence>
      {image && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl">
            {/* Close button */}
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors">
              <X className="h-5 w-5"/>
            </button>

            {/* Image */}
            <div className="aspect-video">
              <img src={image} alt={title} className="w-full h-full object-cover"/>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}
// Long press hook for mobile preview
import { useRef, useCallback } from 'react';
export function useLongPress(callback, ms = 500) {
    const timerRef = useRef(null);
    const isLongPress = useRef(false);
    const start = useCallback(() => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            callback();
        }, ms);
    }, [callback, ms]);
    const stop = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
        isLongPress,
    };
}
