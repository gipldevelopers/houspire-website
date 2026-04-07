import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowRight, Circle } from 'lucide-react';
const PHASES = [
    { id: 1, name: 'Intake' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Feedback' },
    { id: 4, name: 'Refine' },
    { id: 5, name: 'Delivery' },
    { id: 6, name: 'Complete' },
];
export function ProjectStatusCard({ project, onUpdate }) {
    const { toast } = useToast();
    const handleMoveToNextPhase = async () => {
        const nextPhase = project.current_phase + 1;
        if (nextPhase > 6) {
            toast({
                title: 'Project complete',
                description: 'This project is already in the final phase',
            });
            return;
        }
        const { error } = await appDataClient
            .from('projects')
            .update({
            current_phase: nextPhase,
            phase_status: nextPhase === 6 ? 'completed' : 'active',
            updated_at: new Date().toISOString(),
        })
            .eq('id', project.id);
        if (!error) {
            toast({
                title: 'Phase updated!',
                description: `Moved to ${PHASES.find((p) => p.id === nextPhase)?.name}`,
            });
            onUpdate();
            // Send notification
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'phase_updated',
                    project_id: project.id,
                    phase: nextPhase,
                },
            });
        }
    };
    const handleMarkComplete = async () => {
        const { error } = await appDataClient
            .from('projects')
            .update({
            current_phase: 6,
            phase_status: 'completed',
            updated_at: new Date().toISOString(),
        })
            .eq('id', project.id);
        if (!error) {
            toast({
                title: 'Project completed!',
                description: 'Customer will be notified',
            });
            onUpdate();
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'project_completed',
                    project_id: project.id,
                },
            });
        }
    };
    return (<div className="space-y-4">
      {/* Current Phase Display */}
      <div className="text-center py-3 bg-primary/5 rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">Current Phase</p>
        <p className="text-lg font-semibold text-primary">
          {PHASES.find((p) => p.id === project.current_phase)?.name}
        </p>
      </div>

      {/* Phase Progress */}
      <div className="space-y-2">
        {PHASES.map((phase) => {
            const isCompleted = phase.id < project.current_phase;
            const isCurrent = phase.id === project.current_phase;
            const isPending = phase.id > project.current_phase;
            return (<div key={phase.id} className={`flex items-center gap-2 py-1.5 px-2 rounded ${isCurrent ? 'bg-primary/10' : ''}`}>
              {isCompleted ? (<CheckCircle className="h-4 w-4 text-emerald-600"/>) : isCurrent ? (<Circle className="h-4 w-4 text-primary fill-primary"/>) : (<Circle className="h-4 w-4 text-muted-foreground"/>)}
              <span className={`text-sm ${isPending ? 'text-muted-foreground' : 'text-foreground'} ${isCurrent ? 'font-medium' : ''}`}>
                {phase.name}
              </span>
              {isCurrent && (<Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>)}
            </div>);
        })}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {project.phase_status !== 'completed' && project.current_phase < 6 && (<Button className="w-full" onClick={handleMoveToNextPhase}>
            Move to {PHASES.find((p) => p.id === project.current_phase + 1)?.name}
            <ArrowRight className="h-4 w-4 ml-2"/>
          </Button>)}

        {project.current_phase === 5 && project.phase_status !== 'completed' && (<Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleMarkComplete}>
            <CheckCircle className="h-4 w-4 mr-2"/>
            Mark as Completed
          </Button>)}
      </div>
    </div>);
}

