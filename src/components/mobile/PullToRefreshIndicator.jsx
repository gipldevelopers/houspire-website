import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowDown } from 'lucide-react';
export function PullToRefreshIndicator({ isPulling, isRefreshing, pullDistance, threshold = 80, }) {
    const progress = Math.min((pullDistance / threshold) * 100, 100);
    const shouldTrigger = pullDistance >= threshold;
    return (<AnimatePresence>
      {(isPulling || isRefreshing) && (<motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: pullDistance }} exit={{ opacity: 0, y: -50 }} className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            {isRefreshing ? (<RefreshCw className="w-6 h-6 text-primary animate-spin"/>) : (<motion.div animate={{ rotate: shouldTrigger ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowDown className="w-6 h-6 text-primary"/>
              </motion.div>)}

            {/* Progress Ring */}
            <svg className="absolute inset-0 w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${progress * 1.26} 126`} className="text-primary/30"/>
            </svg>
          </div>

          {!isRefreshing && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs font-medium text-muted-foreground bg-white/80 px-3 py-1 rounded-full">
              {shouldTrigger ? 'Release to refresh' : 'Pull to refresh'}
            </motion.p>)}
        </motion.div>)}
    </AnimatePresence>);
}
