'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Zap, CheckCircle2, Clock } from 'lucide-react';
import { getQuickActions } from '@/lib/quick-actions-service';

export function QuickActionsCard() {
  const router = useRouter();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  async function loadActions() {
    setLoading(true);
    const data = await getQuickActions();
    setActions(data);
    setLoading(false);
  }

  function getPriorityStyles(priority) {
    switch (priority) {
      case 'high':
        return {
          border: 'border-l-4 border-l-destructive',
          badge: 'bg-destructive/10 text-destructive border-destructive/20'
        };
      case 'medium':
        return {
          border: 'border-l-4 border-l-amber-500',
          badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        };
      case 'low':
        return {
          border: 'border-l-4 border-l-primary',
          badge: 'bg-primary/10 text-primary border-primary/20'
        };
      default:
        return {
          border: '',
          badge: ''
        };
    }
  }

  if (loading) {
    return (
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (actions.length === 0) {
    return (
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-foreground font-medium">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">No pending actions at the moment</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {actions.length} pending
        </Badge>
      </div>

      <div className="space-y-3">
        {actions.map(action => {
          const styles = getPriorityStyles(action.priority);
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg bg-background border ${styles.border} hover:shadow-md transition-all cursor-pointer group`}
              onClick={() => {
                if (action.href) {
                  router.push(action.href);
                } else if (action.onClick) {
                  action.onClick();
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">{action.title}</h4>
                    <Badge variant="outline" className={`text-xs ${styles.badge}`}>
                      {action.priority}
                    </Badge>
                  </div>
                  {action.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  )}
                  {action.meta && (
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{action.meta}</span>
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
