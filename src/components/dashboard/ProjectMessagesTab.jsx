'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { dataGet, dataPost } from '@/lib/frontend-data';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import { 
  Send, 
  Loader2, 
  MessageCircle,
  Paperclip,
  Image as ImageIcon,
  Smile
} from 'lucide-react';

const QUICK_REPLIES = [
  "Thanks for the update!",
  "I love this direction",
  "Can we adjust the colors?",
  "When will the next revision be ready?",
];

export function ProjectMessagesTab({ project, designer }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, [project.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    // Poll for new messages (replacing real-time subscription)
    const interval = setInterval(() => {
      fetchMessages(roomId);
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [roomId]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Check for existing chat room
      const existingRoom = await dataGet(`/chat-rooms?projectId=${project.id}`);
      
      if (existingRoom && existingRoom.length > 0) {
        setRoomId(existingRoom[0].id);
        await fetchMessages(existingRoom[0].id);
      } else {
        // Create new chat room
        const newRoom = await dataPost('/chat-rooms', {
          project_id: project.id,
          user_id: user.id,
        });
        
        if (newRoom) {
          setRoomId(newRoom.id);
        }
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const data = await dataGet(`/chat-messages?roomId=${chatRoomId}&limit=100`);
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text = newMessage) => {
    if (!text.trim() || !roomId || !user) return;

    setSending(true);
    try {
      await dataPost('/chat-messages', {
        room_id: roomId,
        sender_id: user.id,
        message_text: text.trim(),
        is_admin: false,
      });
      
      setNewMessage('');
      // Refresh messages
      await fetchMessages(roomId);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return `Yesterday ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, h:mm a');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Start the conversation
            </h4>
            <p className="text-muted-foreground text-sm">
              Send a message to your designer
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, idx) => {
              const isUser = !message.is_admin;
              const showAvatar = idx === 0 || messages[idx - 1]?.is_admin !== message.is_admin;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {!isUser && showAvatar && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={designer?.avatar} alt={designer?.name} />
                      <AvatarFallback>{designer?.name?.charAt(0) || 'D'}</AvatarFallback>
                    </Avatar>
                  )}
                  {!isUser && !showAvatar && <div className="w-8" />}

                  <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isUser
                          ? 'bg-foreground text-background rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                      {formatMessageDate(message.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-2">
        {QUICK_REPLIES.map((reply, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-xs h-7 rounded-full"
            onClick={() => sendMessage(reply)}
          >
            {reply}
          </Button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 p-2 border-t border-border/50">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-muted border-0 focus-visible:ring-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Smile className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => sendMessage()}
          disabled={!newMessage.trim() || sending}
          size="icon"
          className="h-9 w-9 rounded-full"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}


