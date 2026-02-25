'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOM_TYPES } from '@/lib/constants';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  LayoutGrid,
  Archive,
  MoreHorizontal,
  ChevronDown,
  Tag,
  Calendar,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const PHASES = [
  { id: 1, name: 'Intake' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'Feedback' },
  { id: 4, name: 'Refine' },
  { id: 5, name: 'Delivery' },
  { id: 6, name: 'Complete' },
];

export function AllProjectsGrid({ projects, onSelect, onArchive }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState(null);
  const [roomFilter, setRoomFilter] = useState(null);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.room_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tags && project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesPhase = phaseFilter === null || project.current_phase === phaseFilter;
    const matchesRoom = !roomFilter || project.room_type === roomFilter;

    return matchesSearch && matchesPhase && matchesRoom;
  });

  // Group by phase for kanban view
  const projectsByPhase = PHASES.reduce((acc, phase) => {
    acc[phase.id] = filteredProjects.filter(p => p.current_phase === phase.id);
    return acc;
  }, {});

  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">No projects yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Phase Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                {phaseFilter ? `Phase ${phaseFilter}` : 'All Phases'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={() => setPhaseFilter(null)}>
                All Phases
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {PHASES.map(phase => (
                <DropdownMenuItem 
                  key={phase.id}
                  onClick={() => setPhaseFilter(phase.id)}
                >
                  Phase {phase.id}: {phase.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Room Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                {roomFilter ? ROOM_TYPES.find(r => r.value === roomFilter)?.label : 'All Rooms'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuItem onClick={() => setRoomFilter(null)}>
                All Rooms
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {ROOM_TYPES.map(room => (
                <DropdownMenuItem 
                  key={room.value}
                  onClick={() => setRoomFilter(room.value)}
                >
                  {room.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
      </p>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={idx}
                onSelect={onSelect}
                onArchive={onArchive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectListItem
                key={project.id}
                project={project}
                index={idx}
                onSelect={onSelect}
                onArchive={onArchive}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto">
          {PHASES.map(phase => (
            <div key={phase.id} className="min-w-[200px]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-foreground">{phase.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {projectsByPhase[phase.id]?.length || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                {projectsByPhase[phase.id]?.map((project, idx) => {
                  const roomType = ROOM_TYPES.find(r => r.value === project.room_type);
                  return (
                    <motion.button
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelect(project)}
                      className="w-full p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors text-left"
                    >
                      <p className="font-medium text-sm text-foreground truncate">
                        {roomType?.label || project.room_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ 
  project, 
  index, 
  onSelect, 
  onArchive 
}) {
  const roomType = ROOM_TYPES.find(r => r.value === project.room_type);
  const progressPercent = (project.current_phase / 6) * 100;
  const daysSinceCreation = Math.floor((Date.now() - new Date(project.created_at).getTime()) / 86400000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="p-4 border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        onClick={() => onSelect(project)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">
              {roomType?.label || project.room_type}
            </h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {daysSinceCreation === 0 ? 'Today' : daysSinceCreation === 1 ? 'Yesterday' : `${daysSinceCreation} days ago`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Phase {project.current_phase}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onArchive?.(project.id);
                }}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-2">
          <Progress value={progressPercent} className="h-1 flex-1" />
          <span className="text-xs text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>
      </Card>
    </motion.div>
  );
}

function ProjectListItem({ 
  project, 
  index, 
  onSelect, 
  onArchive 
}) {
  const roomType = ROOM_TYPES.find(r => r.value === project.room_type);
  const progressPercent = (project.current_phase / 6) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onSelect(project)}
      className="flex items-center gap-4 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
          {roomType?.label || project.room_type}
        </p>
      </div>
      <div className="text-xs text-muted-foreground hidden sm:block">
        {new Date(project.created_at).toLocaleDateString()}
      </div>
      <Badge variant="secondary" className="text-xs">
        Phase {project.current_phase}
      </Badge>
      <div className="w-20 hidden md:block">
        <Progress value={progressPercent} className="h-1" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onArchive?.(project.id);
          }}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
