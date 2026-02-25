import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, Loader2, FileText, Image as ImageIcon, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
export function ChatWindow({ projectId, roomId, isAdmin = false, onClose, className }) {
    const { user } = useAuth();
    const { room, messages, loading, sending, otherUserTyping, send, sendFile, onTyping, loadMore } = useChat({ projectId, roomId, isAdmin });
    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const scrollContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const lastMessageCountRef = useRef(0);
    // Scroll to bottom only when new messages are added (not on every render)
    useEffect(() => {
        if (messages.length > lastMessageCountRef.current && shouldAutoScroll) {
            // Use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
        lastMessageCountRef.current = messages.length;
    }, [messages.length, shouldAutoScroll]);
    // Track scroll position to determine if user has scrolled up
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            // If user is near bottom (within 100px), enable auto-scroll
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShouldAutoScroll(isNearBottom);
        }
    };
    const handleSend = async () => {
        if (selectedFile) {
            await sendFile(selectedFile);
            setSelectedFile(null);
        }
        else if (inputValue.trim()) {
            await send(inputValue);
            setInputValue('');
        }
        inputRef.current?.focus();
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };
    const formatMessageTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isToday(date)) {
            return format(date, 'h:mm a');
        }
        else if (isYesterday(date)) {
            return `Yesterday ${format(date, 'h:mm a')}`;
        }
        return format(date, 'MMM d, h:mm a');
    };
    const getAttachmentIcon = (type) => {
        if (type?.startsWith('image/'))
            return <ImageIcon className="h-4 w-4"/>;
        return <FileText className="h-4 w-4"/>;
    };
    if (loading) {
        return (<div className={cn("flex items-center justify-center h-96", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
      </div>);
    }
    if (!room) {
        return (<div className={cn("flex items-center justify-center h-96 text-muted-foreground", className)}>
        <p>Unable to load chat</p>
      </div>);
    }
    return (<div className={cn("flex flex-col h-full border rounded-lg bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {isAdmin ? 'C' : 'S'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {isAdmin ? 'Customer' : 'Support Team'}
            </p>
            {otherUserTyping && (<p className="text-xs text-primary animate-pulse">Typing...</p>)}
          </div>
        </div>
        {onClose && (<Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4"/>
          </Button>)}
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (<div className="text-center py-8 text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>) : (messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            const isFromAdmin = message.is_admin;
            return (<div key={message.id} className={cn("flex gap-3", isOwnMessage ? "justify-end" : "justify-start")}>
                  {!isOwnMessage && (<Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={isFromAdmin ? 'bg-primary text-primary-foreground' : ''}>
                        {isFromAdmin ? 'S' : 'C'}
                      </AvatarFallback>
                    </Avatar>)}

                  <div className={cn("max-w-[70%] rounded-2xl px-4 py-2", isOwnMessage
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md")}>
                    {/* Text message */}
                    {message.message_text && (<p className="whitespace-pre-wrap break-words">
                        {message.message_text}
                      </p>)}

                    {/* Attachments */}
                    {message.attachments && Array.isArray(message.attachments) && (<div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, idx) => (<a key={idx} href={attachment.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 p-2 rounded-lg", isOwnMessage ? "bg-primary-foreground/10" : "bg-background")}>
                            {attachment.type?.startsWith('image/') ? (<img src={attachment.url} alt={attachment.name} className="max-w-[200px] rounded"/>) : (<>
                                {getAttachmentIcon(attachment.type)}
                                <span className="text-sm truncate max-w-[150px]">
                                  {attachment.name}
                                </span>
                                <Download className="h-3 w-3 ml-auto"/>
                              </>)}
                          </a>))}
                      </div>)}

                    {/* Timestamp */}
                    <p className={cn("text-xs mt-1", isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {formatMessageTime(message.created_at)}
                      {message.edited && ' (edited)'}
                    </p>
                  </div>

                  {isOwnMessage && (<Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>)}
                </div>);
        }))}

          {/* Typing indicator */}
          {otherUserTyping && (<div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {isAdmin ? 'C' : 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-2 rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
              </div>
            </div>)}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        {/* File preview */}
        {selectedFile && (<div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded-lg">
            {getAttachmentIcon(selectedFile.type)}
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedFile(null)}>
              <X className="h-4 w-4"/>
            </Button>
          </div>)}

        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"/>
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={sending}>
            <Paperclip className="h-5 w-5"/>
          </Button>

          <Input ref={inputRef} value={inputValue} onChange={(e) => {
            setInputValue(e.target.value);
            onTyping();
        }} onKeyDown={handleKeyDown} placeholder="Type a message..." disabled={sending} className="flex-1"/>

          <Button onClick={handleSend} disabled={sending || (!inputValue.trim() && !selectedFile)} size="icon">
            {sending ? (<Loader2 className="h-5 w-5 animate-spin"/>) : (<Send className="h-5 w-5"/>)}
          </Button>
        </div>
      </div>
    </div>);
}
