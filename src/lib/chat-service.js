import { appDataClient } from '@/lib/static-client';
/**
 * Get or create chat room for a project/order
 */
export async function getOrCreateChatRoom(projectId, orderId) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            throw new Error('Not authenticated');
        // Check if room exists for this project
        const { data: existingRoom, error: fetchError } = await appDataClient
            .from('chat_rooms')
            .select('*')
            .eq('project_id', projectId)
            .maybeSingle();
        if (fetchError && fetchError.code !== 'PGRST116')
            throw fetchError;
        if (existingRoom)
            return existingRoom;
        // Create new room
        const { data: newRoom, error: createError } = await appDataClient
            .from('chat_rooms')
            .insert({
            project_id: projectId,
            order_id: orderId || null,
            user_id: user.id,
            status: 'active',
            unread_count_user: 0,
            unread_count_admin: 0
        })
            .select()
            .single();
        if (createError)
            throw createError;
        return newRoom;
    }
    catch (error) {
        console.error('Error getting/creating chat room:', error);
        return null;
    }
}
/**
 * Get chat rooms for current user
 */
export async function getChatRooms() {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            return [];
        // Get rooms where user is the owner
        const { data: rooms, error } = await appDataClient
            .from('chat_rooms')
            .select('*')
            .eq('user_id', user.id)
            .order('last_message_at', { ascending: false, nullsFirst: false });
        if (error)
            throw error;
        return (rooms || []);
    }
    catch (error) {
        console.error('Error getting chat rooms:', error);
        return [];
    }
}
/**
 * Get all chat rooms (admin)
 */
export async function getAllChatRooms() {
    try {
        const { data: rooms, error } = await appDataClient
            .from('chat_rooms')
            .select('*')
            .order('last_message_at', { ascending: false, nullsFirst: false });
        if (error)
            throw error;
        return (rooms || []);
    }
    catch (error) {
        console.error('Error getting all chat rooms:', error);
        return [];
    }
}
/**
 * Get messages for a room with pagination
 */
