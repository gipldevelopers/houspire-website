import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, Send } from 'lucide-react';
const reviewSchema = z.object({
    rating: z.number().min(1, 'Please select a rating').max(5),
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});
export function ReviewForm({ projectId, onSuccess }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const { register, handleSubmit, formState: { errors }, setValue, } = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            title: '',
            comment: '',
        },
    });
    const onSubmit = async (data) => {
        if (!user)
            return;
        setSubmitting(true);
        try {
            const { error } = await appDataClient.from('reviews').insert({
                project_id: projectId,
                user_id: user.id,
                rating: data.rating,
                title: data.title,
                comment: data.comment,
                published: false,
            });
            if (error)
                throw error;
            toast({
                title: 'Review submitted! ⭐',
                description: 'Your review will be published after moderation',
            });
            if (onSuccess)
                onSuccess();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to submit review',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<Card className="p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500"/>
        Write a Review
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Your Rating *</Label>
          <div className="flex items-center gap-4">
            <StarRating rating={rating} size="lg" interactive onChange={(value) => {
            setRating(value);
            setValue('rating', value);
        }}/>
            <span className="text-sm text-muted-foreground">
              {rating > 0 ? `${rating} out of 5 stars` : 'Select rating'}
            </span>
          </div>
          {errors.rating && (<p className="text-sm text-destructive mt-1">{errors.rating.message}</p>)}
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium mb-2 block">
            Review Title *
          </Label>
          <Input id="title" {...register('title')} placeholder="Summarize your experience" className="h-12"/>
          {errors.title && (<p className="text-sm text-destructive mt-1">{errors.title.message}</p>)}
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
            Your Review *
          </Label>
          <Textarea id="comment" {...register('comment')} placeholder="Share your experience with Houspire..." rows={5} className="resize-none"/>
          {errors.comment && (<p className="text-sm text-destructive mt-1">{errors.comment.message}</p>)}
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 10 characters
          </p>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={submitting} className="w-full h-12">
          {submitting ? (<>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"/>
              Submitting...
            </>) : (<>
              <Send className="h-5 w-5 mr-2"/>
              Submit Review
            </>)}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your review will be published after moderation
        </p>
      </form>
    </Card>);
}

