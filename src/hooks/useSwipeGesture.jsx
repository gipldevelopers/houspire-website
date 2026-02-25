import { useState, useCallback } from 'react'

export function useSwipeGesture(options) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }, [])

  const handleTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontalSwipe) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
