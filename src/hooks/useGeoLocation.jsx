import { useState, useEffect } from 'react'

export function useGeoLocation() {
  const [geo, setGeo] = useState({
    country: 'IN',
    currency: 'INR',
    loading: true,
  })

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country_code || 'IN'
        const currency = getCurrencyFromCountry(countryCode)
        setGeo({
          country: countryCode,
          currency,
          loading: false,
        })
      })
      .catch(() => {
        setGeo({
          country: 'IN',
          currency: 'INR',
          loading: false,
        })
      })
  }, [])

  return geo
}

function getCurrencyFromCountry(countryCode) {
  const currencyMap = {
    IN: 'INR',
    US: 'USD',
    AE: 'AED',
    GB: 'GBP',
    AU: 'AUD',
    SG: 'SGD',
  }
  return currencyMap[countryCode] || 'INR'
}
