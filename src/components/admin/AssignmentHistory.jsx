import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ArrowRight, Zap, User, RefreshCw, } from 'lucide-react';
export function AssignmentHistory({ orderId }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadHistory();
    }, [orderId]);
    const loadHistory = async () => {
        try {
            setLoading(true);
            // Fetch assignment logs
            const { data: logs, error } = await supabase
                .from('assignment_log')
                .select('*')
                .eq('order_id', orderId)
                .order('assigned_at', { ascending: false });
            if (error)
                throw error;
            // Fetch designer names for all designer_ids and reassigned_from ids
            const allDesignerIds = new Set();
            logs?.forEach(log => {
                if (log.designer_id)
                    allDesignerIds.add(log.designer_id);
                if (log.reassigned_from)
                    allDesignerIds.add(log.reassigned_from);
            });
            const { data: designers } = await supabase
                .from('designer_profiles')
                .select('id, display_name')
                .in('id', Array.from(allDesignerIds));
            const designerMap = new Map(designers?.map(d => [d.id, d.display_name]) || []);
            const formatted = (logs || []).map(log => ({
                id: log.id,
                designer_id: log.designer_id,
                designer_name: designerMap.get(log.designer_id) || 'Unknown',
                assigned_at: log.assigned_at,
                assigned_by: log.assigned_by,
                assignment_type: log.assignment_type,
                match_score: log.match_score,
                reassigned_from: log.reassigned_from,
                old_designer_name: log.reassigned_from ? designerMap.get(log.reassigned_from) || 'Unknown' : null,
                reassignment_reason: log.reassignment_reason,
            }));
            setHistory(formatted);
        }
        catch (error) {
            console.error('Error loading assignment history:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (<div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl"/>
        <Skeleton className="h-20 w-full rounded-xl"/>
      </div>);
    }
    if (history.length === 0) {
        return (<div className="text-center py-8 text-muted-foreground">
        <User className="h-8 w-8 mx-auto mb-2 opacity-50"/>
        <p>No assignment history</p>
      </div>);
    }
    return (<div className="space-y-4">
      {history.map((log, index) => {
            const isReassignment = log.assignment_type === 'reassignment' || !!log.reassigned_from;
            const isCurrent = index === 0;
            return (<div key={log.id} className={`relative p-4 rounded-xl border-2 ${isCurrent
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-neutral-200 bg-neutral-50/50'}`}>
            {/* Timeline connector */}
            {index < history.length - 1 && (<div className="absolute left-8 top-full h-4 w-0.5 bg-neutral-200"/>)}

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isReassignment
                    ? 'bg-orange-100 text-orange-600'
                    : log.assignment_type === 'auto'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'}`}>
                {isReassignment ? (<RefreshCw className="h-5 w-5"/>) : log.assignment_type === 'auto' ? (<Zap className="h-5 w-5"/>) : (<User className="h-5 w-5"/>)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {log.designer_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{log.designer_name}</span>
                  {isCurrent && (<Badge className="bg-green-100 text-green-700 text-xs">Current</Badge>)}
                </div>

                {/* Assignment details */}
                {isReassignment ? (<div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Reassigned from</span>
                    <Badge variant="outline" className="text-xs">
                      {log.old_designer_name}
                    </Badge>
                    <ArrowRight className="h-3 w-3"/>
                    <Badge variant="outline" className="text-xs">
                      {log.designer_name}
                    </Badge>
                  </div>) : (<div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Assigned via</span>
                    <Badge variant="secondary" className="text-xs">
                      {log.assignment_type === 'auto' ? 'Auto-assign' : 'Manual'}
                    </Badge>
                    {log.match_score && (<span className="text-xs">
                        ({log.match_score}% match)
                      </span>)}
                  </div>)}

                {/* Reason if reassignment */}
                {log.reassignment_reason && (<p className="text-sm text-orange-700 mt-2 bg-orange-50 rounded-lg px-3 py-2">
                    <span className="font-medium">Reason:</span> {log.reassignment_reason}
                  </p>)}

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3"/>
                  <span>
                    {new Date(log.assigned_at).toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
                  </span>
                </div>
              </div>
            </div>
          </div>);
        })}
    </div>);
}
