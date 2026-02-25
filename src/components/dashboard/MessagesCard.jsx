'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export function MessagesCard() {
  const router = useRouter();
  const { unreadCount, loading } = useUnreadCount();

  return (
    <Card className="p-6 border-border/50 bg-gradient-to-br from-accent/5 via-background to-purple-500/5 overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 relative">
            <MessageCircle className="h-6 w-6 text-accent" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full px-1.5 text-[10px] bg-destructive text-destructive-foreground border-2 border-background"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">Messages</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 
                ? 'You have unread messages from your designer'
                : 'Chat with your designer about your project'
              }
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            onClick={() => router.push('/dashboard/chat')} 
            className="flex-1 h-10 rounded-full bg-foreground hover:bg-foreground/90 text-background"
          >
            Open Messages
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Helpful hint */}
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          Tip: Chat is available for each of your active projects
        </p>
      </div>
    </Card>
  );
}
