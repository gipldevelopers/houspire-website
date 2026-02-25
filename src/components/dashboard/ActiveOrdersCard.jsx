'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Rocket,
  ArrowRight,
  Calendar,
  MessageCircle,
  Upload, 
  CheckCircle,
  Clock,
  Paintbrush,
  Eye,
} from 'lucide-react';

export function ActiveOrdersCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActiveOrders();
    }
  }, [user]);

  const fetchActiveOrders = async () => {
    try {
      const data = await apiGet('/api/orders?status=paid,in_progress,design_ready,revision_requested&limit=5');
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch active orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (order) => {
    switch (order.status) {
      case 'paid':
        return {
          label: 'Getting Started',
          icon: <Rocket className="h-4 w-4" />,
          className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          description: !order.discovery_call_scheduled 
            ? 'Schedule your discovery call'
            : !order.floor_plan_url 
              ? 'Upload your floor plan'
              : 'Waiting for design to start',
          action: !order.discovery_call_scheduled 
            ? { label: 'Schedule Call', icon: <Calendar className="h-4 w-4" /> }
            : !order.floor_plan_url
              ? { label: 'Upload Files', icon: <Upload className="h-4 w-4" /> }
              : { label: 'View Order', icon: <ArrowRight className="h-4 w-4" /> },
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: <Paintbrush className="h-4 w-4" />,
          className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          description: 'Your designer is working on your project',
          action: { label: 'View Progress', icon: <Eye className="h-4 w-4" /> },
        };
      case 'design_ready':
        return {
          label: 'Design Ready',
          icon: <CheckCircle className="h-4 w-4" />,
          className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
          description: 'Your designs are ready for review',
          action: { label: 'Review Designs', icon: <Eye className="h-4 w-4" /> },
        };
      case 'revision_requested':
        return {
          label: 'Revision',
          icon: <MessageCircle className="h-4 w-4" />,
          className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
          description: 'Your designer is working on revisions',
          action: { label: 'View Status', icon: <Clock className="h-4 w-4" /> },
        };
      default:
        return {
          label: order.status,
          icon: <Clock className="h-4 w-4" />,
          className: 'bg-muted text-muted-foreground',
          description: 'Processing your order',
          action: { label: 'View Order', icon: <ArrowRight className="h-4 w-4" /> },
        };
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Active Orders</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {orders.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order);
          return (
            <div
              key={order.id}
              className="p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-foreground">
                      {order.package_name || 'Design Package'}
                    </p>
                    <Badge className={`text-xs ${statusInfo.className}`}>
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {statusInfo.description}
                  </p>
                  {order.style_name && (
                    <p className="text-xs text-muted-foreground">
                      Style: {order.style_name}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (statusInfo.action.label === 'Schedule Call') {
                      router.push(`/order/${order.id}?action=schedule`);
                    } else if (statusInfo.action.label === 'Upload Files') {
                      router.push(`/order/${order.id}?action=upload`);
                    } else {
                      router.push(`/order/${order.id}`);
                    }
                  }}
                  className="flex-shrink-0"
                >
                  {statusInfo.action.icon}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length > 0 && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => router.push('/dashboard/orders')}
        >
          View All Orders
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </Card>
  );
}
