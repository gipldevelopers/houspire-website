'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

export function AdminRoute({ children }) {
  const { user, isAdmin, loading, roleLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Show access denied toast only once when user is loaded and not admin
    if (!loading && !roleLoading && user && !isAdmin && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access admin pages.',
        variant: 'destructive',
      });
    }
  }, [loading, roleLoading, user, isAdmin, toast]);

  useEffect(() => {
    // Redirect logic
    if (!loading && !roleLoading) {
      if (!user) {
        router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [loading, roleLoading, user, isAdmin, router, pathname]);

  // Still loading auth or role
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not admin - will redirect via useEffect
  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
