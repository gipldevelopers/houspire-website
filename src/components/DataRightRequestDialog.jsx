import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DATA_RIGHT_TYPES } from '@/types/data-rights';
import { submitDataRightRequest, verifyDataRightRequest } from '@/lib/data-rights-service';
import { useToast } from '@/hooks/use-toast';
export default function DataRightRequestDialog({ isOpen, onClose, requestType, onSuccess }) {
    const [step, setStep] = useState('request');
    const [description, setDescription] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const { toast } = useToast();
    function handleClose() {
        setStep('request');
        setDescription('');
        setVerificationCode('');
        setRequestId(null);
        onClose();
    }
    async function handleSubmit() {
        if (!requestType)
            return;
        setSubmitting(true);
        try {
            const result = await submitDataRightRequest(requestType, description);
            if (!result.success) {
                throw new Error(result.error || 'Failed to submit request');
            }
            setRequestId(result.requestId);
            setStep('verify');
            toast({
                title: 'Verification code sent',
                description: 'Check your email for the verification code (check console for demo)'
            });
        }
        catch (error) {
            console.error('Submit error:', error);
            const message = error instanceof Error ? error.message : 'Failed to submit request';
            toast({
                variant: 'destructive',
                title: 'Submission failed',
                description: message
            });
        }
        finally {
            setSubmitting(false);
        }
    }
    async function handleVerify() {
        if (!requestId || !verificationCode)
            return;
        setVerifying(true);
        try {
            const result = await verifyDataRightRequest(requestId, verificationCode);
            if (!result.success) {
                throw new Error(result.error || 'Verification failed');
            }
            setStep('success');
            onSuccess?.();
            toast({
                title: 'Request verified!',
                description: 'Your request is being processed'
            });
        }
        catch (error) {
            console.error('Verify error:', error);
            const message = error instanceof Error ? error.message : 'Invalid verification code';
            toast({
                variant: 'destructive',
                title: 'Verification failed',
                description: message
            });
        }
        finally {
            setVerifying(false);
        }
    }
    if (!requestType)
        return null;
    const rightInfo = DATA_RIGHT_TYPES[requestType];
    return (<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{rightInfo.icon}</span>
            {rightInfo.title}
          </DialogTitle>
          <DialogDescription>
            {rightInfo.description}
          </DialogDescription>
        </DialogHeader>

        {step === 'request' && (<>
            <div className="py-4 space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600"/>
                <AlertDescription className="text-blue-900">
                  <strong>What happens next:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>You&apos;ll receive a verification code via email</li>
                    <li>Enter the code to verify your identity</li>
                    <li>We&apos;ll process your request within 30 days</li>
                    <li>You&apos;ll receive an email when completed</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Additional Details (Optional)
                </Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide any additional details that might help us process your request..." rows={4}/>
                <p className="text-xs text-muted-foreground">
                  For deletion requests, please specify if there&apos;s any data you&apos;d like to keep.
                  For correction requests, please specify what needs to be corrected.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Submitting...
                  </>) : ('Submit Request')}
              </Button>
            </DialogFooter>
          </>)}

        {step === 'verify' && (<>
            <div className="py-4 space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600"/>
                <AlertDescription className="text-blue-900">
                  <strong>Verification Required:</strong> We&apos;ve sent a 6-digit code to your email. 
                  Please enter it below to verify your identity. The code expires in 15 minutes.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="text-center text-2xl tracking-widest font-mono"/>
                <p className="text-xs text-muted-foreground">
                  Check your email for the 6-digit verification code (for demo, check browser console)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleVerify} disabled={verifying || verificationCode.length !== 6}>
                {verifying ? (<>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                    Verifying...
                  </>) : ('Verify & Submit')}
              </Button>
            </DialogFooter>
          </>)}

        {step === 'success' && (<>
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-50 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600"/>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Request Submitted Successfully!</h3>
                <p className="text-muted-foreground">
                  Your <strong>{rightInfo.title.toLowerCase()}</strong> request has been verified 
                  and is being processed.
                </p>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>What&apos;s next:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>We&apos;ll process your request within 30 days</li>
                    <li>You&apos;ll receive email updates on the progress</li>
                    <li>You can track the status in &quot;My Requests&quot; section</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </>)}
      </DialogContent>
    </Dialog>);
}
