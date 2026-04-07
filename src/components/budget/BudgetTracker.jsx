import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Edit, AlertCircle, CheckCircle2, } from 'lucide-react';
export function BudgetTracker({ projectId }) {
    const { toast } = useToast();
    const [actuals, setActuals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [healthData, setHealthData] = useState(null);
    useEffect(() => {
        fetchBudgetActuals();
        checkBudgetHealth();
    }, [projectId]);
    const fetchBudgetActuals = async () => {
        try {
            const { data, error } = await appDataClient
                .from('budget_actuals')
                .select('*')
                .eq('project_id', projectId)
                .order('category', { ascending: true });
            if (error)
                throw error;
            setActuals(data || []);
        }
        catch (error) {
            toast({
                title: 'Failed to load budget tracking',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const checkBudgetHealth = async () => {
        try {
            const { data, error } = await appDataClient.rpc('check_budget_health', {
                p_project_id: projectId,
            });
            if (error)
                throw error;
            if (data && data.length > 0) {
                setHealthData(data[0]);
            }
        }
        catch (error) {
            console.error('Failed to check budget health:', error);
        }
    };
    const handleStartEdit = (category) => {
        setEditingCategory(category.category);
        setEditAmount(category.actual_amount.toString());
        setEditNotes(category.notes || '');
    };
    const handleSaveEdit = async () => {
        if (!editingCategory)
            return;
        setSaving(true);
        try {
            const { error } = await appDataClient.rpc('update_budget_actual', {
                p_project_id: projectId,
                p_category: editingCategory,
                p_actual_amount: parseFloat(editAmount),
                p_notes: editNotes || null,
            });
            if (error)
                throw error;
            toast({
                title: 'Updated! 💰',
                description: 'Budget tracking updated',
            });
            setEditingCategory(null);
            setEditAmount('');
            setEditNotes('');
            fetchBudgetActuals();
            checkBudgetHealth();
        }
        catch (error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSaving(false);
        }
    };
    const getStatusColor = (variancePercentage) => {
        if (variancePercentage > 10)
            return 'text-red-600';
        if (variancePercentage > 5)
            return 'text-orange-600';
        if (variancePercentage < -5)
            return 'text-green-600';
        return 'text-muted-foreground';
    };
    const getStatusBadge = (status) => {
        const styles = {
            on_track: 'bg-green-100 text-green-700 border-green-200',
            approaching_limit: 'bg-orange-100 text-orange-700 border-orange-200',
            over_budget: 'bg-red-100 text-red-700 border-red-200',
        };
        const icons = {
            on_track: CheckCircle2,
            approaching_limit: AlertCircle,
            over_budget: AlertCircle,
        };
        const labels = {
            on_track: 'On Track',
            approaching_limit: 'Approaching Limit',
            over_budget: 'Over Budget',
        };
        const Icon = icons[status] || CheckCircle2;
        return (<Badge className={`${styles[status] || styles.on_track} gap-1`}>
        <Icon className="h-3 w-3"/>
        {labels[status] || 'On Track'}
      </Badge>);
    };
    if (loading) {
        return (<Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded animate-pulse"/>
          <div className="h-20 bg-muted rounded animate-pulse"/>
        </div>
      </Card>);
    }
    if (actuals.length === 0) {
        return (<Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No budget tracking data available</p>
          <p className="text-sm text-muted-foreground mt-1">Budget tracking will appear once your project budget is set</p>
        </div>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Budget Health Overview */}
      {healthData && (<Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">
                Budget Health
              </h3>
              <p className="text-sm text-muted-foreground">Track spending vs budget</p>
            </div>

            {getStatusBadge(healthData.status)}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Budgeted</p>
              <p className="text-lg font-bold text-foreground">
                ₹{healthData.total_budgeted.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Total Actual</p>
              <p className="text-lg font-bold text-foreground">
                ₹{healthData.total_actual.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Variance</p>
              <p className={`text-lg font-bold ${healthData.total_variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {healthData.total_variance > 0 ? '+' : ''}₹
                {Math.abs(healthData.total_variance).toLocaleString()}
              </p>
              <p className={`text-xs ${healthData.variance_percentage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {healthData.variance_percentage > 0 ? '+' : ''}
                {healthData.variance_percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>)}

      {/* Category Tracking */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Category Breakdown
        </h3>

        <div className="space-y-6">
          {actuals.map((actual, index) => (<motion.div key={actual.category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">
                    {actual.category}
                  </p>

                  <div className="flex items-center gap-4 text-sm mt-1">
                    <span className="text-muted-foreground">
                      Budget: 
                      <span className="font-medium text-foreground ml-1">
                        ₹{actual.budgeted_amount.toLocaleString()}
                      </span>
                    </span>

                    <span className="text-muted-foreground">
                      Actual: 
                      <span className="font-medium text-foreground ml-1">
                        ₹{actual.actual_amount.toLocaleString()}
                      </span>
                    </span>

                    <span className={getStatusColor(actual.variance_percentage)}>
                      {actual.variance > 0 ? (<TrendingUp className="h-3 w-3 inline mr-1"/>) : (<TrendingDown className="h-3 w-3 inline mr-1"/>)}
                      <span className="font-medium">
                        {actual.variance > 0 ? '+' : ''}₹
                        {Math.abs(actual.variance).toLocaleString()}
                      </span>
                      <span className="ml-1">
                        ({actual.variance_percentage > 0 ? '+' : ''}
                        {actual.variance_percentage.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                </div>

                {editingCategory !== actual.category && (<Button onClick={() => handleStartEdit(actual)} variant="ghost" size="sm">
                    <Edit className="h-4 w-4"/>
                  </Button>)}
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <Progress value={Math.min((actual.actual_amount / actual.budgeted_amount) * 100, 100)} className="h-2"/>
              </div>

              {/* Edit Mode */}
              {editingCategory === actual.category ? (<div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      Actual Amount Spent
                    </label>
                    <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-9"/>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      Notes (Optional)
                    </label>
                    <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} className="text-sm"/>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} disabled={saving} size="sm" className="flex-1">
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={() => {
                    setEditingCategory(null);
                    setEditAmount('');
                    setEditNotes('');
                }} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>) : (actual.notes && (<p className="text-sm text-muted-foreground italic">
                    Note: {actual.notes}
                  </p>))}
            </motion.div>))}
        </div>
      </Card>
    </div>);
}

