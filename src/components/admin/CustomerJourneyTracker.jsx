import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, FileText, Palette, MessageSquare, CheckCircle, Package, Clock, ArrowRight, AlertTriangle, TrendingUp, } from 'lucide-react';
import { appDataClient } from '@/lib/static-client';
const JOURNEY_PHASES = [
    { phase: 1, name: 'Payment', icon: CreditCard, description: 'Initial payment received' },
    { phase: 2, name: 'Intake', icon: FileText, description: 'Room details submitted' },
    { phase: 3, name: 'Design', icon: Palette, description: 'Concepts in progress' },
    { phase: 4, name: 'Feedback', icon: MessageSquare, description: 'Customer review' },
    { phase: 5, name: 'Refine', icon: TrendingUp, description: 'Final adjustments' },
    { phase: 6, name: 'Delivery', icon: Package, description: 'Package delivered' },
];
export function CustomerJourneyTracker({ projectId, currentPhase }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchJourneyEvents();
    }, [projectId]);
    const fetchJourneyEvents = async () => {
        setLoading(true);
        const { data } = await appDataClient
            .from('workflow_events')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
        if (data) {
            setEvents(data);
        }
        setLoading(false);
    };
    const getPhaseStatus = (phase) => {
        if (phase < currentPhase)
            return 'completed';
        if (phase === currentPhase)
            return 'current';
        return 'pending';
    };
    const getPhaseTimestamp = (phase) => {
        const event = events.find((e) => e.phase === `phase_${phase}`);
        return event?.created_at;
    };
    const calculatePhaseDuration = (phase) => {
        const startEvent = events.find((e) => e.phase === `phase_${phase}`);
        const endEvent = events.find((e) => e.phase === `phase_${phase + 1}`);
        if (!startEvent)
            return null;
        const start = new Date(startEvent.created_at).getTime();
        const end = endEvent ? new Date(endEvent.created_at).getTime() : Date.now();
        const hours = Math.floor((end - start) / (1000 * 60 * 60));
        if (hours < 24)
            return `${hours}h`;
        return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    };
    const progress = (currentPhase / 6) * 100;
    return (<div className="space-y-6">
      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Journey Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2"/>
      </Card>

      {/* Journey Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-muted"/>

        <div className="space-y-4">
          {JOURNEY_PHASES.map((phase, idx) => {
            const status = getPhaseStatus(phase.phase);
            const timestamp = getPhaseTimestamp(phase.phase);
            const duration = calculatePhaseDuration(phase.phase);
            const Icon = phase.icon;
            return (<motion.div key={phase.phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative flex gap-4">
                {/* Icon */}
                <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                    ${status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''}
                    ${status === 'current' ? 'bg-primary/10 ring-2 ring-primary' : ''}
                    ${status === 'pending' ? 'bg-muted' : ''}
                  `}>
                  {status === 'completed' ? (<CheckCircle className="h-5 w-5 text-emerald-600"/>) : (<Icon className={`h-5 w-5 ${status === 'current' ? 'text-primary' : 'text-muted-foreground'}`}/>)}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {phase.name}
                    </h4>
                    {status === 'current' && (<Badge variant="default" className="animate-pulse">
                        Current
                      </Badge>)}
                    {status === 'completed' && (<Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                        Completed
                      </Badge>)}
                  </div>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    {timestamp && (<span className="flex items-center gap-1">
                        <Clock className="h-3 w-3"/>
                        {new Date(timestamp).toLocaleDateString()}
                      </span>)}
                    {duration && status !== 'pending' && (<span className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3"/>
                        {duration}
                      </span>)}
                  </div>
                </div>
              </motion.div>);
        })}
        </div>
      </div>

      {/* Risk Indicators */}
      {currentPhase < 6 && (<Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5"/>
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100">
                Phase {currentPhase} Active
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Timer is running. Ensure timely delivery to maintain customer satisfaction.
              </p>
            </div>
          </div>
        </Card>)}
    </div>);
}

