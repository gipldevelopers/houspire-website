import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesignerReviews } from '@/hooks/useDesigners';
import { Star, ThumbsUp, CheckCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
export function DesignerReviews({ designerId, designerName }) {
    const [showAll, setShowAll] = useState(false);
    const { data: reviews, isLoading, error } = useDesignerReviews(designerId, showAll ? 50 : 5);
    if (isLoading) {
        return (<div className="space-y-4">
        <Skeleton className="h-8 w-48"/>
        {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-32 w-full"/>))}
      </div>);
    }
    if (error || !reviews?.length) {
        return (<Card className="p-8 text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4"/>
        <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          Be the first to work with {designerName} and share your experience!
        </p>
      </Card>);
    }
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return (<div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Client Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`h-5 w-5 ${star <= Math.round(averageRating)
                ? 'text-amber-500 fill-current'
                : 'text-muted-foreground/30'}`}/>))}
            </div>
            <span className="text-lg font-semibold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <AnimatePresence>
        <div className="space-y-4">
          {reviews.map((review, index) => (<motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <ReviewCard review={review}/>
            </motion.div>))}
        </div>
      </AnimatePresence>

      {/* Show More/Less */}
      {reviews.length >= 5 && (<div className="text-center pt-4">
          <Button variant="outline" onClick={() => setShowAll(!showAll)} className="gap-2">
            {showAll ? (<>
                Show Less
                <ChevronUp className="h-4 w-4"/>
              </>) : (<>
                Show All Reviews
                <ChevronDown className="h-4 w-4"/>
              </>)}
          </Button>
        </div>)}
    </div>);
}
function ReviewCard({ review }) {
    const [helpful, setHelpful] = useState(false);
    const initials = review.reviewer_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'A';
    return (<Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {review.reviewer_name || 'Anonymous'}
                </span>
                {review.is_verified && (<Badge variant="secondary" className="gap-1 text-xs">
                    <CheckCircle className="h-3 w-3"/>
                    Verified
                  </Badge>)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (<Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating
                ? 'text-amber-500 fill-current'
                : 'text-muted-foreground/30'}`}/>))}
                </div>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>

            {review.is_featured && (<Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                Featured
              </Badge>)}
          </div>

          {/* Review Text */}
          {review.review_text && (<p className="text-foreground/90 mb-4">{review.review_text}</p>)}

          {/* Detailed Ratings */}
          {(review.communication_rating || review.quality_rating || review.timeliness_rating) && (<div className="flex flex-wrap gap-4 mb-4 text-sm">
              {review.communication_rating && (<div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Communication:</span>
                  <span className="font-medium">{review.communication_rating}/5</span>
                </div>)}
              {review.quality_rating && (<div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="font-medium">{review.quality_rating}/5</span>
                </div>)}
              {review.timeliness_rating && (<div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Timeliness:</span>
                  <span className="font-medium">{review.timeliness_rating}/5</span>
                </div>)}
            </div>)}

          {/* Designer Response */}
          {review.designer_response && (<div className="bg-secondary/30 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-foreground mb-1">Designer Response</p>
              <p className="text-sm text-muted-foreground">{review.designer_response}</p>
            </div>)}

          {/* Helpful Button */}
          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className={`gap-1.5 ${helpful ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setHelpful(!helpful)}>
              <ThumbsUp className={`h-4 w-4 ${helpful ? 'fill-current' : ''}`}/>
              Helpful ({review.helpful_count + (helpful ? 1 : 0)})
            </Button>
          </div>
        </div>
      </div>
    </Card>);
}
