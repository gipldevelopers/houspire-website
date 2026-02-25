'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';

export function QuizMockup() {
  return (
    <div className="relative">
      {/* Browser frame */}
      <div className="bg-card rounded-2xl md:rounded-3xl shadow-apple-xl border border-border/50 overflow-hidden">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
              houspire.com/style-quiz
            </div>
          </div>
        </div>
        {/* Quiz content */}
        <div className="p-6 md:p-8 bg-background">
          <p className="text-sm text-muted-foreground mb-2">Question 3 of 6</p>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6">
            Which vibe speaks to you?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {['Cozy & Warm', 'Clean & Minimal', 'Bold & Vibrant', 'Natural & Organic'].map((style, idx) => (
              <div
                key={style}
                className={`p-4 rounded-xl border-2 text-center text-sm font-medium transition-all ${
                  idx === 1 
                    ? 'border-accent bg-accent/5 text-accent' 
                    : 'border-border text-muted-foreground hover:border-border/80'
                }`}
              >
                {style}
                {idx === 1 && <CheckCircle className="h-4 w-4 mx-auto mt-2 text-accent" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <Badge className="absolute -top-3 -right-3 bg-accent text-accent-foreground shadow-lg">
        <Star className="h-3 w-3 mr-1 fill-current" />
        2 min quiz
      </Badge>
    </div>
  );
}
