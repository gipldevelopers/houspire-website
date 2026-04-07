import { useState, useEffect } from 'react'
import { getTotalUnreadCount } from '@/lib/chat-service'
import { appDataClient } from '@/lib/static-client'

export function useUnreadCount(isAdmin = false) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUnreadCount()

    const channel = appDataClient
      .channel('unread-counts-global')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        },
        () => {
          loadUnreadCount()
        }
      )
      .subscribe()

    const interval = setInterval(loadUnreadCount, 30000)

    return () => {
      appDataClient.removeChannel(channel)
      clearInterval(interval)
    }
  }, [isAdmin])

  async function loadUnreadCount() {
    try {
      const count = await getTotalUnreadCount(isAdmin)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    } finally {
      setLoading(false)
    }
  }

  return { unreadCount, loading, refresh: loadUnreadCount }
}

