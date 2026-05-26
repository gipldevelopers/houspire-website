'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, ArrowRight, Home, Eye } from 'lucide-react';

export function StartProjectModal({ open, onOpenChange }) {
  const router = useRouter();

  const handleGetStarted = () => {
    onOpenChange(false);
    router.push('/select-package');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Let's Start Your Project
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Professional designs delivered in 72 hours
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">1. Choose Your Package</h4>
                <p className="text-xs text-muted-foreground">Select a single room trial or a complete home package.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Home className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">2. Share Your Space</h4>
                <p className="text-xs text-muted-foreground">Upload photos and specify your requirements in 10 minutes.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">3. Get Your Design Package</h4>
                <p className="text-xs text-muted-foreground">Receive photorealistic renders, itemized budget, and shopping links.</p>
              </div>
            </div>
          </div>

          <div
            onClick={handleGetStarted}
            className="relative p-5 rounded-xl border-2 border-accent/50 bg-accent/5 cursor-pointer hover:border-accent hover:bg-accent/10 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Explore Design Packages</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Find the perfect fit starting from just ₹499.
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 72-hour delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> 100% money-back guarantee
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleGetStarted();
              }}
            >
              Browse Packages <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
