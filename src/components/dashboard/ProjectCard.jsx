'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROOM_TYPES, DESIGNER_PERSONAS } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export function ProjectCard({ project, quizMatchedDesignerId, onView }) {
  const roomType = ROOM_TYPES.find(r => r.value === project.room_type);
  const projectDesigner = DESIGNER_PERSONAS.find(d => d.id === project.designer_persona);
  const quizMatchedDesigner = quizMatchedDesignerId 
    ? DESIGNER_PERSONAS.find(d => d.id === quizMatchedDesignerId)
    : null;
  
  const isDifferentDesigner = 
    quizMatchedDesigner && 
    projectDesigner && 
    quizMatchedDesigner.id !== projectDesigner.id;

  const getPhaseLabel = (phase) => {
    const labels = ['Intake', 'Processing', 'Feedback', 'Refinement', 'Review', 'Complete'];
    return labels[phase - 1] || 'Unknown';
  };

  const getStatusColor = (phase) => {
    if (phase === 6) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (phase >= 3) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  };

  return (
    <Card className="p-4 card-premium hover-lift cursor-pointer" onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium text-foreground">{roomType?.label || project.room_type}</h4>
          <div className="text-xs text-muted-foreground">
            <span>Designer: {projectDesigner?.name || 'Assigning...'}</span>
            {isDifferentDesigner && (
              <span className="block text-xs opacity-70">
                (Quiz matched: {quizMatchedDesigner?.name})
              </span>
            )}
          </div>
        </div>
        <Badge className={getStatusColor(project.current_phase)} variant="secondary">
          Phase {project.current_phase}: {getPhaseLabel(project.current_phase)}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">
          Started: {new Date(project.created_at).toLocaleDateString()}
        </span>
        <Button variant="ghost" size="sm" className="text-xs">
          View <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
