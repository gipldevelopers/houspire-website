import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, FolderHeart, Image as ImageIcon } from 'lucide-react';
import { getOrderInspirationBoards, getOrderInspirationImages } from '@/lib/inspiration-service';
export function CustomerInspirations({ orderId, variant = 'full' }) {
    const [boards, setBoards] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        loadInspirations();
    }, [orderId]);
    async function loadInspirations() {
        setLoading(true);
        const [boardsData, imagesData] = await Promise.all([
            getOrderInspirationBoards(orderId),
            getOrderInspirationImages(orderId)
        ]);
        setBoards(boardsData);
        setImages(imagesData);
        setLoading(false);
    }
    if (loading) {
        return (<Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-8 h-8 rounded-lg"/>
          <Skeleton className="h-5 w-40"/>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (<Skeleton key={i} className="aspect-square rounded-lg"/>))}
        </div>
      </Card>);
    }
    if (boards.length === 0) {
        return null; // Don't show section if no boards attached
    }
    if (variant === 'compact') {
        return (<div className="space-y-3">
        <div className="flex items-center gap-2">
          <FolderHeart className="h-4 w-4 text-pink-500"/>
          <span className="text-sm font-medium">Customer Inspirations</span>
          <Badge variant="secondary" className="text-xs">
            {images.length} images
          </Badge>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.slice(0, 6).map(img => (<Dialog key={img.id}>
              <DialogTrigger asChild>
                <button className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 hover:ring-2 hover:ring-primary transition-all">
                  <img src={img.image_url} alt={img.title || 'Inspiration'} className="w-full h-full object-cover"/>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <img src={img.image_url} alt={img.title || 'Inspiration'} className="w-full max-h-[80vh] object-contain"/>
                {(img.title || img.notes || img.room_type || img.style) && (<div className="p-4 border-t">
                    {img.title && <h3 className="font-medium">{img.title}</h3>}
                    {img.notes && <p className="text-sm text-muted-foreground mt-1">{img.notes}</p>}
                    <div className="flex gap-2 mt-2">
                      {img.room_type && <Badge variant="secondary">{img.room_type}</Badge>}
                      {img.style && <Badge variant="secondary">{img.style}</Badge>}
                    </div>
                  </div>)}
              </DialogContent>
            </Dialog>))}
          {images.length > 6 && (<div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground">+{images.length - 6}</span>
            </div>)}
        </div>
      </div>);
    }
    return (<Card className="p-6 border-2 border-pink-100 dark:border-pink-900/30 bg-gradient-to-br from-pink-50/50 to-rose-50/30 dark:from-pink-950/20 dark:to-rose-950/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
            <FolderHeart className="h-5 w-5 text-pink-600"/>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Customer Inspiration Boards</h3>
            <p className="text-sm text-muted-foreground">
              {boards.length} board{boards.length !== 1 ? 's' : ''} • {images.length} saved image{images.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Board names */}
      <div className="flex flex-wrap gap-2 mb-4">
        {boards.map(board => (<Badge key={board.id} variant="outline" className="bg-white dark:bg-neutral-900">
            <Heart className="h-3 w-3 mr-1 text-pink-500"/>
            {board.name}
          </Badge>))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {images.map(img => (<Dialog key={img.id}>
            <DialogTrigger asChild>
              <button className="relative aspect-square rounded-xl overflow-hidden bg-muted group hover:ring-2 hover:ring-pink-500 transition-all">
                <img src={img.image_url} alt={img.title || 'Inspiration'} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
                {img.notes && (<div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-xs text-white/90 line-clamp-2">{img.notes}</p>
                  </div>)}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <img src={img.image_url} alt={img.title || 'Inspiration'} className="w-full max-h-[70vh] object-contain bg-black"/>
              <div className="p-4">
                {img.title && <h3 className="font-semibold text-lg mb-1">{img.title}</h3>}
                {img.notes && (<p className="text-muted-foreground mb-3">{img.notes}</p>)}
                <div className="flex flex-wrap gap-2">
                  {img.room_type && (<Badge variant="secondary" className="capitalize">
                      {img.room_type.replace('_', ' ')}
                    </Badge>)}
                  {img.style && (<Badge variant="secondary" className="capitalize">
                      {img.style.replace('_', ' ')}
                    </Badge>)}
                </div>
              </div>
            </DialogContent>
          </Dialog>))}
      </div>

      {images.length === 0 && (<div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50"/>
          <p className="text-sm">Boards attached but no images saved yet</p>
        </div>)}
    </Card>);
}
