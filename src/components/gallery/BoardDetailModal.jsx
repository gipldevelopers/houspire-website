import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, LayoutGrid, Lock, Globe, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { removeFromBoard } from '@/lib/inspiration-service';
import { useToast } from '@/hooks/use-toast';

export function BoardDetailModal({ isOpen, onClose, board, onUpdate }) {
  const { toast } = useToast();

  if (!board) return null;

  const handleRemoveItem = async (e, itemId) => {
    e.stopPropagation();
    const success = await removeFromBoard(itemId);
    if (success) {
      toast({
        title: "Removed from board",
        description: "Design has been removed from your collection.",
      });
      if (onUpdate) onUpdate();
    }
  };

  const designs = board.items || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6"
        >
          {/* Close Backdrop Click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] bg-background rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-border/10 bg-secondary/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <LayoutGrid className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {board.name}
                    {board.isSecret ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    {designs.length} {designs.length === 1 ? 'Saved Design' : 'Saved Designs'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-3 rounded-full hover:bg-secondary/80 transition-all active:scale-95 shadow-sm"
              >
                <X className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>

            {/* Scrollable Gallery Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
              {designs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {designs.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative rounded-3xl overflow-hidden bg-muted aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title || 'Saved design'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Action Buttons Top Right */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                        <button
                          onClick={(e) => handleRemoveItem(e, item.id)}
                          className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg"
                          title="Remove from board"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Content Overlay Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h4 className="text-white font-bold text-sm truncate mb-1">
                          {item.title || 'Living Room Design'}
                        </h4>
                        <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">
                          {item.roomType?.replace('_', ' ') || 'Interior'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                    <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">This board is empty</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
                    Browse the gallery and click the heart icon to save your favorite designs here.
                  </p>
                  <Button
                    onClick={onClose}
                    className="mt-8 rounded-full h-12 px-8 bg-primary text-white font-bold"
                  >
                    Go Exploring
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            {designs.length > 0 && (
              <div className="p-6 md:p-8 border-t border-border/10 bg-secondary/5 flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-medium italic">
                  Tip: Board collections are saved locally in your browser.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Customizing boards is not fully available yet.",
                    })
                  }}
                  className="rounded-full h-11 px-6 text-xs font-bold uppercase tracking-widest border-secondary/50"
                >
                  Board Settings
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
