'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, Link } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { dataPost, dataRequest } from '@/lib/frontend-data';
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';

import { Suspense } from 'react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.emailVerified) {
      router.push('/dashboard');
    }

    // If token is present, verify email automatically
    if (token) {
      const verifyEmail = async () => {
        setVerifying(true);
        try {
          await dataPost('/auth/verify-email', { token });
          
          toast({
            title: 'Email verified!',
            description: 'Your email has been verified successfully',
          });

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } catch (error) {
          console.error('Verify email error:', error);
          toast({
            title: 'Verification failed',
            description: error instanceof Error ? error.message : 'Invalid or expired verification token',
            variant: 'destructive',
          });
        } finally {
          setVerifying(false);
        }
      };
      verifyEmail();
    }
  }, [user, token, router, toast]);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please provide your email address',
        variant: 'destructive',
      });
      return;
    }

    setResending(true);

    try {
      await dataRequest('/auth/verify-email', {
        method: 'PUT',
        body: JSON.stringify({ email }),
      });

      setResent(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for the verification link',
      });
    } catch (error) {
      console.error('Resend email error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again';
      toast({
        title: 'Failed to send email',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
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
          {/* Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Mail className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              Check your email
            </h1>

            <p className="text-muted-foreground mt-2">
              We sent a verification link to
            </p>

            <p className="font-semibold text-foreground mt-1">
              {email || 'your email address'}
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-muted/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-3">
              Next steps:
            </p>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Open the email we sent you</li>
              <li>Click the verification link</li>
              <li>You'll be automatically signed in</li>
            </ol>
          </div>

          {/* Resend */}
          <div className="mt-6 space-y-3">
            {resent && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                Verification email sent successfully
              </div>
            )}

            <Button
              onClick={handleResendEmail}
              disabled={resending || resent}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : resent ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Email sent
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend verification email
                </>
              )}
            </Button>

            <Link href="/login">
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <a href="mailto:support@houspire.com" className="text-foreground underline">
                contact support
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}


