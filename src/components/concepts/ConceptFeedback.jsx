import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
export function ConceptFeedback({ conceptId, existingFeedback, existingRating, onSubmit }) {
    const [rating, setRating] = useState(existingRating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState(existingFeedback || '');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();
    const feedbackPrompts = [
        { emoji: '❤️', text: 'Love the overall style' },
        { emoji: '🎨', text: 'Great color choices' },
        { emoji: '📐', text: 'Perfect layout/arrangement' },
        { emoji: '💡', text: 'Love the lighting design' },
        { emoji: '🔄', text: 'Want more options' },
        { emoji: '💰', text: 'Concerned about budget' },
    ];
    const handlePromptClick = (text) => {
        setFeedback(prev => prev ? `${prev}\n• ${text}` : `• ${text}`);
    };
    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: 'Please rate the design',
                description: 'Select 1-5 stars before submitting',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        const { error } = await appDataClient
            .from('concepts')
            .update({
            user_rating: rating,
            user_feedback: feedback,
            updated_at: new Date().toISOString()
        })
            .eq('id', conceptId);
        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to save feedback. Please try again.',
                variant: 'destructive',
            });
        }
        else {
            setSubmitted(true);
            toast({
                title: 'Feedback submitted! ✨',
                description: 'Your designer will review and make adjustments',
            });
            onSubmit();
        }
        setLoading(false);
    };
    if (submitted) {
        return (<Card className="p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600"/>
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your feedback has been submitted. We'll incorporate your preferences into the next revision.
        </p>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Rating */}
      <Card className="p-6">
        <Label className="text-base font-semibold mb-4 block">
          How do you like this design?
        </Label>
        
        <div className="flex items-center gap-2 justify-center py-4">
          {[1, 2, 3, 4, 5].map((star) => (<motion.button key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="focus:outline-none">
              <Star className={`h-10 w-10 transition-colors ${star <= (hoveredRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/30'}`}/>
            </motion.button>))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          {rating === 0 && 'Click to rate'}
          {rating === 1 && 'Needs significant changes'}
          {rating === 2 && 'Some improvements needed'}
          {rating === 3 && 'Good, but not quite there'}
          {rating === 4 && 'Love it with minor tweaks'}
          {rating === 5 && 'Perfect! Ready to proceed'}
        </p>
      </Card>

      {/* Quick Feedback Prompts */}
      <Card className="p-6">
        <Label className="text-base font-semibold mb-4 block">
          Quick feedback (click to add)
        </Label>
        
        <div className="flex flex-wrap gap-2">
          {feedbackPrompts.map((prompt) => (<Button key={prompt.text} variant="outline" size="sm" onClick={() => handlePromptClick(prompt.text)} className="text-sm">
              {prompt.emoji} {prompt.text}
            </Button>))}
        </div>
      </Card>

      {/* Detailed Feedback */}
      <Card className="p-6">
        <Label htmlFor="feedback" className="text-base font-semibold mb-4 block">
          Share your thoughts
        </Label>
        
        <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us what you love, what you'd change, or any specific requests..." className="min-h-[150px] resize-none"/>
        
        <p className="text-xs text-muted-foreground mt-2">
          Be specific! Mention colors, furniture styles, or specific items you want changed.
        </p>
      </Card>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={loading || rating === 0} className="w-full" size="lg">
        {loading ? (<>
            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
            Submitting...
          </>) : (<>
            <Send className="h-4 w-4 mr-2"/>
            Submit Feedback
          </>)}
      </Button>
    </div>);
}

