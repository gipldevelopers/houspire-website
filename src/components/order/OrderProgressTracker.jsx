import { useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Circle, Clock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getOrderMilestones, getCurrentMilestone, calculateProgress, getNextAction, getMilestoneDefinition, getOrderProgressState, applyOrderProgressState } from '@/lib/progress-tracker-service';
export function OrderProgressTracker({ orderId, compact = false, className = '', onMilestoneChange }) {
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);
    const prevProgressRef = useRef(0);
    const loadMilestones = useCallback(async (showToast = false) => {
        const [data, state] = await Promise.all([
            getOrderMilestones(orderId),
            getOrderProgressState(orderId),
        ]);
        const applied = applyOrderProgressState(data, state);
        const newProgress = calculateProgress(applied);
        // Show toast on real-time milestone completion
        if (showToast && newProgress > prevProgressRef.current) {
            const justCompleted = applied.find((m) => m.status === 'completed' && milestones.find((old) => old.id === m.id)?.status !== 'completed');
            const def = justCompleted ? getMilestoneDefinition(justCompleted.milestone_type) : null;
            if (def) {
                toast.success(`${def.icon} ${def.label} completed!`, {
                    description: def.description,
                });
            }
        }
        prevProgressRef.current = newProgress;
        setMilestones(applied);
        onMilestoneChange?.(applied);
        setLoading(false);
    }, [orderId, milestones, onMilestoneChange]);
    useEffect(() => {
        if (!orderId)
            return;
        setLoading(true);
        loadMilestones();
        // Real-time subscriptions for milestones + order status
        const channel = supabase
            .channel(`order-tracking-${orderId}`)
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'order_milestones',
            filter: `order_id=eq.${orderId}`,
        }, () => {
            loadMilestones(true);
        })
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${orderId}`,
        }, () => {
            loadMilestones(true);
        })
            .subscribe((status) => {
            setIsLive(status === 'SUBSCRIBED');
        });
        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);
    if (loading) {
        return (<Card className={`p-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32"/>
            <Skeleton className="h-6 w-16"/>
          </div>
          <Skeleton className="h-2 w-full"/>
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map(i => (<Skeleton key={i} className="h-12 w-full"/>))}
          </div>
        </div>
      </Card>);
    }
    if (milestones.length === 0) {
        return (<Card className={`p-6 ${className}`}>
        <div className="text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50"/>
          <p>No progress data available</p>
        </div>
      </Card>);
    }
    const progress = calculateProgress(milestones);
    const currentMilestone = getCurrentMilestone(milestones);
    const nextAction = getNextAction(milestones, orderId);
    const currentDef = currentMilestone ? getMilestoneDefinition(currentMilestone.milestone_type) : null;
    if (compact) {
        return (<Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Order Progress</span>
            {isLive && (<span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"/>
              </span>)}
          </div>
          <Badge variant="secondary">{progress}%</Badge>
        </div>
        <Progress value={progress} className="h-2"/>
        {currentDef && (<p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span>{currentDef.icon}</span>
            {currentDef.label}
          </p>)}
      </Card>);
    }
    return (<Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Order Progress</h3>
            {isLive && (<span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"/>
              </span>)}
          </div>
          <Badge variant={progress === 100 ? 'default' : 'secondary'} className="text-sm">
            {progress}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2"/>
        {currentDef && (<p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin"/>
            Current: {currentDef.label}
          </p>)}
      </div>

      {/* Next Action Card */}
      {nextAction && (<Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-primary">{nextAction.title}</h4>
              <p className="text-sm text-muted-foreground">{nextAction.description}</p>
            </div>
            <Button onClick={() => navigate(nextAction.link)} size="sm">
              {nextAction.action}
              <ArrowRight className="h-4 w-4 ml-1"/>
            </Button>
          </div>
        </Card>)}

      {/* Timeline */}
      <div className="relative">
        {milestones.map((milestone, index) => {
            const definition = getMilestoneDefinition(milestone.milestone_type);
            if (!definition)
                return null;
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';
            const isPending = milestone.status === 'pending';
            const isSkipped = milestone.status === 'skipped';
            const isLast = index === milestones.length - 1;
            return (<div key={milestone.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Icon Column */}
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg
                  ${isCompleted ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : ''}
                  ${isInProgress ? 'bg-primary/10 border-primary text-primary animate-pulse' : ''}
                  ${isPending ? 'bg-muted border-muted-foreground/30 text-muted-foreground' : ''}
                  ${isSkipped ? 'bg-muted border-muted-foreground/20 text-muted-foreground/50' : ''}
                `}>
                  {isCompleted ? (<CheckCircle2 className="h-5 w-5"/>) : isInProgress ? (<Clock className="h-5 w-5"/>) : isSkipped ? (<AlertCircle className="h-4 w-4"/>) : (<Circle className="h-4 w-4"/>)}
                </div>
                {!isLast && (<div className={`w-0.5 flex-1 mt-2 ${isCompleted ? 'bg-emerald-300' : 'bg-muted'}`}/>)}
              </div>

              {/* Content Column */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium flex items-center gap-2 ${isSkipped ? 'text-muted-foreground line-through' : ''}`}>
                    <span>{definition.icon}</span>
                    {definition.label}
                  </h4>
                  {milestone.completed_at && (<span className="text-xs text-muted-foreground">
                      {new Date(milestone.completed_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                    })}
                    </span>)}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{definition.description}</p>

                {/* Estimated completion for pending */}
                {isPending && milestone.estimated_completion && (<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3"/>
                    Est: {new Date(milestone.estimated_completion).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                    })}
                  </p>)}

                {/* Notes */}
                {milestone.notes && (<p className="text-xs text-muted-foreground mt-1 italic">
                    {milestone.notes}
                  </p>)}

                {/* In Progress badge */}
                {isInProgress && (<Badge variant="default" className="mt-2 text-xs">
                    In Progress
                  </Badge>)}
              </div>
            </div>);
        })}
      </div>
    </Card>);
}
