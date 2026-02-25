'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Image, Package, ShoppingBag } from 'lucide-react';

export function DeliveryMockup() {
  const packageItems = [
    { icon: Image, label: '3D Renders (4 views)' },
    { icon: ShoppingBag, label: 'Shopping List (23 items)' },
    { icon: Package, label: 'Budget Breakdown' },
  ];

  return (
    <div className="relative">
      {/* Main card */}
      <Card className="overflow-hidden shadow-apple-xl">
        {/* 3D Render preview */}
        <div className="relative aspect-[4/3]">
          <img
            src="/styles/japanese-zen/portfolio-4-dining-room.png"
            alt="3D Render"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm opacity-80">Your Design Package</p>
            <p className="text-lg font-semibold">Modern Living Room</p>
          </div>
        </div>
        {/* Package items */}
        <div className="p-4 bg-card">
          <div className="space-y-2">
            {packageItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-foreground">{item.label}</span>
                <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </Card>
      {/* Floating badge */}
      <Badge className="absolute -top-3 -right-3 bg-foreground text-background shadow-lg">
        <Package className="h-3 w-3 mr-1" />
        Complete package
      </Badge>
    </div>
  );
}
