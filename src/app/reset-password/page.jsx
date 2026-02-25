'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound, Loader2 } from 'lucide-react';

import { Suspense } from 'react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if we have a valid token
    if (token) {
      setValidToken(true);
    }
    setChecking(false);
  }, [token]);

  const validatePassword = () => {
    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    if (!token) {
      toast({
        title: 'Invalid token',
        description: 'Please request a new password reset link',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await apiPost('/api/auth/reset-password', {
        token,
        password,
      });

      toast({
        title: 'Password updated!',
        description: 'Your password has been reset successfully',
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to reset password',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
        <Card className="p-8 rounded-2xl shadow-lg border-0 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Invalid or expired link
          </h1>
          <p className="text-muted-foreground mt-2">
            This password reset link is invalid or has expired
          </p>
          <Button
            onClick={() => router.push('/forgot-password')}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl mt-6"
          >
            Request new link
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 rounded-2xl shadow-lg border-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Set new password
            </h1>
            <p className="text-muted-foreground mt-2">
              Your new password must be different from previously used passwords
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                New password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a new password"
                  className="pl-11 pr-11 h-12 rounded-xl border-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="pl-11 pr-11 h-12 rounded-xl border-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Passwords don't match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm font-medium text-foreground mb-2">
                Password requirements:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${password.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className={password.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${password === confirmPassword && confirmPassword.length > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className={password === confirmPassword && confirmPassword.length > 0 ? 'text-green-600' : 'text-muted-foreground'}>
                    Passwords match
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
        </Card>

        {/* Help */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Need help?{' '}
          <a href="mailto:support@houspire.com" className="text-foreground hover:underline">
            Contact support
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
