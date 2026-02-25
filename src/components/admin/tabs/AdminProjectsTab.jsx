'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Eye, Send, Upload, Phone, Mail, Trash, CheckCircle, Clock, AlertCircle, Play, Pause, Download, UserPlus, } from 'lucide-react';
import { ROOM_TYPES, DESIGNER_PERSONAS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
export function AdminProjectsTab({ projects, onRefresh }) {
    const router = useRouter();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPhase, setFilterPhase] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const getPhaseLabel = (phase) => {
        const labels = ['Intake', 'Processing', 'Feedback', 'Refinement', 'Review', 'Complete'];
        return labels[phase - 1] || 'Unknown';
    };
    const getPhaseColor = (phase) => {
        if (phase <= 2)
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
        if (phase <= 4)
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
        if (phase === 5)
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200';
    };
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.room_type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPhase = filterPhase === null || project.current_phase === filterPhase;
        return matchesSearch && matchesPhase;
    });
    const toggleProjectSelection = (projectId) => {
        setSelectedProjects((prev) => prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]);
    };
    const toggleAllProjects = () => {
        if (selectedProjects.length === filteredProjects.length) {
            setSelectedProjects([]);
        }
        else {
            setSelectedProjects(filteredProjects.map((p) => p.id));
        }
    };
    const handleBulkAction = async (action) => {
        if (selectedProjects.length === 0) {
            toast({
                title: 'No projects selected',
                description: 'Please select at least one project',
                variant: 'destructive',
            });
            return;
        }
        toast({
            title: `${action} started`,
            description: `Processing ${selectedProjects.length} projects...`,
        });
        // Simulate action
        setTimeout(() => {
            toast({
                title: 'Action completed',
                description: `Successfully processed ${selectedProjects.length} projects`,
            });
            setSelectedProjects([]);
            onRefresh();
        }, 1500);
    };
    const getRoomLabel = (roomType) => {
        const room = ROOM_TYPES.find((r) => r.value === roomType);
        return room?.label || roomType;
    };
    const getDesignerName = (designerId) => {
        if (!designerId)
            return 'Unassigned';
        const designer = DESIGNER_PERSONAS.find((d) => d.id === designerId);
        return designer?.name || 'Unknown';
    };
    return (<div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects by ID or room type..." className="pl-10"/>
        </div>
        <div className="flex gap-2">
          <Button variant={filterPhase === null ? 'default' : 'outline'} size="sm" onClick={() => setFilterPhase(null)}>
            All ({projects.length})
          </Button>
          <Button variant={filterPhase === 1 ? 'default' : 'outline'} size="sm" onClick={() => setFilterPhase(1)}>
            <Clock className="h-4 w-4 mr-1"/>
            Intake
          </Button>
          <Button variant={filterPhase === 2 ? 'default' : 'outline'} size="sm" onClick={() => setFilterPhase(2)}>
            <AlertCircle className="h-4 w-4 mr-1"/>
            QC Pending
          </Button>
          <Button variant={filterPhase === 6 ? 'default' : 'outline'} size="sm" onClick={() => setFilterPhase(6)}>
            <CheckCircle className="h-4 w-4 mr-1"/>
            Complete
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedProjects.length > 0 && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedProjects.length} project(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Email')}>
                    <Mail className="h-4 w-4 mr-1"/>
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Assign')}>
                    <UserPlus className="h-4 w-4 mr-1"/>
                    Assign Designer
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                    <Download className="h-4 w-4 mr-1"/>
                    Export
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setSelectedProjects([])}>
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>)}
      </AnimatePresence>

      {/* Projects Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0} onCheckedChange={toggleAllProjects}/>
              </TableHead>
              <TableHead>Project ID</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Designer</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Timer</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (<TableRow key={project.id} className="group">
                <TableCell>
                  <Checkbox checked={selectedProjects.includes(project.id)} onCheckedChange={() => toggleProjectSelection(project.id)}/>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {project.id.slice(0, 8)}
                  </code>
                </TableCell>
                <TableCell className="font-medium">{getRoomLabel(project.room_type)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                      {getDesignerName(project.designer_persona).charAt(0)}
                    </div>
                    <span className="text-sm">{getDesignerName(project.designer_persona)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPhaseColor(project.current_phase)}>
                    {getPhaseLabel(project.current_phase)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={project.timer_status === 'running' ? 'default' : 'secondary'}>
                    {project.timer_status === 'running' ? (<Play className="h-3 w-3 mr-1"/>) : (<Pause className="h-3 w-3 mr-1"/>)}
                    {project.timer_status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">₹{project.total_paid.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/project/${project.id}`)}>
                        <Eye className="h-4 w-4 mr-2"/>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="h-4 w-4 mr-2"/>
                        Upload Concepts
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2"/>
                        Send to Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2"/>
                        Call Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2"/>
                        Email Customer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="h-4 w-4 mr-2"/>
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
      </Card>

      {filteredProjects.length === 0 && (<div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria</p>
        </div>)}
    </div>);
}
