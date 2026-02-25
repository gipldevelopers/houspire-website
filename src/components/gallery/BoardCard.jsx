import React from 'react';
import { motion } from 'framer-motion';
import { Lock, MoreHorizontal, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function BoardCard({ board, onClick }) {
  const { toast } = useToast();
  
  // Get real cover image from first item or fallback
  const firstItem = board.items?.[0];
  const coverImage = firstItem?.image_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80';
  
  // Get real item count
  const itemsCount = board.items?.length || 0;

  const handleShare = (e) => {
    e.stopPropagation();
    const shareText = `Check out my "${board.name}" inspiration board on Houspire! ✨\n\nI've saved ${itemsCount} designs to my collection.`;
    
    if (navigator.share) {
      navigator.share({
        title: `Houspire Board: ${board.name}`,
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      toast({
        title: "Board shared!",
        description: "Summary copied to clipboard. ✨",
        duration: 2000,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-md transition-all duration-300">
        <img
          src={coverImage}
          alt={board.name}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Secret Badge */}
        {board.isSecret && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm z-10">
            <Lock className="h-3 w-3 text-foreground" />
          </div>
        )}
        
        {/* Share Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex gap-2">
          <button 
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white text-foreground transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-foreground truncate">{board.name}</h3>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
          {itemsCount} {itemsCount === 1 ? 'Design' : 'Designs'}
        </p>
      </div>
    </motion.div>
  );
}
