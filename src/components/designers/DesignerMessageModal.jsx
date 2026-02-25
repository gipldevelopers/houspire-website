import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, Clock, CheckCircle, } from 'lucide-react';
const QUICK_MESSAGES = [
    "Hi! I'm interested in working with you on my project.",
    "I love your portfolio! Can we discuss my space?",
    "What's your availability for a new project?",
];
export function DesignerMessageModal({ open, onOpenChange, designer }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const avatarUrl = designer.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${designer.slug}`;
    const handleSend = async () => {
        if (!message.trim()) {
            toast({
                title: 'Please enter a message',
                variant: 'destructive',
            });
            return;
        }
        if (!user && (!email.trim() || !name.trim())) {
            toast({
                title: 'Please enter your name and email',
                variant: 'destructive',
            });
            return;
        }
        setSending(true);
        try {
            // Insert inquiry into database
            const { error } = await supabase
                .from('designer_inquiries')
                .insert({
                designer_id: designer.id,
                user_id: user?.id || null,
                guest_name: user ? null : name.trim(),
                guest_email: user ? null : email.trim(),
                message: message.trim(),
                status: 'new',
            });
            if (error)
                throw error;
            setSent(true);
            toast({
                title: 'Message sent!',
                description: `${designer.display_name} will get back to you soon.`,
            });
            // Reset after showing success
            setTimeout(() => {
                setSent(false);
                setMessage('');
                setName('');
                setEmail('');
                onOpenChange(false);
            }, 2000);
        }
        catch (error) {
            console.error('Failed to send inquiry:', error);
            toast({
                title: 'Failed to send message',
                description: error.message || 'Please try again later.',
                variant: 'destructive',
            });
        }
        finally {
            setSending(false);
        }
    };
    const handleQuickMessage = (text) => {
        setMessage(text);
    };
    const handleLoginRedirect = () => {
        onOpenChange(false);
        navigate('/login', { state: { from: `/designer/${designer.slug}` } });
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={designer.display_name}/>
              <AvatarFallback>{designer.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="block">Message {designer.display_name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {designer.title}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Clock className="h-3.5 w-3.5"/>
            Typically responds {designer.response_time || 'within 24 hours'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {sent ? (<motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600"/>
              </div>
              <h4 className="text-lg font-semibold text-foreground">Message Sent!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {designer.display_name} will respond soon.
              </p>
            </motion.div>) : (<motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Quick message suggestions */}
              <div className="flex flex-wrap gap-2">
                {QUICK_MESSAGES.map((text, idx) => (<Badge key={idx} variant="outline" className="cursor-pointer hover:bg-secondary/50 transition-colors text-xs" onClick={() => handleQuickMessage(text)}>
                    {text.substring(0, 30)}...
                  </Badge>))}
              </div>

              {/* Guest fields */}
              {!user && (<div className="space-y-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">
                    Enter your details or{' '}
                    <button onClick={handleLoginRedirect} className="text-primary hover:underline font-medium">
                      sign in
                    </button>
                  </p>
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}/>
                  <Input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>)}

              {/* Message input */}
              <Textarea placeholder={`Write a message to ${designer.display_name.split(' ')[0]}...`} value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="resize-none"/>

              {/* Send button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSend} disabled={sending || !message.trim()}>
                  {sending ? (<>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Sending...
                    </>) : (<>
                      <Send className="mr-2 h-4 w-4"/>
                      Send Message
                    </>)}
                </Button>
              </div>
            </motion.div>)}
        </AnimatePresence>
      </DialogContent>
    </Dialog>);
}
