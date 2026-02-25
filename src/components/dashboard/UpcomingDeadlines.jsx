'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { addDays, format, startOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  FileText,
  Package,
  MessageCircle,
  Clock
} from 'lucide-react';

const MILESTONE_ICONS = {
  intake: FileText,
  design: Clock,
  review: MessageCircle,
  delivery: Package,
  meeting: Calendar,
};

const MILESTONE_COLORS = {
  intake: 'bg-blue-500',
  design: 'bg-purple-500',
  review: 'bg-amber-500',
  delivery: 'bg-success',
  meeting: 'bg-accent',
};

export function UpcomingDeadlines({ projectId, projectCreatedAt, currentPhase = 1 }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Generate sample milestones based on project
  const milestones = useMemo(() => {
    if (!projectCreatedAt) return [];

    const startDate = new Date(projectCreatedAt);
    return [
      {
        id: '1',
        title: 'Intake Deadline',
        date: addDays(startDate, 1),
        type: 'intake',
        completed: currentPhase > 1,
      },
      {
        id: '2',
        title: 'First Concepts',
        date: addDays(startDate, 2),
        type: 'design',
        completed: currentPhase > 2,
      },
      {
        id: '3',
        title: 'Review Session',
        date: addDays(startDate, 3),
        type: 'review',
        completed: currentPhase > 3,
      },
      {
        id: '4',
        title: 'Final Delivery',
        date: addDays(startDate, 4),
        type: 'delivery',
        completed: currentPhase > 4,
      },
    ];
  }, [projectCreatedAt, currentPhase]);

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: addDays(currentWeekStart, 6),
  });

  const getMilestonesForDay = (day) => 
    milestones.filter(m => isSameDay(m.date, day));

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  const generateICS = (milestone) => {
    const start = format(milestone.date, "yyyyMMdd'T'HHmmss");
    const end = format(addDays(milestone.date, 0), "yyyyMMdd'T'235959");
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${milestone.title}
DESCRIPTION:Houspire project milestone
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${milestone.title.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Upcoming</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[100px] text-center">
            {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d')}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => {
          const dayMilestones = getMilestonesForDay(day);
          const today = isToday(day);

          return (
            <div 
              key={day.toISOString()} 
              className={`text-center p-2 rounded-lg ${today ? 'bg-accent/10 ring-1 ring-accent' : ''}`}
            >
              <p className="text-xs text-muted-foreground">{format(day, 'EEE')}</p>
              <p className={`text-sm font-medium ${today ? 'text-accent' : 'text-foreground'}`}>
                {format(day, 'd')}
              </p>
              {dayMilestones.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {dayMilestones.slice(0, 3).map(m => (
                    <div 
                      key={m.id} 
                      className={`w-1.5 h-1.5 rounded-full ${MILESTONE_COLORS[m.type]}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Milestones List */}
      <div className="space-y-2">
        {milestones
          .filter(m => m.date >= new Date())
          .slice(0, 4)
          .map(milestone => {
            const Icon = MILESTONE_ICONS[milestone.type] || Calendar;
            
            return (
              <div 
                key={milestone.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${MILESTONE_COLORS[milestone.type]}/10`}>
                  <Icon className={`h-4 w-4 ${MILESTONE_COLORS[milestone.type].replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{milestone.title}</p>
                  <p className="text-xs text-muted-foreground">{format(milestone.date, 'MMM d, h:mm a')}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => generateICS(milestone)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            );
          })}
      </div>

      {milestones.filter(m => m.date >= new Date()).length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
        </div>
      )}
    </Card>
  );
}
