'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  FileText, 
  Calendar, 
  Upload, 
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export function InfoGrid({ 
  designer, 
  projectId,
  currentPhase = 1,
  hasUnreadMessages = false,
  unreadCount = 0 
}) {
  const router = useRouter();

  // Dynamic quick actions based on project phase
  const quickActions = [];
  
  if (currentPhase === 1) {
    quickActions.push({
      label: 'Complete Intake',
      icon: FileText,
      primary: true,
      onClick: () => projectId && router.push(`/project/${projectId}`),
    });
  }
  
  if (currentPhase >= 2) {
    quickActions.push({
      label: 'View Concepts',
      icon: Sparkles,
      primary: currentPhase === 3,
      onClick: () => projectId && router.push(`/project/${projectId}?tab=concepts`),
    });
  }
  
  quickActions.push({
    label: 'Upload Files',
    icon: Upload,
    primary: false,
    onClick: () => projectId && router.push(`/project/${projectId}?tab=files`),
  });
  
  quickActions.push({
    label: 'Schedule Call',
    icon: Calendar,
    primary: false,
    onClick: () => projectId && router.push(`/orders/${projectId}/schedule-call`),
  });

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Designer Card */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Your Designer</span>
        </div>
        {designer ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-accent/20">
              <AvatarImage src={designer.avatar} alt={designer.name} />
              <AvatarFallback>{designer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{designer.name}</p>
              <p className="text-sm text-muted-foreground truncate">{designer.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{designer.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Designer will be assigned soon</p>
          </div>
        )}
      </Card>

      {/* Quick Actions Card */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
        </div>
        <div className="space-y-2">
          {quickActions.slice(0, 3).map((action, idx) => (
            <Button
              key={idx}
              variant={action.primary ? 'default' : 'ghost'}
              size="sm"
              onClick={action.onClick}
              className={`w-full justify-start h-9 ${action.primary ? 'bg-accent hover:bg-accent/90 text-white' : ''}`}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Messages Card */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Messages</span>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="space-y-3">
          {hasUnreadMessages ? (
            <>
              <p className="text-sm text-foreground">You have unread messages from your designer</p>
              <Button 
                size="sm" 
                className="w-full bg-foreground hover:bg-foreground/90 text-background"
                onClick={() => router.push('/dashboard/chat')}
              >
                Open Chat
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">All caught up! No new messages.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push('/dashboard/chat')}
              >
                View Conversations
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
