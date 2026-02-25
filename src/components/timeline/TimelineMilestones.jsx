import { motion } from 'framer-motion';
import { format, addWeeks } from 'date-fns';
import { CheckCircle2, Palette, ShoppingCart, Hammer, Sparkles, PartyPopper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
const milestoneIcons = [Palette, ShoppingCart, Hammer, Sparkles];
export function TimelineMilestones({ phases, startDate, totalWeeks }) {
    const getMilestones = () => {
        let cumulativeWeeks = 0;
        const milestones = phases.map((phase, idx) => {
            cumulativeWeeks += phase.weeks;
            return {
                name: `${phase.name} Complete`,
                week: cumulativeWeeks,
                date: addWeeks(startDate, cumulativeWeeks),
                icon: milestoneIcons[idx % milestoneIcons.length],
                isLast: idx === phases.length - 1,
            };
        });
        return milestones;
    };
    const milestones = getMilestones();
    return (<Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Project Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-muted"/>
          
          <div className="space-y-6">
            {milestones.map((milestone, idx) => {
            const Icon = milestone.icon;
            return (<motion.div key={milestone.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${milestone.isLast
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted border-2 border-background'}`}>
                    {milestone.isLast ? (<PartyPopper className="h-4 w-4"/>) : (<Icon className="h-4 w-4 text-muted-foreground"/>)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{milestone.name}</p>
                      {milestone.isLast && (<Badge className="bg-primary/10 text-primary border-0">
                          Project Complete
                        </Badge>)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Week {milestone.week} • {format(milestone.date, 'EEEE, dd MMMM yyyy')}
                    </p>
                  </div>

                  {/* Checkmark for completed */}
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground/30"/>
                </motion.div>);
        })}
          </div>
        </div>
      </CardContent>
    </Card>);
}
