import { useEffect, useState, useRef, useCallback } from 'react'

export function usePullToRefresh(options) {
  const { onRefresh, threshold = 80, disabled = false } = options

  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const startY = useRef(0)
  const pulling = useRef(false)

  const handleTouchStart = useCallback((e) => {
    if (disabled || isRefreshing) return
    
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      pulling.current = true
      setIsPulling(true)
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || isRefreshing || disabled) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0 && window.scrollY === 0) {
      const resistedDistance = Math.min(distance * 0.5, threshold * 1.5)
      setPullDistance(resistedDistance)
    }
  }, [isRefreshing, disabled, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current || isRefreshing || disabled) return

    pulling.current = false
    setIsPulling(false)

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(threshold)

      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [pullDistance, threshold, disabled, isRefreshing, onRefresh])

  useEffect(() => {
    if (disabled) return

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled])

  return {
    isPulling,
    isRefreshing,
    pullDistance,
  }
}
