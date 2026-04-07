import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { X, Save, Download, Share2, ZoomIn, ZoomOut, ArrowLeftRight, Grid3x3, Columns, Trash2, } from 'lucide-react';
export function ComparisonTool({ projectId, items, comparisonType, onClose, }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState('split');
    const [sliderPosition, setSliderPosition] = useState(50);
    const [zoom, setZoom] = useState(100);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [comparisonName, setComparisonName] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [savedComparisons, setSavedComparisons] = useState([]);
    const sliderRef = useRef(null);
    useEffect(() => {
        if (items.length >= 2) {
            setSelectedItems([items[0], items[1]]);
        }
        fetchSavedComparisons();
    }, [items]);
    const fetchSavedComparisons = async () => {
        try {
            const { data, error } = await appDataClient
                .from('saved_comparisons')
                .select('*')
                .eq('project_id', projectId)
                .eq('comparison_type', comparisonType)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setSavedComparisons((data || []).map(d => ({
                ...d,
                items: d.items || []
            })));
        }
        catch (error) {
            console.error('Failed to fetch saved comparisons:', error);
        }
    };
    const toggleItemSelection = (item) => {
        const isSelected = selectedItems.find((i) => i.id === item.id);
        if (isSelected) {
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        }
        else {
            if (selectedItems.length >= 4) {
                toast({
                    title: 'Maximum reached',
                    description: 'You can compare up to 4 items at once',
                    variant: 'destructive',
                });
                return;
            }
            setSelectedItems([...selectedItems, item]);
        }
    };
    const handleSaveComparison = async () => {
        if (!comparisonName.trim()) {
            toast({
                title: 'Name required',
                description: 'Please enter a name for this comparison',
                variant: 'destructive',
            });
            return;
        }
        setSaving(true);
        try {
            const { error } = await appDataClient.from('saved_comparisons').insert({
                user_id: user?.id,
                project_id: projectId,
                comparison_name: comparisonName,
                comparison_type: comparisonType,
                items: selectedItems.map((item) => item.id),
                notes: notes || null,
            });
            if (error)
                throw error;
            toast({
                title: 'Comparison saved! 💾',
                description: 'You can access it anytime from your saved comparisons',
            });
            setShowSaveDialog(false);
            setComparisonName('');
            setNotes('');
            fetchSavedComparisons();
        }
        catch (error) {
            toast({
                title: 'Failed to save comparison',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    const handleDownloadComparison = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        canvas.width = 1920;
        canvas.height = 1080;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const promises = selectedItems.map((item, index) => {
            return new Promise((resolve) => {
                if (!item.imageUrl) {
                    resolve();
                    return;
                }
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const x = (canvas.width / selectedItems.length) * index;
                    const w = canvas.width / selectedItems.length;
                    const h = canvas.height;
                    ctx.drawImage(img, x, 0, w, h);
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 24px Arial';
                    ctx.fillText(item.name, x + 20, 40);
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = item.imageUrl;
            });
        });
        Promise.all(promises).then(() => {
            canvas.toBlob((blob) => {
                if (!blob)
                    return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `comparison-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
                toast({
                    title: 'Downloaded! 📥',
                    description: 'Comparison image saved to your device',
                });
            });
        });
    };
    const handleShare = async () => {
        const text = `Check out this comparison: ${selectedItems.map((i) => i.name).join(' vs ')}`;
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Design Comparison', text, url });
                toast({ title: 'Shared successfully! 📤' });
            }
            catch (error) {
                console.error('Share failed:', error);
            }
        }
        else {
            await navigator.clipboard.writeText(url);
            toast({
                title: 'Link copied! 📋',
                description: 'Share this link to show the comparison',
            });
        }
    };
    const handleSliderDrag = (e) => {
        const container = sliderRef.current;
        if (!container)
            return;
        const onMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setSliderPosition(Math.max(0, Math.min(100, percentage)));
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };
    const handleDeleteComparison = async (id) => {
        if (!confirm('Delete this comparison?'))
            return;
        try {
            await appDataClient.from('saved_comparisons').delete().eq('id', id);
            toast({ title: 'Comparison deleted' });
            fetchSavedComparisons();
        }
        catch (error) {
            console.error('Failed to delete:', error);
        }
    };
    const renderSplitView = () => {
        if (selectedItems.length !== 2)
            return null;
        return (<div className="grid grid-cols-2 gap-4 h-full">
        {selectedItems.map((item) => (<div key={item.id} className="relative overflow-hidden rounded-lg">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" style={{ transform: `scale(${zoom / 100})` }}/>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">{item.name}</p>
            </div>
          </div>))}
      </div>);
    };
    const renderGridView = () => {
        return (<div className={`grid gap-4 h-full ${selectedItems.length <= 2 ? 'grid-cols-2' :
                selectedItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2 grid-rows-2'}`}>
        {selectedItems.map((item) => (<div key={item.id} className="relative overflow-hidden rounded-lg">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" style={{ transform: `scale(${zoom / 100})` }}/>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">{item.name}</p>
            </div>
          </div>))}
      </div>);
    };
    const renderSliderView = () => {
        if (selectedItems.length !== 2)
            return null;
        return (<div ref={sliderRef} className="relative h-full overflow-hidden rounded-lg">
        {/* Before Image */}
        <div className="absolute inset-0">
          <img src={selectedItems[0].imageUrl} alt={selectedItems[0].name} className="w-full h-full object-cover"/>
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedItems[0].name}
          </div>
        </div>

        {/* After Image */}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
          <img src={selectedItems[1].imageUrl} alt={selectedItems[1].name} className="w-full h-full object-cover"/>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedItems[1].name}
          </div>
        </div>

        {/* Slider */}
        <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg" style={{ left: `${sliderPosition}%` }} onMouseDown={handleSliderDrag}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground"/>
          </div>
        </div>
      </div>);
    };
    const renderBudgetComparison = () => {
        if (comparisonType !== 'budget')
            return null;
        return (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {selectedItems.map((item, idx) => (<Card key={item.id} className="p-6">
            <h3 className="font-semibold text-foreground text-lg mb-4">
              {item.name}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Furniture</span>
                <span className="font-medium text-foreground">
                  ₹{item.data?.furniture?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Materials</span>
                <span className="font-medium text-foreground">
                  ₹{item.data?.materials?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Labor</span>
                <span className="font-medium text-foreground">
                  ₹{item.data?.labor?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Accessories</span>
                <span className="font-medium text-foreground">
                  ₹{item.data?.accessories?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 bg-muted rounded-lg px-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-primary">
                  ₹{item.data?.total?.toLocaleString() || 0}
                </span>
              </div>

              {/* Difference Badge */}
              {selectedItems.length === 2 && idx === 1 && (<div className="pt-2">
                  {(item.data?.total || 0) > (selectedItems[0].data?.total || 0) ? (<Badge variant="destructive">
                      +₹{((item.data?.total || 0) - (selectedItems[0].data?.total || 0)).toLocaleString()} more
                    </Badge>) : (item.data?.total || 0) < (selectedItems[0].data?.total || 0) ? (<Badge className="bg-green-500">
                      -₹{((selectedItems[0].data?.total || 0) - (item.data?.total || 0)).toLocaleString()} less
                    </Badge>) : (<Badge variant="secondary">Same cost</Badge>)}
                </div>)}
            </div>
          </Card>))}
      </div>);
    };
    if (selectedItems.length === 0) {
        return (<div className="flex flex-col items-center justify-center py-12 text-center">
        <Grid3x3 className="h-16 w-16 text-muted-foreground/50 mb-4"/>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Select Items to Compare
        </h3>
        <p className="text-muted-foreground mb-6">
          Choose 2-4 items from the list below to start comparing
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
          {items.map((item) => (<Card key={item.id} onClick={() => toggleItemSelection(item)} className="cursor-pointer hover:border-primary transition-all border-2 overflow-hidden">
              {item.imageUrl && (<img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover"/>)}
              <div className="p-3">
                <p className="font-medium text-sm text-foreground">{item.name}</p>
              </div>
            </Card>))}
        </div>
      </div>);
    }
    return (<div className="flex flex-col h-full">
      {/* Controls Bar */}
      <div className="border-b p-4 bg-background">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Selected Items */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Comparing:</span>
            {selectedItems.map((item) => (<Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                {item.name}
                <button onClick={() => toggleItemSelection(item)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3"/>
                </button>
              </Badge>))}

            {selectedItems.length < 4 && items.length > selectedItems.length && (<Button onClick={() => {
                const nextItem = items.find(i => !selectedItems.find(s => s.id === i.id));
                if (nextItem)
                    toggleItemSelection(nextItem);
            }} size="sm" variant="outline" className="h-7">
                + Add
              </Button>)}
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {comparisonType !== 'budget' && (<>
                <Button onClick={() => setViewMode('split')} variant={viewMode === 'split' ? 'default' : 'outline'} size="sm">
                  <Columns className="h-4 w-4"/>
                </Button>

                <Button onClick={() => setViewMode('grid')} variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm">
                  <Grid3x3 className="h-4 w-4"/>
                </Button>

                {selectedItems.length === 2 && (<Button onClick={() => setViewMode('slider')} variant={viewMode === 'slider' ? 'default' : 'outline'} size="sm">
                    <ArrowLeftRight className="h-4 w-4"/>
                  </Button>)}

                <div className="w-px h-6 bg-border mx-1"/>

                <Button onClick={() => setZoom(Math.max(50, zoom - 10))} variant="outline" size="sm" disabled={zoom <= 50}>
                  <ZoomOut className="h-4 w-4"/>
                </Button>

                <span className="text-sm text-muted-foreground min-w-[40px] text-center">
                  {zoom}%
                </span>

                <Button onClick={() => setZoom(Math.min(200, zoom + 10))} variant="outline" size="sm" disabled={zoom >= 200}>
                  <ZoomIn className="h-4 w-4"/>
                </Button>

                <div className="w-px h-6 bg-border mx-1"/>
              </>)}

            <Button onClick={() => setShowSaveDialog(true)} variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1"/>
              Save
            </Button>

            <Button onClick={handleDownloadComparison} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1"/>
              Download
            </Button>

            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1"/>
              Share
            </Button>

            {onClose && (<Button onClick={onClose} variant="ghost" size="sm">
                <X className="h-4 w-4"/>
              </Button>)}
          </div>
        </div>
      </div>

      {/* Comparison View */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}>
          {comparisonType === 'budget'
            ? renderBudgetComparison()
            : viewMode === 'split'
                ? renderSplitView()
                : viewMode === 'grid'
                    ? renderGridView()
                    : renderSliderView()}
        </div>
      </div>

      {/* Saved Comparisons */}
      {savedComparisons.length > 0 && (<div className="border-t p-4 bg-muted/30">
          <h4 className="font-medium text-foreground text-sm mb-3">
            Saved Comparisons
          </h4>

          <ScrollArea className="max-h-32">
            <div className="flex gap-3 flex-wrap">
              {savedComparisons.map((comp) => (<div key={comp.id} className="flex items-center gap-2 bg-background border rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {comp.comparison_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comp.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button onClick={() => {
                    const loadedItems = items.filter((item) => comp.items.includes(item.id));
                    setSelectedItems(loadedItems);
                }} size="sm" variant="outline">
                      Load
                    </Button>

                    <Button onClick={() => handleDeleteComparison(comp.id)} size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>))}
            </div>
          </ScrollArea>
        </div>)}

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSaveDialog(false)}>
            <Card className="w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Save Comparison
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Comparison Name
                  </label>
                  <Input value={comparisonName} onChange={(e) => setComparisonName(e.target.value)} placeholder="e.g., Option A vs Option B" className="mt-1"/>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Notes (Optional)
                  </label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes about this comparison..." rows={3} className="mt-1"/>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveComparison} disabled={saving} className="flex-1 h-12">
                    {saving ? (<>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"/>
                        Saving...
                      </>) : (<>
                        <Save className="h-5 w-5 mr-2"/>
                        Save Comparison
                      </>)}
                  </Button>

                  <Button onClick={() => setShowSaveDialog(false)} variant="outline" className="flex-1 h-12">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>)}
      </AnimatePresence>
    </div>);
}

