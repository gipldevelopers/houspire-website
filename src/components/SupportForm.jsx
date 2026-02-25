import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { notificationHelpers } from '@/lib/notifications';
import { trackEvents } from '@/lib/analytics';
import { MessageCircle, Loader2, CheckCircle } from 'lucide-react';
const categories = [
    { value: 'design_question', label: 'Design Question' },
    { value: 'payment_issue', label: 'Payment Issue' },
    { value: 'technical_problem', label: 'Technical Problem' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' },
];
export function SupportForm({ projectId, trigger }) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast({
                title: 'Please sign in',
                description: 'You need to be signed in to submit a support ticket.',
                variant: 'destructive',
            });
            return;
        }
        if (!subject || !category || !message) {
            toast({
                title: 'Missing information',
                description: 'Please fill in all fields.',
                variant: 'destructive',
            });
            return;
        }
        setSubmitting(true);
        try {
            const { data: ticket, error } = await supabase
                .from('support_tickets')
                .insert({
                user_id: user.id,
                project_id: projectId || null,
                subject: `[${category}] ${subject}`,
                message,
                priority: category === 'payment_issue' ? 'high' : 'normal',
            })
                .select()
                .single();
            if (error)
                throw error;
            // Track analytics
            trackEvents.submittedTicket(category);
            // Send notification
            await notificationHelpers.onSupportTicketCreated(user.id, ticket.id, subject);
            setSubmitted(true);
            toast({
                title: 'Ticket submitted!',
                description: 'We\'ll respond within 4-6 hours.',
            });
            // Reset form after delay
            setTimeout(() => {
                setOpen(false);
                setSubmitted(false);
                setSubject('');
                setCategory('');
                setMessage('');
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting ticket:', error);
            toast({
                title: 'Error',
                description: 'Failed to submit ticket. Please try again.',
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (<Button variant="outline" onClick={() => trackEvents.openedSupport()}>
            <MessageCircle className="h-4 w-4 mr-2"/>
            Contact Support
          </Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {submitted ? 'Ticket Submitted!' : 'Contact Support'}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (<div className="py-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600"/>
            </div>
            <h3 className="text-lg font-semibold mb-2">We got your message!</h3>
            <p className="text-muted-foreground">
              Our team will respond within 4-6 hours. Check your email for updates.
            </p>
          </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category"/>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" required/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Please describe your issue in detail..." rows={5} required/>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Submitting...
                  </>) : ('Submit Ticket')}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Average response time: 4-6 hours • Priority support for payment issues
            </p>
          </form>)}
      </DialogContent>
    </Dialog>);
}
