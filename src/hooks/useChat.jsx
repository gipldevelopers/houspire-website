import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getOrCreateChatRoom,
  getChatRooms,
  getMessages,
  sendMessage,
  sendAttachment,
  markMessagesRead,
  getTotalUnreadCount,
  setTypingIndicator,
  updatePresence,
  subscribeToMessages,
  subscribeToRoom,
  unsubscribeChannel
} from '@/lib/chat-service'

export function useChat(options = {}) {
  const { projectId, roomId: initialRoomId, isAdmin = false, autoMarkRead = true } = options
  const { user } = useAuth()

  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  const messageChannelRef = useRef(null)
  const roomChannelRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Load room
  const loadRoom = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let chatRoom = null

      if (initialRoomId) {
        const rooms = await getChatRooms()
        chatRoom = rooms.find(r => r.id === initialRoomId) || null
      } else if (projectId) {
        chatRoom = await getOrCreateChatRoom(projectId)
      }

      if (chatRoom) {
        setRoom(chatRoom)
        
        const msgs = await getMessages(chatRoom.id)
        setMessages(msgs)

        if (autoMarkRead) {
          await markMessagesRead(chatRoom.id, isAdmin)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load chat')
    } finally {
      setLoading(false)
    }
  }, [user, projectId, initialRoomId, isAdmin, autoMarkRead])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!room) return

    messageChannelRef.current = subscribeToMessages(room.id, (newMessage) => {
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev
        return [...prev, newMessage]
      })

      if (autoMarkRead) {
        markMessagesRead(room.id, isAdmin)
      }
    })

    roomChannelRef.current = subscribeToRoom(room.id, (updates) => {
      setRoom(prev => prev ? { ...prev, ...updates } : null)
      
      const typing = isAdmin ? updates.user_typing : updates.admin_typing
      if (typing !== undefined) {
        setOtherUserTyping(typing)
      }
    })

    return () => {
      if (messageChannelRef.current) {
        unsubscribeChannel(messageChannelRef.current)
      }
      if (roomChannelRef.current) {
        unsubscribeChannel(roomChannelRef.current)
      }
    }
  }, [room?.id, isAdmin, autoMarkRead])

  // Initial load
  useEffect(() => {
    loadRoom()
  }, [loadRoom])

  // Update presence when mounting/unmounting
  useEffect(() => {
    if (!user) return

    updatePresence(true)

    const handleBeforeUnload = () => {
      updatePresence(false)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      updatePresence(false)
    }
  }, [user])

  // Send text message
  const send = useCallback(async (text) => {
    if (!room || !text.trim()) return false

    setSending(true)
    try {
      const message = await sendMessage(room.id, text, isAdmin)
      if (message) {
        return true
      }
      return false
    } catch (err) {
      console.error('Error sending message:', err)
      return false
    } finally {
      setSending(false)
      setTypingIndicator(room.id, false, isAdmin)
    }
  }, [room, isAdmin])

  // Send attachment
  const sendFile = useCallback(async (file) => {
    if (!room) return false

    setSending(true)
    try {
      const message = await sendAttachment(room.id, file, isAdmin)
      return !!message
    } catch (err) {
      console.error('Error sending attachment:', err)
      return false
    } finally {
      setSending(false)
    }
  }, [room, isAdmin])

  // Handle typing
  const onTyping = useCallback(() => {
    if (!room) return

    setTypingIndicator(room.id, true, isAdmin)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTypingIndicator(room.id, false, isAdmin)
    }, 3000)
  }, [room, isAdmin])

  // Refresh messages
  const refresh = useCallback(async () => {
    if (!room) return
    const msgs = await getMessages(room.id)
    setMessages(msgs)
  }, [room])

  // Load more (pagination)
  const loadMore = useCallback(async () => {
    if (!room || messages.length === 0) return false

    const oldestMessage = messages[0]
    const olderMessages = await getMessages(room.id, 50, oldestMessage.created_at)

    if (olderMessages.length > 0) {
      setMessages(prev => [...olderMessages, ...prev])
      return true
    }

    return false
  }, [room, messages])

  return {
    room,
    messages,
    loading,
    sending,
    error,
    otherUserTyping,
    send,
    sendFile,
    onTyping,
    refresh,
    loadMore,
    markAsRead: () => room && markMessagesRead(room.id, isAdmin)
  }
}

export function useChatUnreadCount(isAdmin = false) {
  const [count, setCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    getTotalUnreadCount(isAdmin).then(setCount)

    const interval = setInterval(() => {
      getTotalUnreadCount(isAdmin).then(setCount)
    }, 30000)

    return () => clearInterval(interval)
  }, [user, isAdmin])

  return count
}
