'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, Link } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle,
  Loader2,
  Gift,
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

const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters');
const emailSchema = z.string().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

// Password strength calculator
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-destructive' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-warning' };
  return { score, label: 'Strong', color: 'bg-success' };
}

import { Suspense } from 'react';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Get referral code from URL
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate password strength
  const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const returnTo = searchParams.get('returnTo');
      router.push(returnTo || '/dashboard');
    }
  }, [user, authLoading, router, searchParams]);

  const validateForm = () => {
    const newErrors = {};
    
    const nameResult = nameSchema.safeParse(formData.fullName.trim());
    if (!nameResult.success) {
      newErrors.name = nameResult.error.errors[0].message;
    }
    
    const emailResult = emailSchema.safeParse(formData.email.trim());
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(formData.password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      toast({
        title: 'Accept terms',
        description: 'Please accept the terms and conditions',
        variant: 'destructive',
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signUp(formData.email.trim(), formData.password, formData.fullName.trim());
      
      if (error) {
        let message = error.message;
        if (error.message.includes('User already registered') || error.message.includes('User already exists')) {
          message = 'An account with this email already exists. Please sign in instead.';
        }
        toast({
          title: 'Sign up failed',
          description: message,
          variant: 'destructive',
        });
      } else {
        // Store referral code in localStorage to apply after email verification
        if (referralCode) {
          localStorage.setItem('pendingReferralCode', referralCode);
        }
        
        toast({
          title: 'Account created! 🎉',
          description: referralCode 
            ? 'Check your email to verify your account. Referral discount will be applied!'
            : 'Check your email to verify your account',
        });
        // Redirect to verify email page with email param
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      // TODO: Implement Google OAuth
      toast({
        title: 'Google sign up',
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

  const benefits = [
    'Get professional designs in 72 hours',
    'Transparent pricing - no hidden fees',
    'Direct shopping links included',
    'Verified contractor connections',
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
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/hero-bg.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70" />
        
        <div className="relative z-10 p-12 flex flex-col justify-center text-background">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
            Start your design journey today
          </h1>

          <p className="text-lg text-background/80 mb-8">
            Join thousands of homeowners creating beautiful spaces with India's most transparent interior design platform
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, idx) => (
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
                <span className="text-background/90">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 p-4 bg-accent/20 rounded-lg border border-accent/30"
            >
              <div className="flex items-center gap-2 text-background">
                <Gift className="h-5 w-5 text-accent" />
                <span className="font-medium">Referral code applied! You'll get special benefits.</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Right - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-6 md:p-8 bg-background"
      >
        <Card className="w-full max-w-md p-6 md:p-8 shadow-apple-lg border border-border/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Sign up to get started with your design project
            </p>
          </div>

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
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

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className={`pl-11 h-12 ${errors.name ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`pl-11 h-12 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
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
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className={`pl-11 pr-11 h-12 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={setAcceptedTerms}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
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

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-accent font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Signup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
