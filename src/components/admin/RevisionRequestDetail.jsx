import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { appDataClient } from '@/lib/static-client';
import { Upload, AlertCircle, Calendar, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
export default function RevisionRequestDetail({ revisions, orderId, orderNumber, revisionCount }) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [designerResponse, setDesignerResponse] = useState('');
    const [responding, setResponding] = useState(false);
    const changesRequested = revisions.filter(r => r.status === 'changes_requested');
    const latestRequest = changesRequested[0];
    const requestedAt = latestRequest ? new Date(latestRequest.updated_at) : new Date();
    const expectedDelivery = new Date(requestedAt);
    expectedDelivery.setHours(expectedDelivery.getHours() + 72);
    const isOverdue = new Date() > expectedDelivery && changesRequested.length > 0;
    async function handleSaveResponse() {
        if (!designerResponse.trim())
            return;
        setResponding(true);
        try {
            // Update internal notes with designer response
            const { error } = await appDataClient
                .from('orders')
                .update({
                internal_notes: `[Designer Response - ${new Date().toLocaleDateString()}]\n${designerResponse}`,
                updated_at: new Date().toISOString()
            })
                .eq('id', orderId);
            if (error)
                throw error;
            toast({
                title: 'Response saved',
                description: 'Designer response has been saved to internal notes'
            });
            setDesignerResponse('');
        }
        catch (error) {
            console.error('Failed to save response:', error);
            toast({
                title: 'Failed to save',
                description: 'Could not save designer response',
                variant: 'destructive'
            });
        }
        finally {
            setResponding(false);
        }
    }
    if (changesRequested.length === 0) {
        return (<Alert>
        <CheckCircle2 className="h-4 w-4"/>
        <AlertDescription>
          No pending revision requests for this order.
        </AlertDescription>
      </Alert>);
    }
    return (<div className="space-y-6">
      {/* Alert Banner */}
      <Alert className={`${isOverdue ? 'border-red-300 bg-red-50 dark:bg-red-950/30' : 'border-amber-300 bg-amber-50 dark:bg-amber-950/30'}`}>
        <AlertCircle className={`h-5 w-5 ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}/>
        <AlertTitle className={isOverdue ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}>
          {isOverdue ? '⚠️ Overdue Revision Request' : '🔔 Pending Revision Request'}
        </AlertTitle>
        <AlertDescription>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Customer requested changes for {changesRequested.length} room(s).
                {isOverdue && ' This request is past the 72-hour deadline.'}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4"/>
                  Requested: {requestedAt.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4"/>
                  Due: {expectedDelivery.toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button onClick={() => navigate(`/admin/orders/${orderId}/upload`)} className="bg-amber-600 hover:bg-amber-700 flex-shrink-0">
              <Upload className="h-4 w-4 mr-2"/>
              Upload Revised Designs
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Revision Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Revision Request #{revisionCount || 1}
            </h3>
            <p className="text-sm text-muted-foreground">
              Order #{orderNumber} • Requested {requestedAt.toLocaleDateString()}
            </p>
          </div>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
            Pending
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Rooms Affected</p>
            <p className="font-medium text-foreground">{changesRequested.map(r => r.room).join(', ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Revisions</p>
            <p className="font-medium text-foreground">{revisionCount || 1}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium text-foreground">Awaiting Revised Designs</p>
          </div>
        </div>
      </Card>

      {/* Detailed Changes Per Room */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary"/>
          Customer Feedback
        </h3>

        <div className="space-y-4">
          {changesRequested.map((revision, index) => (<div key={`${revision.room}-${index}`} className="space-y-3">
              {index > 0 && <Separator />}
              
              <div className="pt-2">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary">
                    {index + 1}
                  </span>
                  {revision.room}
                </h4>

                {/* Feedback Description */}
                <div className="mt-3 ml-10">
                  <p className="text-sm text-muted-foreground mb-1">
                    What needs to change:
                  </p>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">
                      {revision.feedback || 'No specific feedback provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>))}
        </div>
      </Card>

      {/* Designer Response Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4">
          Designer Response
        </h3>
        
        <div className="space-y-3">
          <Label htmlFor="designer-response">
            Add notes or clarifications for the customer (optional)
          </Label>
          <Textarea id="designer-response" value={designerResponse} onChange={(e) => setDesignerResponse(e.target.value)} placeholder="E.g., 'I've updated the living room with lighter sofa colors as requested. Also adjusted the layout to create more open space...'" rows={4}/>
          <Button onClick={handleSaveResponse} disabled={responding || !designerResponse.trim()} variant="outline" size="sm">
            {responding ? 'Saving...' : 'Save Response'}
          </Button>
        </div>
      </Card>

      {/* Action Card */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Ready to Upload?</h3>
            <p className="text-sm text-muted-foreground">
              Upload the revised designs to complete this revision request
            </p>
          </div>
          <Button onClick={() => navigate(`/admin/orders/${orderId}/upload`)} size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Upload className="h-5 w-5 mr-2"/>
            Upload Revised Designs
          </Button>
        </div>
      </Card>
    </div>);
}

