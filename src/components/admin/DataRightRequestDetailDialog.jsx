import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Loader2, Download, User, Calendar } from 'lucide-react';
import { DATA_RIGHT_TYPES } from '@/types/data-rights';
import { useToast } from '@/hooks/use-toast';
export default function DataRightRequestDetailDialog({ isOpen, onClose, request, onUpdate }) {
    const [processing, setProcessing] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [notes, setNotes] = useState(request.notes || '');
    const [rejectionReason, setRejectionReason] = useState('');
    const { toast } = useToast();
    const rightInfo = DATA_RIGHT_TYPES[request.request_type];
    const daysSince = Math.floor((Date.now() - new Date(request.requested_at).getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysSince > 30;
    async function handleMarkProcessing() {
        if (!confirm('Mark this request as processing?\n\nThis will update the status and notify the user.')) {
            return;
        }
        setProcessing(true);
        try {
            const { error } = await supabase
                .from('data_rights_requests')
                .update({
                status: 'processing',
                notes: notes || null
            })
                .eq('id', request.id);
            if (error)
                throw error;
            toast({
                title: 'Status updated',
                description: 'Request marked as processing'
            });
            onUpdate();
        }
        catch (error) {
            console.error('Error updating status:', error);
            toast({
                variant: 'destructive',
                title: 'Update failed',
                description: 'Failed to update request status'
            });
        }
        finally {
            setProcessing(false);
        }
    }
    async function handleComplete() {
        if (!confirm('Mark this request as completed?\n\n' +
            'Make sure you have:\n' +
            '- Processed the request completely\n' +
            '- Sent any required data to the user\n' +
            '- Documented the actions taken')) {
            return;
        }
        setProcessing(true);
        try {
            const { error } = await supabase
                .from('data_rights_requests')
                .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                notes: notes || null
            })
                .eq('id', request.id);
            if (error)
                throw error;
            toast({
                title: 'Request completed',
                description: 'The user has been notified'
            });
            onUpdate();
        }
        catch (error) {
            console.error('Error completing request:', error);
            toast({
                variant: 'destructive',
                title: 'Completion failed',
                description: 'Failed to complete request'
            });
        }
        finally {
            setProcessing(false);
        }
    }
    async function handleReject() {
        if (!rejectionReason.trim()) {
            toast({
                variant: 'destructive',
                title: 'Reason required',
                description: 'Please provide a reason for rejection'
            });
            return;
        }
        if (!confirm('Reject this request?\n\n' +
            'The user will be notified with the rejection reason.')) {
            return;
        }
        setRejecting(true);
        try {
            const { error } = await supabase
                .from('data_rights_requests')
                .update({
                status: 'rejected',
                rejected_at: new Date().toISOString(),
                rejection_reason: rejectionReason,
                notes: notes || null
            })
                .eq('id', request.id);
            if (error)
                throw error;
            toast({
                title: 'Request rejected',
                description: 'The user has been notified'
            });
            onUpdate();
        }
        catch (error) {
            console.error('Error rejecting request:', error);
            toast({
                variant: 'destructive',
                title: 'Rejection failed',
                description: 'Failed to reject request'
            });
        }
        finally {
            setRejecting(false);
        }
    }
    function handleGenerateDataExport() {
        toast({
            title: 'Coming soon',
            description: 'Data export generation will be implemented in the next phase'
        });
    }
    function getStatusVariant(status) {
        switch (status) {
            case 'completed': return 'default';
            case 'rejected': return 'destructive';
            case 'pending': return 'secondary';
            default: return 'outline';
        }
    }
    return (<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{rightInfo?.icon || '📄'}</span>
            {rightInfo?.title || 'Data Rights Request'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(request.status)}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>

            {isOverdue && request.status !== 'completed' && request.status !== 'rejected' && (<Badge variant="destructive">
                Overdue ({daysSince} days)
              </Badge>)}
          </div>

          {/* User Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">User Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4"/>
                <span className="font-mono text-xs">{request.user_id}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4"/>
                <span>Requested: {new Date(request.requested_at).toLocaleString('en-IN')}</span>
              </div>
              {request.verified_at && (<div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500"/>
                  <span>Verified: {new Date(request.verified_at).toLocaleString('en-IN')}</span>
                </div>)}
            </div>
          </div>

          {/* Request Details */}
          <div>
            <h4 className="font-medium mb-2">Request Details</h4>
            {request.description ? (<div className="bg-muted/30 rounded p-3">
                <p className="text-sm">{request.description}</p>
              </div>) : (<p className="text-sm text-muted-foreground">No additional details provided</p>)}
          </div>

          <Separator />

          {/* Admin Notes */}
          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes about processing this request..." rows={3} className="mt-2"/>
          </div>

          {/* Action Buttons based on status */}
          {(request.status === 'verified' || request.status === 'processing') && (<>
              <Separator />

              {/* For Access/Portability requests */}
              {(request.request_type === 'access' || request.request_type === 'portability') && (<Alert className="border-blue-200 bg-blue-50">
                  <Download className="h-4 w-4 text-blue-600"/>
                  <AlertDescription className="text-blue-800">
                    <p className="font-semibold mb-2">Data Export Required</p>
                    <p className="text-sm mb-3">
                      For this request type, you need to generate and send a data export to the user.
                    </p>
                    <Button onClick={handleGenerateDataExport} variant="outline" size="sm" className="bg-white">
                      <Download className="h-4 w-4 mr-2"/>
                      Generate Data Export
                    </Button>
                  </AlertDescription>
                </Alert>)}

              {/* Rejection section */}
              <div>
                <Label htmlFor="rejection">Rejection Reason (if rejecting)</Label>
                <Textarea id="rejection" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Provide a clear reason if you need to reject this request..." rows={2} className="mt-2"/>
              </div>
            </>)}

          {/* Completed/Rejected info */}
          {request.status === 'completed' && request.completed_at && (<Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600"/>
              <AlertDescription className="text-green-800">
                Completed on {new Date(request.completed_at).toLocaleString('en-IN')}
              </AlertDescription>
            </Alert>)}

          {request.status === 'rejected' && (<Alert variant="destructive">
              <XCircle className="h-4 w-4"/>
              <AlertDescription>
                <strong>Rejected:</strong> {request.rejection_reason}
              </AlertDescription>
            </Alert>)}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {(request.status === 'verified' || request.status === 'processing') && (<>
              <Button variant="destructive" onClick={handleReject} disabled={processing || rejecting}>
                {rejecting ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Rejecting...
                  </>) : (<>
                    <XCircle className="h-4 w-4 mr-2"/>
                    Reject
                  </>)}
              </Button>

              {request.status === 'verified' && (<Button variant="outline" onClick={handleMarkProcessing} disabled={processing || rejecting}>
                  Mark Processing
                </Button>)}

              <Button onClick={handleComplete} disabled={processing || rejecting} className="bg-green-600 hover:bg-green-700">
                {processing ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Completing...
                  </>) : (<>
                    <CheckCircle2 className="h-4 w-4 mr-2"/>
                    Complete
                  </>)}
              </Button>
            </>)}

          {(request.status === 'completed' || request.status === 'rejected' || request.status === 'pending') && (<Button onClick={onClose} className="w-full">
              Close
            </Button>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
