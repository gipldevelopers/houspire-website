'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { dataGet } from '@/lib/frontend-data';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  Activity, 
  Image, 
  FileText, 
  MessageCircle, 
  DollarSign,
  CheckCircle,
  Clock,
  Package,
  Loader2
} from 'lucide-react';

const ACTIVITY_ICONS = {
  render_uploaded: Image,
  concept_created: FileText,
  message_received: MessageCircle,
  budget_updated: DollarSign,
  phase_completed: CheckCircle,
  timer_started: Clock,
  delivery_ready: Package,
  default: Activity,
};

const ACTIVITY_COLORS = {
  render_uploaded: 'bg-purple-500/10 text-purple-500',
  concept_created: 'bg-blue-500/10 text-blue-500',
  message_received: 'bg-green-500/10 text-green-500',
  budget_updated: 'bg-amber-500/10 text-amber-500',
  phase_completed: 'bg-success/10 text-success',
  timer_started: 'bg-accent/10 text-accent',
  delivery_ready: 'bg-teal-500/10 text-teal-500',
  default: 'bg-muted text-muted-foreground',
};

export function DashboardActivityFeed({ projectId }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivities();
      // Note: Real-time subscriptions would need to be replaced with polling or WebSocket
      // For now, we'll just fetch on mount and when projectId changes
    }
  }, [user, projectId]);

  const fetchActivities = async () => {
    try {
      const url = projectId 
        ? `/project-activity?projectId=${projectId}&limit=10`
        : `/project-activity?limit=10`;
      
      const data = await dataGet(url);

      // Transform to activity items
      const activityItems = (data || []).map(a => ({
        id: a.id,
        type: a.action || 'default',
        message: a.description || 'Activity logged',
        created_at: a.created_at,
        metadata: a.metadata,
      }));

      setActivities(activityItems);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Activity Feed</h3>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Activity Feed</h3>
        </div>
        {activities.length > 0 && (
          <Badge variant="secondary" className="text-xs">Live</Badge>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {activities.map((activity, idx) => {
              const Icon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default;
              const colorClass = ACTIVITY_COLORS[activity.type] || ACTIVITY_COLORS.default;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}


