'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function PhaseProgress({ 
  currentPhase, 
  phaseStatus,
  projectAddons = [],
  packageType = 'base' 
}) {
  
  // Build dynamic phases based on what user purchased
  const getProjectPhases = () => {
    const basePhases = [
      {
        id: 1,
        name: 'Design Brief',
        shortName: 'Intake',
        description: 'Share your room details & preferences',
        icon: '📝',
        required: true,
      },
      {
        id: 2,
        name: 'Concept Creation',
        shortName: 'Design',
        description: 'Designer creates your 3D renders',
        icon: '🎨',
        required: true,
      },
      {
        id: 3,
        name: 'Review & Feedback',
        shortName: 'Feedback',
        description: 'Share your thoughts on the design',
        icon: '💬',
        required: true,
      },
    ];

    const optionalPhases = [];
    let phaseIdCounter = 4;

    // Check for revision add-on
    const hasRevisions = projectAddons.some(a => 
      a.addon_type === 'additional_revisions' || 
      a.addon_type === 'revisions'
    );
    
    if (hasRevisions) {
      optionalPhases.push({
        id: phaseIdCounter++,
        name: 'Design Refinement',
        shortName: 'Refine',
        description: 'Designer incorporates your feedback',
        icon: '✨',
        required: false,
      });
    }

    // Check for execution bundle
    const hasExecution = projectAddons.some(a => 
      a.addon_type === 'execution_bundle' || 
      a.addon_type === 'execution'
    );
    
    if (hasExecution) {
      optionalPhases.push({
        id: phaseIdCounter++,
        name: 'Execution Planning',
        shortName: 'Planning',
        description: 'Timeline, shopping list & contractor guides',
        icon: '🔨',
        required: false,
      });
    }

    // Final delivery phase (always present)
    const finalPhase = {
      id: phaseIdCounter,
      name: 'Package Delivery',
      shortName: 'Delivery',
      description: 'Download your complete design package',
      icon: '🎉',
      required: true,
    };

    return [...basePhases, ...optionalPhases, finalPhase];
  };

  const phases = getProjectPhases();

  const getPhaseStatus = (phaseIndex) => {
    const phaseNumber = phaseIndex + 1;
    if (phaseNumber < currentPhase) return 'completed';
    if (phaseNumber === currentPhase) return 'current';
    return 'locked';
  };

  const progressPercentage = ((currentPhase - 1) / (phases.length - 1)) * 100;

  return (
    <Card className="p-6 card-premium">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold">Your Design Journey</h3>
        <Badge variant="secondary">
          Step {currentPhase} of {phases.length}
        </Badge>
      </div>
      
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:block relative">
        {/* Background Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted">
          <motion.div 
            className="h-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Phases */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(index);
            const isComplete = status === 'completed';
            const isActive = status === 'current';
            const isLocked = status === 'locked';

            return (
              <motion.div 
                key={phase.id} 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm z-10 transition-all ${
                    isComplete
                      ? 'bg-secondary text-secondary-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : isActive ? (
                    phaseStatus === 'pending' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-xs mt-2 font-medium text-center ${
                  isActive ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {phase.shortName}
                </span>
                
                {/* Status Badges */}
                <div className="mt-1 flex flex-col items-center gap-1">
                  {!phase.required && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Add-on
                    </Badge>
                  )}
                  {isActive && (
                    <span className="text-[10px] text-secondary font-medium">
                      {phaseStatus === 'pending' ? 'Waiting' : 'In Progress'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden space-y-4">
        {phases.map((phase, index) => {
          const status = getPhaseStatus(index);
          const isComplete = status === 'completed';
          const isActive = status === 'current';
          const isLocked = status === 'locked';

          return (
            <motion.div 
              key={phase.id}
              className="flex gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon Column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isComplete
                      ? 'bg-secondary text-secondary-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
                
                {/* Connecting Line */}
                {index < phases.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 ${
                    isComplete ? 'bg-secondary' : 'bg-muted'
                  }`} />
                )}
              </div>

              {/* Content Column */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">{phase.icon}</span>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {phase.shortName}
                  </span>
                  {!phase.required && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      Add-on
                    </Badge>
                  )}
                  {isActive && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-secondary text-secondary-foreground">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {phase.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </Card>
  );
}
