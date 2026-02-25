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
import { Wand2, Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export function StartProjectModal({ open, onOpenChange }) {
  const router = useRouter();

  const handleTakeQuiz = () => {
    onOpenChange(false);
    router.push('/style-quiz');
  };

  const handleSkipQuiz = () => {
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
            How would you like to begin?
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Take Quiz Option - Primary */}
          <div
            onClick={handleTakeQuiz}
            className="relative p-5 rounded-xl border-2 border-accent/50 bg-accent/5 cursor-pointer hover:border-accent hover:bg-accent/10 transition-all group"
          >
            <Badge className="absolute -top-2.5 left-4 bg-accent text-accent-foreground text-xs">
              Recommended
            </Badge>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Wand2 className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Take the Style Quiz</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get personalized recommendations based on your unique style.
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 2 minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Personalized match
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleTakeQuiz();
              }}
            >
              Start Quiz <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Skip Option - Secondary */}
          <div
            onClick={handleSkipQuiz}
            className="p-5 rounded-xl border border-border bg-card cursor-pointer hover:border-muted-foreground/30 hover:bg-muted/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Skip & Browse Packages</h3>
                <p className="text-sm text-muted-foreground">
                  Already know what you want? Jump straight to package selection.
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="w-full mt-4 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleSkipQuiz();
              }}
            >
              Browse Packages
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
