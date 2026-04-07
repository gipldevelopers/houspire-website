import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { Download, Send, Trash2, Loader2 } from 'lucide-react';
export function BulkActions({ selectedProjects, onComplete }) {
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const handleBulkAction = async () => {
        if (!action || selectedProjects.length === 0)
            return;
        setLoading(true);
        try {
            switch (action) {
                case 'export':
                    await exportProjects();
                    break;
                case 'send_reminder':
                    await sendBulkReminders();
                    break;
                case 'update_phase':
                    await updatePhases();
                    break;
                case 'archive':
                    await archiveProjects();
                    break;
                default:
                    break;
            }
            toast({
                title: 'Success',
                description: `Bulk action completed for ${selectedProjects.length} projects`,
            });
            onComplete();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const exportProjects = async () => {
        const { data, error } = await appDataClient
            .from('projects')
            .select('*')
            .in('id', selectedProjects);
        if (error)
            throw error;
        const csv = convertToCSV(data || []);
        downloadCSV(csv, 'projects-export.csv');
    };
    const sendBulkReminders = async () => {
        for (const projectId of selectedProjects) {
            const { data: project } = await appDataClient
                .from('projects')
                .select('user_id')
                .eq('id', projectId)
                .single();
            if (project) {
                await appDataClient.functions.invoke('send-notification', {
                    body: {
                        userId: project.user_id,
                        projectId,
                        type: 'reminder',
                        channel: 'both',
                    },
                });
            }
        }
    };
    const updatePhases = async () => {
        await appDataClient
            .from('projects')
            .update({ current_phase: 3 })
            .in('id', selectedProjects);
    };
    const archiveProjects = async () => {
        await appDataClient
            .from('projects')
            .update({ phase_status: 'archived' })
            .in('id', selectedProjects);
    };
    if (selectedProjects.length === 0)
        return null;
    return (<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selectedProjects.length} selected
      </span>
      
      <Select value={action} onValueChange={setAction}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Choose action..."/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="export">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4"/>
              Export to CSV
            </span>
          </SelectItem>
          <SelectItem value="send_reminder">
            <span className="flex items-center gap-2">
              <Send className="h-4 w-4"/>
              Send Reminders
            </span>
          </SelectItem>
          <SelectItem value="update_phase">
            Update Phase
          </SelectItem>
          <SelectItem value="archive">
            <span className="flex items-center gap-2">
              <Trash2 className="h-4 w-4"/>
              Archive
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <Button onClick={handleBulkAction} disabled={!action || loading} size="sm">
        {loading ? (<>
            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
            Processing...
          </>) : ('Apply')}
      </Button>
    </div>);
}
function convertToCSV(data) {
    if (!data || data.length === 0)
        return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','));
    return [headers.join(','), ...rows].join('\n');
}
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

