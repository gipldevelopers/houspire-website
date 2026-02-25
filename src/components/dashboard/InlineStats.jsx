'use client';

import { Badge } from '@/components/ui/badge';
import { Home, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export function InlineStats({ projects, avgDeliveryHours = 68, totalSavings = 12000 }) {
  const activeProjects = projects.filter(p => p.current_phase < 6);
  const completedProjects = projects.filter(p => p.current_phase === 6);

  const stats = [
    {
      icon: Home,
      value: activeProjects.length,
      label: 'Active',
      color: 'bg-accent/10 text-accent border-accent/20',
    },
    {
      icon: CheckCircle,
      value: completedProjects.length,
      label: 'Completed',
      color: 'bg-success/10 text-success border-success/20',
    },
    {
      icon: Clock,
      value: `${avgDeliveryHours}h`,
      label: 'Avg Delivery',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    {
      icon: TrendingUp,
      value: `₹${(totalSavings / 1000).toFixed(0)}K`,
      label: 'Saved',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {stats.map((stat, idx) => (
        <Badge 
          key={idx} 
          variant="outline" 
          className={`${stat.color} px-3 py-1.5 text-sm font-medium gap-1.5`}
        >
          <stat.icon className="h-3.5 w-3.5" />
          <span className="font-semibold">{stat.value}</span>
          <span className="text-xs opacity-70">{stat.label}</span>
        </Badge>
      ))}
    </div>
  );
}
