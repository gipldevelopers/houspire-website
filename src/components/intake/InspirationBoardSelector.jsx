import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, FolderHeart, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInspirationBoards } from '@/lib/inspiration-service';
export function InspirationBoardSelector({ selectedBoardIds, onSelectionChange }) {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadBoards();
    }, []);
    async function loadBoards() {
        setLoading(true);
        const data = await getInspirationBoards();
        setBoards(data);
        setLoading(false);
    }
    function toggleBoard(boardId) {
        if (selectedBoardIds.includes(boardId)) {
            onSelectionChange(selectedBoardIds.filter(id => id !== boardId));
        }
        else {
            onSelectionChange([...selectedBoardIds, boardId]);
        }
    }
    const totalImages = boards.reduce((sum, b) => sum + (b.image_count || 0), 0);
    if (loading) {
        return (<Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full"/>
          <Skeleton className="h-6 w-48"/>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl"/>
          <Skeleton className="h-16 w-full rounded-xl"/>
        </div>
      </Card>);
    }
    return (<Card className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <FolderHeart className="h-5 w-5 text-pink-500"/>
        <h3 className="font-semibold">Your Inspiration Boards</h3>
        {selectedBoardIds.length > 0 && (<Badge className="ml-auto bg-pink-100 text-pink-700 border-0">
            {selectedBoardIds.length} attached
          </Badge>)}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {boards.length > 0
            ? `Attach your saved designs for designer reference • ${totalImages} images available`
            : 'Save designs from our gallery to share with your designer'}
      </p>

      {boards.length > 0 ? (<div className="space-y-3">
          {boards.map(board => (<div key={board.id} className={`
                flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all
                ${selectedBoardIds.includes(board.id)
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20'
                    : 'border-border hover:border-muted-foreground/30'}
              `} onClick={() => toggleBoard(board.id)}>
              {/* Checkbox */}
              <Checkbox checked={selectedBoardIds.includes(board.id)} onCheckedChange={() => toggleBoard(board.id)} className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"/>
              
              {/* Cover image or placeholder */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {board.cover_image ? (<img src={board.cover_image} alt="" className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-muted-foreground"/>
                  </div>)}
              </div>
              
              {/* Board info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium truncate">{board.name}</h4>
                  {board.is_default && (<Badge variant="secondary" className="text-xs">Default</Badge>)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {board.image_count || 0} saved image{(board.image_count || 0) !== 1 ? 's' : ''}
                </p>
              </div>
            </div>))}

          <Link to="/dashboard/inspiration" target="_blank" className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 pt-2">
            <ExternalLink className="h-4 w-4"/>
            Manage your boards
          </Link>
        </div>) : (<div className="text-center py-6 bg-muted/50 rounded-xl">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3"/>
          <p className="text-muted-foreground mb-4">
            No inspiration boards yet
          </p>
          <Link to="/discover" target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <Heart className="h-4 w-4"/>
              Browse Gallery
            </Button>
          </Link>
        </div>)}
    </Card>);
}
