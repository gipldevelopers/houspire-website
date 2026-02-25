import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
export function AdminPartialRefund({ payment, onSuccess }) {
    const { toast } = useToast();
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const handleSubmit = async () => {
        const amount = parseFloat(refundAmount);
        if (!amount || amount <= 0) {
            toast({
                title: 'Invalid amount',
                description: 'Please enter a valid refund amount',
                variant: 'destructive',
            });
            return;
        }
        if (amount > payment.amount) {
            toast({
                title: 'Amount too large',
                description: 'Refund amount cannot exceed payment amount',
                variant: 'destructive',
            });
            return;
        }
        if (!refundReason.trim()) {
            toast({
                title: 'Reason required',
                description: 'Please provide a reason for the refund',
                variant: 'destructive',
            });
            return;
        }
        setProcessing(true);
        try {
            const { data, error } = await supabase.rpc('process_partial_refund', {
                p_payment_id: payment.id,
                p_refund_amount: amount,
                p_refund_reason: refundReason,
                p_notes: notes || null,
            });
            if (error)
                throw error;
            const result = Array.isArray(data) ? data[0] : data;
            if (result?.success) {
                toast({
                    title: 'Partial refund initiated! 💰',
                    description: `₹${amount} refund has been processed`,
                });
                setRefundAmount('');
                setRefundReason('');
                setNotes('');
                onSuccess();
            }
            else {
                throw new Error(result?.message || 'Failed to process refund');
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            toast({
                title: 'Refund failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setProcessing(false);
        }
    };
    const isDisabled = payment.status !== 'captured' || processing;
    return (<Card className="border-red-200 bg-red-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5 text-red-600"/>
          Process Partial Refund
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">Payment Amount:</span>
          <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
        </div>

        {payment.refund_status === 'partial' && (<Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertDescription>
              This payment has partial refunds. Check history before processing.
            </AlertDescription>
          </Alert>)}

        {payment.status !== 'captured' && (<Alert variant="destructive">
            <AlertTriangle className="h-4 w-4"/>
            <AlertDescription>
              Only captured payments can be refunded. Current status: {payment.status}
            </AlertDescription>
          </Alert>)}

        <div className="space-y-2">
          <Label htmlFor="refund-amount">Refund Amount (₹)</Label>
          <Input id="refund-amount" type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="Enter amount to refund" min="0" max={payment.amount} step="0.01" disabled={isDisabled}/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refund-reason">Refund Reason *</Label>
          <Textarea id="refund-reason" value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="e.g., Service not delivered, Customer request, etc." rows={3} disabled={isDisabled}/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refund-notes">Internal Notes (Optional)</Label>
          <Textarea id="refund-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes for internal reference..." rows={2} disabled={isDisabled}/>
        </div>

        <Button onClick={handleSubmit} disabled={isDisabled} className="w-full h-12 bg-red-600 text-white hover:bg-red-700">
          {processing ? (<>
              <Loader2 className="h-5 w-5 mr-2 animate-spin"/>
              Processing Refund...
            </>) : (<>
              <DollarSign className="h-5 w-5 mr-2"/>
              Process Partial Refund
            </>)}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Note: This will initiate a refund via Razorpay. The amount will be
          credited to the customer's account within 5-7 business days.
        </p>
      </CardContent>
    </Card>);
}
