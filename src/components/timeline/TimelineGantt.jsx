import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from '@/components/ui/tooltip';
import { Palette, ShoppingCart, Hammer, Sparkles, Diamond } from 'lucide-react';
const phaseColors = [
    { bg: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300' },
    { bg: 'bg-amber-500', light: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300' },
    { bg: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300' },
];
const phaseIcons = [Palette, ShoppingCart, Hammer, Sparkles];
export function TimelineGantt({ phases, startDate, totalWeeks, showMilestones = true, showDependencies = false }) {
    const ganttData = useMemo(() => {
        let cumulativeWeeks = 0;
        return phases.map((phase, idx) => {
            const start = cumulativeWeeks;
            cumulativeWeeks += phase.weeks;
            const startDatePhase = addWeeks(startDate, start);
            const endDatePhase = addWeeks(startDate, cumulativeWeeks);
            return {
                ...phase,
                startWeek: start,
                endWeek: cumulativeWeeks,
                startDate: startDatePhase,
                endDate: endDatePhase,
                percentage: (phase.weeks / totalWeeks) * 100,
                color: phaseColors[idx % phaseColors.length],
                Icon: phaseIcons[idx % phaseIcons.length],
            };
        });
    }, [phases, startDate, totalWeeks]);
    const milestones = useMemo(() => {
        if (!showMilestones)
            return [];
        let weekCounter = 0;
        return phases.slice(0, -1).map((phase, idx) => {
            weekCounter += phase.weeks;
            return {
                name: `${phase.name} Complete`,
                weekIndex: weekCounter,
                icon: Diamond,
            };
        });
    }, [phases, showMilestones]);
    const completionDate = addWeeks(startDate, totalWeeks);
    return (<Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Project Gantt Chart</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{format(startDate, 'dd MMM')}</span>
            <span>→</span>
            <span>{format(completionDate, 'dd MMM yyyy')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gantt Bars */}
        <div className="space-y-3">
          {ganttData.map((phase, idx) => (<TooltipProvider key={phase.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    {/* Phase Label */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <phase.Icon className={`h-4 w-4 ${phase.color.text}`}/>
                        <span className="text-sm font-medium">{phase.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {phase.weeks} week{phase.weeks !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Bar Container */}
                    <div className="relative h-10 bg-muted rounded-lg overflow-hidden">
                      {/* Offset for start position */}
                      <motion.div initial={{ width: 0 }} animate={{ width: `${phase.percentage}%` }} transition={{ duration: 0.8, delay: idx * 0.15, ease: 'easeOut' }} className={`absolute h-full ${phase.color.bg} rounded-lg`} style={{
                left: `${(phase.startWeek / totalWeeks) * 100}%`,
            }}>
                        {/* Date labels inside bar */}
                        <div className="absolute inset-0 flex items-center justify-between px-3 text-white text-xs">
                          <span className="hidden sm:inline">{format(phase.startDate, 'dd MMM')}</span>
                          <span className="hidden sm:inline">{format(phase.endDate, 'dd MMM')}</span>
                        </div>
                      </motion.div>
                      
                      {/* Dependency Arrow */}
                      {showDependencies && idx > 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute top-1/2 -translate-y-1/2 -left-3 w-3 h-0.5 bg-muted-foreground" style={{ left: `${(phase.startWeek / totalWeeks) * 100 - 1}%` }}/>)}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium">{phase.name}</p>
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                    <p className="text-xs">
                      {format(phase.startDate, 'dd MMM')} - {format(phase.endDate, 'dd MMM yyyy')}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>))}
        </div>

        {/* Milestones */}
        {showMilestones && milestones.length > 0 && (<div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">Key Milestones</p>
            <div className="relative h-8 bg-muted rounded-full">
              {milestones.map((milestone, idx) => {
                const position = (milestone.weekIndex / totalWeeks) * 100;
                return (<TooltipProvider key={milestone.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 + idx * 0.1 }} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" style={{ left: `${position}%` }}>
                          <div className="w-6 h-6 rotate-45 bg-primary border-2 border-background flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <Diamond className="h-3 w-3 -rotate-45 text-primary-foreground"/>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Week {milestone.weekIndex} • {format(addWeeks(startDate, milestone.weekIndex), 'dd MMM')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>);
            })}
              
              {/* End marker */}
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Done!
                </Badge>
              </motion.div>
            </div>
          </div>)}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2">
          {ganttData.map((phase) => (<div key={phase.name} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${phase.color.bg}`}/>
              <span className="text-xs text-muted-foreground">{phase.name}</span>
            </div>))}
        </div>
      </CardContent>
    </Card>);
}
