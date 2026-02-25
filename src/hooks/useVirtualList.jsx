import { useState, useMemo, useCallback } from 'react'

/**
 * Virtual scrolling for large lists - renders only visible items
 */
export function useVirtualList({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 3,
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const end = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * itemHeight,
    }
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan])

  const totalHeight = itemCount * itemHeight

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    startIndex,
    endIndex,
    offsetY,
    totalHeight,
    onScroll,
  }
}
