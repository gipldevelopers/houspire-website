import { Button } from '@/components/ui/button';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Bell, FileText, Download, RefreshCw, Mail, } from 'lucide-react';
export function QuickActionsCard({ projectId, onRefresh }) {
    const { toast } = useToast();
    const handleNotifyConceptsReady = async () => {
        try {
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'concepts_ready',
                    project_id: projectId,
                },
            });
            toast({
                title: 'Notification sent!',
                description: 'Customer notified that concepts are ready',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to send',
                description: 'Could not send notification',
                variant: 'destructive',
            });
        }
    };
    const handleSendReminder = async () => {
        try {
            await appDataClient.functions.invoke('send-notification', {
                body: {
                    type: 'feedback_reminder',
                    project_id: projectId,
                },
            });
            toast({
                title: 'Reminder sent!',
                description: 'Customer reminded to provide feedback',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to send',
                variant: 'destructive',
            });
        }
    };
    const handleExportData = () => {
        toast({
            title: 'Export started',
            description: 'Generating project data export...',
        });
    };
    const actions = [
        {
            icon: Bell,
            label: 'Notify: Concepts Ready',
            onClick: handleNotifyConceptsReady,
            variant: 'default',
        },
        {
            icon: Mail,
            label: 'Send Feedback Reminder',
            onClick: handleSendReminder,
            variant: 'outline',
        },
        {
            icon: FileText,
            label: 'Generate Report',
            onClick: () => toast({ title: 'Generating report...' }),
            variant: 'outline',
        },
        {
            icon: Download,
            label: 'Export Project Data',
            onClick: handleExportData,
            variant: 'outline',
        },
    ];
    return (<div className="space-y-2">
      {actions.map((action, idx) => (<Button key={idx} variant={action.variant} size="sm" className="w-full justify-start" onClick={action.onClick}>
          <action.icon className="h-4 w-4 mr-2"/>
          {action.label}
        </Button>))}
      {onRefresh && (<Button variant="ghost" size="sm" className="w-full justify-start" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2"/>
          Refresh Data
        </Button>)}
    </div>);
}

