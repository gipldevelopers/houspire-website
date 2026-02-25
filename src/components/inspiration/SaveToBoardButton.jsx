import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, FolderHeart, Check, FolderPlus, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getInspirationBoards, saveToBoard, isImageSaved, createBoard, getOrCreateDefaultBoard } from '@/lib/inspiration-service';

export function SaveToBoardButton({ imageUrl, sourceType, sourceId, roomType, style, designTitle, variant = 'icon', size = 'default', className = '' }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [savedBoardId, setSavedBoardId] = useState(null);
    const [creating, setCreating] = useState(false);
    const [showNewBoard, setShowNewBoard] = useState(false);
    
    // Form state
    const [newBoardName, setNewBoardName] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        checkIfSaved();
    }, [imageUrl]);

    useEffect(() => {
        if (open) {
            loadBoards();
        }
    }, [open]);

    // Listen for board updates
    useEffect(() => {
      const handleUpdate = () => {
        checkIfSaved();
        if (open) loadBoards();
      };
      window.addEventListener('boardsUpdated', handleUpdate);
      return () => window.removeEventListener('boardsUpdated', handleUpdate);
    }, [open]);

    async function checkIfSaved() {
        const result = await isImageSaved(imageUrl);
        setSaved(result.saved);
        setSavedBoardId(result.boardId || null);
    }

    async function loadBoards() {
        setLoading(true);
        const data = await getInspirationBoards();
        // If no boards exist, default board will be created during selection if needed,
        // but for UX we just show what exists
        setBoards(data);
        setLoading(false);
    }

    async function handleSaveToBoard(boardId) {
        setSaving(true);
        const success = await saveToBoard(boardId, imageUrl, sourceType, {
            sourceId,
            title: designTitle,
            notes: notes || undefined,
            roomType,
            style
        });

        if (success) {
            toast({
                title: 'Saved to board! ✨',
                description: 'Image added to your inspiration board'
            });
            setSaved(true);
            setSavedBoardId(boardId);
            setOpen(false);
            setNotes('');
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed to save',
                description: 'Could not save image. Please try again.'
            });
        }
        setSaving(false);
    }

    async function handleCreateBoard() {
        if (!newBoardName.trim()) {
            return;
        }
        setCreating(true);
        const board = await createBoard(newBoardName.trim());
        if (board) {
            await handleSaveToBoard(board.id);
            setNewBoardName('');
            setShowNewBoard(false);
        }
        setCreating(false);
    }

    function handleTriggerClick(e) {
        e.stopPropagation();
        e.preventDefault();
        setOpen(true);
    }

    const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
    const buttonSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';

    const trigger = variant === 'icon' ? (
      <Button 
        size="icon" 
        variant="secondary" 
        className={`${buttonSize} rounded-full bg-background/90 text-foreground backdrop-blur-sm hover:bg-background shadow-md transition-all ${saved ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`} 
        onClick={handleTriggerClick} 
        disabled={saving}
      >
        {saving ? (<Loader2 className={`${iconSize} animate-spin`}/>) : (<FolderHeart className={`${iconSize} ${saved ? 'fill-current' : ''}`}/>)}
      </Button>
    ) : (
      <Button variant={saved ? 'default' : 'outline'} size={size} className={className} onClick={handleTriggerClick}>
        <FolderPlus className={`h-4 w-4 mr-2`}/>
        {saved ? 'Collected' : 'Add to collection'}
      </Button>
    );

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderHeart className="h-5 w-5 text-primary"/>
              Save to Inspiration Board
            </DialogTitle>
            <DialogDescription>
              Organize your favorite designs for easy reference
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Add a note (optional)</Label>
              <Textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Why you like this design..." 
                rows={2} 
                className="resize-none"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Choose a board</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {boards.length > 0 ? (
                    boards.map(board => (
                      <Button 
                        key={board.id} 
                        variant={savedBoardId === board.id ? 'default' : 'outline'} 
                        className="w-full justify-between h-12 rounded-xl" 
                        onClick={() => handleSaveToBoard(board.id)} 
                        disabled={saving}
                      >
                        <span className="flex items-center gap-2">
                          {savedBoardId === board.id && <Check className="h-4 w-4"/>}
                          {board.name}
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                          {board.image_count || 0}
                        </span>
                      </Button>
                    ))
                  ) : (
                    <p className="text-xs text-center py-4 text-muted-foreground">No boards found. Create one below!</p>
                  )}
                </div>
              </div>
            )}

            {showNewBoard ? (
              <div className="pt-4 border-t space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New board name</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newBoardName} 
                    onChange={(e) => setNewBoardName(e.target.value)} 
                    placeholder="e.g., Living Room Ideas" 
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()} 
                    autoFocus
                    className="rounded-xl h-11"
                  />
                  <Button onClick={handleCreateBoard} disabled={creating || !newBoardName.trim()} className="rounded-xl h-11 px-6">
                    {creating ? (<Loader2 className="h-4 w-4 animate-spin"/>) : ('Create')}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowNewBoard(false)} className="text-xs font-bold text-muted-foreground">
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full h-11 rounded-xl border-dashed" onClick={() => setShowNewBoard(true)}>
                <Plus className="h-4 w-4 mr-2"/>
                Create new board
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
}
