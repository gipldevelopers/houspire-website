import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { matchDesignersForOrder, reassignDesigner } from '@/lib/designer-matching';
import { AlertTriangle, ArrowRight, Star, Clock, } from 'lucide-react';
const REASSIGNMENT_REASONS = [
    { value: 'designer_unavailable', label: 'Designer Unavailable (sick, emergency, etc.)' },
    { value: 'quality_issues', label: 'Quality Concerns' },
    { value: 'workload_balance', label: 'Workload Balancing' },
    { value: 'customer_request', label: 'Customer Request' },
    { value: 'designer_request', label: 'Designer Request' },
    { value: 'other', label: 'Other' },
];
export function ReassignDesignerModal({ open, onOpenChange, orderId, orderNumber, currentDesignerId, currentDesignerName, onSuccess, }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [reassigning, setReassigning] = useState(false);
    const [matches, setMatches] = useState([]);
    const [selectedDesignerId, setSelectedDesignerId] = useState('');
    const [reason, setReason] = useState('');
    const [reasonDetails, setReasonDetails] = useState('');
    useEffect(() => {
        if (open && orderId) {
            fetchMatches();
            resetForm();
        }
    }, [open, orderId]);
    const resetForm = () => {
        setSelectedDesignerId('');
        setReason('');
        setReasonDetails('');
    };
    const fetchMatches = async () => {
        try {
            setLoading(true);
            const results = await matchDesignersForOrder(orderId);
            // Filter out the current designer
            const filteredResults = results.filter(m => m.designer_id !== currentDesignerId);
            setMatches(filteredResults);
        }
        catch (error) {
            console.error('Failed to fetch matches:', error);
            toast({
                title: 'Error loading designers',
                description: 'Could not fetch available designers',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleReassign = async () => {
        if (!reason) {
            toast({
                title: 'Reason required',
                description: 'Please select a reason for reassignment',
                variant: 'destructive',
            });
            return;
        }
        if (!selectedDesignerId) {
            toast({
                title: 'Designer required',
                description: 'Please select a new designer',
                variant: 'destructive',
            });
            return;
        }
        const selectedDesigner = matches.find(m => m.designer_id === selectedDesignerId);
        const reasonLabel = REASSIGNMENT_REASONS.find(r => r.value === reason)?.label || reason;
        const fullReason = reasonDetails
            ? `${reasonLabel}: ${reasonDetails}`
            : reasonLabel;
        try {
            setReassigning(true);
            const result = await reassignDesigner(orderId, selectedDesignerId, fullReason);
            if (result.success) {
                toast({
                    title: 'Designer Reassigned',
                    description: `Order reassigned to ${selectedDesigner?.designer_name}`,
                });
                onOpenChange(false);
                onSuccess();
            }
            else {
                throw new Error(result.error);
            }
        }
        catch (error) {
            toast({
                title: 'Reassignment Failed',
                description: error.message || 'Could not reassign designer',
                variant: 'destructive',
            });
        }
        finally {
            setReassigning(false);
        }
    };
    const getScoreBadgeColor = (score) => {
        if (score >= 90)
            return 'bg-green-100 text-green-700';
        if (score >= 80)
            return 'bg-blue-100 text-blue-700';
        return 'bg-neutral-100 text-neutral-700';
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Reassign Designer - Order #{orderNumber}
          </DialogTitle>
          <DialogDescription>
            Change the designer assigned to this order. The previous designer's work will be preserved.
          </DialogDescription>
        </DialogHeader>

        {/* Current Designer */}
        <div className="bg-neutral-100 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentDesignerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-neutral-500">Current Designer</p>
              <p className="font-semibold">{currentDesignerName}</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <Alert className="border-orange-300 bg-orange-50 mb-4">
          <AlertTriangle className="h-4 w-4 text-orange-600"/>
          <AlertDescription className="text-orange-700">
            Reassignment will reset the design start time and may delay delivery. Use this only when necessary.
          </AlertDescription>
        </Alert>

        {/* Reason Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Reason for Reassignment *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select reason..."/>
              </SelectTrigger>
              <SelectContent>
                {REASSIGNMENT_REASONS.map(r => (<SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Additional Details (Optional)</Label>
            <Textarea value={reasonDetails} onChange={(e) => setReasonDetails(e.target.value)} placeholder="Provide more context about the reassignment..." rows={2} className="rounded-xl"/>
          </div>

          {/* New Designer Selection */}
          <div className="space-y-2">
            <Label>Select New Designer *</Label>
            {loading ? (<div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"/>
                <span className="ml-3 text-muted-foreground">Loading...</span>
              </div>) : matches.length === 0 ? (<Alert className="border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600"/>
                <AlertDescription className="text-red-700">
                  No other designers are available for this style. All designers are at capacity.
                </AlertDescription>
              </Alert>) : (<div className="space-y-3 max-h-[300px] overflow-y-auto">
                {matches.map((designer) => (<div key={designer.designer_id} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedDesignerId === designer.designer_id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'}`} onClick={() => setSelectedDesignerId(designer.designer_id)}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {designer.designer_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{designer.designer_name}</span>
                          <Badge className={getScoreBadgeColor(designer.match_score)}>
                            {designer.match_score}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {designer.expertise_level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500"/>
                            {designer.avg_rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3"/>
                            {designer.avg_delivery_hours}h
                          </span>
                          <span>
                            {designer.active_projects}/{designer.max_projects} projects
                          </span>
                        </div>
                      </div>

                      <div className="w-16">
                        <Progress value={designer.capacity_percentage} className="h-1.5"/>
                      </div>
                    </div>
                  </div>))}
              </div>)}
          </div>
        </div>

        {/* Reassignment Arrow */}
        {selectedDesignerId && (<div className="flex items-center justify-center gap-4 py-4 mt-4 bg-neutral-50 rounded-xl">
            <div className="text-center">
              <Avatar className="h-10 w-10 mx-auto mb-1">
                <AvatarFallback className="bg-neutral-300 text-neutral-700">
                  {currentDesignerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">From</p>
            </div>
            <ArrowRight className="h-6 w-6 text-primary"/>
            <div className="text-center">
              <Avatar className="h-10 w-10 mx-auto mb-1">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {matches.find(m => m.designer_id === selectedDesignerId)?.designer_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">To</p>
            </div>
          </div>)}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={reassigning}>
            Cancel
          </Button>
          <Button onClick={handleReassign} disabled={reassigning || !reason || !selectedDesignerId}>
            {reassigning ? 'Reassigning...' : 'Confirm Reassignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
