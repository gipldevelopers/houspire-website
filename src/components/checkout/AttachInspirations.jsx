import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, FolderHeart, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getInspirationBoards } from '@/lib/inspiration-service';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
export function AttachInspirations({ selectedBoardIds, onSelectionChange }) {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        loadBoards();
    }, []);
    async function loadBoards() {
        setLoading(true);
        const data = await getInspirationBoards();
        setBoards(data);
        setLoading(false);
        // Auto-expand if user has boards
        if (data.length > 0) {
            setIsOpen(true);
        }
    }
    function toggleBoard(boardId) {
        if (selectedBoardIds.includes(boardId)) {
            onSelectionChange(selectedBoardIds.filter(id => id !== boardId));
        }
        else {
            onSelectionChange([...selectedBoardIds, boardId]);
        }
    }
    if (loading) {
        return (<Card className="p-6 border-2 border-neutral-200 rounded-2xl">
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
    const totalImages = boards.reduce((sum, b) => sum + (b.image_count || 0), 0);
    return (<Card className="p-6 border-2 border-neutral-200 rounded-2xl overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <FolderHeart className="h-5 w-5 text-pink-600"/>
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-neutral-900">
                  Attach Inspiration Boards
                </h2>
                <p className="text-sm text-neutral-600">
                  {boards.length > 0
            ? `Share your saved designs with your designer • ${totalImages} images available`
            : 'Save designs from our gallery to share with your designer'}
                </p>
              </div>
            </div>
            {boards.length > 0 && (<div className="flex items-center gap-2">
                {selectedBoardIds.length > 0 && (<Badge className="bg-pink-100 text-pink-700 border-0">
                    {selectedBoardIds.length} selected
                  </Badge>)}
                {isOpen ? (<ChevronUp className="h-5 w-5 text-neutral-400"/>) : (<ChevronDown className="h-5 w-5 text-neutral-400"/>)}
              </div>)}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-3">
            {boards.length > 0 ? (<>
                <p className="text-sm text-neutral-600 mb-4">
                  Select boards to share as references. Your designer will see these for inspiration.
                </p>
                
                {boards.map(board => (<div key={board.id} className={`
                      flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${selectedBoardIds.includes(board.id)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-neutral-200 hover:border-neutral-300'}
                    `} onClick={() => toggleBoard(board.id)}>
                    {/* Checkbox */}
                    <Checkbox checked={selectedBoardIds.includes(board.id)} onCheckedChange={() => toggleBoard(board.id)} className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"/>
                    
                    {/* Cover image or placeholder */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {board.cover_image ? (<img src={board.cover_image} alt="" className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-neutral-300"/>
                        </div>)}
                    </div>
                    
                    {/* Board info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-neutral-900 truncate">{board.name}</h4>
                        {board.is_default && (<Badge variant="secondary" className="text-xs">Default</Badge>)}
                      </div>
                      <p className="text-sm text-neutral-600">
                        {board.image_count || 0} saved image{(board.image_count || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>))}

                <Link to="/dashboard/inspiration" target="_blank" className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 mt-4">
                  <ExternalLink className="h-4 w-4"/>
                  Manage your boards
                </Link>
              </>) : (<div className="text-center py-6">
                <Heart className="h-10 w-10 text-neutral-300 mx-auto mb-3"/>
                <p className="text-neutral-600 mb-4">
                  You haven't saved any inspirations yet
                </p>
                <Link to="/discover">
                  <Button variant="outline" className="rounded-xl">
                    Browse Design Gallery
                  </Button>
                </Link>
              </div>)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>);
}
