'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Clock, ArrowRight, ShoppingBag } from 'lucide-react';

export function PendingOrdersCard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPendingOrders();
    }
  }, [user]);

  const fetchPendingOrders = async () => {
    try {
      const data = await apiGet('/api/orders?status=payment_pending,pending&limit=5');
      
      // Deduplicate accidental duplicate payment attempts (keep newest per status+package)
      const deduped = [];
      const seen = new Set();
      for (const o of data || []) {
        const key = `${o.status}:${o.package_name || ''}`;
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(o);
      }

      setOrders(deduped);
    } catch (error) {
      console.error('Failed to fetch pending orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'payment_pending':
        return {
          label: 'Payment Pending',
          icon: <CreditCard className="h-4 w-4" />,
          className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        };
      case 'pending':
        return {
          label: 'Processing',
          icon: <Clock className="h-4 w-4" />,
          className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
      default:
        return {
          label: status,
          icon: <Clock className="h-4 w-4" />,
          className: 'bg-muted text-muted-foreground'
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
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
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
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Pending Orders</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {orders.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
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
                  <p className="text-xs text-muted-foreground">
                    Order #{order.order_number}
                  </p>
                  {order.final_price && (
                    <p className="text-sm font-medium text-foreground mt-1">
                      ₹{order.final_price.toLocaleString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/order/${order.id}`)}
                  className="flex-shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
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
