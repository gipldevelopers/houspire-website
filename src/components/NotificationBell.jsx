import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Zap, X, Check, } from 'lucide-react';
export function NotificationBell() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (user) {
            fetchNotifications();
            const cleanup = subscribeToNotifications();
            return cleanup;
        }
    }, [user]);
    const fetchNotifications = async () => {
        if (!user)
            return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('in_app_notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            if (error)
                throw error;
            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.read).length || 0);
        }
        catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const subscribeToNotifications = () => {
        if (!user)
            return () => { };
        const channel = supabase
            .channel('user-notifications')
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
        }, (payload) => {
            console.log('New notification:', payload);
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
        })
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
        }, (payload) => {
            setNotifications(prev => prev.map(n => (n.id === payload.new.id ? payload.new : n)));
            fetchNotifications();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    };
    const markAsRead = async (id) => {
        try {
            const { error } = await supabase.rpc('mark_notification_read', {
                p_notification_id: id,
            });
            if (error)
                throw error;
            setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };
    const markAllAsRead = async () => {
        try {
            const { error } = await supabase.rpc('mark_all_notifications_read');
            if (error)
                throw error;
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        }
        catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };
    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.action_url) {
            navigate(notification.action_url);
            setIsOpen(false);
        }
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600"/>;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600"/>;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600"/>;
            case 'update':
                return <Zap className="h-5 w-5 text-purple-600"/>;
            default:
                return <Info className="h-5 w-5 text-blue-600"/>;
        }
    };
    const getNotificationBg = (type, read) => {
        if (read)
            return 'bg-muted/50';
        switch (type) {
            case 'success':
                return 'bg-green-50';
            case 'warning':
                return 'bg-yellow-50';
            case 'error':
                return 'bg-red-50';
            case 'update':
                return 'bg-purple-50';
            default:
                return 'bg-blue-50';
        }
    };
    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60)
            return 'Just now';
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400)
            return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };
    if (!user)
        return null;
    return (<div className="relative">
      {/* Bell Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 hover:bg-accent rounded-full transition-colors">
        <Bell className="h-5 w-5 text-foreground/70"/>
        {unreadCount > 0 && (<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>)}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (<>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}/>

            {/* Dropdown */}
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-80 sm:w-96 z-50">
              <Card className="shadow-lg border overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (<Button onClick={markAllAsRead} size="sm" variant="ghost" className="text-xs h-8">
                        <Check className="h-3 w-3 mr-1"/>
                        Mark all read
                      </Button>)}
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-accent rounded">
                      <X className="h-4 w-4 text-muted-foreground"/>
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {loading ? (<div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
                    </div>) : notifications.length === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mb-2 opacity-50"/>
                      <p className="text-sm">No notifications yet</p>
                    </div>) : (<div className="divide-y">
                      {notifications.map((notification) => (<div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${getNotificationBg(notification.type, notification.read)}`}>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (<span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1.5"/>)}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(notification.created_at)}
                              </p>
                              {notification.action_text && (<span className="text-xs text-primary font-medium mt-1 inline-block">
                                  {notification.action_text} →
                                </span>)}
                            </div>
                          </div>
                        </div>))}
                    </div>)}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (<div className="p-3 border-t bg-muted/30">
                    <Button onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                }} size="sm" variant="ghost" className="w-full text-xs">
                      View all notifications
                    </Button>
                  </div>)}
              </Card>
            </motion.div>
          </>)}
      </AnimatePresence>
    </div>);
}
