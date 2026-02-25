import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, X } from 'lucide-react';
export function DesignerVideoIntro({ videoUrl, designerName, avatarUrl, compact = false }) {
    const [isOpen, setIsOpen] = useState(false);
    if (!videoUrl)
        return null;
    // Detect video type (YouTube, Vimeo, or direct URL)
    const getEmbedUrl = (url) => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
        }
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }
        // Direct video URL
        return url;
    };
    const embedUrl = getEmbedUrl(videoUrl);
    const isDirectVideo = embedUrl === videoUrl;
    if (compact) {
        return (<>
        <Badge className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 transition-colors" onClick={() => setIsOpen(true)}>
          <Play className="h-3 w-3 mr-1"/>
          Watch Intro
        </Badge>

        <VideoModal isOpen={isOpen} onClose={() => setIsOpen(false)} embedUrl={embedUrl} isDirectVideo={isDirectVideo} designerName={designerName}/>
      </>);
    }
    return (<>
      <motion.div whileHover={{ scale: 1.02 }} className="relative group cursor-pointer rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5" onClick={() => setIsOpen(true)}>
        {/* Thumbnail/Avatar background */}
        <div className="aspect-video relative">
          {avatarUrl ? (<img src={avatarUrl} alt={designerName} className="w-full h-full object-cover opacity-60 blur-sm"/>) : (<div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10"/>)}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"/>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:bg-white transition-colors">
              <Play className="h-7 w-7 text-primary ml-1"/>
            </motion.div>
          </div>
          
          {/* Label */}
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
              <Play className="h-3 w-3 mr-1.5"/>
              Video Introduction
            </Badge>
          </div>
        </div>
      </motion.div>

      <VideoModal isOpen={isOpen} onClose={() => setIsOpen(false)} embedUrl={embedUrl} isDirectVideo={isDirectVideo} designerName={designerName}/>
    </>);
}
function VideoModal({ isOpen, onClose, embedUrl, isDirectVideo, designerName }) {
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Video Introduction - {designerName}</DialogTitle>
        </DialogHeader>
        
        {/* Close Button */}
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 z-10 text-white hover:bg-white/20 rounded-full">
          <X className="h-5 w-5"/>
        </Button>

        <div className="aspect-video w-full">
          {isDirectVideo ? (<video src={embedUrl} controls autoPlay className="w-full h-full">
              Your browser does not support the video tag.
            </video>) : (<iframe src={embedUrl} title={`${designerName} Introduction`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>)}
        </div>
      </DialogContent>
    </Dialog>);
}
