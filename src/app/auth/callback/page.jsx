'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Suspense } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle OAuth callback or password recovery
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const returnTo = searchParams.get('returnTo');

    if (type === 'recovery') {
      // Password recovery callback
      router.push(`/reset-password?token=${token}`);
    } else if (token) {
      // OAuth callback - store token and redirect
      localStorage.setItem('token', token);
      router.push(returnTo || '/dashboard');
    } else {
      // Default redirect to dashboard
      router.push(returnTo || '/dashboard');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

