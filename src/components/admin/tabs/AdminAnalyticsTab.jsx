import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { DollarSign, Users, FolderKanban, Target, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight, Download, } from 'lucide-react';
import { appDataClient } from '@/lib/static-client';
export function AdminAnalyticsTab({ projects, onRefresh }) {
    const [timeRange, setTimeRange] = useState('30d');
    const [designerStats, setDesignerStats] = useState([]);
    const [reviewCount, setReviewCount] = useState(0);
    // Fetch real designer stats
    useEffect(() => {
        async function fetchDesignerStats() {
            const { data } = await appDataClient
                .from('designer_profiles')
                .select('id, display_name, projects_completed, rating, completion_rate')
                .eq('status', 'active')
                .order('projects_completed', { ascending: false })
                .limit(5);
            if (data) {
                setDesignerStats(data.map(d => ({
                    name: d.display_name,
                    projects: d.projects_completed || 0,
                    revenue: (d.projects_completed || 0) * 2000,
                    rating: d.rating || 0,
                    completionRate: d.completion_rate || 0,
                })));
            }
            const { count } = await appDataClient
                .from('designer_reviews')
                .select('*', { count: 'exact', head: true });
            setReviewCount(count || 0);
        }
        fetchDesignerStats();
    }, []);
    // Calculate analytics from real project data
    const totalRevenue = projects.reduce((sum, p) => sum + (p.total_paid || 0), 0);
    const completedProjects = projects.filter((p) => p.current_phase === 6).length;
    const activeProjects = projects.filter((p) => p.current_phase < 6).length;
    const avgProjectValue = projects.length > 0 ? totalRevenue / projects.length : 0;
    // Conversion funnel with real project count
    const funnelData = [
        { stage: 'Visitors', count: 5420, percentage: 100 },
        { stage: 'Quiz Started', count: 2100, percentage: 38.7 },
        { stage: 'Quiz Completed', count: 1450, percentage: 26.8 },
        { stage: 'Checkout Started', count: 680, percentage: 12.5 },
        { stage: 'Payment Complete', count: projects.length, percentage: projects.length > 0 ? (projects.length / 5420) * 100 : 0 },
        { stage: 'Project Complete', count: completedProjects, percentage: completedProjects > 0 ? (completedProjects / 5420) * 100 : 0 },
    ];
    // Room type distribution from real orders
    const roomCounts = {};
    projects.forEach(p => {
        const rooms = p.selected_rooms || [];
        rooms.forEach((r) => {
            roomCounts[r] = (roomCounts[r] || 0) + 1;
        });
    });
    const totalRooms = Object.values(roomCounts).reduce((a, b) => a + b, 0) || 1;
    const roomTypeStats = Object.entries(roomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalRooms) * 100),
    }));
    // Fallback if no room data
    const displayRoomStats = roomTypeStats.length > 0 ? roomTypeStats : [
        { type: 'Master Bedroom', count: 0, percentage: 0 },
        { type: 'Living Room', count: 0, percentage: 0 },
        { type: 'Kitchen', count: 0, percentage: 0 },
    ];
    return (<div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2"/>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={DollarSign} label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}k`} change="+12.5%" trend="up" color="emerald"/>
        <MetricCard icon={FolderKanban} label="Active Projects" value={activeProjects.toString()} change="+8.2%" trend="up" color="blue"/>
        <MetricCard icon={Users} label="New Customers" value={projects.length.toString()} change="+15.3%" trend="up" color="purple"/>
        <MetricCard icon={Target} label="Conversion Rate" value="4.2%" change="-0.5%" trend="down" color="amber"/>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Conversion Funnel</h3>
              <p className="text-sm text-muted-foreground">User journey analysis</p>
            </div>
            <Badge variant="secondary">
              <Activity className="h-3 w-3 mr-1"/>
              Live
            </Badge>
          </div>

          <div className="space-y-4">
            {funnelData.map((stage, idx) => (<div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{stage.count.toLocaleString()}</span>
                    <span className="font-medium">{stage.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stage.percentage}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 rounded-lg"/>
                </div>
              </div>))}
          </div>
        </Card>

        {/* Room Type Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Room Type Distribution</h3>
              <p className="text-sm text-muted-foreground">Projects by room type</p>
            </div>
            <PieChart className="h-5 w-5 text-muted-foreground"/>
          </div>

          <div className="space-y-4">
            {displayRoomStats.map((room) => (<div key={room.type} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium truncate">{room.type}</div>
                <div className="flex-1">
                  <Progress value={room.percentage} className="h-3"/>
                </div>
                <div className="w-16 text-right">
                  <span className="font-medium">{room.count}</span>
                  <span className="text-muted-foreground text-sm ml-1">({room.percentage}%)</span>
                </div>
              </div>))}
          </div>
        </Card>
      </div>

      {/* Designer Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Designer Performance</h3>
            <p className="text-sm text-muted-foreground">Top performing designers this period</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {designerStats.map((designer, idx) => (<motion.div key={designer.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-4 bg-muted/50 border-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-medium">
                    {designer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{designer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {designer.projects} projects
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">₹{(designer.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">{designer.rating} ★</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">On-time</span>
                    <span className="font-medium">{designer.completionRate}%</span>
                  </div>
                </div>
              </Card>
            </motion.div>))}
        </div>
      </Card>

      {/* Revenue Trend (Simplified) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">Daily revenue over time</p>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground"/>
        </div>

        <div className="h-48 flex items-end justify-between gap-2">
          {[65, 45, 78, 52, 90, 68, 82, 55, 95, 72, 88, 60, 75, 85].map((height, idx) => (<motion.div key={idx} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.5, delay: idx * 0.05 }} className="flex-1 bg-gradient-to-t from-primary to-primary/40 rounded-t-md"/>))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>14 days ago</span>
          <span>Today</span>
        </div>
      </Card>
    </div>);
}
function MetricCard({ icon: Icon, label, value, change, trend, color, }) {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
        amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    };
    return (<Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-5 w-5"/>
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? (<ArrowUpRight className="h-4 w-4"/>) : (<ArrowDownRight className="h-4 w-4"/>)}
          {change}
        </div>
      </div>
    </Card>);
}

