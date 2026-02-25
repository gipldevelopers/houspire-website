'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Radio,
  CheckCircle2,
  Clock,
  Package,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export function LiveTrackingBanner() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const fetchActiveOrders = useCallback(async () => {
    if (!user) return;

    try {
      const orderData = await apiGet('/api/orders?status=paid,in_progress,design_ready,revision_requested&limit=3');

      if (!orderData || orderData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Fetch milestone counts for each order
      const tracked = await Promise.all(
        orderData.map(async (order) => {
          // Note: This would need an API endpoint for milestone counts
          // For now, we'll use placeholder values
          const milestoneData = await apiGet(`/api/orders/${order.id}/milestones`).catch(() => ({ total: 0, completed: 0 }));
          
          return {
            id: order.id,
            status: order.status || 'pending',
            room_type: null,
            package_name: order.package_name,
            created_at: order.created_at,
            updated_at: order.updated_at,
            milestone_count: milestoneData.total || 0,
            completed_milestones: milestoneData.completed || 0,
          };
        })
      );

      setOrders(tracked);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchActiveOrders();

    // Poll for updates every 30 seconds (replacing real-time subscription)
    const interval = setInterval(() => {
      fetchActiveOrders();
    }, 30000);

    setIsLive(true);

    return () => {
      clearInterval(interval);
      setIsLive(false);
    };
  }, [user, fetchActiveOrders]);

  if (loading) {
    return (
      <Card className="p-4 border-border/50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (orders.length === 0) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-blue-500';
      case 'in_progress': return 'text-amber-500';
      case 'design_ready': return 'text-emerald-500';
      case 'revision_requested': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Processing';
      case 'in_progress': return 'Designing';
      case 'design_ready': return 'Ready for Review';
      case 'revision_requested': return 'Revising';
      default: return status;
    }
  };

  return (
    <Card className="border-border/50 overflow-hidden">
      {/* Live indicator header */}
      <div className="px-4 py-2.5 bg-muted/50 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Radio className="h-4 w-4 text-emerald-500" />
            {isLive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/30"
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <span className="text-sm font-medium text-foreground">Live Tracking</span>
          {isLive && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-0">
              LIVE
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {orders.length} active order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Order tracking cards */}
      <div className="divide-y divide-border/50">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => {
            const progress = order.milestone_count > 0
              ? Math.round((order.completed_milestones / order.milestone_count) * 100)
              : 0;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/orders/${order.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Status icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    order.status === 'design_ready' 
                      ? 'bg-emerald-500/10' 
                      : order.status === 'in_progress' 
                        ? 'bg-amber-500/10' 
                        : 'bg-blue-500/10'
                  }`}>
                    {order.status === 'design_ready' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : order.status === 'in_progress' ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                        <Loader2 className="h-5 w-5 text-amber-500" />
                      </motion.div>
                    ) : (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {order.package_name || order.room_type?.replace(/_/g, ' ') || 'Design Order'}
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border-0 ${getStatusColor(order.status)} bg-current/10`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">{progress}%</span>
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-1">
                      Updated {formatDistanceToNow(new Date(order.updated_at || order.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
