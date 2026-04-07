import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, Check, AlertCircle, Info, CheckCircle2, AlertTriangle, Clock, Settings, Trash2, } from 'lucide-react';
export function NotificationCenter() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        if (user) {
            fetchNotifications();
            const cleanup = subscribeToNotifications();
            return cleanup;
        }
    }, [user]);
    const fetchNotifications = async () => {
        try {
            const { data, error } = await appDataClient.rpc('get_grouped_notifications', {
                p_user_id: user?.id,
                p_limit: 50,
            });
            if (error)
                throw error;
            // Map the data to the correct type
            const mappedData = (data || []).map((item) => ({
                group_key: item.group_key,
                notification_ids: item.notification_ids,
                latest_notification: item.latest_notification,
                count: item.count,
                priority: item.priority,
                has_unread: item.has_unread
            }));
            setNotifications(mappedData);
            // Calculate unread count
            const unread = mappedData.reduce((sum, n) => sum + (n.has_unread ? n.count : 0), 0);
            setUnreadCount(unread);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to load notifications',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const subscribeToNotifications = () => {
        const channel = appDataClient
            .channel(`notifications-${user?.id}`)
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user?.id}`,
        }, () => {
            fetchNotifications();
        })
            .subscribe();
        return () => {
            appDataClient.removeChannel(channel);
        };
    };
    const handleMarkGroupRead = async (groupKey) => {
        try {
            const { error } = await appDataClient.rpc('mark_notification_group_read', {
                p_group_key: groupKey,
            });
            if (error)
                throw error;
            fetchNotifications();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to mark as read',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };
    const handleMarkAllRead = async () => {
        try {
            const { error } = await appDataClient.rpc('mark_all_notifications_read');
            if (error)
                throw error;
            fetchNotifications();
            toast({
                title: 'All marked as read! ✓',
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to mark all as read',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };
    const handleDeleteGroup = async (groupKey) => {
        if (!confirm('Delete these notifications?'))
            return;
        try {
            const group = notifications.find((n) => n.group_key === groupKey);
            if (!group)
                return;
            const { error } = await appDataClient
                .from('in_app_notifications')
                .delete()
                .in('id', group.notification_ids);
            if (error)
                throw error;
            fetchNotifications();
            toast({
                title: 'Notifications deleted',
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to delete',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };
    const handleSnooze = async (notificationId, hours) => {
        try {
            const snoozeUntil = new Date();
            snoozeUntil.setHours(snoozeUntil.getHours() + hours);
            const { error } = await appDataClient.rpc('snooze_notification', {
                p_notification_id: notificationId,
                p_snooze_until: snoozeUntil.toISOString(),
            });
            if (error)
                throw error;
            fetchNotifications();
            toast({
                title: `Snoozed for ${hours} hour${hours !== 1 ? 's' : ''}`,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast({
                title: 'Failed to snooze',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };
    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'urgent':
                return <AlertCircle className="h-5 w-5 text-red-600"/>;
            case 'high':
                return <AlertTriangle className="h-5 w-5 text-orange-600"/>;
            case 'normal':
                return <Info className="h-5 w-5 text-blue-600"/>;
            default:
                return <CheckCircle2 className="h-5 w-5 text-muted-foreground"/>;
        }
    };
    const getPriorityBadge = (priority) => {
        const styles = {
            urgent: 'bg-red-100 text-red-700 border-red-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            normal: 'bg-blue-100 text-blue-700 border-blue-200',
            low: 'bg-muted text-muted-foreground border-border',
        };
        return (<Badge variant="outline" className={`text-xs ${styles[priority] || styles.normal}`}>
        {priority}
      </Badge>);
    };
    const filterNotifications = (priority) => {
        if (!priority)
            return notifications;
        return notifications.filter((n) => n.latest_notification.priority === priority);
    };
    const filteredNotifications = activeTab === 'all'
        ? notifications
        : activeTab === 'unread'
            ? notifications.filter((n) => n.has_unread)
            : filterNotifications(activeTab);
    if (loading) {
        return (<Card className="p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </Card>);
    }
    return (<Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-5 w-5 text-primary"/>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                Notifications
              </h2>
              {unreadCount > 0 && (<p className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </p>)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleMarkAllRead} variant="outline" size="sm" disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2"/>
              Mark all read
            </Button>
            <Button onClick={() => window.location.href = '/notification-settings'} variant="ghost" size="sm">
              <Settings className="h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              Urgent ({filterNotifications('urgent').length})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs">
              High ({filterNotifications('high').length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Notifications List */}
        <TabsContent value={activeTab} className="mt-0">
          {filteredNotifications.length === 0 ? (<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50"/>
              <p className="font-medium">No notifications</p>
            </div>) : (<div className="divide-y max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {filteredNotifications.map((group, index) => {
                const notif = group.latest_notification;
                return (<motion.div key={group.group_key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ delay: index * 0.05 }} className={`p-4 hover:bg-accent/50 transition-colors ${group.has_unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {getPriorityIcon(notif.priority)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-medium text-foreground ${group.has_unread ? 'font-semibold' : ''}`}>
                                {notif.title}
                              </p>
                              {group.count > 1 && (<Badge variant="secondary" className="text-xs">
                                  {group.count} items
                                </Badge>)}
                              {getPriorityBadge(notif.priority)}
                            </div>

                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button onClick={() => handleMarkGroupRead(group.group_key)} variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={!group.has_unread}>
                                <Check className="h-4 w-4"/>
                              </Button>
                              <Button onClick={() => handleDeleteGroup(group.group_key)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4"/>
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>

                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notif.created_at).toLocaleString()}
                            </span>

                            {notif.action_url && (<Button onClick={() => window.location.href = notif.action_url} variant="outline" size="sm" className="h-7 text-xs">
                                {notif.action_text || 'View'}
                              </Button>)}

                            <div className="flex items-center gap-1">
                              <Button onClick={() => handleSnooze(group.notification_ids[0], 1)} variant="ghost" size="sm" className="h-7 text-xs">
                                <Clock className="h-3 w-3 mr-1"/>
                                1h
                              </Button>
                              <Button onClick={() => handleSnooze(group.notification_ids[0], 24)} variant="ghost" size="sm" className="h-7 text-xs">
                                1d
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>);
            })}
              </AnimatePresence>
            </div>)}
        </TabsContent>
      </Tabs>
    </Card>);
}

