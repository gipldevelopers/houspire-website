import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Phone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useExitIntent } from '@/hooks/useExitIntent';
import { appDataClient } from '@/lib/static-client';
export function ExitIntentPopup({ enabled = true }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { shouldShow, dismiss } = useExitIntent({ enabled });
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    async function handleClaim() {
        if (!email.trim()) {
            toast({
                variant: 'destructive',
                title: 'Email required',
                description: 'Please enter your email to claim the offer'
            });
            return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toast({
                variant: 'destructive',
                title: 'Invalid email',
                description: 'Please enter a valid email address'
            });
            return;
        }
        setSubmitting(true);
        try {
            // Try to save email to newsletter subscribers
            // This might fail if table doesn't exist, but we still proceed
            try {
                await appDataClient
                    .from('newsletter_subscribers')
                    .upsert({
                    email: email.trim().toLowerCase(),
                    source: 'exit_intent',
                    subscribed: true
                }, { onConflict: 'email' });
            }
            catch {
                // Ignore errors - table might not exist
            }
            toast({
                title: '🎉 Offer claimed!',
                description: 'Your ₹500 discount has been applied. Redirecting...'
            });
            // Store the discount in session
            sessionStorage.setItem('exit-intent-discount', '500');
            // Redirect to packages
            setTimeout(() => {
                navigate('/select-package');
                dismiss();
            }, 1500);
        }
        catch (error) {
            console.error('Error saving email:', error);
            // Still redirect even if save fails
            navigate('/select-package');
            dismiss();
        }
        finally {
            setSubmitting(false);
        }
    }
    function handleBookCall() {
        navigate('/contact');
        dismiss();
    }
    return (<Dialog open={shouldShow} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Wait! Don't Miss Out 🎁
          </DialogTitle>
          <DialogDescription className="text-center">
            We noticed you're interested in our design services
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Offer Cards */}
          <div className="grid gap-4">
            {/* Discount Offer */}
            <div className="border rounded-xl p-5 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary"/>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    ₹500 OFF
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your First Design Project
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleClaim()} className="bg-background"/>
                <Button onClick={handleClaim} disabled={submitting} className="w-full">
                  {submitting ? (<>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                      Claiming...
                    </>) : (<>
                      <Gift className="h-4 w-4 mr-2"/>
                      Claim Offer
                    </>)}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Limited time offer • Expires in 24 hours
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"/>
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border"/>
            </div>

            {/* Free Consultation */}
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-accent"/>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    FREE Call
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15-min Design Consultation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">Discuss your vision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">Get expert advice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">Understand the process</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted-foreground">No commitment</span>
                </div>
              </div>

              <Button variant="outline" onClick={handleBookCall} className="w-full">
                <Phone className="h-4 w-4 mr-2"/>
                Book Free Call
              </Button>
            </div>
          </div>

          {/* No Thanks */}
          <div className="text-center mt-4">
            <button onClick={dismiss} className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
              No thanks, I'll pay full price
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}

