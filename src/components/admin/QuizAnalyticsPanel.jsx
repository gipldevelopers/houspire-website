import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { appDataClient } from '@/lib/static-client';
import { Loader2, TrendingUp, Users, Award, DollarSign } from 'lucide-react';
export function QuizAnalyticsPanel() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchAnalytics();
    }, []);
    const fetchAnalytics = async () => {
        try {
            const { data, error } = await appDataClient.rpc('get_quiz_analytics_summary', {
                p_days: 30,
            });
            if (error)
                throw error;
            if (data && data.length > 0) {
                setAnalytics(data[0]);
            }
        }
        catch (error) {
            console.error('Failed to fetch quiz analytics:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const formatStyleName = (style) => {
        if (!style)
            return 'N/A';
        return style.replace(/_/g, ' ').split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };
    const formatBudget = (budget) => {
        if (!budget)
            return 'N/A';
        switch (budget) {
            case 'budget': return '₹50k - ₹1.5L';
            case 'mid_range': return '₹1.5L - ₹3.5L';
            case 'premium': return '₹3.5L - ₹8L+';
            default: return budget.replace(/_/g, ' ');
        }
    };
    if (loading) {
        return (<div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
        <span className="ml-2 text-muted-foreground">Loading analytics...</span>
      </div>);
    }
    const stats = [
        {
            title: 'Total Completions',
            value: analytics?.total_completions?.toString() || '0',
            icon: Users,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Top Style',
            value: formatStyleName(analytics?.most_popular_style),
            icon: Award,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Top Room',
            value: formatStyleName(analytics?.most_popular_room_type),
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Avg Budget',
            value: formatBudget(analytics?.avg_budget_range),
            icon: DollarSign,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
        },
    ];
    return (<div className="space-y-6">
      <h3 className="text-lg font-semibold">Quiz Analytics (Last 30 Days)</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (<Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`}/>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>

      {analytics?.completion_trend && Object.keys(analytics.completion_trend).length > 0 && (<Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-24">
              {Object.entries(analytics.completion_trend)
                .slice(-14) // Last 14 days
                .map(([date, count]) => {
                const maxCount = Math.max(...Object.values(analytics.completion_trend));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (<div key={date} className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors" style={{ height: `${Math.max(height, 5)}%` }} title={`${date}: ${count} completions`}/>);
            })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>14 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>)}
    </div>);
}

