import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingDown, TrendingUp, Settings2, AlertTriangle, } from 'lucide-react';
export function BudgetAdjustmentTool({ projectId, currentBudget, categories, onSuccess, }) {
    const { toast } = useToast();
    const [adjustmentType, setAdjustmentType] = useState('decrease');
    const [targetBudget, setTargetBudget] = useState(currentBudget);
    const [adjustedCategories, setAdjustedCategories] = useState(categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.current }), {}));
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const adjustmentAmount = targetBudget - currentBudget;
    const adjustmentPercentage = currentBudget > 0 ? (adjustmentAmount / currentBudget) * 100 : 0;
    const handleQuickAdjustment = (percentage) => {
        const newBudget = currentBudget * (1 + percentage / 100);
        setTargetBudget(Math.round(newBudget));
        const newCategories = {};
        categories.forEach((cat) => {
            newCategories[cat.name] = Math.round(cat.current * (1 + percentage / 100));
        });
        setAdjustedCategories(newCategories);
    };
    const handleCategoryAdjustment = (categoryName, value) => {
        setAdjustedCategories({
            ...adjustedCategories,
            [categoryName]: value,
        });
        const newTotal = Object.values({
            ...adjustedCategories,
            [categoryName]: value,
        }).reduce((sum, val) => sum + val, 0);
        setTargetBudget(newTotal);
    };
    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast({
                title: 'Reason required',
                description: 'Please explain why you need this adjustment',
                variant: 'destructive',
            });
            return;
        }
        setSubmitting(true);
        try {
            const affectedCategories = {};
            categories.forEach((cat) => {
                const change = adjustedCategories[cat.name] - cat.current;
                if (change !== 0) {
                    affectedCategories[cat.name] = change;
                }
            });
            const { error } = await supabase.rpc('request_budget_adjustment', {
                p_project_id: projectId,
                p_adjustment_type: adjustmentType,
                p_new_amount: targetBudget,
                p_reason: reason,
                p_affected_categories: affectedCategories,
            });
            if (error)
                throw error;
            toast({
                title: 'Adjustment requested! 📊',
                description: 'Our team will review your request',
            });
            onSuccess();
        }
        catch (error) {
            toast({
                title: 'Request failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Budget Adjustment Tool
          </h3>
          <p className="text-sm text-muted-foreground">
            Adjust your budget and see how it affects each category
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Current Budget</p>
          <p className="text-xl font-bold text-foreground">
            ₹{currentBudget.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Adjustment Type */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => {
            setAdjustmentType('decrease');
            handleQuickAdjustment(-10);
        }} className={`p-4 rounded-xl border-2 transition-all ${adjustmentType === 'decrease'
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-muted-foreground/30'}`}>
          <TrendingDown className="h-6 w-6 mx-auto mb-2 text-primary"/>
          <p className="font-medium text-sm text-foreground">Reduce Budget</p>
          <p className="text-xs text-muted-foreground">Save money</p>
        </button>

        <button onClick={() => {
            setAdjustmentType('increase');
            handleQuickAdjustment(10);
        }} className={`p-4 rounded-xl border-2 transition-all ${adjustmentType === 'increase'
            ? 'border-green-600 bg-green-50'
            : 'border-border hover:border-muted-foreground/30'}`}>
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600"/>
          <p className="font-medium text-sm text-foreground">Increase Budget</p>
          <p className="text-xs text-muted-foreground">Add premium items</p>
        </button>

        <button onClick={() => {
            setAdjustmentType('optimize');
            handleQuickAdjustment(0);
        }} className={`p-4 rounded-xl border-2 transition-all ${adjustmentType === 'optimize'
            ? 'border-purple-600 bg-purple-50'
            : 'border-border hover:border-muted-foreground/30'}`}>
          <Settings2 className="h-6 w-6 mx-auto mb-2 text-purple-600"/>
          <p className="font-medium text-sm text-foreground">Optimize</p>
          <p className="text-xs text-muted-foreground">Better allocation</p>
        </button>
      </div>

      {/* Quick Adjustments */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3">
          Quick Adjustments
        </p>
        <div className="flex gap-2">
          {[-20, -10, -5, 5, 10, 20].map((pct) => (<Button key={pct} onClick={() => handleQuickAdjustment(pct)} variant="outline" size="sm" className="flex-1">
              {pct > 0 ? '+' : ''}
              {pct}%
            </Button>))}
        </div>
      </div>

      {/* Target Budget */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            New Budget Target
          </label>
          <div className="text-right">
            <p className="font-bold text-foreground">
              ₹{targetBudget.toLocaleString()}
            </p>
            <p className={`text-xs ${adjustmentAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {adjustmentAmount > 0 ? '+' : ''}₹{Math.abs(adjustmentAmount).toLocaleString()}{' '}
              ({adjustmentPercentage > 0 ? '+' : ''}
              {adjustmentPercentage.toFixed(1)}%)
            </p>
          </div>
        </div>

        <Input type="number" value={targetBudget} onChange={(e) => setTargetBudget(parseInt(e.target.value) || 0)} className="h-12 text-lg font-semibold"/>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-4">
          Adjust by Category
        </p>

        {categories.map((category) => {
            const current = category.current;
            const adjusted = adjustedCategories[category.name] || current;
            const change = adjusted - current;
            const changePercentage = current > 0 ? (change / current) * 100 : 0;
            return (<div key={category.name} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    ₹{adjusted.toLocaleString()}
                  </span>
                  {change !== 0 && (<span className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change > 0 ? '+' : ''}₹{Math.abs(change).toLocaleString()}
                    </span>)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Slider value={[adjusted]} onValueChange={([value]) => handleCategoryAdjustment(category.name, value)} min={Math.round(current * 0.5)} max={Math.round(current * 1.5)} step={1000} className="flex-1"/>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹{Math.round(current * 0.5).toLocaleString()}</span>
                <span>₹{current.toLocaleString()} (current)</span>
                <span>₹{Math.round(current * 1.5).toLocaleString()}</span>
              </div>
            </div>);
        })}
      </div>

      {/* Warning if large change */}
      {Math.abs(adjustmentPercentage) > 20 && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="font-medium text-amber-800">
                  Large Budget Change
                </p>
                <p className="text-sm text-amber-700">
                  You're requesting a {Math.abs(adjustmentPercentage).toFixed(1)}% change.
                  This may require significant design modifications.
                </p>
              </div>
            </div>
          </div>
        </motion.div>)}

      {/* Reason */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Reason for Adjustment *
        </label>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why you need this budget adjustment..." rows={4}/>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Button onClick={handleSubmit} disabled={submitting || !reason.trim()} className="flex-1 h-12">
          {submitting ? (<>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"/>
              Submitting...
            </>) : (<>
              <DollarSign className="h-5 w-5 mr-2"/>
              Request Adjustment
            </>)}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Budget adjustments are reviewed by our team within 24 hours
      </p>
    </Card>);
}
