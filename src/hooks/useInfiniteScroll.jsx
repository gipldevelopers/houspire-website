import { useState, useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll({
  items,
  pageSize = 12,
  threshold = 200,
}) {
  const [displayCount, setDisplayCount] = useState(pageSize)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef(null)

  const visibleItems = items.slice(0, displayCount)
  const hasMore = displayCount < items.length

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return
    
    setIsLoadingMore(true)
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + pageSize, items.length))
      setIsLoadingMore(false)
    }, 100)
  }, [hasMore, isLoadingMore, pageSize, items.length])

  const reset = useCallback(() => {
    setDisplayCount(pageSize)
  }, [pageSize])

  useEffect(() => {
    setDisplayCount(pageSize)
  }, [items.length, pageSize])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, loadMore, threshold])

  return {
    visibleItems,
    loadMore,
    hasMore,
    isLoadingMore,
    reset,
    sentinelRef,
  }
}
