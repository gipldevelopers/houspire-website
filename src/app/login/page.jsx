'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Loader2,
  Shield,
} from 'lucide-react';

// Google icon component
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const returnTo = searchParams.get('returnTo');
      router.push(returnTo || '/dashboard');
    }
  }, [user, authLoading, router, searchParams]);

  const onSubmit = async (data) => {
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        let message = error.message;
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid email or password')) {
          message = 'Invalid email or password. Please try again.';
        }
        toast({
          title: 'Sign in failed',
          description: message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: "You've been signed in successfully",
        });
        const returnTo = searchParams.get('returnTo');
        router.push(returnTo || '/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // TODO: Implement Google OAuth
      toast({
        title: 'Google sign in',
        description: 'Google OAuth will be implemented soon',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const features = [
    'Track your project progress',
    'View your design concepts',
    'Download shopping lists',
    'Chat with your designer',
  ];

  // Show loading skeleton while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left - Branding (visible on lg+) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/hero-bg.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70" />
        
        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col justify-center text-background">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
            Welcome back to your design journey
          </h1>

          <p className="text-lg text-background/80 mb-8">
            Continue creating beautiful spaces with India's most transparent interior design platform
          </p>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-accent" />
                </div>
                <span className="text-background/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-6 md:p-8 bg-background"
      >
        <Card className="w-full max-w-md p-6 md:p-8 shadow-apple-lg border border-border/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-12 mb-6 font-medium border-border hover:bg-secondary/50"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon className="h-5 w-5 mr-2" />
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className={`pl-11 h-12 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="Enter your password"
                  className={`pl-11 pr-11 h-12 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Trust signal */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>Your data is secure and encrypted</span>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent font-medium hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Help */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Need help?{' '}
            <a href="mailto:support@houspire.com" className="text-foreground hover:underline">
              Contact support
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
