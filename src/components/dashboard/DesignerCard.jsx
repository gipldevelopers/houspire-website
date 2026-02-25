'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Star, 
  MessageCircle, 
  ExternalLink, 
  CheckCircle
} from 'lucide-react';

export function DesignerCard({ designer, isAvailable = true, onContact }) {
  const router = useRouter();

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Your Designer</h3>
        <Badge 
          className={`${isAvailable ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'} border-0`}
        >
          <div className={`w-2 h-2 rounded-full mr-1.5 ${isAvailable ? 'bg-success' : 'bg-muted-foreground'}`} />
          {isAvailable ? 'Available' : 'Busy'}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarImage src={designer.avatar} alt={designer.name} />
          <AvatarFallback className="text-lg">{designer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-foreground">{designer.name}</h4>
          <p className="text-sm text-muted-foreground">{designer.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-foreground">{designer.rating}</span>
            <span className="text-sm text-muted-foreground">/5.0</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {designer.experience_years && (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold text-foreground">{designer.experience_years}+</p>
            <p className="text-xs text-muted-foreground">Years Experience</p>
          </div>
        )}
        {designer.projects_completed && (
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold text-foreground">{designer.projects_completed}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={onContact}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push(`/designer/${designer.id}`)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Portfolio
        </Button>
      </div>
    </Card>
  );
}
