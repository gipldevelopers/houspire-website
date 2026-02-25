import { useState, useEffect } from 'react'

export function useLocationDetection() {
  const [location, setLocation] = useState({
    country: '',
    countryCode: '',
    city: '',
    region: '',
    isIndia: false,
    isLoading: true,
  })

  useEffect(() => {
    const manualLocation = localStorage.getItem('houspire_manual_location')
    if (manualLocation) {
      try {
        const parsed = JSON.parse(manualLocation)
        setLocation({ ...parsed, isLoading: false })
        return
      } catch {}
    }
    
    detectLocation()
  }, [])

  const detectLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.reason || 'Rate limited')
        }
        
        setLocation({
          country: data.country_name || '',
          countryCode: data.country_code || '',
          city: data.city || '',
          region: data.region || '',
          isIndia: data.country_code === 'IN',
          isLoading: false,
        })
        return
      }

      throw new Error('Primary service failed')
      
    } catch (error) {
      console.warn('Primary IP detection failed, trying fallback...', error)
      
      try {
        const fallbackResponse = await fetch('http://ip-api.com/json/')
        const fallbackData = await fallbackResponse.json()
        
        if (fallbackData.status === 'success') {
          setLocation({
            country: fallbackData.country || '',
            countryCode: fallbackData.countryCode || '',
            city: fallbackData.city || '',
            region: fallbackData.regionName || '',
            isIndia: fallbackData.countryCode === 'IN',
            isLoading: false,
          })
          return
        }
      } catch (fallbackError) {
        console.warn('Fallback IP detection failed', fallbackError)
      }
      
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const isIndia = timezone.includes('Kolkata') || 
                      timezone.includes('India') || 
                      timezone.includes('Asia/Calcutta')
      
      setLocation({
        country: isIndia ? 'India' : 'Unknown',
        countryCode: isIndia ? 'IN' : '',
        city: '',
        region: '',
        isIndia,
        isLoading: false,
      })
    }
  }

  const setManualLocation = (isIndia) => {
    const newLocation = {
      country: isIndia ? 'India' : 'International',
      countryCode: isIndia ? 'IN' : 'US',
      city: '',
      region: '',
      isIndia,
      isLoading: false,
    }
    localStorage.setItem('houspire_manual_location', JSON.stringify(newLocation))
    setLocation(newLocation)
  }

  const clearManualLocation = () => {
    localStorage.removeItem('houspire_manual_location')
    detectLocation()
  }

  return { ...location, setManualLocation, clearManualLocation }
}
