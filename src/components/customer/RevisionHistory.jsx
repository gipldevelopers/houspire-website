import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, RefreshCw, ChevronDown, ChevronUp, AlertTriangle, XCircle } from 'lucide-react';
import { getRevisionHistory } from '@/lib/revision-service';
export default function RevisionHistory({ orderId }) {
    const [revisions, setRevisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [expandedItems, setExpandedItems] = useState(new Set());
    useEffect(() => {
        loadHistory();
    }, [orderId]);
    async function loadHistory() {
        setLoading(true);
        try {
            const data = await getRevisionHistory(orderId);
            setRevisions(data.revisions);
            setTotalCount(data.totalCount);
        }
        catch (error) {
            console.error('Failed to load revision history:', error);
        }
        finally {
            setLoading(false);
        }
    }
    function toggleExpand(room) {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(room)) {
                newSet.delete(room);
            }
            else {
                newSet.add(room);
            }
            return newSet;
        });
    }
    function getStatusIcon(status) {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-5 w-5 text-green-600"/>;
            case 'changes_requested':
                return <RefreshCw className="h-5 w-5 text-amber-600"/>;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600"/>;
            case 'pending':
            default:
                return <Clock className="h-5 w-5 text-blue-600"/>;
        }
    }
    function getStatusBadge(status) {
        const configs = {
            pending: { variant: 'secondary', label: 'Pending Review' },
            approved: { variant: 'default', label: 'Approved', className: 'bg-green-600' },
            changes_requested: { variant: 'secondary', label: 'Changes Requested', className: 'bg-amber-100 text-amber-800' },
            rejected: { variant: 'destructive', label: 'Rejected' }
        };
        const config = configs[status] || configs.pending;
        return (<Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>);
    }
    if (loading) {
        return (<div className="space-y-4">
        <Skeleton className="h-20 w-full"/>
        <Skeleton className="h-20 w-full"/>
        <Skeleton className="h-20 w-full"/>
      </div>);
    }
    if (revisions.length === 0) {
        return (<Alert>
        <AlertTriangle className="h-4 w-4"/>
        <AlertDescription>
          No revision history yet. You can request changes from the design review page.
        </AlertDescription>
      </Alert>);
    }
    // Group by status
    const changesRequested = revisions.filter(r => r.status === 'changes_requested');
    const approved = revisions.filter(r => r.status === 'approved');
    const pending = revisions.filter(r => r.status === 'pending');
    return (<div className="space-y-6">
      {/* Summary */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Revision Summary</h3>
            <p className="text-sm text-muted-foreground">
              {totalCount} room(s) with change requests
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              {approved.length} Approved
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              {changesRequested.length} Pending
            </Badge>
          </div>
        </div>
      </Card>

      {/* Changes Requested */}
      {changesRequested.length > 0 && (<div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-amber-600"/>
            Changes Requested ({changesRequested.length})
          </h4>
          {changesRequested.map((revision, index) => {
                const isExpanded = expandedItems.has(revision.room);
                return (<Card key={`changes-${index}`} className="p-4 border-amber-200 dark:border-amber-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(revision.status)}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{revision.room}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(revision.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(revision.status)}
                    {revision.feedback && (<Button variant="ghost" size="sm" onClick={() => toggleExpand(revision.room)}>
                        {isExpanded ? (<ChevronUp className="h-4 w-4"/>) : (<ChevronDown className="h-4 w-4"/>)}
                      </Button>)}
                  </div>
                </div>
                
                {isExpanded && revision.feedback && (<div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground font-medium mb-1">Feedback:</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap bg-muted p-3 rounded-lg">
                      {revision.feedback}
                    </p>
                  </div>)}
              </Card>);
            })}
        </div>)}

      <Separator />

      {/* Approved Rooms */}
      {approved.length > 0 && (<div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600"/>
            Approved ({approved.length})
          </h4>
          {approved.map((revision, index) => (<Card key={`approved-${index}`} className="p-4 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(revision.status)}
                  <div>
                    <p className="font-medium text-foreground">{revision.room}</p>
                    <p className="text-xs text-muted-foreground">
                      Approved on {new Date(revision.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(revision.status)}
              </div>
            </Card>))}
        </div>)}

      {/* Pending Review */}
      {pending.length > 0 && (<div className="space-y-3">
          <h4 className="font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600"/>
            Pending Review ({pending.length})
          </h4>
          {pending.map((revision, index) => (<Card key={`pending-${index}`} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(revision.status)}
                  <div>
                    <p className="font-medium text-foreground">{revision.room}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated {new Date(revision.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(revision.status)}
              </div>
            </Card>))}
        </div>)}
    </div>);
}
