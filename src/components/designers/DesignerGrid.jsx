'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DesignerAvatar } from '@/components/shared/DesignerAvatar';
import { cn } from '@/lib/utils';
import { DESIGN_STYLES } from '@/lib/constants';
const getStyleLabel = (styleId) => {
    const style = DESIGN_STYLES.find(s => s.value === styleId);
    return style?.label || styleId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
export function DesignerGrid({ designers, viewMode, selectedDesigners, onToggleSelect }) {
    if (designers.length === 0) {
        return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-muted-foreground"/>
        </div>
        <h3 className="text-xl font-semibold mb-2">No designers found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset Filters
        </Button>
      </motion.div>);
    }
    if (viewMode === 'list') {
        return (<div className="space-y-4">
        {designers.map((designer, index) => (<motion.div key={designer.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={cn('flex items-center gap-6 p-5 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300', selectedDesigners.includes(designer.id) && 'ring-2 ring-primary')}>
            <Checkbox checked={selectedDesigners.includes(designer.id)} onCheckedChange={() => onToggleSelect(designer.id)} className="h-5 w-5"/>
            
            <DesignerAvatar avatarUrl={designer.avatar} slug={designer.slug || designer.id} fullName={designer.name} className="w-16 h-16"/>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg">{designer.name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current"/>
                  <span className="text-sm font-medium">{designer.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{designer.specialty}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3"/>
                  {designer.experience_years} years
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3"/>
                  {designer.projects_completed} projects
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {designer.signature_style.slice(0, 2).map(style => (<Badge key={style} variant="secondary" className="text-xs">
                  {getStyleLabel(style)}
                </Badge>))}
            </div>
            
            <Button asChild variant="ghost" size="sm">
              <Link href={`/designers/${designer.id}`}>
                View Portfolio
                <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </Button>
          </motion.div>))}
      </div>);
    }
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designers.map((designer, index) => (<motion.div key={designer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={cn('group relative bg-card rounded-3xl border border-border/50 overflow-hidden hover:border-border hover:shadow-xl transition-all duration-500', selectedDesigners.includes(designer.id) && 'ring-2 ring-primary')}>
          {/* Selection checkbox */}
          <div className="absolute top-4 left-4 z-10">
            <Checkbox checked={selectedDesigners.includes(designer.id)} onCheckedChange={() => onToggleSelect(designer.id)} className="h-5 w-5 bg-background/80 backdrop-blur-sm"/>
          </div>
          
          {/* Availability badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              Available
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Avatar and info */}
            <div className="flex items-start gap-4 mb-4">
              <DesignerAvatar avatarUrl={designer.avatar} slug={designer.slug || designer.id} fullName={designer.name} className="w-16 h-16 group-hover:scale-105 transition-transform duration-300"/>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-0.5 group-hover:text-primary transition-colors">
                  {designer.name}
                </h3>
                <p className="text-sm text-muted-foreground">{designer.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current"/>
                  <span className="text-sm font-medium">{designer.rating}</span>
                  <span className="text-xs text-muted-foreground">({designer.projects_completed} projects)</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {designer.description}
            </p>
            
            {/* Style badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {designer.signature_style.slice(0, 3).map(style => (<Badge key={style} variant="secondary" className="text-xs">
                  {getStyleLabel(style)}
                </Badge>))}
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/50 pt-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4"/>
                {designer.experience_years} years exp.
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4"/>
                {designer.projects_completed}+ projects
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 pb-6">
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href={`/designers/${designer.id}`}>
                View Portfolio
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
              </Link>
            </Button>
          </div>
        </motion.div>))}
    </div>);
}
