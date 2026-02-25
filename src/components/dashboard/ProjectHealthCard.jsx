'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  MessageCircle, 
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

function calculateHealthScore(
  timerPercentage,
  currentPhase,
  revisionCount,
  hasUnreadMessages
) {
  let score = 100;
  
  // Timer impact (up to -30 points)
  if (timerPercentage > 80) score -= 30;
  else if (timerPercentage > 60) score -= 15;
  else if (timerPercentage > 40) score -= 5;
  
  // Phase progress bonus (up to +10)
  score += Math.min(currentPhase * 2, 10);
  
  // Revision impact (-5 per revision after 2)
  if (revisionCount > 2) score -= (revisionCount - 2) * 5;
  
  // Unread messages impact
  if (hasUnreadMessages) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function getHealthColor(score) {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-yellow-500';
  return 'text-destructive';
}

function getHealthBgColor(score) {
  if (score >= 70) return 'bg-success';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-destructive';
}

function getHealthLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}

export function ProjectHealthCard({
  projectId,
  currentPhase,
  timerPercentage,
  revisionCount,
  hasUnreadMessages,
  intakeComplete,
  conceptsAvailable,
  onActionClick
}) {
  const healthScore = calculateHealthScore(timerPercentage, currentPhase, revisionCount, hasUnreadMessages);
  const healthColor = getHealthColor(healthScore);
  const healthBgColor = getHealthBgColor(healthScore);
  const healthLabel = getHealthLabel(healthScore);

  // Generate action items based on project state
  const actionItems = [];
  
  if (!intakeComplete) {
    actionItems.push({
      id: 'intake',
      label: 'Complete intake form',
      icon: FileText,
      status: 'pending',
      progress: currentPhase === 1 ? 50 : 0,
    });
  }
  
  if (hasUnreadMessages) {
    actionItems.push({
      id: 'messages',
      label: 'Respond to designer message',
      icon: MessageCircle,
      status: 'urgent',
      age: '2 hours ago',
    });
  }
  
  if (conceptsAvailable && currentPhase >= 3) {
    actionItems.push({
      id: 'concepts',
      label: 'Review uploaded concepts',
      icon: CheckCircle,
      status: 'in_progress',
    });
  }

  // Circular progress component
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Project Health
        </h3>
        <Badge 
          className={`${healthScore >= 70 ? 'bg-success/10 text-success' : healthScore >= 40 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-destructive/10 text-destructive'} border-0`}
        >
          {healthLabel}
        </Badge>
      </div>

      {/* Health Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={healthColor}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`text-3xl font-bold ${healthColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {healthScore}
            </motion.span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      {/* Health Factors */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${timerPercentage < 60 ? 'bg-success' : timerPercentage < 80 ? 'bg-yellow-500' : 'bg-destructive'}`} />
          <span className="text-muted-foreground">Timer: {Math.round(100 - timerPercentage)}% left</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${revisionCount <= 2 ? 'bg-success' : 'bg-yellow-500'}`} />
          <span className="text-muted-foreground">Revisions: {revisionCount}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${!hasUnreadMessages ? 'bg-success' : 'bg-destructive'}`} />
          <span className="text-muted-foreground">Messages: {hasUnreadMessages ? 'Unread' : 'Up to date'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Phase: {currentPhase}/5</span>
        </div>
      </div>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Action Items</p>
          {actionItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onActionClick?.(item.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.status === 'urgent' ? 'bg-destructive/10' :
                item.status === 'completed' ? 'bg-success/10' :
                'bg-accent/10'
              }`}>
                {item.status === 'urgent' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <item.icon className={`h-4 w-4 ${
                    item.status === 'completed' ? 'text-success' : 'text-accent'
                  }`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.label}</p>
                {item.progress !== undefined && (
                  <Progress value={item.progress} className="h-1 mt-1.5" />
                )}
                {item.age && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.age}</p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
