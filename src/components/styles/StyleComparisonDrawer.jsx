'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import {
  X,
  ArrowRight,
  Star,
  Users,
  Briefcase,
  Check,
  Scale,
} from 'lucide-react';

export function StyleComparisonDrawer({
  selectedStyles,
  onRemove,
  onClear,
  maxStyles = 3,
}) {
  const router = useRouter();
  const isVisible = selectedStyles.length > 0;

  const handleCompare = () => {
    const slugs = selectedStyles.map(s => s.slug).join(',');
    router.push(`/styles/compare?styles=${slugs}`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border rounded-2xl shadow-2xl p-4 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compare Styles</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStyles.length} of {maxStyles} selected
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5" onClick={onClear}>
                  Clear All
                </button>
              </div>

              {/* Selected Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {[...Array(maxStyles)].map((_, idx) => {
                  const style = selectedStyles[idx];
                  
                  if (!style) {
                    return (
                      <div
                        key={idx}
                        className="h-24 rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          Add style {idx + 1}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={style.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="relative group rounded-xl overflow-hidden bg-muted"
                    >
                      <div className="h-24 relative">
                        {style.cover_image_url ? (
                          <img
                            src={style.cover_image_url}
                            alt={style.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-8">
                          <p className="text-white font-medium text-sm truncate">
                            {style.name}
                          </p>
                          <div className="flex items-center gap-2 text-white/80 text-xs">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {style.avg_rating?.toFixed(1)}
                            <span className="text-white/50">•</span>
                            <Users className="w-3 h-3" />
                            {style.designer_count}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemove(style)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Compare Button */}
              <button
                onClick={handleCompare}
                disabled={selectedStyles.length < 2}
                className={`w-full h-12 text-base rounded-xl flex items-center justify-center font-medium transition-all ${selectedStyles.length < 2 ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'btn-primary'}`}
              >
                {selectedStyles.length < 2 ? (
                  'Select at least 2 styles to compare'
                ) : (
                  <>
                    Compare {selectedStyles.length} Styles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