export async function getMessages(roomId, limit = 50, before) {
    try {
        let query = appDataClient
            .from('chat_messages')
            .select('*')
            .eq('room_id', roomId)
            .eq('deleted', false)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (before) {
            query = query.lt('created_at', before);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        // Reverse to show oldest first
        return (data || []).reverse();
    }
    catch (error) {
        console.error('Error getting messages:', error);
        return [];
    }
}
/**
 * Send a text message
 */
export async function sendMessage(roomId, messageText, isAdmin = false) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            throw new Error('Not authenticated');
        const { data, error } = await appDataClient
            .from('chat_messages')
            .insert({
            room_id: roomId,
            sender_id: user.id,
            is_admin: isAdmin,
            message_text: messageText.trim(),
            message_type: 'text',
            deleted: false,
            edited: false
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.error('Error sending message:', error);
        return null;
    }
}
/**
 * Upload and send file attachment
 */
export async function sendAttachment(roomId, file, isAdmin = false) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            throw new Error('Not authenticated');
        // Upload file
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${roomId}/${timestamp}-${random}-${sanitizedName}`;
        const { error: uploadError } = await appDataClient.storage
            .from('chat-attachments')
            .upload(fileName, file, { upsert: false });
        if (uploadError)
            throw uploadError;
        // Get public URL
        const { data: urlData } = appDataClient.storage
            .from('chat-attachments')
            .getPublicUrl(fileName);
        // Create message with attachment
        const attachmentData = [{
                url: urlData.publicUrl,
                name: file.name,
                type: file.type,
                size: file.size
            }];
        const { data, error } = await appDataClient
            .from('chat_messages')
            .insert({
            room_id: roomId,
            sender_id: user.id,
            is_admin: isAdmin,
            message_type: 'attachment',
            attachments: attachmentData,
            deleted: false,
            edited: false
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.error('Error sending attachment:', error);
        return null;
    }
}
/**
 * Mark messages as read
 */
export async function markMessagesRead(roomId, isAdmin) {
    try {
        await appDataClient.rpc('mark_chat_messages_read', {
            p_room_id: roomId,
            p_is_admin: isAdmin
        });
    }
    catch (error) {
        console.error('Error marking messages as read:', error);
    }
}
/**
 * Get total unread count for user
 */
export async function getTotalUnreadCount(isAdmin = false) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            return 0;
        let query = appDataClient.from('chat_rooms').select('unread_count_user, unread_count_admin');
        if (!isAdmin) {
            query = query.eq('user_id', user.id);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data?.reduce((sum, room) => {
            return sum + (isAdmin ? (room.unread_count_admin || 0) : (room.unread_count_user || 0));
        }, 0) || 0;
    }
    catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
}
/**
 * Update typing indicator
 */
export async function setTypingIndicator(roomId, isTyping, isAdmin) {
    try {
        const updateData = isAdmin
            ? { admin_typing: isTyping }
            : { user_typing: isTyping };
        await appDataClient
            .from('chat_rooms')
            .update(updateData)
            .eq('id', roomId);
    }
    catch (error) {
        console.error('Error setting typing indicator:', error);
    }
}
/**
 * Update user presence (online/offline)
 */
export async function updatePresence(isOnline) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            return;
        await appDataClient
            .from('user_presence')
            .upsert({
            user_id: user.id,
            is_online: isOnline,
            last_seen: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error updating presence:', error);
    }
}
/**
 * Get user presence
 */
export async function getUserPresence(userId) {
    try {
        const { data, error } = await appDataClient
            .from('user_presence')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        return null;
    }
}
/**
 * Subscribe to new messages in a room
 */
export function subscribeToMessages(roomId, onMessage) {
    const channel = appDataClient
        .channel(`chat-messages:${roomId}`)
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
    }, (payload) => {
        onMessage(payload.new);
    })
        .subscribe();
    return channel;
}
/**
 * Subscribe to room updates (typing, unread counts)
 */
export function subscribeToRoom(roomId, onRoomUpdate) {
    const channel = appDataClient
        .channel(`chat-room:${roomId}`)
        .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `id=eq.${roomId}`
    }, (payload) => {
        onRoomUpdate(payload.new);
    })
        .subscribe();
    return channel;
}
/**
 * Subscribe to user presence changes
 */
export function subscribeToPresence(userId, onPresenceChange) {
    const channel = appDataClient
        .channel(`presence:${userId}`)
        .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `user_id=eq.${userId}`
    }, (payload) => {
        onPresenceChange(payload.new);
    })
        .subscribe();
    return channel;
}
/**
 * Unsubscribe from channel
 */
export async function unsubscribeChannel(channel) {
    await appDataClient.removeChannel(channel);
}
/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(messageId) {
    try {
        const { error } = await appDataClient
            .from('chat_messages')
            .update({ deleted: true, deleted_at: new Date().toISOString() })
            .eq('id', messageId);
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error deleting message:', error);
        return false;
    }
}
/**
 * Edit a message
 */
export async function editMessage(messageId, newText) {
    try {
        const { error } = await appDataClient
            .from('chat_messages')
            .update({
            message_text: newText.trim(),
            edited: true,
            updated_at: new Date().toISOString()
        })
            .eq('id', messageId);
        if (error)
            throw error;
        return true;
    }
    catch (error) {
        console.error('Error editing message:', error);
        return false;
    }
}
/**
 * Get or create chat room for an order (via its linked project)
 */
export async function getOrCreateChatRoomForOrder(orderId) {
    try {
        const { data: { user } } = await appDataClient.auth.getUser();
        if (!user)
            throw new Error('Not authenticated');
        // First check if room already exists for this order
        const { data: existingRoom } = await appDataClient
            .from('chat_rooms')
            .select('*')
            .eq('order_id', orderId)
            .maybeSingle();
        if (existingRoom)
            return existingRoom;
        // Get order with linked project_id
        const { data: order, error: orderError } = await appDataClient
            .from('orders')
            .select('id, user_id, design_files')
            .eq('id', orderId)
            .single();
        if (orderError || !order) {
            console.error('Order not found:', orderId);
            return null;
        }
        // Extract project_id from design_files
        const designFiles = order.design_files;
        const projectId = designFiles?.project_id;
        if (!projectId) {
            console.error('No project linked to order:', orderId);
            // Return error info so caller can handle gracefully
            throw new Error(`Order ${orderId} has no linked project yet. The project is created after payment confirmation - please try again in a moment.`);
        }
        // Create room linked to both project and order
        return getOrCreateChatRoom(projectId, orderId);
    }
    catch (error) {
        console.error('Error getting/creating chat room for order:', error);
        return null;
    }
}

