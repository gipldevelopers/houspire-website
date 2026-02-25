import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, RefreshCw } from 'lucide-react';
import { getUserDataRightRequests, cancelDataRightRequest } from '@/lib/data-rights-service';
import { DATA_RIGHT_TYPES } from '@/types/data-rights';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
export default function MyDataRightRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(null);
    const { toast } = useToast();
    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            loadRequests();
        }
        else {
            setLoading(false);
        }
    }, [user]);
    async function loadRequests() {
        setLoading(true);
        try {
            const data = await getUserDataRightRequests();
            setRequests(data);
        }
        catch (error) {
            console.error('Failed to load requests:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleCancel(requestId) {
        if (!confirm('Are you sure you want to cancel this request?'))
            return;
        setCanceling(requestId);
        try {
            const success = await cancelDataRightRequest(requestId);
            if (success) {
                setRequests(prev => prev.filter(r => r.id !== requestId));
                toast({
                    title: 'Request cancelled',
                    description: 'Your data rights request has been cancelled'
                });
            }
            else {
                throw new Error('Failed to cancel');
            }
        }
        catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to cancel',
                description: 'Could not cancel the request. Please try again.'
            });
        }
        finally {
            setCanceling(null);
        }
    }
    function getStatusBadge(status) {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Verification</Badge>;
            case 'verified':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Verified</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Processing</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    }
    if (!user) {
        return (<Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Please <a href="/login" className="text-primary hover:underline">sign in</a> to view your data rights requests.
        </p>
      </Card>);
    }
    if (loading) {
        return (<Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin"/>
          <span>Loading requests...</span>
        </div>
      </Card>);
    }
    if (requests.length === 0) {
        return (<Card className="p-6 text-center">
        <p className="text-muted-foreground">
          You haven&apos;t submitted any data rights requests yet.
        </p>
      </Card>);
    }
    return (<div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={loadRequests}>
          <RefreshCw className="h-4 w-4 mr-2"/>
          Refresh
        </Button>
      </div>

      {requests.map((request) => {
            const rightInfo = DATA_RIGHT_TYPES[request.request_type];
            return (<Card key={request.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{rightInfo?.icon || '📋'}</span>
                <div>
                  <h4 className="font-medium">{rightInfo?.title || request.request_type}</h4>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(request.requested_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
                  </p>
                  {request.description && (<p className="text-sm mt-1 text-muted-foreground">
                      &quot;{request.description}&quot;
                    </p>)}
                  {request.verified_at && (<p className="text-xs text-green-600 mt-1">
                      Verified: {new Date(request.verified_at).toLocaleDateString('en-IN')}
                    </p>)}
                  {request.completed_at && (<p className="text-xs text-green-600 mt-1">
                      Completed: {new Date(request.completed_at).toLocaleDateString('en-IN')}
                    </p>)}
                  {request.rejection_reason && (<p className="text-xs text-red-600 mt-1">
                      Reason: {request.rejection_reason}
                    </p>)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(request.status)}
                {request.status === 'pending' && (<Button variant="ghost" size="icon" onClick={() => handleCancel(request.id)} disabled={canceling === request.id} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                    {canceling === request.id ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<Trash2 className="h-4 w-4"/>)}
                  </Button>)}
              </div>
            </div>
          </Card>);
        })}
    </div>);
}
