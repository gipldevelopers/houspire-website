'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { dataGet } from '@/lib/frontend-data';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calculator,
  ArrowRight,
  Loader2
} from 'lucide-react';

const CATEGORY_COLORS = {
  Furniture: 'hsl(var(--chart-1))',
  Materials: 'hsl(var(--chart-2))',
  Labor: 'hsl(var(--chart-3))',
  Decor: 'hsl(var(--chart-4))',
  Other: 'hsl(var(--chart-5))',
};

export function ProjectBudgetTab({ project }) {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBudgetData();
  }, [project.id]);

  const fetchBudgetData = async () => {
    try {
      const data = await dataGet(`/projects/${project.id}/budget`);
      setBudgetData(data || []);
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Calculate totals
  const totalBudgeted = budgetData.reduce((sum, b) => sum + b.budgeted_amount, 0);
  const totalActual = budgetData.reduce((sum, b) => sum + (b.actual_amount || 0), 0);
  const totalVariance = totalBudgeted - totalActual;
  const variancePercent = totalBudgeted > 0 ? ((totalVariance / totalBudgeted) * 100) : 0;
  const isOverBudget = totalActual > totalBudgeted;

  // Prepare chart data
  const chartData = budgetData.map(b => ({
    name: b.category,
    value: b.budgeted_amount,
    actual: b.actual_amount || 0,
  }));

  // If no budget data, show empty state with sample data
  const displayData = budgetData.length > 0 ? budgetData : [
    { id: '1', category: 'Furniture', budgeted_amount: 100000, actual_amount: null, variance: null, variance_percentage: null },
    { id: '2', category: 'Materials', budgeted_amount: 75000, actual_amount: null, variance: null, variance_percentage: null },
    { id: '3', category: 'Labor', budgeted_amount: 50000, actual_amount: null, variance: null, variance_percentage: null },
    { id: '4', category: 'Decor', budgeted_amount: 25000, actual_amount: null, variance: null, variance_percentage: null },
  ];

  const displayChartData = displayData.map(b => ({
    name: b.category,
    value: b.budgeted_amount,
    actual: b.actual_amount || 0,
  }));

  const displayTotalBudgeted = displayData.reduce((sum, b) => sum + b.budgeted_amount, 0);

  return (
    <div className="space-y-6">
      {/* Budget Summary Card */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            ₹{displayTotalBudgeted.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center gap-2 mb-2">
            {isOverBudget ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-success" />
            )}
            <span className="text-sm text-muted-foreground">Spent</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">
            ₹{totalActual.toLocaleString()}
          </p>
          {totalActual > 0 && (
            <Badge 
              className={`mt-1 ${isOverBudget ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'} border-0`}
            >
              {isOverBudget ? `${Math.abs(variancePercent).toFixed(0)}% over` : `${variancePercent.toFixed(0)}% under`}
            </Badge>
          )}
        </Card>
      </div>

      {/* Pie Chart */}
      <Card className="p-4 border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-4">Budget Distribution</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {displayChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Other}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Category Breakdown
        </h4>
        {displayData.map((item, idx) => {
          const spent = item.actual_amount || 0;
          const progress = item.budgeted_amount > 0 ? (spent / item.budgeted_amount) * 100 : 0;
          const isOver = spent > item.budgeted_amount;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl border border-border/50 bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other }}
                  />
                  <span className="font-medium text-foreground">{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    ₹{spent.toLocaleString()} / ₹{item.budgeted_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <Progress 
                value={Math.min(progress, 100)} 
                className={`h-2 ${isOver ? '[&>div]:bg-destructive' : ''}`}
              />
              {isOver && (
                <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Over by ₹{(spent - item.budgeted_amount).toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Health Indicator */}
      <Card className={`p-4 ${isOverBudget ? 'bg-destructive/5 border-destructive/20' : 'bg-success/5 border-success/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOverBudget ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <TrendingUp className="h-5 w-5 text-success" />
            )}
            <div>
              <p className="font-medium text-foreground">
                {isOverBudget ? 'Budget Alert' : 'Budget Healthy'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOverBudget 
                  ? `You're ₹${Math.abs(totalVariance).toLocaleString()} over budget`
                  : `You have ₹${totalVariance.toLocaleString()} remaining`
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Link to Full Calculator */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push('/budget-calculator')}
      >
        <Calculator className="h-4 w-4 mr-2" />
        Open Budget Calculator
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}


