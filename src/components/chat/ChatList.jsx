import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatRooms, getAllChatRooms, getOrCreateChatRoom, getOrCreateChatRoomForOrder } from '@/lib/chat-service';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, FolderOpen, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { appDataClient } from '@/lib/static-client';
import { useToast } from '@/hooks/use-toast';
export function ChatList({ isAdmin = false, onSelectRoom, selectedRoomId, className }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [rooms, setRooms] = useState([]);
    const [orders, setOrders] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingRoom, setCreatingRoom] = useState(null);
    useEffect(() => {
        loadData();
    }, [isAdmin]);
    async function loadData() {
        setLoading(true);
        try {
            const [roomsData, ordersData, projectsData] = await Promise.all([
                isAdmin ? getAllChatRooms() : getChatRooms(),
                loadOrders(),
                loadProjects()
            ]);
            setRooms(roomsData);
            setOrders(ordersData);
            setProjects(projectsData);
        }
        catch (error) {
            console.error('Error loading data:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function loadOrders() {
        if (isAdmin)
            return [];
        const { data: { user: currentUser } } = await appDataClient.auth.getUser();
        if (!currentUser)
            return [];
        const { data } = await appDataClient
            .from('orders')
            .select('id, order_number, package_name, status, design_files')
            .eq('user_id', currentUser.id)
            .in('status', ['paid', 'in_progress', 'design_ready', 'revision_requested'])
            .order('created_at', { ascending: false });
        return (data || []);
    }
    async function loadProjects() {
        if (isAdmin)
            return [];
        const { data: { user: currentUser } } = await appDataClient.auth.getUser();
        if (!currentUser)
            return [];
        const { data } = await appDataClient
            .from('projects')
            .select('id, room_type, designer_persona, current_phase')
            .eq('user_id', currentUser.id)
            .eq('archived', false)
            .order('created_at', { ascending: false });
        return data || [];
    }
    async function handleStartChatForProject(projectId) {
        setCreatingRoom(projectId);
        try {
            const room = await getOrCreateChatRoom(projectId);
            if (room) {
                setRooms(prev => [room, ...prev.filter(r => r.id !== room.id)]);
                onSelectRoom(room);
            }
        }
        catch (error) {
            console.error('Error creating chat room:', error);
        }
        finally {
            setCreatingRoom(null);
        }
    }
    async function handleStartChatForOrder(orderId) {
        setCreatingRoom(orderId);
        try {
            const room = await getOrCreateChatRoomForOrder(orderId);
            if (room) {
                setRooms(prev => [room, ...prev.filter(r => r.id !== room.id)]);
                onSelectRoom(room);
            }
        }
        catch (error) {
            console.error('Error creating chat room for order:', error);
            toast({
                title: 'Unable to start chat',
                description: error?.message || 'This order may still be processing. Please try again in a moment.',
                variant: 'destructive',
            });
        }
        finally {
            setCreatingRoom(null);
        }
    }
    // Find orders without chat rooms (primary way to start chats now)
    const ordersWithoutRooms = orders.filter(order => !rooms.some(room => room.order_id === order.id));
    // Legacy: Find projects without chat rooms (fallback)
    const projectsWithoutRooms = projects.filter(project => !rooms.some(room => room.project_id === project.id) &&
        !orders.some(order => order.design_files?.project_id === project.id));
    if (loading) {
        return (<div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-primary"/>
      </div>);
    }
    return (<ScrollArea className={cn("h-full", className)}>
      <div className="space-y-2 p-2">
        {/* Start New Conversation Section - Orders */}
        {!isAdmin && ordersWithoutRooms.length > 0 && (<div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
              Start a conversation
            </p>
            {ordersWithoutRooms.map((order) => (<Card key={order.id} className="p-3 mb-2 border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" onClick={() => handleStartChatForOrder(order.id)}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {creatingRoom === order.id ? (<Loader2 className="h-5 w-5 animate-spin text-primary"/>) : (<Package className="h-5 w-5 text-primary"/>)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {order.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.package_name || 'Chat with your designer'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                </div>
              </Card>))}
          </div>)}

        {/* Legacy: Projects without rooms (fallback) */}
        {!isAdmin && projectsWithoutRooms.length > 0 && ordersWithoutRooms.length === 0 && (<div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
              Start a conversation
            </p>
            {projectsWithoutRooms.map((project) => (<Card key={project.id} className="p-3 mb-2 border-dashed border-2 border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer" onClick={() => handleStartChatForProject(project.id)}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    {creatingRoom === project.id ? (<Loader2 className="h-5 w-5 animate-spin text-accent"/>) : (<Plus className="h-5 w-5 text-accent"/>)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Chat about your {project.room_type?.replace('_', ' ') || 'project'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to start chatting with your designer
                    </p>
                  </div>
                </div>
              </Card>))}
          </div>)}

        {/* Existing Conversations */}
        {rooms.length > 0 && (<>
            {(ordersWithoutRooms.length > 0 || projectsWithoutRooms.length > 0) && (<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
                Recent conversations
              </p>)}
            {rooms.map((room) => {
                const unreadCount = isAdmin ? room.unread_count_admin : room.unread_count_user;
                const isSelected = selectedRoomId === room.id;
                const isTyping = isAdmin ? room.user_typing : room.admin_typing;
                return (<Card key={room.id} onClick={() => onSelectRoom(room)} className={cn("p-3 cursor-pointer transition-colors hover:bg-muted/50", isSelected && "bg-muted border-primary")}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={isAdmin ? '' : 'bg-primary text-primary-foreground'}>
                        {isAdmin ? 'C' : 'D'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {isAdmin ? 'Customer Chat' : 'Your Designer'}
                        </p>
                        {room.last_message_at && (<span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(room.last_message_at), { addSuffix: true })}
                          </span>)}
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        {isTyping ? (<p className="text-sm text-primary animate-pulse truncate">
                            Typing...
                          </p>) : (<p className="text-sm text-muted-foreground truncate">
                            {room.last_message_preview || 'No messages yet'}
                          </p>)}

                        {unreadCount > 0 && (<Badge variant="default" className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>)}
                      </div>
                    </div>
                  </div>
                </Card>);
            })}
          </>)}

        {/* Empty State */}
        {rooms.length === 0 && ordersWithoutRooms.length === 0 && projectsWithoutRooms.length === 0 && (<div className="text-center py-12 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50"/>
            <p className="font-medium mb-2">No active orders</p>
            <p className="text-sm mb-4">Complete a purchase to chat with your designer</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/select-package')}>
              <Plus className="h-4 w-4 mr-2"/>
              Start a project
            </Button>
          </div>)}
      </div>
    </ScrollArea>);
}

