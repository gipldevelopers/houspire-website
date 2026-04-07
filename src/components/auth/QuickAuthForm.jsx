import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
export function QuickAuthForm({ onSuccess }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState('signup');
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (signupData.password.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            const redirectUrl = `${window.location.origin}/`;
            const { data: authData, error: signupError } = await appDataClient.auth.signUp({
                email: signupData.email,
                password: signupData.password,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: {
                        full_name: signupData.name,
                    },
                },
            });
            if (signupError)
                throw signupError;
            if (authData.user) {
                // Create profile
                await appDataClient.from('profiles').upsert({
                    user_id: authData.user.id,
                    full_name: signupData.name,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
                toast({
                    title: 'Account created! ✅',
                    description: 'Welcome to Houspire!',
                });
                onSuccess(authData.user);
            }
        }
        catch (error) {
            console.error('Signup error:', error);
            toast({
                title: 'Signup failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await appDataClient.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });
            if (error)
                throw error;
            if (data.user) {
                toast({
                    title: 'Welcome back! ✅',
                });
                onSuccess(data.user);
            }
        }
        catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="space-y-4">
      <Tabs value={authMode} onValueChange={(v) => setAuthMode(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="signup" className="mt-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="signup-name" placeholder="Your full name" className="pl-10" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} required disabled={loading}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="signup-email" type="email" placeholder="you@example.com" className="pl-10" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required disabled={loading}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="signup-password" type="password" placeholder="Min 8 characters" className="pl-10" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required minLength={8} disabled={loading}/>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Creating Account...
                </>) : ('Create Free Account')}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="login" className="mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="login-email" type="email" placeholder="you@example.com" className="pl-10" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required disabled={loading}/>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input id="login-password" type="password" placeholder="Your password" className="pl-10" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required disabled={loading}/>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                  Logging In...
                </>) : ('Login to Account')}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>);
}

