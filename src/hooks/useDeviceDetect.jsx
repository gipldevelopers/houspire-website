import { useState, useEffect } from 'react'
import { getDeviceType, isTouchDevice, isIOS, isAndroid } from '@/lib/deviceDetect'

/**
 * React hook for responsive device detection
 * Updates on window resize
 */
export function useDeviceDetect() {
  const [deviceInfo, setDeviceInfo] = useState(() => ({
    type: 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }))

  useEffect(() => {
    const updateDeviceInfo = () => {
      const type = getDeviceType()
      setDeviceInfo({
        type,
        width: window.innerWidth,
        height: window.innerHeight,
        isTouch: isTouchDevice(),
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        isMobile: type === 'mobile',
        isTablet: type === 'tablet',
        isDesktop: type === 'desktop',
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}
