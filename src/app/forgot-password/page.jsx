'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle, KeyRound, Home, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await apiPost('/api/auth/forgot-password', { email });

      setEmailSent(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for password reset instructions',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to send email',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branded Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-foreground -ml-0 rounded-tl-none">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-background mb-4">
                Forgot your password?
              </h1>
              <p className="text-lg text-background/70">
                No worries! Enter your email and we'll send you a link to reset your password securely.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 space-y-4"
            >
              {[
                'Quick & secure password reset',
                'Link expires in 1 hour for safety',
                'Check spam folder if not received',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-background/80">
                  <div className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-background" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="text-background/50 text-sm">
            © {new Date().getFullYear()} Houspire. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <Home className="h-5 w-5 text-background" />
              </div>
              <span className="text-2xl font-bold text-foreground">Houspire</span>
            </Link>
          </div>

          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Reset password
                </h2>
                <p className="text-muted-foreground">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-12 h-12 rounded-xl border-input bg-background"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send reset instructions'
                  )}
                </Button>
              </form>

              {/* Help */}
              <p className="text-center text-sm text-muted-foreground mt-8">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-foreground hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Success State */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Check your email
                </h2>

                <p className="text-muted-foreground mb-2">
                  We sent a password reset link to
                </p>

                <p className="font-semibold text-foreground mb-6">
                  {email}
                </p>

                <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground mb-8">
                  <p>
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="font-medium text-foreground hover:underline"
                    >
                      try another email address
                    </button>
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full h-12 bg-foreground hover:bg-foreground/90 text-background rounded-xl font-semibold text-base transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Link>
              </motion.div>
            </>
          )}

          {/* Support */}
          <div className="text-center mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a
                href="mailto:support@houspire.com"
                className="font-medium text-foreground hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
