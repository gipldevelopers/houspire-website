import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { ThumbsUp, CheckCircle, MessageSquare, Flag, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
export function ReviewListItem({ review, onImageClick }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [hasVoted, setHasVoted] = useState(false);
    const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
    const [voting, setVoting] = useState(false);
    const isOwnReview = user?.id === review.user_id;
    const photos = review.photos || [];
    const handleHelpfulVote = async () => {
        if (!user) {
            toast({
                title: 'Login required',
                description: 'Please login to vote',
                variant: 'destructive',
            });
            return;
        }
        if (isOwnReview)
            return;
        setVoting(true);
        try {
            if (hasVoted) {
                const { error } = await supabase
                    .from('review_helpful_votes')
                    .delete()
                    .eq('review_id', review.id)
                    .eq('user_id', user.id);
                if (error)
                    throw error;
                setHasVoted(false);
                setHelpfulCount((prev) => prev - 1);
            }
            else {
                const { error } = await supabase.from('review_helpful_votes').insert({
                    review_id: review.id,
                    user_id: user.id,
                });
                if (error)
                    throw error;
                setHasVoted(true);
                setHelpfulCount((prev) => prev + 1);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to vote',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setVoting(false);
        }
    };
    return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary"/>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">
                  {review.profiles?.full_name || 'Verified Customer'}
                </span>
                {review.verified_purchase && (<Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle className="h-3 w-3 mr-1"/>
                    Verified
                  </Badge>)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={review.rating} size="sm"/>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Content */}
        {review.title && (<h4 className="font-semibold text-foreground mb-2">{review.title}</h4>)}
        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

        {/* Photos */}
        {photos.length > 0 && (<div className="flex gap-2 mt-4 overflow-x-auto">
            {photos.map((photo, idx) => (<button key={idx} onClick={() => onImageClick?.(photo)} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 group ring-1 ring-border">
                <img src={photo} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
              </button>))}
          </div>)}

        {/* Admin Response */}
        {review.admin_response && (<div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary"/>
              <span className="text-sm font-medium text-foreground">Response from Houspire</span>
            </div>
            <p className="text-sm text-muted-foreground">{review.admin_response}</p>
          </div>)}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
          <Button onClick={handleHelpfulVote} variant={hasVoted ? 'default' : 'ghost'} size="sm" disabled={voting || isOwnReview} className="gap-1.5">
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`}/>
            Helpful ({helpfulCount})
          </Button>

          {!isOwnReview && (<Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <Flag className="h-4 w-4"/>
              Report
            </Button>)}
        </div>
      </Card>
    </motion.div>);
}
