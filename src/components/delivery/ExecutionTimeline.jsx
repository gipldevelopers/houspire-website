import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, ArrowRight, } from 'lucide-react';
export function ExecutionTimeline({ timeline, orderId }) {
    const storageKey = `houspire_timeline_progress_${orderId}`;
    const [completedTasks, setCompletedTasks] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        }
        catch {
            return new Set();
        }
    });
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify([...completedTasks]));
    }, [completedTasks, storageKey]);
    const toggleTask = (taskId) => {
        setCompletedTasks(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            }
            else {
                next.add(taskId);
            }
            return next;
        });
    };
    const getTotalProgress = () => {
        const totalTasks = timeline.reduce((sum, week) => sum + week.tasks.length, 0);
        if (totalTasks === 0)
            return 0;
        return Math.round((completedTasks.size / totalTasks) * 100);
    };
    if (timeline.length === 0) {
        return null;
    }
    const progress = getTotalProgress();
    return (<div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Implementation Timeline</h3>
        <Badge variant={progress === 100 ? 'default' : 'secondary'} className="gap-1">
          <Calendar className="h-3 w-3"/>
          {progress}% Complete
        </Badge>
      </div>

      {/* Progress bar */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}/>
            </div>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {timeline.reduce((sum, week) => sum + week.tasks.length, 0)} tasks
          </span>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"/>

        {timeline.map((week, weekIndex) => {
            const weekTasks = week.tasks.map((task, i) => `${week.week}-${i}`);
            const completedInWeek = weekTasks.filter(t => completedTasks.has(t)).length;
            const isWeekComplete = completedInWeek === week.tasks.length;
            return (<motion.div key={week.week} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: weekIndex * 0.1 }} className="relative pl-16 pb-8 last:pb-0">
              {/* Week marker */}
              <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${isWeekComplete
                    ? 'bg-success border-success'
                    : completedInWeek > 0
                        ? 'bg-accent/20 border-accent'
                        : 'bg-background border-muted-foreground/30'} flex items-center justify-center`}>
                {isWeekComplete && (<CheckCircle2 className="h-3 w-3 text-success-foreground"/>)}
              </div>

              {/* Week content */}
              <Card className={`p-4 ${isWeekComplete ? 'border-success/30' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Week {week.week}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {completedInWeek}/{week.tasks.length} completed
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mt-1">{week.title}</h4>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {week.tasks.map((task, taskIndex) => {
                    const taskId = `${week.week}-${taskIndex}`;
                    const isCompleted = completedTasks.has(taskId);
                    return (<div key={taskIndex} className="flex items-start gap-3 group cursor-pointer" onClick={() => toggleTask(taskId)}>
                        <Checkbox checked={isCompleted} onCheckedChange={() => toggleTask(taskId)} className="mt-0.5"/>
                        <span className={`text-sm flex-1 ${isCompleted
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'} group-hover:text-primary transition-colors`}>
                          {task}
                        </span>
                      </div>);
                })}
                </div>

                {/* Dependencies */}
                {week.dependencies.length > 0 && (<div className="mt-3 pt-3 border-t border-dashed">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowRight className="h-3 w-3"/>
                      <span>Depends on: {week.dependencies.join(', ')}</span>
                    </div>
                  </div>)}
              </Card>
            </motion.div>);
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Check off tasks as you complete them. Progress is saved locally.
      </p>
    </div>);
}
