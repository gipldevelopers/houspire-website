import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, CheckCircle } from 'lucide-react';
import { z } from 'zod';
const reviewSchema = z.object({
    rating: z.number().min(1, 'Please select a rating').max(5),
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
    comment: z.string().min(20, 'Review must be at least 20 characters').max(1000, 'Review must be less than 1000 characters'),
});
export function ReviewSubmitForm({ onSuccess, onCancel }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        // Validate
        const result = reviewSchema.safeParse({ rating, title, comment });
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }
        if (!user) {
            toast({
                title: 'Login required',
                description: 'Please login to submit a review',
                variant: 'destructive',
            });
            return;
        }
        setSubmitting(true);
        try {
            // Get user's first project or create a placeholder
            const { data: projects } = await supabase
                .from('projects')
                .select('id')
                .eq('user_id', user.id)
                .limit(1);
            const projectId = projects?.[0]?.id;
            if (!projectId) {
                toast({
                    title: 'No project found',
                    description: 'You need to have a project to leave a review',
                    variant: 'destructive',
                });
                setSubmitting(false);
                return;
            }
            const { error } = await supabase.from('reviews').insert({
                project_id: projectId,
                user_id: user.id,
                rating,
                title,
                comment,
                published: false, // Admin will approve
                verified_purchase: true,
            });
            if (error)
                throw error;
            setSubmitted(true);
            toast({
                title: 'Review submitted!',
                description: 'Thank you for your feedback. Your review will be published after approval.',
            });
            onSuccess?.();
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
    if (submitted) {
        return (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600"/>
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">Thank you!</h3>
        <p className="text-muted-foreground">
          Your review has been submitted and is pending approval.
        </p>
      </motion.div>);
    }
    return (<form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="text-center">
        <label className="block text-sm font-medium text-muted-foreground mb-3">
          How would you rate your experience?
        </label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} className="justify-center"/>
        {errors.rating && (<p className="text-sm text-destructive mt-2">{errors.rating}</p>)}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Review Title
        </label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your experience" maxLength={100} className="h-12"/>
        {errors.title && (<p className="text-sm text-destructive mt-1">{errors.title}</p>)}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Your Review
        </label>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your design experience..." rows={5} maxLength={1000} className="resize-none"/>
        <div className="flex justify-between mt-1">
          {errors.comment ? (<p className="text-sm text-destructive">{errors.comment}</p>) : (<span />)}
          <span className="text-xs text-muted-foreground">
            {comment.length}/1000
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (<Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12">
            Cancel
          </Button>)}
        <Button type="submit" disabled={submitting || rating === 0} className="flex-1 h-12 gap-2">
          {submitting ? (<div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>) : (<Send className="h-4 w-4"/>)}
          Submit Review
        </Button>
      </div>
    </form>);
}
