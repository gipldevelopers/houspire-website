import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { appDataClient } from '@/lib/static-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Paperclip, Image as ImageIcon, FileIcon, X, Check, CheckCheck, Trash2, MessageCircle, Search, Download, Smile, } from 'lucide-react';
import { compressImage } from '@/lib/imageUtils';
export function ChatInterface({ projectId }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    // Chat search & reactions
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(null);
    const [messageReactions, setMessageReactions] = useState({});
    const REACTION_OPTIONS = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef();
    const fileInputRef = useRef(null);
    const MESSAGES_PER_PAGE = 50;
    useEffect(() => {
        initializeChat();
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [projectId]);
    useEffect(() => {
        if (room) {
            const unsubMessages = subscribeToMessages();
            const unsubRoom = subscribeToRoom();
            return () => {
                unsubMessages?.();
                unsubRoom?.();
            };
        }
    }, [room?.id]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const initializeChat = async () => {
        try {
            // Get or create chat room
            let { data: existingRoom, error: roomError } = await appDataClient
                .from('chat_rooms')
                .select('*')
                .eq('project_id', projectId)
                .single();
            if (roomError && roomError.code === 'PGRST116') {
                // Create room if doesn't exist
                const { data: newRoom, error: createError } = await appDataClient
                    .from('chat_rooms')
                    .insert({
                    project_id: projectId,
                    user_id: user?.id,
                })
                    .select()
                    .single();
                if (createError)
                    throw createError;
                existingRoom = newRoom;
            }
            else if (roomError) {
                throw roomError;
            }
            setRoom(existingRoom);
            // Load initial messages
            await loadMessages(existingRoom.id);
            // Mark messages as read
            await markAsRead(existingRoom.id);
        }
        catch (error) {
            console.error('Failed to initialize chat:', error);
            toast({
                title: 'Failed to load chat',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const loadMessages = async (roomId, before) => {
        try {
            let query = appDataClient
                .from('chat_messages')
                .select('*')
                .eq('room_id', roomId)
                .eq('deleted', false)
                .order('created_at', { ascending: false })
                .limit(MESSAGES_PER_PAGE);
            if (before) {
                query = query.lt('created_at', before);
            }
            const { data, error } = await query;
            if (error)
                throw error;
            // Fetch profiles for senders
            const messagesWithProfiles = await Promise.all((data || []).map(async (msg) => {
                const { data: profile } = await appDataClient
                    .from('profiles')
                    .select('full_name')
                    .eq('user_id', msg.sender_id)
                    .single();
                return {
                    ...msg,
                    attachments: msg.attachments,
                    profiles: profile || null
                };
            }));
            const newMessages = messagesWithProfiles.reverse();
            if (before) {
                setMessages((prev) => [...newMessages, ...prev]);
            }
            else {
                setMessages(newMessages);
            }
            setHasMore(data && data.length === MESSAGES_PER_PAGE);
        }
        catch (error) {
            toast({
                title: 'Failed to load messages',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const loadMoreMessages = async () => {
        if (!room || !hasMore || loadingMore)
            return;
        setLoadingMore(true);
        const oldestMessage = messages[0];
        if (oldestMessage) {
            await loadMessages(room.id, oldestMessage.created_at);
        }
        setLoadingMore(false);
    };
    const subscribeToMessages = () => {
        if (!room)
            return;
        const channel = appDataClient
            .channel(`chat-messages-${room.id}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${room.id}`,
        }, async (payload) => {
            const newMessage = payload.new;
            // Fetch sender profile
            const { data: profile } = await appDataClient
                .from('profiles')
                .select('full_name')
                .eq('user_id', newMessage.sender_id)
                .single();
            setMessages((prev) => [
                ...prev,
                { ...newMessage, attachments: newMessage.attachments, profiles: profile || null },
            ]);
            // Mark as read if from admin
            if (newMessage.is_admin && room) {
                await markAsRead(room.id);
            }
            // Play notification sound
            if (newMessage.is_admin && newMessage.sender_id !== user?.id) {
                playNotificationSound();
            }
        })
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_messages',
            filter: `room_id=eq.${room.id}`,
        }, (payload) => {
            const updatedMessage = payload.new;
            setMessages((prev) => prev.map((msg) => msg.id === updatedMessage.id
                ? { ...msg, ...updatedMessage, attachments: updatedMessage.attachments }
                : msg));
        })
            .subscribe();
        return () => {
            appDataClient.removeChannel(channel);
        };
    };
    const subscribeToRoom = () => {
        if (!room)
            return;
        const channel = appDataClient
            .channel(`chat-room-${room.id}`)
            .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_rooms',
            filter: `id=eq.${room.id}`,
        }, (payload) => {
            const updatedRoom = payload.new;
            setRoom(updatedRoom);
        })
            .subscribe();
        return () => {
            appDataClient.removeChannel(channel);
        };
    };
    const markAsRead = async (roomId) => {
        try {
            await appDataClient.rpc('mark_messages_as_read', {
                p_room_id: roomId,
                p_is_admin: false,
            });
        }
        catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };
    const handleSendMessage = async () => {
        if ((!messageText.trim() && attachments.length === 0) || !room)
            return;
        setSending(true);
        try {
            // Upload attachments first
            let uploadedAttachments = [];
            if (attachments.length > 0) {
                setUploading(true);
                uploadedAttachments = await uploadFiles(attachments);
                setUploading(false);
            }
            // Send message
            const { data, error } = await appDataClient.rpc('send_chat_message', {
                p_room_id: room.id,
                p_message_text: messageText.trim() || null,
                p_attachments: uploadedAttachments,
                p_message_type: uploadedAttachments.length > 0 ? 'file' : 'text',
            });
            if (error)
                throw error;
            if (data && data[0] && !data[0].success) {
                throw new Error(data[0].message || 'Failed to send message');
            }
            // Clear input
            setMessageText('');
            setAttachments([]);
            // Stop typing indicator
            await updateTypingStatus(false);
        }
        catch (error) {
            toast({
                title: 'Failed to send message',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSending(false);
        }
    };
    const uploadFiles = async (files) => {
        const uploaded = [];
        for (const file of files) {
            try {
                let fileToUpload = file;
                // Compress images
                if (file.type.startsWith('image/')) {
                    fileToUpload = await compressImage(file, 1920, 1920, 0.8);
                }
                // Validate file size (max 10MB)
                if (fileToUpload.size > 10 * 1024 * 1024) {
                    toast({
                        title: 'File too large',
                        description: `${file.name} exceeds 10MB limit`,
                        variant: 'destructive',
                    });
                    continue;
                }
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = `${projectId}/chat/${fileName}`;
                const { error: uploadError } = await appDataClient.storage
                    .from('chat-files')
                    .upload(filePath, fileToUpload);
                if (uploadError)
                    throw uploadError;
                const { data: urlData } = appDataClient.storage
                    .from('chat-files')
                    .getPublicUrl(filePath);
                uploaded.push({
                    url: urlData.publicUrl,
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    name: file.name,
                    size: file.size,
                });
            }
            catch (error) {
                toast({
                    title: 'Upload failed',
                    description: `Failed to upload ${file.name}`,
                    variant: 'destructive',
                });
            }
        }
        return uploaded;
    };
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length + attachments.length > 5) {
            toast({
                title: 'Too many files',
                description: 'Maximum 5 files per message',
                variant: 'destructive',
            });
            return;
        }
        setAttachments([...attachments, ...files]);
    };
    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };
    const handleTyping = useCallback(() => {
        if (!room)
            return;
        updateTypingStatus(true);
        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Set new timeout to stop typing after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
            updateTypingStatus(false);
        }, 3000);
    }, [room]);
    const updateTypingStatus = async (isTyping) => {
        if (!room)
            return;
        try {
            await appDataClient.rpc('update_typing_status', {
                p_room_id: room.id,
                p_is_typing: isTyping,
            });
        }
        catch (error) {
            console.error('Failed to update typing status:', error);
        }
    };
    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Delete this message?'))
            return;
        try {
            const { error } = await appDataClient
                .from('chat_messages')
                .update({ deleted: true, deleted_at: new Date().toISOString() })
                .eq('id', messageId);
            if (error)
                throw error;
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            toast({
                title: 'Message deleted',
            });
        }
        catch (error) {
            toast({
                title: 'Failed to delete message',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const playNotificationSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEoODlOq5O+zYBoGPJPY8sh0KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45ZFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQcYZrzy6KFOEQxMpOHxt2IdBTiP1vPPfjAFI3bF7+CURQsRWK/n7axaFwhAmNzyxHEmBCyAzvHYiTkHGGa88uihThEMTKPh8bdiHQU4j9bzz34wBSN2xe/glEULEViv5+2sWhcIQJjc8sRxJgQsgM7x2Ik5Bxhmv');
        audio.volume = 0.3;
        audio.play().catch(() => { });
    };
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current)
            return;
        const { scrollTop } = messagesContainerRef.current;
        // Load more when scrolled to top
        if (scrollTop === 0 && hasMore && !loadingMore) {
            loadMoreMessages();
        }
    }, [hasMore, loadingMore]);
    // Chat search
    const handleSearchMessages = async () => {
        if (!searchQuery.trim() || !room)
            return;
        setSearching(true);
        try {
            const { data, error } = await appDataClient.rpc('search_chat_messages', {
                p_room_id: room.id,
                p_query: searchQuery,
                p_limit: 50,
            });
            if (error)
                throw error;
            setSearchResults(data || []);
        }
        catch (error) {
            toast({
                title: 'Search failed',
                description: error.message,
                variant: 'destructive',
            });
        }
        finally {
            setSearching(false);
        }
    };
    const scrollToMessage = (messageId) => {
        const element = document.getElementById(`message-${messageId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-message');
            setTimeout(() => element.classList.remove('highlight-message'), 2000);
        }
        setShowSearch(false);
    };
    // Reactions
    const handleAddReaction = async (messageId, reaction) => {
        try {
            const { error } = await appDataClient.rpc('add_message_reaction', {
                p_message_id: messageId,
                p_reaction: reaction,
            });
            if (error)
                throw error;
            await loadReactions(messageId);
            setShowReactionPicker(null);
        }
        catch (error) {
            toast({
                title: 'Failed to add reaction',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const handleRemoveReaction = async (messageId, reaction) => {
        try {
            const { error } = await appDataClient.rpc('remove_message_reaction', {
                p_message_id: messageId,
                p_reaction: reaction,
            });
            if (error)
                throw error;
            await loadReactions(messageId);
        }
        catch (error) {
            toast({
                title: 'Failed to remove reaction',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    const loadReactions = async (messageId) => {
        try {
            const { data, error } = await appDataClient
                .from('chat_message_reactions')
                .select('reaction, user_id')
                .eq('message_id', messageId);
            if (error)
                throw error;
            const reactionMap = {};
            data?.forEach((r) => {
                if (!reactionMap[r.reaction]) {
                    reactionMap[r.reaction] = { count: 0, users: [] };
                }
                reactionMap[r.reaction].count++;
                reactionMap[r.reaction].users.push(r.user_id);
            });
            const reactions = Object.entries(reactionMap).map(([reaction, data]) => ({
                reaction,
                count: data.count,
                userReacted: data.users.includes(user?.id || ''),
            }));
            setMessageReactions((prev) => ({ ...prev, [messageId]: reactions }));
        }
        catch (error) {
            console.error('Failed to load reactions:', error);
        }
    };
    // Chat export
    const handleExportChat = async () => {
        if (!room)
            return;
        try {
            const { data, error } = await appDataClient.rpc('export_chat_messages', {
                p_room_id: room.id,
                p_format: 'txt',
            });
            if (error)
                throw error;
            const exportData = Array.isArray(data) ? data[0] : data;
            const blob = new Blob([exportData.content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast({
                title: 'Chat exported! 📥',
                description: `${exportData.message_count} messages exported`,
            });
        }
        catch (error) {
            toast({
                title: 'Export failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    // Load reactions for visible messages
    useEffect(() => {
        messages.forEach((msg) => {
            if (!messageReactions[msg.id]) {
                loadReactions(msg.id);
            }
        });
    }, [messages]);
    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === today.toDateString()) {
            return 'Today';
        }
        else if (d.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        else {
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
            });
        }
    };
    const renderMessage = (message, index) => {
        const isOwnMessage = message.sender_id === user?.id;
        const showAvatar = index === 0 ||
            messages[index - 1].sender_id !== message.sender_id ||
            new Date(message.created_at || '').getTime() -
                new Date(messages[index - 1].created_at || '').getTime() >
                300000; // 5 minutes
        const showDate = index === 0 ||
            formatDate(message.created_at || '') !== formatDate(messages[index - 1].created_at || '');
        const reactions = messageReactions[message.id] || [];
        return (<div key={message.id} id={`message-${message.id}`}>
        {/* Date Separator */}
        {showDate && (<div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              {formatDate(message.created_at || '')}
            </span>
          </div>)}

        {/* Message */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`group flex gap-2 mb-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          {showAvatar && !isOwnMessage && (<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
              {message.is_admin ? 'D' : message.profiles?.full_name?.charAt(0) || 'U'}
            </div>)}

          {!showAvatar && !isOwnMessage && <div className="w-8 flex-shrink-0"/>}

          {/* Message Content */}
          <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            {/* Sender Name */}
            {showAvatar && !isOwnMessage && (<p className="text-xs text-muted-foreground mb-1 ml-1">
                {message.is_admin ? 'Designer' : message.profiles?.full_name || 'User'}
              </p>)}

            {/* Message Bubble */}
            <div className={`rounded-2xl px-4 py-2 ${isOwnMessage
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md'}`}>
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (<div className="space-y-2 mb-2">
                  {message.attachments.map((attachment, i) => (<div key={i}>
                      {attachment.type === 'image' ? (<img src={attachment.url} alt={attachment.name} className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(attachment.url, '_blank')}/>) : (<a href={attachment.url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg ${isOwnMessage
                            ? 'bg-primary/80 hover:bg-primary/70'
                            : 'bg-background hover:bg-accent'}`}>
                          <FileIcon className="h-4 w-4"/>
                          <span className="text-sm truncate">{attachment.name}</span>
                        </a>)}
                    </div>))}
                </div>)}

              {/* Message Text */}
              {message.message_text && (<p className="whitespace-pre-wrap break-words text-sm">
                  {message.message_text}
                </p>)}
            </div>

            {/* Reactions */}
            {reactions.length > 0 && (<div className="flex flex-wrap gap-1 mt-1 ml-1">
                {reactions.map((r) => (<button key={r.reaction} onClick={() => r.userReacted
                        ? handleRemoveReaction(message.id, r.reaction)
                        : handleAddReaction(message.id, r.reaction)} className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors ${r.userReacted
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-muted hover:bg-muted/80'}`}>
                    {r.reaction}
                    <span>{r.count}</span>
                  </button>))}
              </div>)}

            {/* Time & Actions */}
            <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(message.created_at || '')}
              </span>

              {isOwnMessage && (<span className="text-muted-foreground">
                  {message.read_by_admin ? (<CheckCheck className="h-3 w-3 text-primary"/>) : (<Check className="h-3 w-3"/>)}
                </span>)}

              {/* Reaction button */}
              <button onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)} className="text-muted-foreground hover:text-foreground ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Smile className="h-3 w-3"/>
              </button>

              {/* Delete button for own messages */}
              {isOwnMessage && (<button onClick={() => handleDeleteMessage(message.id)} className="text-muted-foreground hover:text-destructive ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3"/>
                </button>)}
            </div>

            {/* Reaction Picker */}
            <AnimatePresence>
              {showReactionPicker === message.id && (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-1 mt-1 p-2 bg-background border rounded-full shadow-lg">
                  {REACTION_OPTIONS.map((emoji) => (<button key={emoji} onClick={() => handleAddReaction(message.id, emoji)} className="text-lg hover:scale-125 transition-transform">
                      {emoji}
                    </button>))}
                </motion.div>)}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>);
    };
    if (loading) {
        return (<Card className="flex flex-col h-[500px]">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/>
          <p className="ml-3 text-muted-foreground">Loading chat...</p>
        </div>
      </Card>);
    }
    if (!room) {
        return (<Card className="flex flex-col h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Chat is not available for this project yet.</p>
      </Card>);
    }
    return (<Card className="flex flex-col h-[500px] overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium">
            D
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Designer</h3>
            <p className="text-xs text-muted-foreground">
              {room.admin_typing ? 'typing...' : 'Usually replies within minutes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button onClick={() => setShowSearch(!showSearch)} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4"/>
          </Button>

          {/* Export Button */}
          <Button onClick={handleExportChat} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download className="h-4 w-4"/>
          </Button>

          {room.unread_count_user > 0 && (<span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {room.unread_count_user}
            </span>)}
        </div>
      </div>

      {/* Search Panel */}
      <AnimatePresence>
        {showSearch && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-b bg-muted/20 p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearchMessages()} placeholder="Search messages..." className="pl-10 h-9"/>
              </div>
              <Button onClick={handleSearchMessages} size="sm" disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
              <Button onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
                setSearchResults([]);
            }} variant="ghost" size="sm">
                <X className="h-4 w-4"/>
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (<div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {searchResults.map((result) => (<button key={result.message_id} onClick={() => scrollToMessage(result.message_id)} className="w-full text-left p-2 bg-background hover:bg-accent rounded-lg transition-colors text-sm">
                    <p className="line-clamp-2 text-foreground">{result.message_text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(result.created_at).toLocaleString()}
                    </p>
                  </button>))}
              </div>)}

            {searchQuery && searchResults.length === 0 && !searching && (<p className="text-center text-sm text-muted-foreground mt-3">
                No messages found
              </p>)}
          </motion.div>)}
      </AnimatePresence>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={messagesContainerRef} onScroll={handleScroll}>
        {loadingMore && (<div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
          </div>)}

        {messages.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground"/>
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask questions about your project, share ideas, or discuss design
              changes with your designer.
            </p>
          </div>) : (<>
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef}/>
          </>)}
      </ScrollArea>

      {/* Typing Indicator */}
      <AnimatePresence>
        {room.admin_typing && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
              </div>
              Designer is typing...
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-2 border-t">
            <div className="flex flex-wrap gap-2 pt-2">
              {attachments.map((file, index) => (<div key={index} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  {file.type.startsWith('image/') ? (<ImageIcon className="h-4 w-4 text-muted-foreground"/>) : (<FileIcon className="h-4 w-4 text-muted-foreground"/>)}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button onClick={() => removeAttachment(index)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4"/>
                  </button>
                </div>))}
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileSelect} className="hidden"/>

          <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="icon" className="flex-shrink-0" disabled={uploading || sending}>
            <Paperclip className="h-5 w-5"/>
          </Button>

          <Textarea value={messageText} onChange={(e) => {
            setMessageText(e.target.value);
            handleTyping();
        }} onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        }} placeholder="Type your message... (Shift+Enter for new line)" className="flex-1 resize-none min-h-[44px] max-h-[120px]" rows={1} disabled={uploading || sending}/>

          <Button onClick={handleSendMessage} disabled={(!messageText.trim() && attachments.length === 0) ||
            uploading ||
            sending} className="flex-shrink-0 h-11 px-4">
            {uploading ? (<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"/>) : sending ? (<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"/>) : (<Send className="h-5 w-5"/>)}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>);
}

