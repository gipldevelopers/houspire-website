'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CheckCircle, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

export function DashboardStats({ projects, avgDeliveryHours = 68, totalSavings = 12000 }) {
  const [expandedCard, setExpandedCard] = useState(null);
  
  const activeProjects = projects.filter(p => p.current_phase < 6);
  const completedProjects = projects.filter(p => p.current_phase === 6);

  const stats = [
    {
      id: 'active',
      icon: Home,
      label: 'Active Projects',
      value: activeProjects.length,
      trend: activeProjects.length > 0 ? `${activeProjects.length} in progress` : 'Start your first',
      expandable: true,
      details: activeProjects.slice(0, 3),
    },
    {
      id: 'completed',
      icon: CheckCircle,
      label: 'Completed',
      value: completedProjects.length,
      trend: completedProjects.length > 0 ? 'All delivered' : 'None yet',
      expandable: completedProjects.length > 0,
      details: completedProjects.slice(0, 3),
    },
    {
      id: 'delivery',
      icon: Clock,
      label: 'Avg. Delivery',
      value: `${avgDeliveryHours}h`,
      trend: '4h faster than avg',
      expandable: false,
    },
    {
      id: 'savings',
      icon: TrendingUp,
      label: 'Total Savings',
      value: `₹${(totalSavings / 1000).toFixed(0)}K`,
      trend: 'vs. market rate',
      expandable: false,
    },
  ];

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card 
            className={`p-5 border-border/50 hover:shadow-apple transition-all duration-300 ${
              stat.expandable ? 'cursor-pointer' : ''
            }`}
            onClick={() => stat.expandable && toggleExpand(stat.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              {stat.expandable && (
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  {expandedCard === stat.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground tracking-tight">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-success mt-1">{stat.trend}</p>

            {/* Expandable Details */}
            <AnimatePresence>
              {expandedCard === stat.id && stat.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 pt-4 border-t border-border/50 space-y-2"
                >
                  {stat.details.map((project) => (
                    <div 
                      key={project.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground capitalize">
                        {project.room_type.replace('_', ' ')}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Phase {project.current_phase}
                      </Badge>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
