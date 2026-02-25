import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { matchDesignersForOrder, assignDesignerToOrder } from '@/lib/designer-matching';
import { Star, Clock, CheckCircle, Zap, Users, Sparkles, } from 'lucide-react';
export function AssignDesignerModal({ open, onOpenChange, orderId, orderNumber, styleName, packageName, onSuccess, }) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [matches, setMatches] = useState([]);
    const [selectedDesigner, setSelectedDesigner] = useState(null);
    useEffect(() => {
        if (open && orderId) {
            fetchMatches();
        }
    }, [open, orderId]);
    const fetchMatches = async () => {
        try {
            setLoading(true);
            const results = await matchDesignersForOrder(orderId);
            setMatches(results);
        }
        catch (error) {
            console.error('Failed to fetch matches:', error);
            toast({
                title: 'Error loading designers',
                description: 'Could not fetch recommended designers',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleAutoAssign = async () => {
        if (matches.length === 0) {
            toast({
                title: 'No designers available',
                description: 'No designers are available for this order',
                variant: 'destructive',
            });
            return;
        }
        await handleAssign(matches[0].designer_id, 'auto');
    };
    const handleAssign = async (designerId, type = 'manual') => {
        try {
            setAssigning(true);
            const result = await assignDesignerToOrder(orderId, designerId, type);
            if (result.success) {
                toast({
                    title: 'Designer Assigned!',
                    description: 'The designer has been assigned and notified.',
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
                title: 'Assignment Failed',
                description: error.message || 'Could not assign designer',
                variant: 'destructive',
            });
        }
        finally {
            setAssigning(false);
        }
    };
    const getScoreBadgeColor = (score) => {
        if (score >= 90)
            return 'bg-green-100 text-green-700 border-green-300';
        if (score >= 80)
            return 'bg-blue-100 text-blue-700 border-blue-300';
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };
    const getExpertiseBadge = (level, isPrimary) => {
        const colors = {
            expert: 'bg-purple-100 text-purple-700',
            advanced: 'bg-blue-100 text-blue-700',
            intermediate: 'bg-gray-100 text-gray-700',
        };
        return (<div className="flex items-center gap-1">
        <Badge className={colors[level] || colors.intermediate}>
          {level}
        </Badge>
        {isPrimary && (<Star className="h-3 w-3 text-yellow-500 fill-yellow-500"/>)}
      </div>);
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Assign Designer to Order #{orderNumber}
          </DialogTitle>
          <DialogDescription>
            {styleName && packageName && (<span>
                <Badge variant="outline" className="mr-2">{styleName}</Badge>
                <Badge variant="secondary">{packageName}</Badge>
              </span>)}
          </DialogDescription>
        </DialogHeader>

        {loading ? (<div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/>
            <span className="ml-3 text-muted-foreground">Finding best matches...</span>
          </div>) : matches.length === 0 ? (<div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
            <h3 className="text-lg font-semibold mb-2">No Designers Available</h3>
            <p className="text-muted-foreground">
              All designers are currently at capacity. Please try again later.
            </p>
          </div>) : (<>
            {/* Auto-Assign Button */}
            <div className="mb-6">
              <Button onClick={handleAutoAssign} size="lg" className="w-full h-14 text-lg" disabled={assigning}>
                <Zap className="h-5 w-5 mr-2"/>
                {assigning ? 'Assigning...' : 'Auto-Assign Best Match'}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-2">
                Will assign {matches[0]?.designer_name} (Score: {matches[0]?.match_score})
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"/>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or select manually
                </span>
              </div>
            </div>

            {/* Designer Cards */}
            <div className="space-y-4">
              {matches.map((designer) => (<div key={designer.designer_id} className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedDesigner === designer.designer_id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'}`} onClick={() => setSelectedDesigner(designer.designer_id)}>
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-14 w-14">
                      <AvatarImage src=""/>
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {designer.designer_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {designer.designer_name}
                            {designer.is_primary_style && (<Sparkles className="h-4 w-4 text-yellow-500"/>)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getExpertiseBadge(designer.expertise_level, designer.is_primary_style)}
                          </div>
                        </div>
                        <Badge className={`text-lg px-3 py-1 ${getScoreBadgeColor(designer.match_score)}`}>
                          {designer.match_score}
                        </Badge>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Workload</p>
                          <div className="flex items-center gap-2">
                            <Progress value={designer.capacity_percentage} className="h-1.5 w-16"/>
                            <span className="text-xs font-medium">
                              {designer.active_projects}/{designer.max_projects}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500"/>
                            {designer.avg_rating.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Projects</p>
                          <p className="text-sm font-medium">{designer.total_projects}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Delivery</p>
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3"/>
                            {designer.avg_delivery_hours}h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assign Button */}
                    <Button variant={selectedDesigner === designer.designer_id ? 'default' : 'outline'} size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleAssign(designer.designer_id, 'manual');
                }} disabled={assigning}>
                      {assigning && selectedDesigner === designer.designer_id ? ('Assigning...') : (<>
                          <CheckCircle className="h-4 w-4 mr-1"/>
                          Assign
                        </>)}
                    </Button>
                  </div>
                </div>))}
            </div>
          </>)}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
