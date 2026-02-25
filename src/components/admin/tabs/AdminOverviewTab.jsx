import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowRight, Phone, Mail, CheckCircle, FileText, Users, Wand2, Plus, Upload, Send, Download, Eye, } from 'lucide-react';
export function AdminOverviewTab({ stats, projects, onRefresh }) {
    const navigate = useNavigate();
    // Get urgent projects (no update in 24+ hours)
    const urgentProjects = projects.filter((p) => {
        const hoursSinceUpdate = (Date.now() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60);
        return hoursSinceUpdate > 24 && p.current_phase < 6;
    }).slice(0, 5);
    // Recent activity
    const recentProjects = projects.slice(0, 8);
    // Designer performance mock data
    const designerPerformance = [
        { name: 'Priya Sharma', projects: 12, rating: 4.9, onTime: 98 },
        { name: 'Meera Kapoor', projects: 8, rating: 4.8, onTime: 95 },
        { name: 'Arjun Patel', projects: 6, rating: 4.9, onTime: 100 },
    ];
    return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Urgent Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive"/>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Urgent Actions Required</h3>
                <p className="text-sm text-muted-foreground">
                  {urgentProjects.length} projects need attention
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4"/>
            </Button>
          </div>

          <div className="space-y-3">
            {urgentProjects.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-4">
                ✨ No urgent actions - all projects on track!
              </p>) : (urgentProjects.map((project) => (<UrgentProjectCard key={project.id} project={project}/>)))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="ml-1 h-4 w-4"/>
            </Button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (<ActivityItem key={project.id} project={project}/>))}
          </div>
        </Card>
      </div>

      {/* Right Column - 1/3 width */}
      <div className="space-y-6">
        {/* Today's Overview */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Today's Overview</h3>
          <div className="space-y-4">
            <QuickStat label="New Projects" value={stats.pending}/>
            <QuickStat label="Concepts Delivered" value={stats.inProgress}/>
            <QuickStat label="Payments Received" value={`₹${(stats.revenue / 1000).toFixed(0)}k`}/>
            <QuickStat label="Support Tickets" value={3}/>
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Top Designers</h3>
          <div className="space-y-4">
            {designerPerformance.map((designer) => (<DesignerPerformanceItem key={designer.name} {...designer}/>))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Plus className="h-4 w-4 mr-2"/>
              Create new project
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Upload className="h-4 w-4 mr-2"/>
              Upload concepts
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Send className="h-4 w-4 mr-2"/>
              Send bulk email
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Download className="h-4 w-4 mr-2"/>
              Export reports
            </Button>
          </div>
        </Card>
      </div>
    </div>);
}
function UrgentProjectCard({ project }) {
    const navigate = useNavigate();
    const hoursSinceUpdate = Math.floor((Date.now() - new Date(project.updated_at).getTime()) / (1000 * 60 * 60));
    return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/20">
      <div>
        <p className="font-medium text-foreground">
          {project.room_type.replace(/_/g, ' ')} - {project.id.slice(0, 8)}
        </p>
        <p className="text-sm text-destructive">
          No update for {hoursSinceUpdate} hours
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => navigate(`/admin/project/${project.id}`)}>
          <Eye className="h-4 w-4 mr-1"/>
          View
        </Button>
        <Button size="sm" variant="outline">
          <Phone className="h-4 w-4"/>
        </Button>
        <Button size="sm" variant="outline">
          <Mail className="h-4 w-4"/>
        </Button>
      </div>
    </motion.div>);
}
function ActivityItem({ project }) {
    const navigate = useNavigate();
    const activities = [
        { icon: CheckCircle, text: 'Payment received', color: 'text-emerald-600' },
        { icon: FileText, text: 'Intake submitted', color: 'text-blue-600' },
        { icon: Users, text: 'Designer assigned', color: 'text-purple-600' },
        { icon: Wand2, text: 'Concepts uploaded', color: 'text-amber-600' },
    ];
    const activity = activities[project.current_phase % activities.length];
    return (<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate(`/admin/project/${project.id}`)}>
      <div className={`p-2 rounded-lg bg-muted`}>
        <activity.icon className={`h-4 w-4 ${activity.color}`}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{activity.text}</p>
        <p className="text-xs text-muted-foreground truncate">
          {project.room_type.replace(/_/g, ' ')} •{' '}
          {new Date(project.updated_at).toLocaleTimeString()}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground"/>
    </div>);
}
function QuickStat({ label, value }) {
    return (<div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>);
}
function DesignerPerformanceItem({ name, projects, rating, onTime, }) {
    return (<div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}/>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{projects} active</p>
          </div>
        </div>
        <Badge variant="secondary">{rating} ★</Badge>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">On-time delivery</span>
          <span className="font-medium">{onTime}%</span>
        </div>
        <Progress value={onTime} className="h-1.5"/>
      </div>
    </div>);
}
