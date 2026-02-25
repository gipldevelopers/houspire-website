import { useLocation } from 'react-router-dom'

export function useWhatsAppMessage() {
  const location = useLocation()

  if (location.pathname.includes('/select-package')) {
    return 'Hi! I need help choosing the right design package for my home.'
  }

  if (location.pathname.includes('/checkout')) {
    return 'Hi! I have questions about the payment process.'
  }

  if (location.pathname.includes('/dashboard')) {
    return 'Hi! I need help with my ongoing project.'
  }

  if (location.pathname.includes('/reviews')) {
    return 'Hi! I want to know more about customer experiences with Houspire.'
  }

  if (location.pathname.includes('/designers')) {
    return 'Hi! Can I request a specific designer for my project?'
  }

  if (location.pathname.includes('/style-quiz')) {
    return 'Hi! I need help with the style quiz and finding my design preferences.'
  }

  if (location.pathname.includes('/referrals')) {
    return 'Hi! I have questions about the referral program.'
  }

  if (location.pathname.includes('/vip')) {
    return 'Hi! I want to know more about VIP membership benefits.'
  }

  return 'Hi! I have a question about Houspire interior design services.'
}

export function generateWhatsAppUrl(phoneNumber, message) {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export function isWithinChatHours() {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  
  if (day === 0) return false
  return hour >= 9 && hour < 21
}
