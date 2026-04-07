import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, CheckCircle, Eye, Palette, Layers, Download, ChevronLeft, ChevronRight, X, } from 'lucide-react';
// Type guard for color palette
function isColorPalette(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function DesignVariations({ projectId }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [variations, setVariations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    useEffect(() => {
        fetchVariations();
    }, [projectId]);
    const fetchVariations = async () => {
        try {
            const { data, error } = await appDataClient
                .from('design_variations')
                .select(`
          *,
          variation_renders (
            id,
            render_url,
            view_name,
            description,
            order_index
          )
        `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            // Check which variations user has voted for
            const { data: votesData } = await appDataClient
                .from('variation_votes')
                .select('variation_id')
                .eq('user_id', user?.id || '');
            const votedVariationIds = new Set(votesData?.map(v => v.variation_id) || []);
            // Get comment counts
            const { data: commentsData } = await appDataClient
                .from('variation_comments')
                .select('variation_id');
            const commentCounts = commentsData?.reduce((acc, c) => {
                acc[c.variation_id] = (acc[c.variation_id] || 0) + 1;
                return acc;
            }, {}) || {};
            const formattedData = (data || []).map((variation) => ({
                id: variation.id,
                variation_name: variation.variation_name,
                description: variation.description,
                style: variation.style,
                color_palette: isColorPalette(variation.color_palette) ? variation.color_palette : null,
                mood_board: variation.mood_board,
                is_selected: variation.is_selected,
                votes: variation.votes,
                created_at: variation.created_at,
                renders: (variation.variation_renders || []).sort((a, b) => a.order_index - b.order_index),
                user_voted: votedVariationIds.has(variation.id),
                comments_count: commentCounts[variation.id] || 0,
            }));
            setVariations(formattedData);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to load variations',
                description: message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleVote = async (variationId, currentlyVoted) => {
        try {
            if (currentlyVoted) {
                const { error } = await appDataClient
                    .from('variation_votes')
                    .delete()
                    .eq('variation_id', variationId)
                    .eq('user_id', user?.id || '');
                if (error)
                    throw error;
                toast({ title: 'Vote removed' });
            }
            else {
                const { error } = await appDataClient
                    .from('variation_votes')
                    .insert({
                    variation_id: variationId,
                    user_id: user?.id,
                });
                if (error)
                    throw error;
                toast({ title: 'Voted! ❤️' });
            }
            fetchVariations();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to vote',
                description: message,
                variant: 'destructive',
            });
        }
    };
    const handleSelectVariation = async (variationId) => {
        try {
            const { error } = await appDataClient.rpc('select_design_variation', {
                p_variation_id: variationId,
            });
            if (error)
                throw error;
            toast({
                title: 'Variation selected! ✨',
                description: "We'll proceed with this design",
            });
            fetchVariations();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to select variation',
                description: message,
                variant: 'destructive',
            });
        }
    };
    const fetchComments = async (variationId) => {
        try {
            const { data, error } = await appDataClient
                .from('variation_comments')
                .select('*')
                .eq('variation_id', variationId)
                .order('created_at', { ascending: true });
            if (error)
                throw error;
            setComments(data || []);
        }
        catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };
    const handleAddComment = async (variationId) => {
        if (!newComment.trim())
            return;
        setSubmittingComment(true);
        try {
            const { error } = await appDataClient
                .from('variation_comments')
                .insert({
                variation_id: variationId,
                user_id: user?.id,
                comment: newComment,
            });
            if (error)
                throw error;
            setNewComment('');
            toast({ title: 'Comment added! 💬' });
            fetchComments(variationId);
            fetchVariations();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to add comment',
                description: message,
                variant: 'destructive',
            });
        }
        finally {
            setSubmittingComment(false);
        }
    };
    const openLightbox = (variation, index) => {
        setSelectedVariation(variation);
        setCurrentImageIndex(index);
        fetchComments(variation.id);
    };
    const nextImage = () => {
        if (selectedVariation) {
            setCurrentImageIndex((prev) => prev === selectedVariation.renders.length - 1 ? 0 : prev + 1);
        }
    };
    const prevImage = () => {
        if (selectedVariation) {
            setCurrentImageIndex((prev) => prev === 0 ? selectedVariation.renders.length - 1 : prev - 1);
        }
    };
    if (loading) {
        return (<Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
        </div>
      </Card>);
    }
    if (variations.length === 0) {
        return (<Card className="p-8 text-center">
        <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
        <h3 className="text-lg font-semibold mb-2">
          No Design Variations Yet
        </h3>
        <p className="text-muted-foreground">
          Our designers are working on multiple design options for you!
        </p>
      </Card>);
    }
    return (<>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary"/>
              Design Variations
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose your favorite design from {variations.length} options
            </p>
          </div>

          <Badge variant={variations.some(v => v.is_selected) ? 'default' : 'secondary'}>
            {variations.some(v => v.is_selected) ? 'Selected' : 'Vote Now'}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variations.map((variation, index) => (<motion.div key={variation.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`overflow-hidden border-2 transition-all ${variation.is_selected
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-transparent hover:border-muted'}`}>
                {/* Thumbnail */}
                <div className="relative aspect-video cursor-pointer group" onClick={() => openLightbox(variation, 0)}>
                  {variation.renders[0] ? (<img src={variation.renders[0].render_url} alt={variation.variation_name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full bg-muted flex items-center justify-center">
                      <Palette className="h-8 w-8 text-muted-foreground"/>
                    </div>)}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Eye className="h-8 w-8 text-white"/>
                  </div>

                  {/* Selected Badge */}
                  {variation.is_selected && (<div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3"/>
                      Selected
                    </div>)}

                  {/* Image Count */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {variation.renders.length} images
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">
                        {variation.variation_name}
                      </h4>
                      {variation.style && (<p className="text-xs text-muted-foreground">
                          {variation.style} Style
                        </p>)}
                    </div>
                  </div>

                  {variation.description && (<p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {variation.description}
                    </p>)}

                  {/* Color Palette */}
                  {variation.color_palette && (<div className="flex items-center gap-2 mb-3">
                      <Palette className="h-4 w-4 text-muted-foreground"/>
                      <div className="flex gap-1">
                        {Object.values(variation.color_palette).slice(0, 5).map((color, i) => (<div key={i} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: color }}/>))}
                      </div>
                    </div>)}

                  {/* Actions */}
                  <div className="flex gap-2 mb-3">
                    <Button onClick={() => handleVote(variation.id, variation.user_voted)} variant={variation.user_voted ? 'default' : 'outline'} size="sm" className={`flex-1 ${variation.user_voted
                ? 'bg-red-500 text-white hover:bg-red-600'
                : ''}`}>
                      <Heart className={`h-4 w-4 mr-1 ${variation.user_voted ? 'fill-current' : ''}`}/>
                      {variation.votes}
                    </Button>

                    <Button onClick={() => {
                setSelectedVariation(variation);
                setShowComments(true);
                fetchComments(variation.id);
            }} variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1"/>
                      {variation.comments_count}
                    </Button>
                  </div>

                  {!variation.is_selected && (<Button onClick={() => handleSelectVariation(variation.id)} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-2"/>
                      Select This Design
                    </Button>)}
                </div>
              </Card>
            </motion.div>))}
        </div>
      </Card>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedVariation && !showComments && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelectedVariation(null)}>
            <div className="absolute top-4 right-4 z-10">
              <Button onClick={() => setSelectedVariation(null)} variant="ghost" className="text-white hover:bg-white/10">
                <X className="h-6 w-6"/>
              </Button>
            </div>

            <div className="relative w-full max-w-5xl px-4">
              {/* Previous Button */}
              <button onClick={(e) => {
                e.stopPropagation();
                prevImage();
            }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur">
                <ChevronLeft className="h-6 w-6"/>
              </button>

              {/* Image */}
              <motion.div key={currentImageIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
                <img src={selectedVariation.renders[currentImageIndex]?.render_url} alt={selectedVariation.renders[currentImageIndex]?.view_name} className="w-full max-h-[80vh] object-contain rounded-lg"/>

                {/* Image Info */}
                <div className="mt-4 text-center text-white">
                  <p className="font-semibold">
                    {selectedVariation.renders[currentImageIndex]?.view_name}
                  </p>
                  <p className="text-white/70 text-sm">
                    {currentImageIndex + 1} / {selectedVariation.renders.length}
                  </p>
                </div>
              </motion.div>

              {/* Next Button */}
              <button onClick={(e) => {
                e.stopPropagation();
                nextImage();
            }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur">
                <ChevronRight className="h-6 w-6"/>
              </button>

              {/* Bottom Actions */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <Button onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = selectedVariation.renders[currentImageIndex]?.render_url;
                link.download = `${selectedVariation.variation_name}-${selectedVariation.renders[currentImageIndex]?.view_name}.jpg`;
                link.click();
            }} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur">
                  <Download className="h-4 w-4 mr-2"/>
                  Download
                </Button>

                <Button onClick={(e) => {
                e.stopPropagation();
                setShowComments(true);
            }} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur">
                  <MessageCircle className="h-4 w-4 mr-2"/>
                  Comments
                </Button>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {showComments && selectedVariation && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowComments(false)}>
            <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">
                  Comments on {selectedVariation.variation_name}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
                  <X className="h-4 w-4"/>
                </Button>
              </div>

              {/* Comments List */}
              <div className="p-4 max-h-[50vh] overflow-y-auto space-y-4">
                {comments.length === 0 ? (<div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                    <p>No comments yet</p>
                  </div>) : (comments.map((comment) => (<div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                        U
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">User</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {comment.comment}
                        </p>
                      </div>
                    </div>)))}
              </div>

              {/* Add Comment */}
              <div className="p-4 border-t space-y-3">
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add your thoughts about this design..." rows={3} className="resize-none"/>

                <Button onClick={() => handleAddComment(selectedVariation.id)} disabled={submittingComment || !newComment.trim()} className="w-full">
                  {submittingComment ? (<>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
                      Posting...
                    </>) : (<>
                      <MessageCircle className="h-4 w-4 mr-2"/>
                      Post Comment
                    </>)}
                </Button>
              </div>
            </Card>
          </motion.div>)}
      </AnimatePresence>
    </>);
}

