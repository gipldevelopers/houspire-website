import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/StarRating';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, MessageSquare, Flag, CheckCircle, Image as ImageIcon } from 'lucide-react';
export function ReviewCard({ review, isOwnReview = false, onImageClick }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [hasVoted, setHasVoted] = useState(false);
    const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
    const [voting, setVoting] = useState(false);
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
        if (isOwnReview) {
            toast({
                title: 'Cannot vote on own review',
                variant: 'destructive',
            });
            return;
        }
        setVoting(true);
        try {
            if (hasVoted) {
                const { error } = await appDataClient
                    .from('review_helpful_votes')
                    .delete()
                    .eq('review_id', review.id)
                    .eq('user_id', user.id);
                if (error)
                    throw error;
                setHasVoted(false);
                setHelpfulCount(prev => prev - 1);
            }
            else {
                const { error } = await appDataClient.from('review_helpful_votes').insert({
                    review_id: review.id,
                    user_id: user.id,
                });
                if (error)
                    throw error;
                setHasVoted(true);
                setHelpfulCount(prev => prev + 1);
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
    return (<Card className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={review.rating} size="sm"/>
            {isOwnReview && (<Badge variant="secondary" className="text-xs">
                Your Review
              </Badge>)}
            {review.verified_purchase && (<Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1"/>
                Verified Purchase
              </Badge>)}
          </div>
          <h4 className="font-semibold text-foreground">
            {review.title || 'Review'}
          </h4>
          <p className="text-sm text-muted-foreground">
            By {review.profiles?.full_name || 'Anonymous'} •{' '}
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-muted-foreground leading-relaxed mb-4">{review.comment}</p>

      {/* Photos */}
      {photos.length > 0 && (<div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {photos.map((photo, idx) => (<button key={idx} onClick={() => onImageClick?.(photo)} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 group">
              <img src={photo} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
              </div>
            </button>))}
        </div>)}

      {/* Admin Response */}
      {review.admin_response && (<div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary"/>
            <span className="text-sm font-medium text-foreground">
              Response from Houspire
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{review.admin_response}</p>
          {review.admin_response_at && (<p className="text-xs text-muted-foreground mt-2">
              {new Date(review.admin_response_at).toLocaleDateString()}
            </p>)}
        </div>)}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button onClick={handleHelpfulVote} variant={hasVoted ? 'default' : 'outline'} size="sm" disabled={voting || isOwnReview}>
          <ThumbsUp className="h-4 w-4 mr-1"/>
          Helpful ({helpfulCount})
        </Button>

        {!isOwnReview && (<Button variant="ghost" size="sm" className="text-muted-foreground">
            <Flag className="h-4 w-4 mr-1"/>
            Report
          </Button>)}
      </div>
    </Card>);
}

