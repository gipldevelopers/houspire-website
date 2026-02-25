'use client';

import { Badge } from '@/components/ui/badge';
import { Camera, Image, Upload } from 'lucide-react';

export function IntakeMockup() {
  return (
    <div className="relative">
      {/* Phone frame */}
      <div className="bg-card rounded-[2rem] shadow-apple-xl border-4 border-foreground/10 overflow-hidden max-w-[280px] mx-auto">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-foreground/5">
          <span className="text-xs font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-foreground/30 rounded-sm" />
          </div>
        </div>
        {/* App content */}
        <div className="p-4 bg-background">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload Photos</p>
              <p className="text-xs text-muted-foreground">Share your space</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                {i <= 2 ? (
                  <img 
                    src={i === 1 ? '/styles/japanese-zen/portfolio-4-dining-room.png' : '/styles/traditional-indian/portfolio-7-kids-bedroom.png'}
                    alt="Room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">Living Room</Badge>
            <Badge variant="secondary" className="text-xs">Modern</Badge>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white shadow-lg">
        <Image className="h-3 w-3 mr-1" />
        Easy upload
      </Badge>
    </div>
  );
}
