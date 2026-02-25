'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ChevronRight, FolderHeart, Plus } from 'lucide-react';
import { getInspirationBoards } from '@/lib/inspiration-service';

export function InspirationBoardsCard() {
  const router = useRouter();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    setLoading(true);
    const data = await getInspirationBoards();
    setBoards(data);
    setTotalImages(data.reduce((sum, b) => sum + (b.image_count || 0), 0));
    setLoading(false);
  }

  if (loading) {
    return (
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
          <Skeleton className="w-16 h-16 rounded-lg" />
        </div>
      </Card>
    );
  }

  // Get cover images from boards
  const coverImages = boards
    .filter(b => b.cover_image)
    .slice(0, 4)
    .map(b => b.cover_image);

  return (
    <Card className="p-4 border-border/50 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/inspiration')}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
            <FolderHeart className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">Inspiration Boards</h4>
            <p className="text-xs text-muted-foreground">
              {boards.length > 0 
                ? `${boards.length} board${boards.length !== 1 ? 's' : ''} • ${totalImages} saved`
                : 'Save designs you love'
              }
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>

      {/* Image previews or empty state */}
      {coverImages.length > 0 ? (
        <div className="flex gap-2">
          {coverImages.map((img, idx) => (
            <div key={idx} className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {boards.length > 4 && (
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-muted-foreground font-medium">+{boards.length - 4}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5" />
          <span>Browse gallery & save your favorites</span>
        </div>
      )}
    </Card>
  );
}
