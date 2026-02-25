'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
import { CheckCircle2, Circle, Clock, Trophy } from 'lucide-react';

export function MilestoneProgress({ projectId, percentage = 0 }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
    
    // Poll for updates every 10 seconds (replacing real-time subscription)
    const interval = setInterval(() => {
      fetchMilestones();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      const data = await apiGet(`/api/projects/${projectId}/milestones`);
      setMilestones(data || []);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full" />
        </div>
      </Card>
    );
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  const currentMilestone = milestones.find((m) => !m.completed);
  const displayPercentage = milestones.length > 0 
    ? Math.round((completedCount / milestones.length) * 100) 
    : percentage;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Project Progress
          </h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {milestones.length} milestones completed
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{displayPercentage}%</p>
          {displayPercentage === 100 && (
            <Badge variant="default" className="bg-green-600">
              <Trophy className="h-3 w-3 mr-1" />
              Complete!
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={displayPercentage} className="h-3 mb-6" />

      {/* Current Milestone */}
      {currentMilestone && displayPercentage < 100 && (
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Current Step
              </p>
              <p className="font-medium text-foreground">
                {currentMilestone.milestone_name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Milestone List */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              milestone.completed
                ? 'bg-green-50 dark:bg-green-900/20'
                : currentMilestone?.id === milestone.id
                ? 'bg-primary/5'
                : 'bg-muted/50'
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {milestone.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : currentMilestone?.id === milestone.id ? (
                <Clock className="h-6 w-6 text-primary animate-pulse" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${
                milestone.completed ? 'text-green-700 dark:text-green-400' : 'text-foreground'
              }`}>
                {milestone.milestone_name}
              </p>

              {milestone.completed && milestone.completed_at && (
                <p className="text-xs text-muted-foreground">
                  Completed {new Date(milestone.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Step Number */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              milestone.completed
                ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'
                : 'bg-muted text-muted-foreground'
            }`}>
              {milestone.order_index}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
