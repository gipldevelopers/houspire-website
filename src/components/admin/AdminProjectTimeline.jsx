import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, Circle, Loader2, Calendar, ArrowRight, } from 'lucide-react';
import { format } from 'date-fns';
const phaseInfo = [
    { phase: 1, name: 'Payment & Setup', description: 'Order confirmed, project initialized' },
    { phase: 2, name: 'Intake Form', description: 'Customer submits room details and preferences' },
    { phase: 3, name: 'Design Creation', description: '72-hour countdown active' },
    { phase: 4, name: 'Concept Review', description: 'Customer reviews and selects concept' },
    { phase: 5, name: 'Delivery', description: 'Final package delivered' },
];
export function AdminProjectTimeline({ projectId, currentPhase }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchEvents();
    }, [projectId]);
    const fetchEvents = async () => {
        const { data } = await supabase
            .from('workflow_events')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true });
        if (data) {
            setEvents(data);
        }
        setLoading(false);
    };
    const getPhaseStatus = (phaseNumber) => {
        if (phaseNumber < currentPhase)
            return 'completed';
        if (phaseNumber === currentPhase)
            return 'active';
        return 'pending';
    };
    const getPhaseIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-emerald-600"/>;
            case 'active':
                return <Clock className="h-5 w-5 text-primary animate-pulse"/>;
            default:
                return <Circle className="h-5 w-5 text-muted-foreground/30"/>;
        }
    };
    const getEventsByPhase = (phaseName) => {
        return events.filter(e => e.phase.toLowerCase().includes(phaseName.toLowerCase()) ||
            e.trigger_event.toLowerCase().includes(phaseName.toLowerCase()));
    };
    if (loading) {
        return (<div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Phase Progress */}
      <div className="flex items-center gap-2 mb-8">
        {phaseInfo.map((phase, index) => {
            const status = getPhaseStatus(phase.phase);
            return (<div key={phase.phase} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    status === 'active' ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'}
              `}>
                {status === 'completed' ? <CheckCircle className="h-4 w-4"/> : phase.phase}
              </div>
              {index < phaseInfo.length - 1 && (<div className={`w-8 h-0.5 ${status === 'completed' ? 'bg-emerald-300' : 'bg-muted'}`}/>)}
            </div>);
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border"/>
        
        <div className="space-y-6">
          {phaseInfo.map((phase) => {
            const status = getPhaseStatus(phase.phase);
            const phaseEvents = getEventsByPhase(phase.name);
            return (<div key={phase.phase} className="relative pl-10">
                <div className="absolute left-0 top-1">
                  {getPhaseIcon(status)}
                </div>

                <Card className={`p-4 ${status === 'active' ? 'ring-2 ring-primary/20 border-primary' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{phase.name}</h4>
                        <Badge variant={status === 'completed' ? 'default' : status === 'active' ? 'default' : 'secondary'} className={status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ''}>
                          {status === 'completed' ? 'Completed' : status === 'active' ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                    </div>
                  </div>

                  {/* Phase Events */}
                  {phaseEvents.length > 0 && (<div className="mt-4 pt-4 border-t space-y-2">
                      {phaseEvents.map((event) => (<div key={event.id} className="flex items-center gap-3 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground"/>
                          <span className="text-muted-foreground">
                            {format(new Date(event.created_at), 'MMM d, h:mm a')}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground"/>
                          <span className="capitalize">{event.trigger_event.replace(/_/g, ' ')}</span>
                        </div>))}
                    </div>)}
                </Card>
              </div>);
        })}
        </div>
      </div>

      {/* All Events Log */}
      {events.length > 0 && (<Card className="p-4 mt-8">
          <h4 className="font-medium mb-4">Event Log</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {events.map((event) => (<div key={event.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {event.phase}
                  </Badge>
                  <span className="capitalize">{event.trigger_event.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-muted-foreground">
                  {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>))}
          </div>
        </Card>)}
    </div>);
}
