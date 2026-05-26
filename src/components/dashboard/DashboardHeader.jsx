'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Plus, Settings, Sparkles } from 'lucide-react';

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDesignTip() {
  const tips = [
    '✨ Tip: Mirrors can make small rooms feel larger',
    '🪴 Tip: Add plants to bring life to any space',
    '💡 Tip: Layer lighting for a cozy ambiance',
    '🎨 Tip: Use the 60-30-10 color rule for balance',
    '🪑 Tip: Anchor your room with a statement piece',
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
}

export function DashboardHeader({ 
  userName, 
  hasProjects, 
  milestonePercentage,
  currentProjectName 
}) {
  const router = useRouter();
  const greeting = getTimeBasedGreeting();
  const tip = getDesignTip();
  const displayName = userName?.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            {greeting}, {displayName}!
          </h1>
          
          {hasProjects && milestonePercentage !== undefined && currentProjectName ? (
            <p className="text-muted-foreground mt-1">
              You're <span className="text-accent font-medium">{milestonePercentage}%</span> through your {currentProjectName} project!
            </p>
          ) : hasProjects ? (
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your projects
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">
              <Sparkles className="h-4 w-4 inline mr-1" />
              Choose a design package to get started
            </p>
          )}
          
          {/* Design tip */}
          <p className="text-xs text-muted-foreground/70 mt-2 hidden md:block">
            {tip}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/settings')}
            className="hidden md:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => router.push('/select-package')}
            className="h-10 px-5 rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
