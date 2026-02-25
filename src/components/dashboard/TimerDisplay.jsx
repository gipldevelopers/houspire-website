'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Pause, Play, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { motion } from 'framer-motion';

export function TimerDisplay({ projectId, timerStatus }) {
  const { hours, minutes, seconds, percentage, isRunning, isExpired } = useTimer(projectId);

  // Determine urgency level based on hours remaining
  const getUrgencyLevel = () => {
    if (hours <= 12) return 'critical';
    if (hours <= 24) return 'warning';
    if (hours <= 48) return 'medium';
    return 'safe';
  };

  const urgencyLevel = getUrgencyLevel();

  const urgencyStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    warning: 'border-orange-500/50 bg-orange-50 dark:bg-orange-950/20',
    medium: 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20',
    safe: 'border-secondary/50 bg-secondary/5',
  };

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    }

    if (timerStatus === 'paused') {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <Pause className="h-3 w-3" />
          Paused
        </Badge>
      );
    }

    if (timerStatus === 'not_started') {
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Not Started
        </Badge>
      );
    }

    return (
      <Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <Play className="h-3 w-3" />
        Running
      </Badge>
    );
  };

  if (isExpired) {
    return (
      <Card className="p-6 border-destructive bg-destructive/5">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-destructive">Timer Expired</h3>
            <p className="text-sm text-muted-foreground">
              We missed the deadline. You qualify for a full refund.
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </Card>
    );
  }

  if (timerStatus === 'not_started') {
    return (
      <Card className="p-6 card-premium">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-muted">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">72-Hour Guarantee</h3>
              <p className="text-sm text-muted-foreground">Timer starts after intake</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">
          Your 72-hour countdown will begin once you submit the design brief.
        </p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${urgencyStyles[urgencyLevel]} card-premium`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-secondary/20">
            <Clock className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">72-Hour Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              {timerStatus === 'paused' ? 'Waiting for your response' : 'Design delivery countdown'}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <motion.div 
          className="flex items-center justify-center gap-2 sm:gap-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-5xl font-bold font-mono ${
              urgencyLevel === 'critical' ? 'text-destructive' :
              urgencyLevel === 'warning' ? 'text-orange-600' :
              'text-foreground'
            }`}>
              {String(hours).padStart(2, '0')}
            </div>
            <span className="text-xs text-muted-foreground mt-1">hours</span>
          </div>

          <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-5xl font-bold font-mono ${
              urgencyLevel === 'critical' ? 'text-destructive' :
              urgencyLevel === 'warning' ? 'text-orange-600' :
              'text-foreground'
            }`}>
              {String(minutes).padStart(2, '0')}
            </div>
            <span className="text-xs text-muted-foreground mt-1">minutes</span>
          </div>

          <span className="text-3xl sm:text-4xl font-bold text-muted-foreground">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <motion.div 
              className={`text-4xl sm:text-5xl font-bold font-mono ${
                urgencyLevel === 'critical' ? 'text-destructive' :
                urgencyLevel === 'warning' ? 'text-orange-600' :
                'text-foreground'
              }`}
              key={seconds}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {String(seconds).padStart(2, '0')}
            </motion.div>
            <span className="text-xs text-muted-foreground mt-1">seconds</span>
          </div>
        </motion.div>

        {/* Status Text */}
        <p className="text-sm text-muted-foreground mt-3">
          {timerStatus === 'paused' 
            ? `⏸️ Paused at ${hours}h ${minutes}m ${seconds}s remaining`
            : '⏱️ Time Remaining'
          }
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(100 - percentage)}% remaining</span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      {/* Status Messages */}
      {timerStatus === 'paused' && (
        <div className="mt-4 p-3 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            ⏸️ Timer paused - Waiting for your feedback. Timer will resume once you respond.
          </p>
        </div>
      )}

      {isRunning && (
        <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          On track for on-time delivery
        </div>
      )}

      {/* Money-back guarantee */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-secondary" />
          <span>100% Money-Back Guarantee if we miss the deadline</span>
        </div>
      </div>
    </Card>
  );
}
