import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Zap, Clock, Mail, MessageSquare, Bell, CheckCircle, Play, Settings, RefreshCw, Send, } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export function AdminWorkflowTab({ projects, onRefresh }) {
    const { toast } = useToast();
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [automationEnabled, setAutomationEnabled] = useState(true);
    useEffect(() => {
        fetchFollowups();
    }, []);
    const fetchFollowups = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('followup_actions')
            .select('*')
            .order('scheduled_for', { ascending: true })
            .limit(50);
        if (data) {
            setFollowups(data);
        }
        setLoading(false);
    };
    // Workflow phases
    const workflowPhases = [
        {
            id: 'intake',
            name: 'Intake',
            description: 'Customer submits project details',
            automations: ['Welcome email', 'Designer assignment notification'],
            count: projects.filter((p) => p.current_phase === 1).length,
        },
        {
            id: 'processing',
            name: 'Processing',
            description: 'Design team creates concepts',
            automations: ['Progress update (24h)', 'Timer alerts'],
            count: projects.filter((p) => p.current_phase === 2).length,
        },
        {
            id: 'feedback',
            name: 'Feedback',
            description: 'Customer reviews concepts',
            automations: ['Concept ready notification', 'Feedback reminder (48h)'],
            count: projects.filter((p) => p.current_phase === 3).length,
        },
        {
            id: 'refinement',
            name: 'Refinement',
            description: 'Design revisions',
            automations: ['Revision started notification', 'Completion update'],
            count: projects.filter((p) => p.current_phase === 4).length,
        },
        {
            id: 'review',
            name: 'Review',
            description: 'Final review and approval',
            automations: ['Final review notification', 'Approval request'],
            count: projects.filter((p) => p.current_phase === 5).length,
        },
        {
            id: 'complete',
            name: 'Complete',
            description: 'Project delivered',
            automations: ['Delivery confirmation', 'Review request', 'Referral offer'],
            count: projects.filter((p) => p.current_phase === 6).length,
        },
    ];
    // Pending followups
    const pendingFollowups = followups.filter((f) => f.status === 'pending');
    const executedFollowups = followups.filter((f) => f.status === 'executed');
    const executeFollowup = async (id) => {
        toast({
            title: 'Executing followup...',
            description: 'Sending notification to customer',
        });
        const { error } = await supabase
            .from('followup_actions')
            .update({ status: 'executed', executed_at: new Date().toISOString() })
            .eq('id', id);
        if (!error) {
            toast({
                title: 'Followup executed',
                description: 'Notification sent successfully',
            });
            fetchFollowups();
        }
    };
    const getActionIcon = (type) => {
        switch (type) {
            case 'email':
                return <Mail className="h-4 w-4"/>;
            case 'sms':
                return <MessageSquare className="h-4 w-4"/>;
            case 'push':
                return <Bell className="h-4 w-4"/>;
            default:
                return <Send className="h-4 w-4"/>;
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
            case 'normal':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
            case 'low':
                return 'bg-muted text-muted-foreground';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };
    return (<div className="space-y-6">
      {/* Automation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary"/>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Workflow Automation</h3>
              <p className="text-sm text-muted-foreground">
                Automated emails, reminders, and notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Automation</span>
              <Switch checked={automationEnabled} onCheckedChange={setAutomationEnabled}/>
            </div>
            <Button variant="outline" onClick={fetchFollowups}>
              <RefreshCw className="h-4 w-4 mr-2"/>
              Refresh
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2"/>
              Configure
            </Button>
          </div>
        </div>
      </Card>

      {/* Workflow Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {workflowPhases.map((phase, idx) => (<motion.div key={phase.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="p-4 h-full">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{phase.name}</h4>
                <Badge variant="secondary">{phase.count}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
              <div className="space-y-1">
                {phase.automations.map((auto, i) => (<div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-emerald-500"/>
                    {auto}
                  </div>))}
              </div>
            </Card>
          </motion.div>))}
      </div>

      {/* Pending Followups */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
              <Clock className="h-5 w-5 text-amber-600"/>
            </div>
            <div>
              <h3 className="font-semibold">Pending Actions</h3>
              <p className="text-sm text-muted-foreground">
                {pendingFollowups.length} actions scheduled
              </p>
            </div>
          </div>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2"/>
            Run All
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Scheduled For</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading followups...
                </TableCell>
              </TableRow>) : pendingFollowups.length === 0 ? (<TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-8 w-8 text-emerald-500"/>
                    <p className="text-muted-foreground">All caught up! No pending actions.</p>
                  </div>
                </TableCell>
              </TableRow>) : (pendingFollowups.slice(0, 10).map((followup) => (<TableRow key={followup.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(followup.action_type)}
                      <span className="capitalize">{followup.action_type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{followup.template}</TableCell>
                  <TableCell>
                    {new Date(followup.scheduled_for).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(followup.priority || 'normal')}>
                      {followup.priority || 'normal'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1"/>
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => executeFollowup(followup.id)}>
                      <Send className="h-4 w-4 mr-1"/>
                      Execute
                    </Button>
                  </TableCell>
                </TableRow>)))}
          </TableBody>
        </Table>
      </Card>

      {/* Recent Executions */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle className="h-5 w-5 text-emerald-600"/>
          </div>
          <div>
            <h3 className="font-semibold">Recent Executions</h3>
            <p className="text-sm text-muted-foreground">
              Last {executedFollowups.length} completed actions
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {executedFollowups.slice(0, 5).map((followup) => (<div key={followup.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {getActionIcon(followup.action_type)}
                <div>
                  <p className="font-medium text-sm">{followup.template}</p>
                  <p className="text-xs text-muted-foreground">
                    {followup.executed_at
                ? new Date(followup.executed_at).toLocaleString()
                : 'Unknown'}
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                Completed
              </Badge>
            </div>))}
        </div>
      </Card>
    </div>);
}
