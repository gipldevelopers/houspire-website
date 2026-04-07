import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Play, Pause, AlertTriangle } from 'lucide-react';
export function TimerStatusCard({ project, onUpdate }) {
    const { toast } = useToast();
    const [timerStatus, setTimerStatus] = useState(project.timer_status);
    const [elapsedSeconds, setElapsedSeconds] = useState(project.timer_elapsed_seconds);
    useEffect(() => {
        setTimerStatus(project.timer_status);
        setElapsedSeconds(project.timer_elapsed_seconds);
    }, [project]);
    useEffect(() => {
        if (timerStatus === 'running' && project.timer_started_at) {
            const interval = setInterval(() => {
                const startTime = new Date(project.timer_started_at).getTime();
                const now = Date.now();
                const runningSeconds = Math.floor((now - startTime) / 1000);
                const total = project.timer_elapsed_seconds + runningSeconds;
                setElapsedSeconds(total);
                if (total >= project.timer_total_seconds) {
                    setTimerStatus('expired');
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timerStatus, project]);
    const formatTime = (seconds) => {
        const remaining = Math.max(0, project.timer_total_seconds - seconds);
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const secs = remaining % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const handlePauseTimer = async () => {
        const runningSeconds = project.timer_started_at
            ? Math.floor((Date.now() - new Date(project.timer_started_at).getTime()) / 1000)
            : 0;
        const { error } = await appDataClient
            .from('projects')
            .update({
            timer_status: 'paused',
            timer_elapsed_seconds: project.timer_elapsed_seconds + runningSeconds,
            timer_started_at: null,
        })
            .eq('id', project.id);
        if (!error) {
            setTimerStatus('paused');
            toast({ title: 'Timer paused' });
            onUpdate?.();
        }
    };
    const handleResumeTimer = async () => {
        const { error } = await appDataClient
            .from('projects')
            .update({
            timer_status: 'running',
            timer_started_at: new Date().toISOString(),
        })
            .eq('id', project.id);
        if (!error) {
            setTimerStatus('running');
            toast({ title: 'Timer resumed' });
            onUpdate?.();
        }
    };
    const getStatusStyles = () => {
        switch (timerStatus) {
            case 'running':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300';
            case 'paused':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300';
            case 'expired':
                return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    const progress = Math.min(100, (elapsedSeconds / project.timer_total_seconds) * 100);
    if (timerStatus === 'not_started' || !project.timer_started_at && timerStatus === 'paused') {
        return (<div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Clock className="h-5 w-5 text-muted-foreground"/>
        <div className="text-sm text-muted-foreground">
          Timer starts after intake submission
        </div>
      </div>);
    }
    return (<div className="space-y-4">
      {/* Status Badge */}
      <Badge className={getStatusStyles()}>
        {timerStatus === 'running' && <Play className="h-3 w-3 mr-1"/>}
        {timerStatus === 'paused' && <Pause className="h-3 w-3 mr-1"/>}
        {timerStatus === 'expired' && <AlertTriangle className="h-3 w-3 mr-1"/>}
        {timerStatus.charAt(0).toUpperCase() + timerStatus.slice(1)}
      </Badge>

      {/* Timer Display */}
      {timerStatus !== 'expired' ? (<div className="text-center py-4 bg-muted/30 rounded-lg">
          <div className="text-3xl font-mono font-bold text-foreground">
            {formatTime(elapsedSeconds)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Time remaining</p>
        </div>) : (<div className="text-center py-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2"/>
          <p className="font-semibold text-red-700 dark:text-red-300">Timer Expired</p>
          <p className="text-xs text-red-600 dark:text-red-400">Customer qualifies for refund</p>
        </div>)}

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full transition-all ${progress > 80 ? 'bg-red-500' : progress > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}/>
        </div>
        <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}% elapsed</p>
      </div>

      {/* Controls */}
      {timerStatus !== 'expired' && (<div className="flex gap-2">
          {timerStatus === 'running' ? (<Button variant="outline" size="sm" className="flex-1" onClick={handlePauseTimer}>
              <Pause className="h-4 w-4 mr-2"/>
              Pause
            </Button>) : (<Button variant="outline" size="sm" className="flex-1" onClick={handleResumeTimer}>
              <Play className="h-4 w-4 mr-2"/>
              Resume
            </Button>)}
        </div>)}
    </div>);
}

