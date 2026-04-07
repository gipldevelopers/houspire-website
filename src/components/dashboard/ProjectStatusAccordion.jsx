'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { dataGet } from '@/lib/frontend-data';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow, addDays, format } from 'date-fns';
import { 
  Activity, 
  ChevronDown, 
  Calendar, 
  Clock,
  MessageCircle,
  FileText,
  Package,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const MILESTONE_COLORS = {
  intake: 'bg-blue-500',
  design: 'bg-purple-500',
  review: 'bg-amber-500',
  delivery: 'bg-success',
};

function calculateHealthScore(
  timerPercentage,
  currentPhase,
  revisionCount,
  hasUnreadMessages
) {
  let score = 100;
  if (timerPercentage > 80) score -= 30;
  else if (timerPercentage > 60) score -= 15;
  else if (timerPercentage > 40) score -= 5;
  score += Math.min(currentPhase * 2, 10);
  if (revisionCount > 2) score -= (revisionCount - 2) * 5;
  if (hasUnreadMessages) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function getHealthColor(score) {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-yellow-500';
  return 'text-destructive';
}

function getHealthLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}

export function ProjectStatusAccordion({
  projectId,
  currentPhase,
  timerPercentage,
  revisionCount = 0,
  hasUnreadMessages = false,
  projectCreatedAt,
}) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const healthScore = calculateHealthScore(timerPercentage, currentPhase, revisionCount, hasUnreadMessages);
  const healthColor = getHealthColor(healthScore);
  const healthLabel = getHealthLabel(healthScore);

  // Generate milestones
  const milestones = projectCreatedAt ? [
    { id: '1', title: 'Intake Deadline', date: addDays(new Date(projectCreatedAt), 1), type: 'intake', completed: currentPhase > 1 },
    { id: '2', title: 'First Concepts', date: addDays(new Date(projectCreatedAt), 2), type: 'design', completed: currentPhase > 2 },
    { id: '3', title: 'Review Session', date: addDays(new Date(projectCreatedAt), 3), type: 'review', completed: currentPhase > 3 },
    { id: '4', title: 'Final Delivery', date: addDays(new Date(projectCreatedAt), 4), type: 'delivery', completed: currentPhase > 4 },
  ] : [];

  useEffect(() => {
    if (user && projectId) {
      fetchActivities();
    }
  }, [user, projectId]);

  const fetchActivities = async () => {
    try {
      const data = await dataGet(`/project-activity?projectId=${projectId}&limit=5`);
      
      const items = (data || []).map(a => ({
        id: a.id,
        type: a.action || 'default',
        message: a.description || 'Activity logged',
        created_at: a.created_at,
      }));

      setActivities(items);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingMilestones = milestones.filter(m => m.date >= new Date() && !m.completed).slice(0, 2);

  return (
    <Card className="border-border/50 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Project Status</p>
                <p className="text-sm text-muted-foreground">Health, deadlines & activity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${healthScore >= 70 ? 'bg-success/10 text-success' : healthScore >= 40 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-destructive/10 text-destructive'} border-0`}>
                {healthScore}% {healthLabel}
              </Badge>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-4">
            {/* Health Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${timerPercentage < 60 ? 'bg-success' : timerPercentage < 80 ? 'bg-yellow-500' : 'bg-destructive'}`} />
                <span className="text-muted-foreground">Timer: {Math.round(100 - timerPercentage)}% left</span>
              </div>
              <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${revisionCount <= 2 ? 'bg-success' : 'bg-yellow-500'}`} />
                <span className="text-muted-foreground">Revisions: {revisionCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${!hasUnreadMessages ? 'bg-success' : 'bg-destructive'}`} />
                <span className="text-muted-foreground">{hasUnreadMessages ? 'Unread msgs' : 'Messages OK'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-muted-foreground">Phase: {currentPhase}/5</span>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            {upcomingMilestones.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Upcoming
                </p>
                <div className="space-y-2">
                  {upcomingMilestones.map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className={`w-2 h-2 rounded-full ${MILESTONE_COLORS[milestone.type]}`} />
                      <span className="text-sm text-foreground">{milestone.title}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{format(milestone.date, 'MMM d')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {activities.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recent Activity</p>
                <div className="space-y-2">
                  {activities.slice(0, 3).map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground truncate">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}


