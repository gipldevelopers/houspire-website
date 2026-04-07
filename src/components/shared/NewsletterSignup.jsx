import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Newspaper } from 'lucide-react';
export function NewsletterSignup({ variant = 'inline' }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [interests, setInterests] = useState([]);
    const { toast } = useToast();
    const interestOptions = [
        'Design Tips',
        'Product Launches',
        'Exclusive Offers',
        'Case Studies',
    ];
    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            toast({
                title: 'Email required',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            const { error } = await appDataClient.from('newsletter_subscribers').insert({
                email,
                name: name || null,
                interests: interests.length > 0 ? interests : null,
                source: variant,
            });
            if (error) {
                if (error.code === '23505') {
                    toast({
                        title: 'Already subscribed!',
                        description: 'This email is already on our list',
                    });
                    setSubscribed(true);
                    return;
                }
                throw error;
            }
            setSubscribed(true);
            toast({
                title: 'Welcome aboard! 🎉',
                description: 'Check your inbox for our welcome email',
            });
            setEmail('');
            setName('');
            setInterests([]);
        }
        catch (error) {
            toast({
                title: 'Subscription failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    if (subscribed) {
        return (<Card className="p-8 text-center bg-green-50 border-green-200">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-xl font-semibold mb-2">You're on the list!</p>
        <p className="text-muted-foreground">
          Welcome to the Houspire community. Expect great content in your inbox soon!
        </p>
      </Card>);
    }
    if (variant === 'inline') {
        return (<Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="h-6 w-6 text-primary"/>
          <div>
            <h3 className="text-xl font-heading font-bold">
              Get Design Inspiration Weekly
            </h3>
            <p className="text-muted-foreground">
              Join 5,000+ design enthusiasts receiving tips, trends, and exclusive offers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)}/>
            <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required/>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">I'm interested in:</p>
            <div className="flex flex-wrap gap-4">
              {interestOptions.map(interest => (<label key={interest} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={interests.includes(interest)} onCheckedChange={checked => {
                    if (checked) {
                        setInterests([...interests, interest]);
                    }
                    else {
                        setInterests(interests.filter(i => i !== interest));
                    }
                }}/>
                  <span className="text-sm">{interest}</span>
                </label>))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Mail className="h-4 w-4 mr-2"/>
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </Card>);
    }
    if (variant === 'footer') {
        return (<div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary"/>
          <p className="font-semibold">Stay Updated</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Get design tips and exclusive offers
        </p>
        <form onSubmit={handleSubscribe} className="flex gap-2">
          <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1"/>
          <Button type="submit" size="icon" disabled={loading}>
            {loading ? '...' : <Send className="h-4 w-4"/>}
          </Button>
        </form>
      </div>);
    }
    // Popup variant
    return (<div className="space-y-4 text-center">
      <div>
        <p className="text-4xl mb-2">📮</p>
        <p className="text-xl font-semibold">Never Miss an Update!</p>
        <p className="text-sm text-muted-foreground">
          Get exclusive design tips, offers, and inspiration straight to your inbox
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="space-y-3">
        <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required/>
        <Button type="submit" className="w-full" disabled={loading}>
          <Mail className="h-4 w-4 mr-2"/>
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </form>
    </div>);
}

