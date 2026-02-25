import { useEffect, useMemo, useState } from 'react'

const HEADER_HEIGHT_PX = 56
const TOP_BANNER_HEIGHT_PX = 44
const BANNER_DISMISSED_KEY = 'houspire_banner_dismissed'
const BANNER_EVENT = 'houspire:banner-dismissed'

function computeHeaderOffsetPx() {
  if (typeof window === 'undefined') return HEADER_HEIGHT_PX
  const isBannerVisible = !sessionStorage.getItem(BANNER_DISMISSED_KEY)
  return isBannerVisible ? TOP_BANNER_HEIGHT_PX + HEADER_HEIGHT_PX : HEADER_HEIGHT_PX
}

/**
 * Provides a consistent top padding value so page content never sits under the fixed header.
 * Matches Header.tsx logic (56px header + optional 44px top banner).
 */
export function useHeaderOffset() {
  const [headerOffsetPx, setHeaderOffsetPx] = useState(() => computeHeaderOffsetPx())

  useEffect(() => {
    const update = () => setHeaderOffsetPx(computeHeaderOffsetPx())

    window.addEventListener(BANNER_EVENT, update)
    window.addEventListener('focus', update)
    window.addEventListener('storage', update)

    return () => {
      window.removeEventListener(BANNER_EVENT, update)
      window.removeEventListener('focus', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  return useMemo(() => ({ headerOffsetPx }), [headerOffsetPx])
}
