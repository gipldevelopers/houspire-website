'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTimer } from '@/hooks/useTimer';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  FileText, 
  Wand2, 
  MessageCircle, 
  Edit, 
  Package, 
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

const phaseDescriptions = {
  1: 'Submit room photos and preferences to begin',
  2: 'Your designer is creating concepts',
  3: 'Review and provide feedback on designs',
  4: 'Designer is refining based on feedback',
  5: 'Final package being prepared for delivery',
};

export function ActiveProjectHero({ project, designer, roomType, heroImage }) {
  const router = useRouter();
  const timer = useTimer(project.id);
  
  const phaseSteps = [
    { id: 1, name: 'Intake', icon: FileText },
    { id: 2, name: 'Design', icon: Wand2 },
    { id: 3, name: 'Feedback', icon: MessageCircle },
    { id: 4, name: 'Refine', icon: Edit },
    { id: 5, name: 'Delivery', icon: Package },
  ];

  const currentPhase = project?.current_phase || 1;
  const progressPercent = (currentPhase / 5) * 100;
  const isAtRisk = timer.isExpired || timer.percentage > 80;

  // Dynamic quick action based on phase
  const getQuickActions = () => {
    const actions = [];
    if (currentPhase === 1) {
      actions.push({ label: 'Complete Intake', icon: FileText, primary: true });
    }
    if (currentPhase >= 3) {
      actions.push({ label: 'Submit Feedback', icon: MessageCircle, primary: currentPhase === 3 });
      actions.push({ label: 'View Concepts', icon: Eye, primary: false });
    }
    if (currentPhase === 5) {
      actions.push({ label: 'Download Package', icon: Download, primary: true });
    }
    actions.push({ label: 'Contact Designer', icon: MessageCircle, primary: false });
    return actions.slice(0, 3);
  };

  const quickActions = getQuickActions();

  return (
    <Card className="overflow-hidden border-border/50">
      {/* Hero Section with optional background image */}
      <div 
        className="relative bg-foreground text-background p-6 md:p-8"
        style={heroImage ? {
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="bg-background/20 text-background border-0 mb-2">
              Active Project
            </Badge>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {roomType?.label || project?.room_type?.replace('_', ' ')} Design
            </h2>
            <p className="text-background/70 mt-1">
              Started {new Date(project?.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Designer Avatar */}
          {designer && (
            <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm rounded-2xl p-3">
              <Avatar className="h-12 w-12 border-2 border-background/30">
                <AvatarImage src={designer.avatar} alt={designer.name} />
                <AvatarFallback>{designer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-background">{designer.name}</p>
                <p className="text-xs text-background/70">{designer.specialty}</p>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => router.push(`/project/${project.id}`)}
          className="mt-4 h-11 px-6 bg-background text-foreground hover:bg-background/90 rounded-full"
        >
          {currentPhase === 1 ? 'Complete Intake' : 'View Details'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Timer Section */}
      {project?.timer_status === 'running' && (
        <div className={`p-6 border-b border-border/50 ${isAtRisk ? 'bg-destructive/5' : 'bg-accent/5'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${isAtRisk ? 'text-destructive' : 'text-accent'}`} />
              <span className="text-sm font-medium">Time remaining</span>
            </div>
            <Badge className={`${isAtRisk ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'} border-0`}>
              {isAtRisk ? (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  At Risk
                </>
              ) : (
                'On track'
              )}
            </Badge>
          </div>
          <motion.p 
            className="text-3xl font-semibold text-foreground tracking-tight font-mono"
            key={timer.timeRemaining}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
          >
            {timer.timeRemaining}
          </motion.p>
          <Progress 
            value={timer.percentage} 
            className={`h-1.5 mt-3 ${isAtRisk ? '[&>div]:bg-destructive' : ''}`} 
          />
        </div>
      )}

      {/* Phase Stepper */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Progress value={progressPercent} className="h-1.5 flex-1" />
          <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>

        <TooltipProvider>
          <div className="flex items-center justify-between">
            {phaseSteps.map((step, idx) => (
              <div key={step.id} className="flex-1 flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center cursor-pointer">
                      <motion.div 
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-colors relative ${
                          step.id < currentPhase 
                            ? 'bg-success text-white' 
                            : step.id === currentPhase 
                              ? 'bg-foreground text-background' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                        animate={step.id === currentPhase ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {step.id < currentPhase ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                        {step.id === currentPhase && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-foreground"
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      <span className={`text-xs text-center hidden md:block ${
                        step.id <= currentPhase ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{phaseDescriptions[step.id]}</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Connector line */}
                {idx < phaseSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step.id < currentPhase ? 'bg-success' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </TooltipProvider>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/50">
          {quickActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.primary ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full ${action.primary ? 'bg-accent hover:bg-accent/90 text-white' : ''}`}
              onClick={() => router.push(`/project/${project.id}`)}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
