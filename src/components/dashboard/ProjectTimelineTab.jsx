'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { addDays, format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  FileText, 
  User, 
  Package, 
  Clock,
  Calendar
} from 'lucide-react';

export function ProjectTimelineTab({ project }) {
  const startDate = new Date(project.created_at);
  const totalDays = Math.ceil((project.timer_total_seconds || 259200) / 86400);
  
  const events = useMemo(() => [
    {
      date: format(startDate, 'MMM d, h:mm a'),
      title: 'Project started',
      description: 'Payment received and project created',
      icon: CheckCircle,
      completed: true,
      expectedDate: startDate,
    },
    {
      date: project.current_phase > 1 
        ? format(addDays(startDate, 1), 'MMM d') 
        : 'Pending',
      title: 'Intake form submitted',
      description: 'Room details and preferences received',
      icon: FileText,
      completed: project.current_phase > 1,
      current: project.current_phase === 1,
      expectedDate: addDays(startDate, 1),
    },
    {
      date: project.current_phase > 2 
        ? format(addDays(startDate, 1), 'MMM d') 
        : 'Pending',
      title: 'Designer assigned',
      description: 'Your designer is working on your project',
      icon: User,
      completed: project.current_phase > 2,
      current: project.current_phase === 2,
      expectedDate: addDays(startDate, 1),
    },
    {
      date: project.current_phase >= 5 
        ? format(addDays(startDate, totalDays), 'MMM d') 
        : `Expected ${format(addDays(startDate, totalDays), 'MMM d')}`,
      title: 'Design delivery',
      description: 'Photorealistic room designs and shopping list ready',
      icon: Package,
      completed: project.current_phase >= 5,
      current: project.current_phase === 4 || project.current_phase === 5,
      expectedDate: addDays(startDate, totalDays),
    }
  ], [project, startDate, totalDays]);

  // Gantt-style timeline
  const phases = [
    { name: 'Intake', duration: 1, color: 'bg-blue-500' },
    { name: 'Design', duration: 2, color: 'bg-purple-500' },
    { name: 'Feedback', duration: 0.5, color: 'bg-amber-500' },
    { name: 'Refine', duration: 0.5, color: 'bg-teal-500' },
    { name: 'Delivery', duration: 0, color: 'bg-success' },
  ];

  const totalPhaseDuration = phases.reduce((sum, p) => sum + p.duration, 0);
  const daysElapsed = differenceInDays(new Date(), startDate);
  const progressPercent = Math.min((daysElapsed / totalDays) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Gantt Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Project Timeline
          </h4>
          {project.current_phase >= 5 ? (
            <Badge className="text-xs bg-success/10 text-success border-0">Delivered</Badge>
          ) : daysElapsed > totalDays ? (
            <Badge variant="destructive" className="text-xs">
              Overdue by {daysElapsed - totalDays} {daysElapsed - totalDays === 1 ? 'day' : 'days'}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Day {daysElapsed} of {totalDays}
            </Badge>
          )}
        </div>
        
        {/* Timeline bar */}
        <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex">
            {phases.map((phase, idx) => {
              const widthPercent = (phase.duration / totalPhaseDuration) * 100;
              const isComplete = idx < project.current_phase - 1;
              const isCurrent = idx === project.current_phase - 1;
              
              return (
                <motion.div
                  key={phase.name}
                  className={`h-full flex items-center justify-center text-xs font-medium text-white ${
                    isComplete || isCurrent ? phase.color : 'bg-muted-foreground/20'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {widthPercent > 15 && (
                    <span className={isComplete || isCurrent ? 'text-white' : 'text-muted-foreground'}>
                      {phase.name}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Progress indicator */}
          <motion.div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
            initial={{ left: '0%' }}
            animate={{ left: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Date labels */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{format(startDate, 'MMM d')}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(addDays(startDate, totalDays), 'MMM d')}
          </span>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        {events.map((event, idx) => (
          <motion.div 
            key={idx} 
            className="flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              event.completed ? 'bg-success text-white' : 
              event.current ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
            }`}>
              <event.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 pb-4 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-foreground">{event.title}</p>
                <span className="text-xs text-muted-foreground">{event.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              {event.current && (
                <Badge className="mt-2 bg-accent/10 text-accent border-0">Current</Badge>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison with industry average */}
      <Card className="p-4 bg-muted/50 border-border/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-foreground">Your Timeline vs Industry Average</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20">You</span>
            <Progress value={progressPercent} className="h-2 flex-1" />
            <span className="text-xs font-medium text-foreground">{totalDays}d</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-20">Industry</span>
            <Progress value={70} className="h-2 flex-1 [&>div]:bg-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">7d</span>
          </div>
        </div>
        <p className="text-xs text-success mt-2">
          ✨ {7 - totalDays > 0 ? `${7 - totalDays} days faster` : 'Industry-leading delivery'} than average
        </p>
      </Card>
    </div>
  );
}
