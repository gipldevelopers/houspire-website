import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle2, Clock, Lock, ChevronDown, ChevronUp } from 'lucide-react';
const TIMELINE_DATA = [
    {
        week: 1,
        title: 'Preparation & Ordering',
        description: 'Place orders and prepare the space',
        tasks: [
            'Order all furniture items',
            'Schedule contractor visits',
            'Clear the room completely',
            'Measure and mark wall placements',
            'Order custom items with long lead times',
        ],
        estimatedHours: 8,
        completed: false,
    },
    {
        week: 2,
        title: 'Structural Work',
        description: 'Complete any structural modifications',
        tasks: [
            'Paint walls (primer + 2 coats)',
            'Install electrical fixtures',
            'Fix any wall damage',
            'Install ceiling fan/lights',
            'Complete flooring work if needed',
        ],
        estimatedHours: 24,
        completed: false,
        dependencies: [1],
    },
    {
        week: 3,
        title: 'Furniture Assembly & Placement',
        description: 'Receive and assemble main furniture',
        tasks: [
            'Receive furniture deliveries',
            'Assemble bed frame and wardrobe',
            'Position large furniture pieces',
            'Install window treatments',
            'Set up storage units',
        ],
        estimatedHours: 16,
        completed: false,
        dependencies: [2],
    },
    {
        week: 4,
        title: 'Lighting & Accessories',
        description: 'Add lighting and smaller elements',
        tasks: [
            'Install table lamps and floor lamps',
            'Hang wall art and mirrors',
            'Add decorative accessories',
            'Install shelving and organize',
            'Place plants and final touches',
        ],
        estimatedHours: 12,
        completed: false,
        dependencies: [3],
    },
    {
        week: 5,
        title: 'Styling & Fine-Tuning',
        description: 'Perfect the details',
        tasks: [
            'Arrange decorative items',
            'Style bookshelves and surfaces',
            'Add textiles (cushions, throws)',
            'Adjust lighting for ambiance',
            'Final cleaning and touch-ups',
        ],
        estimatedHours: 8,
        completed: false,
        dependencies: [4],
    },
    {
        week: 6,
        title: 'Final Review & Handover',
        description: 'Complete the transformation',
        tasks: [
            'Walk-through with designer (video call)',
            'Make any final adjustments',
            'Professional photography (optional)',
            'Create maintenance checklist',
            'Project completion celebration!',
        ],
        estimatedHours: 4,
        completed: false,
        dependencies: [5],
    },
];
export function WeeklyTimeline({ projectId }) {
    const [weeks, setWeeks] = useState(TIMELINE_DATA);
    const [expandedWeek, setExpandedWeek] = useState(1);
    const [completedTasks, setCompletedTasks] = useState({});
    const toggleWeek = (weekNumber) => {
        setExpandedWeek(expandedWeek === weekNumber ? null : weekNumber);
    };
    const toggleTask = (weekNum, taskIndex) => {
        const key = `${weekNum}-${taskIndex}`;
        setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const markWeekComplete = (weekNumber) => {
        setWeeks(prev => prev.map(w => w.week === weekNumber ? { ...w, completed: true } : w));
    };
    const getWeekTasksCompleted = (weekNum, taskCount) => {
        let count = 0;
        for (let i = 0; i < taskCount; i++) {
            if (completedTasks[`${weekNum}-${i}`])
                count++;
        }
        return count;
    };
    const completedWeeks = weeks.filter(w => w.completed).length;
    const totalWeeks = weeks.length;
    const progress = (completedWeeks / totalWeeks) * 100;
    const currentWeek = weeks.find(w => !w.completed);
    return (<div className="space-y-6">
      {/* Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              6-Week Implementation Plan
            </h2>
            <p className="text-sm text-muted-foreground">
              Follow this step-by-step timeline to complete your design
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary">
              {completedWeeks}/{totalWeeks}
            </p>
            <p className="text-sm text-muted-foreground">Weeks Done</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3"/>
        </div>
      </Card>

      {/* Current Week Highlight */}
      {currentWeek && (<Card className="p-6 border-secondary bg-secondary/5">
          <Badge className="bg-secondary text-secondary-foreground mb-2">
            <Clock className="h-3 w-3 mr-1"/>
            Current Week
          </Badge>
          <h3 className="text-lg font-semibold text-foreground">
            Week {currentWeek.week}: {currentWeek.title}
          </h3>
          <p className="text-muted-foreground">{currentWeek.description}</p>
          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4"/>
              {currentWeek.estimatedHours} hours estimated
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4"/>
              {getWeekTasksCompleted(currentWeek.week, currentWeek.tasks.length)}/{currentWeek.tasks.length} tasks done
            </div>
          </div>
        </Card>)}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"/>

        <div className="space-y-4">
          {weeks.map((week) => {
            const canStart = week.dependencies
                ? week.dependencies.every(dep => weeks[dep - 1].completed)
                : true;
            const isExpanded = expandedWeek === week.week;
            const tasksCompleted = getWeekTasksCompleted(week.week, week.tasks.length);
            return (<div key={week.week} className="relative pl-14">
                {/* Week Number Circle */}
                <div className={`absolute left-3 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${week.completed
                    ? 'bg-green-500 text-white'
                    : canStart
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground'}`}>
                  {week.completed ? (<CheckCircle2 className="h-4 w-4"/>) : (week.week)}
                </div>

                {/* Week Card */}
                <Card className={`overflow-hidden ${!canStart ? 'opacity-60' : ''}`}>
                  <div className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => toggleWeek(week.week)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">
                            {week.title}
                          </h3>
                          {week.completed && (<Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1"/>
                              Complete
                            </Badge>)}
                          {!canStart && (<Badge variant="secondary">
                              <Lock className="h-3 w-3 mr-1"/>
                              Locked
                            </Badge>)}
                        </div>
                        <p className="text-sm text-muted-foreground">{week.description}</p>
                      </div>
                      {isExpanded ? (<ChevronUp className="h-5 w-5 text-muted-foreground"/>) : (<ChevronDown className="h-5 w-5 text-muted-foreground"/>)}
                    </div>

                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3"/>
                        {week.estimatedHours}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3"/>
                        {week.tasks.length} tasks
                      </div>
                    </div>

                    {/* Expanded Tasks */}
                    {isExpanded && (<div className="mt-4 space-y-2 border-t pt-4">
                        {week.tasks.map((task, taskIndex) => {
                        const isTaskDone = completedTasks[`${week.week}-${taskIndex}`];
                        return (<div key={taskIndex} className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={isTaskDone} onCheckedChange={() => toggleTask(week.week, taskIndex)} disabled={!canStart}/>
                              <span className={`text-sm ${isTaskDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task}
                              </span>
                            </div>);
                    })}

                        {!week.completed && canStart && tasksCompleted === week.tasks.length && (<Button size="sm" className="mt-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={(e) => {
                            e.stopPropagation();
                            markWeekComplete(week.week);
                        }}>
                            <CheckCircle2 className="h-4 w-4 mr-2"/>
                            Mark Week {week.week} as Complete
                          </Button>)}
                      </div>)}
                  </div>
                </Card>
              </div>);
        })}
        </div>
      </div>

      {/* Completion Celebration */}
      {completedWeeks === totalWeeks && (<Card className="p-8 text-center bg-secondary/10 border-secondary/20">
          <p className="text-4xl mb-4">🎊</p>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Congratulations!
          </h3>
          <p className="text-muted-foreground mb-4">
            You've completed your interior design transformation! 
            Time to enjoy your beautiful new space.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Schedule Final Photos
            </Button>
            <Button variant="outline">
              Share Your Transformation
            </Button>
          </div>
        </Card>)}
    </div>);
}
